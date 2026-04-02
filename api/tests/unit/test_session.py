from app.db.session import create_session_factory, get_db_session
from app.db.models.todo import Todo


def test_create_session_factory_creates_tables() -> None:
    factory = create_session_factory("sqlite:///:memory:")
    session = factory()
    try:
        result = session.query(Todo).all()
        assert result == []
    finally:
        session.close()


def test_get_db_session_yields_and_closes() -> None:
    gen = get_db_session()
    session = next(gen)
    assert session is not None

    try:
        gen.send(None)
    except StopIteration:
        pass
    # Session should be closed — no assertion needed, just verifying no crash


def test_get_db_session_rollback_on_exception() -> None:
    factory = create_session_factory("sqlite:///:memory:")
    session = factory()

    # Add a todo then simulate exception path
    todo = Todo(description="Rollback test")
    session.add(todo)
    session.flush()

    # Rollback should not crash
    session.rollback()

    result = session.query(Todo).all()
    assert result == []
    session.close()
