from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import DEFAULT_DATABASE_URL
from app.db.base import Base
from app.db import models  # noqa: F401


def create_session_factory(database_url: str = DEFAULT_DATABASE_URL) -> sessionmaker[Session]:
    connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
    engine = create_engine(database_url, connect_args=connect_args)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, autoflush=False, autocommit=False)


SessionLocal = create_session_factory()


def get_db_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
