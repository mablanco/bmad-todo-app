import os

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.models.todo import Todo
from app.dependencies.db import get_db

router = APIRouter(prefix="/test", tags=["test-support"])


def ensure_test_routes_enabled() -> None:
    if os.environ.get("ENABLE_E2E_TEST_ROUTES") != "1":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)


@router.delete("/reset", include_in_schema=False, status_code=status.HTTP_204_NO_CONTENT)
def reset_todos(
    _: None = Depends(ensure_test_routes_enabled),
    db: Session = Depends(get_db),
) -> Response:
    db.query(Todo).delete()
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
