from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.todo import Todo


class TodoRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def list(self) -> list[Todo]:
        statement = select(Todo).order_by(Todo.created_at.desc())
        return list(self._db.scalars(statement))

    def get(self, todo_id: str) -> Todo | None:
        return self._db.get(Todo, todo_id)

    def create(self, description: str) -> Todo:
        todo = Todo(description=description)
        self._db.add(todo)
        self._db.commit()
        self._db.refresh(todo)
        return todo

    def update(self, todo: Todo, *, description: str | None = None, completed: bool | None = None) -> Todo:
        if description is not None:
            todo.description = description
        if completed is not None:
            todo.completed = completed
        self._db.add(todo)
        self._db.commit()
        self._db.refresh(todo)
        return todo

    def delete(self, todo: Todo) -> None:
        self._db.delete(todo)
        self._db.commit()
