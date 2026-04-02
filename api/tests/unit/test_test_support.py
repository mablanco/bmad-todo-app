import os
from collections.abc import Iterator
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db.session import create_session_factory
from app.dependencies.db import get_db
from app.main import create_app


@pytest.fixture()
def client_with_test_routes() -> Iterator[TestClient]:
    session_factory = create_session_factory("sqlite:///:memory:")

    def override_get_db() -> Iterator[Session]:
        db = session_factory()
        try:
            yield db
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    with patch.dict(os.environ, {"ENABLE_E2E_TEST_ROUTES": "1"}):
        app = create_app()
        app.dependency_overrides[get_db] = override_get_db
        with TestClient(app) as test_client:
            yield test_client
        app.dependency_overrides.clear()


@pytest.fixture()
def client_without_test_routes() -> Iterator[TestClient]:
    session_factory = create_session_factory("sqlite:///:memory:")

    def override_get_db() -> Iterator[Session]:
        db = session_factory()
        try:
            yield db
        finally:
            db.close()

    with patch.dict(os.environ, {}, clear=False):
        env = os.environ.copy()
        env.pop("ENABLE_E2E_TEST_ROUTES", None)
        with patch.dict(os.environ, env, clear=True):
            app = create_app()
            app.dependency_overrides[get_db] = override_get_db
            with TestClient(app) as test_client:
                yield test_client
            app.dependency_overrides.clear()


def test_reset_deletes_all_todos(client_with_test_routes: TestClient) -> None:
    client_with_test_routes.post("/api/v1/todos", json={"description": "Task A"})
    client_with_test_routes.post("/api/v1/todos", json={"description": "Task B"})

    response = client_with_test_routes.delete("/api/v1/test/reset")
    assert response.status_code == 204

    list_response = client_with_test_routes.get("/api/v1/todos")
    assert list_response.json() == {"data": []}


def test_reset_returns_404_when_routes_disabled(client_without_test_routes: TestClient) -> None:
    response = client_without_test_routes.delete("/api/v1/test/reset")
    assert response.status_code == 404


def test_reset_returns_403_when_secret_mismatch() -> None:
    import app.api.routes.test_support as ts_module

    session_factory = create_session_factory("sqlite:///:memory:")

    def override_get_db() -> Iterator[Session]:
        db = session_factory()
        try:
            yield db
        finally:
            db.close()

    original_secret = ts_module._TEST_SECRET
    try:
        ts_module._TEST_SECRET = "my-secret"
        with patch.dict(os.environ, {"ENABLE_E2E_TEST_ROUTES": "1"}):
            app = create_app()
            app.dependency_overrides[get_db] = override_get_db
            with TestClient(app) as client:
                response = client.delete("/api/v1/test/reset", headers={"X-Test-Secret": "wrong"})
                assert response.status_code == 403

                response = client.delete("/api/v1/test/reset", headers={"X-Test-Secret": "my-secret"})
                assert response.status_code == 204
            app.dependency_overrides.clear()
    finally:
        ts_module._TEST_SECRET = original_secret
