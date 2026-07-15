"""Category model with hierarchical parent support."""

import uuid

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.models.base import BaseModel


class Category(BaseModel):
    """Hierarchical game category with optional parent."""

    __tablename__ = "categories"

    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="分类名称")
    slug: Mapped[str] = mapped_column(String(150), unique=True, nullable=False, comment="URL 友好标识")
    description: Mapped[str | None] = mapped_column(Text, nullable=True, comment="分类描述")
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True,
        comment="父分类 ID"
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False, comment="排序")

    # Self-referential relationship
    parent: Mapped["Category | None"] = relationship(
        "Category", remote_side="Category.id", back_populates="children", lazy="selectin"
    )
    children: Mapped[list["Category"]] = relationship(
        "Category", back_populates="parent", lazy="selectin", order_by="Category.sort_order"
    )
    # Games in this category
    games: Mapped[list["Game"]] = relationship(
        "Game", back_populates="category", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Category {self.name!r}>"
