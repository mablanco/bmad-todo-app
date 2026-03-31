import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:4173",
    "http://localhost:4173",
]
DEFAULT_DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR / 'bmad_todo.db'}",
)


def get_allowed_origins() -> list[str]:
    origins = os.environ.get("ALLOWED_ORIGINS")
    if not origins:
        return DEFAULT_ALLOWED_ORIGINS
    return [origin.strip() for origin in origins.split(",") if origin.strip()]
