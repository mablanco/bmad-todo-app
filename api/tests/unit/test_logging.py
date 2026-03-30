import logging
from unittest.mock import MagicMock

import pytest
from fastapi import Request, Response

from app.core import logging as app_logging


def make_request(path: str = "/api/v1/todos") -> Request:
    scope = {
        "type": "http",
        "http_version": "1.1",
        "method": "GET",
        "path": path,
        "raw_path": path.encode(),
        "scheme": "http",
        "headers": [],
        "query_string": b"",
        "client": ("testclient", 123),
        "server": ("testserver", 80),
    }
    return Request(scope)


@pytest.fixture(autouse=True)
def clean_logger() -> None:
    original_handlers = list(app_logging.logger.handlers)
    original_level = app_logging.logger.level
    original_propagate = app_logging.logger.propagate
    app_logging.logger.handlers.clear()
    yield
    app_logging.logger.handlers.clear()
    for handler in original_handlers:
        app_logging.logger.addHandler(handler)
    app_logging.logger.setLevel(original_level)
    app_logging.logger.propagate = original_propagate


def test_setup_logging_adds_handler_only_once(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("LOG_LEVEL", "DEBUG")

    app_logging.setup_logging()
    app_logging.setup_logging()

    handlers = [
        handler
        for handler in app_logging.logger.handlers
        if handler.get_name() == app_logging.HANDLER_NAME
    ]

    assert len(handlers) == 1
    assert app_logging.logger.level == logging.DEBUG


@pytest.mark.anyio
async def test_logging_middleware_logs_info_for_success(monkeypatch: pytest.MonkeyPatch) -> None:
    info = MagicMock()
    warning = MagicMock()
    error = MagicMock()
    monkeypatch.setattr(app_logging.logger, "info", info)
    monkeypatch.setattr(app_logging.logger, "warning", warning)
    monkeypatch.setattr(app_logging.logger, "error", error)

    async def call_next(_: Request) -> Response:
        return Response(status_code=200)

    response = await app_logging.logging_middleware(make_request(), call_next)

    assert response.status_code == 200
    info.assert_called_once()
    warning.assert_not_called()
    error.assert_not_called()


@pytest.mark.anyio
async def test_logging_middleware_logs_warning_for_client_error(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    info = MagicMock()
    warning = MagicMock()
    error = MagicMock()
    monkeypatch.setattr(app_logging.logger, "info", info)
    monkeypatch.setattr(app_logging.logger, "warning", warning)
    monkeypatch.setattr(app_logging.logger, "error", error)

    async def call_next(_: Request) -> Response:
        return Response(status_code=404)

    response = await app_logging.logging_middleware(make_request("/api/v1/todos/missing"), call_next)

    assert response.status_code == 404
    warning.assert_called_once()
    info.assert_not_called()
    error.assert_not_called()


@pytest.mark.anyio
async def test_logging_middleware_logs_error_and_reraises_on_exception(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    error = MagicMock()
    monkeypatch.setattr(app_logging.logger, "error", error)

    async def call_next(_: Request) -> Response:
        raise RuntimeError("boom")

    with pytest.raises(RuntimeError, match="boom"):
        await app_logging.logging_middleware(make_request(), call_next)

    error.assert_called_once()
    assert error.call_args.kwargs["exc_info"] is True
