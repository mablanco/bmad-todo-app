from collections.abc import Iterator
from pathlib import Path
from tempfile import TemporaryDirectory

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.main import create_app
from app.db.session import create_session_factory


@pytest.fixture()
def client() -> Iterator[TestClient]:
    with TemporaryDirectory() as tmpdir:
        database_url = f"sqlite:///{Path(tmpdir) / 'test.db'}"
        session_factory = create_session_factory(database_url)

        def override_get_db() -> Iterator[Session]:
            db = session_factory()
            try:
                yield db
            finally:
                db.close()

        app = create_app()
        app.dependency_overrides[get_db] = override_get_db

        with TestClient(app) as test_client:
            yield test_client

        app.dependency_overrides.clear()
