"""Game-Tag association table."""

import uuid

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base
from backend.models.base import TimestampMixin


class GameTag(Base, TimestampMixin):
    """Many-to-many association between games and tags."""

    __tablename__ = "game_tags"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    game_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("games.id", ondelete="CASCADE"), nullable=False,
        comment="游戏 ID"
    )
    tag_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tags.id", ondelete="CASCADE"), nullable=False,
        comment="标签 ID"
    )

    __table_args__ = (
        UniqueConstraint("game_id", "tag_id", name="uq_game_tags_game_tag"),
    )

    def __repr__(self) -> str:
        return f"<GameTag game={self.game_id} tag={self.tag_id}>"
