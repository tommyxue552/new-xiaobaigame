"""add_category_id_to_games

Revision ID: 2026_07_15_0002
Revises: 2026_07_15_0001
Create Date: 2026-07-15 14:00:00.000000

v0.3.0 Game API 鈥?add category_id FK to games table.
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "2026_07_15_0002"
down_revision: Union[str, None] = "2026_07_15_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add category_id column and index to games table."""
    op.add_column(
        "games",
        sa.Column(
            "category_id",
            postgresql.UUID(as_uuid=True),
            nullable=True,
            comment="分类 ID",
        ),
    )
    op.create_index("ix_games_category_id", "games", ["category_id"])
    op.create_foreign_key(
        "fk_games_category_id_categories",
        "games",
        "categories",
        ["category_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    """Remove category_id column from games table."""
    op.drop_constraint("fk_games_category_id_categories", "games", type_="foreignkey")
    op.drop_index("ix_games_category_id", table_name="games")
    op.drop_column("games", "category_id")
