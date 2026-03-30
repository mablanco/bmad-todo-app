from unittest.mock import MagicMock

import pytest

from app.core.errors import AppError
from app.db.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate
from app.services.todo_service import TodoService


@pytest.fixture()
def repo() -> MagicMock:
    return MagicMock()


@pytest.fixture()
def service(repo: MagicMock) -> TodoService:
    return TodoService(repo)


def _make_todo(**overrides) -> MagicMock:
    defaults = {
        "id": "abc-123",
        "description": "Test task",
        "completed": False,
    }
    defaults.update(overrides)
    return MagicMock(spec=Todo, **defaults)


def test_list_todos_delegates_to_repository(service: TodoService, repo: MagicMock) -> None:
    expected = [_make_todo(), _make_todo(id="def-456")]
    repo.list.return_value = expected

    result = service.list_todos()

    repo.list.assert_called_once()
    assert result == expected


def test_create_todo_passes_description_to_repository(service: TodoService, repo: MagicMock) -> None:
    payload = TodoCreate(description="Buy milk")
    todo = _make_todo(description="Buy milk")
    repo.create.return_value = todo

    result = service.create_todo(payload)

    repo.create.assert_called_once_with(description="Buy milk")
    assert result == todo


def test_update_todo_raises_not_found_when_missing(service: TodoService, repo: MagicMock) -> None:
    repo.get.return_value = None

    with pytest.raises(AppError) as exc_info:
        service.update_todo("missing-id", TodoUpdate(completed=True))

    assert exc_info.value.code == "TODO_NOT_FOUND"
    assert exc_info.value.status_code == 404


def test_update_todo_passes_partial_fields(service: TodoService, repo: MagicMock) -> None:
    existing = _make_todo()
    repo.get.return_value = existing
    repo.update.return_value = existing

    service.update_todo("abc-123", TodoUpdate(completed=True))

    repo.update.assert_called_once_with(existing, description=None, completed=True)


def test_delete_todo_raises_not_found_when_missing(service: TodoService, repo: MagicMock) -> None:
    repo.get.return_value = None

    with pytest.raises(AppError) as exc_info:
        service.delete_todo("missing-id")

    assert exc_info.value.code == "TODO_NOT_FOUND"
    assert exc_info.value.status_code == 404


def test_delete_todo_delegates_to_repository(service: TodoService, repo: MagicMock) -> None:
    existing = _make_todo()
    repo.get.return_value = existing

    service.delete_todo("abc-123")

    repo.delete.assert_called_once_with(existing)
