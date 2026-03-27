import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR / 'bmad_todo.db'}",
)
