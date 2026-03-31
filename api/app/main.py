from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_allowed_origins
from app.core.errors import register_exception_handlers
from app.core.logging import register_logging
from app.db import models  # noqa: F401


def create_app() -> FastAPI:
    app = FastAPI(title="bmad-todo-app API")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_allowed_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
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
