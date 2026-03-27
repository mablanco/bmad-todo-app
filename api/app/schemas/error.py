from typing import Any

from app.schemas.common import APIModel


class ErrorDetails(APIModel):
    issues: list[dict[str, Any]] | None = None


class ErrorBody(APIModel):
    code: str
    message: str
    details: dict[str, Any]


class ErrorResponse(APIModel):
    error: ErrorBody
