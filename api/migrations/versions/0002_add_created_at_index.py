"""add created_at index

Revision ID: 0002
Revises: 0001
Create Date: 2026-04-02

"""
from typing import Sequence, Union

from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index("ix_todos_created_at", "todos", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_todos_created_at", "todos")
