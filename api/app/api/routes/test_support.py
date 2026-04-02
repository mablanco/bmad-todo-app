import os

from fastapi import APIRouter, Depends, Header, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.models.todo import Todo
from app.dependencies.db import get_db

router = APIRouter(prefix="/test", tags=["test-support"])

_TEST_SECRET = os.environ.get("E2E_TEST_SECRET", "")


def ensure_test_routes_enabled(
    x_test_secret: str = Header(default="", alias="X-Test-Secret"),
) -> None:
    if os.environ.get("ENABLE_E2E_TEST_ROUTES") != "1":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    if _TEST_SECRET and x_test_secret != _TEST_SECRET:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)


@router.delete("/reset", include_in_schema=False, status_code=status.HTTP_204_NO_CONTENT)
def reset_todos(
    _: None = Depends(ensure_test_routes_enabled),
    db: Session = Depends(get_db),
) -> Response:
    db.query(Todo).delete()
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
