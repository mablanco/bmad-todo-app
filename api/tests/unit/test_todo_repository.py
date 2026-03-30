from collections.abc import Iterator

import pytest
from sqlalchemy.orm import Session

from app.db.session import create_session_factory
from app.repositories.todo_repository import TodoRepository


@pytest.fixture()
def db() -> Iterator[Session]:
    factory = create_session_factory("sqlite:///:memory:")
    session = factory()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def repo(db: Session) -> TodoRepository:
    return TodoRepository(db)


def test_list_returns_newest_first(repo: TodoRepository) -> None:
    first = repo.create(description="First")
    second = repo.create(description="Second")

    result = repo.list()

    assert len(result) == 2
    assert result[0].id == second.id
    assert result[1].id == first.id


def test_get_returns_none_for_missing_id(repo: TodoRepository) -> None:
    result = repo.get("nonexistent-id")

    assert result is None


def test_create_persists_and_returns_todo(repo: TodoRepository) -> None:
    todo = repo.create(description="New task")

    assert todo.id
    assert todo.description == "New task"
    assert todo.completed is False
    assert todo.created_at is not None
    assert todo.updated_at is not None


def test_update_modifies_only_provided_fields(repo: TodoRepository) -> None:
    todo = repo.create(description="Original")

    updated = repo.update(todo, completed=True)

    assert updated.description == "Original"
    assert updated.completed is True


def test_delete_removes_the_record(repo: TodoRepository) -> None:
    todo = repo.create(description="To delete")
    todo_id = todo.id

    repo.delete(todo)

    assert repo.get(todo_id) is None
