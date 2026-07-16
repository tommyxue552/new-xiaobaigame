"""Download resource model linking games to download providers."""

import uuid

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.models.base import BaseModel


class DownloadResource(BaseModel):
    """A downloadable resource for a game from a specific provider."""

    __tablename__ = "download_resources"

    game_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("games.id", ondelete="CASCADE"), nullable=False,
        index=True, comment="游戏 ID"
    )
    provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("download_providers.id", ondelete="RESTRICT"), nullable=False,
        index=True, comment="下载渠道 ID"
    )
    download_url: Mapped[str] = mapped_column(Text, nullable=False, comment="下载地址")
    extract_code: Mapped[str | None] = mapped_column(String(50), nullable=True, comment="提取码")
    priority: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False, comment="优先级")
    status: Mapped[str] = mapped_column(
        String(20), default="active", server_default="''active''", nullable=False,
        comment="状态: active / expired / disabled"
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True, comment="备注")

    # Relationships
    game: Mapped["Game"] = relationship("Game", back_populates="download_resources")
    provider: Mapped["DownloadProvider"] = relationship("DownloadProvider", back_populates="download_resources")

    def __repr__(self) -> str:
        return f"<DownloadResource game={self.game_id} provider={self.provider_id}>"
