from dataclasses import dataclass, field
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


@dataclass
class AppError(Exception):
    code: str
    message: str
    status_code: int
    details: dict[str, Any] = field(default_factory=dict)


def error_payload(code: str, message: str, details: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "error": {
            "code": code,
            "message": message,
            "details": details or {},
        }
    }


async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=error_payload(exc.code, exc.message, exc.details),
    )


async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    details = {"issues": jsonable_encoder(exc.errors())}
    return JSONResponse(
        status_code=422,
        content=error_payload(
            "VALIDATION_ERROR",
            "Request validation failed.",
            details,
        ),
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, app_error_handler)
    app.add_exception_handler(RequestValidationError, validation_error_handler)
