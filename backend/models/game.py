"""Game entry model."""

import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.models.base import BaseModel


class Game(BaseModel):
    """Represents a game entry on the platform."""

    __tablename__ = "games"

    title: Mapped[str] = mapped_column(String(255), nullable=False, comment="游戏标题")
    title_en: Mapped[str | None] = mapped_column(String(255), nullable=True, comment="英文标题")
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True, comment="URL 友好标识")
    summary: Mapped[str | None] = mapped_column(Text, nullable=True, comment="简介")
    content: Mapped[str | None] = mapped_column(Text, nullable=True, comment="详细内容")
    cover: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="封面图片 URL")
    category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True,
        index=True, comment="分类 ID"
    )
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, comment="发布日期")
    view_count: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0", nullable=False, comment="浏览量")
    download_count: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0", nullable=False, comment="下载量")
    status: Mapped[str] = mapped_column(
        String(20), default="draft", server_default="''draft''", nullable=False,
        comment="状态: draft / published / hidden"
    )
    seo_title: Mapped[str | None] = mapped_column(String(255), nullable=True, comment="SEO 标题")
    seo_keywords: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="SEO 关键词")
    seo_description: Mapped[str | None] = mapped_column(Text, nullable=True, comment="SEO 描述")

    # Relationships
    category: Mapped["Category | None"] = relationship("Category", back_populates="games", lazy="selectin")
    tags: Mapped[list["Tag"]] = relationship(
        "Tag", secondary="game_tags", back_populates="games", lazy="selectin"
    )
    screenshots: Mapped[list["Screenshot"]] = relationship(
        "Screenshot", back_populates="game", lazy="selectin", order_by="Screenshot.sort_order"
    )
    download_resources: Mapped[list["DownloadResource"]] = relationship(
        "DownloadResource", back_populates="game", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Game {self.title!r}>"
