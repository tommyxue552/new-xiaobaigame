"""Screenshot model for game preview images."""

import uuid

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.models.base import BaseModel


class Screenshot(BaseModel):
    """Game screenshot with sort ordering."""

    __tablename__ = "screenshots"

    game_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("games.id", ondelete="CASCADE"), nullable=False,
        index=True, comment="游戏 ID"
    )
    image_url: Mapped[str] = mapped_column(String(500), nullable=False, comment="截图 URL")
    title: Mapped[str | None] = mapped_column(String(255), nullable=True, comment="截图标题")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False, comment="排序")

    # Relationships
    game: Mapped["Game"] = relationship("Game", back_populates="screenshots")

    def __repr__(self) -> str:
        return f"<Screenshot game={self.game_id} order={self.sort_order}>"
