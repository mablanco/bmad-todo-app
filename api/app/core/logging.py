import logging
import os
import time
from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response

logger = logging.getLogger("bmad_todo")
HANDLER_NAME = "bmad_todo_stream_handler"


def resolve_log_level() -> int:
    log_level_name = os.environ.get("LOG_LEVEL", "INFO").upper()
    return getattr(logging, log_level_name, logging.INFO)


def get_log_method(status_code: int) -> Callable[..., None]:
    if status_code >= 500:
        return logger.error
    if status_code >= 400:
        return logger.warning
    return logger.info


def setup_logging() -> None:
    if not any(handler.get_name() == HANDLER_NAME for handler in logger.handlers):
        handler = logging.StreamHandler()
        handler.set_name(HANDLER_NAME)
        handler.setFormatter(
            logging.Formatter(
                "%(asctime)s level=%(levelname)s logger=%(name)s %(message)s",
                datefmt="%Y-%m-%dT%H:%M:%S",
            )
        )
        logger.addHandler(handler)

    logger.setLevel(resolve_log_level())
    logger.propagate = False


async def logging_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    start = time.perf_counter()
    try:
        response = await call_next(request)
    except Exception:
        duration_ms = (time.perf_counter() - start) * 1000
        logger.error(
            'method=%s path="%s" status=%d duration_ms=%.1f',
            request.method,
            request.url.path,
            500,
            duration_ms,
            exc_info=True,
        )
        raise

    duration_ms = (time.perf_counter() - start) * 1000
    get_log_method(response.status_code)(
        'method=%s path="%s" status=%d duration_ms=%.1f',
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


def register_logging(app: FastAPI) -> None:
    setup_logging()
    app.middleware("http")(logging_middleware)
