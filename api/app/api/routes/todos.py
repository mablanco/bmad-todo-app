from typing import Annotated

from fastapi import APIRouter, Depends, Path, Response, status
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.repositories.todo_repository import TodoRepository
from app.schemas.common import DataResponse
from app.schemas.todo import TodoCreate, TodoRead, TodoUpdate
from app.services.todo_service import TodoService

router = APIRouter(prefix="/todos", tags=["todos"])

DBSession = Annotated[Session, Depends(get_db)]
TodoId = Annotated[str, Path(min_length=1, max_length=36)]


def build_service(db: Session) -> TodoService:
    return TodoService(TodoRepository(db))


@router.get("", response_model=DataResponse[list[TodoRead]])
def list_todos(db: DBSession) -> DataResponse[list[TodoRead]]:
    todos = build_service(db).list_todos()
    return DataResponse(data=[TodoRead.model_validate(todo) for todo in todos])


@router.post("", response_model=DataResponse[TodoRead], status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: DBSession) -> DataResponse[TodoRead]:
    todo = build_service(db).create_todo(payload)
    return DataResponse(data=TodoRead.model_validate(todo))


@router.patch("/{todoId}", response_model=DataResponse[TodoRead])
def update_todo(todoId: TodoId, payload: TodoUpdate, db: DBSession) -> DataResponse[TodoRead]:
    todo = build_service(db).update_todo(todoId, payload)
    return DataResponse(data=TodoRead.model_validate(todo))


@router.delete("/{todoId}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todoId: TodoId, db: DBSession) -> Response:
    build_service(db).delete_todo(todoId)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
