from app.core.errors import AppError
from app.db.models.todo import Todo
from app.repositories.todo_repository import TodoRepository
from app.schemas.todo import TodoCreate, TodoUpdate


class TodoService:
    def __init__(self, repository: TodoRepository) -> None:
        self._repository = repository

    def list_todos(self) -> list[Todo]:
        return self._repository.list()

    def create_todo(self, payload: TodoCreate) -> Todo:
        return self._repository.create(description=payload.description)

    def update_todo(self, todo_id: str, payload: TodoUpdate) -> Todo:
        todo = self._repository.get(todo_id)
        if todo is None:
            raise AppError(
                code="TODO_NOT_FOUND",
                message="Todo not found.",
                status_code=404,
            )
        return self._repository.update(
            todo,
            description=payload.description,
            completed=payload.completed,
        )

    def delete_todo(self, todo_id: str) -> None:
        todo = self._repository.get(todo_id)
        if todo is None:
            raise AppError(
                code="TODO_NOT_FOUND",
                message="Todo not found.",
                status_code=404,
            )
        self._repository.delete(todo)
