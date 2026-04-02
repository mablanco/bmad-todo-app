import pytest
from pydantic import ValidationError

from app.schemas.todo import TodoCreate, TodoUpdate


def test_create_accepts_500_char_description() -> None:
    todo = TodoCreate(description="a" * 500)
    assert len(todo.description) == 500


def test_create_rejects_501_char_description() -> None:
    with pytest.raises(ValidationError):
        TodoCreate(description="a" * 501)


def test_create_trims_whitespace_before_validation() -> None:
    todo = TodoCreate(description="  hello  ")
    assert todo.description == "hello"


def test_create_rejects_whitespace_only() -> None:
    with pytest.raises(ValidationError):
        TodoCreate(description="   ")


def test_update_rejects_empty_payload() -> None:
    with pytest.raises(ValidationError):
        TodoUpdate()


def test_update_accepts_completed_only() -> None:
    update = TodoUpdate(completed=True)
    assert update.completed is True
    assert update.description is None


def test_update_accepts_500_char_description() -> None:
    update = TodoUpdate(description="b" * 500)
    assert len(update.description) == 500


def test_update_rejects_501_char_description() -> None:
    with pytest.raises(ValidationError):
        TodoUpdate(description="b" * 501)
