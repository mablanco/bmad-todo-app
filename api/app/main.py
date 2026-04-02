from fastapi import FastAPI, Request
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api.router import api_router
from app.core.config import get_allowed_origins
from app.core.errors import register_exception_handlers
from app.core.logging import register_logging
from app.db import models  # noqa: F401

limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])


def create_app() -> FastAPI:
    app = FastAPI(title="bmad-todo-app API")
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_allowed_origins(),
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )
    register_exception_handlers(app)
    register_logging(app)
    app.include_router(api_router, prefix="/api/v1")

    def custom_openapi() -> dict:
        if app.openapi_schema:
            return app.openapi_schema
        app.openapi_schema = get_openapi(
            title=app.title,
            version="0.1.0",
            routes=app.routes,
        )
        return app.openapi_schema

    app.openapi = custom_openapi
    return app


app = create_app()
