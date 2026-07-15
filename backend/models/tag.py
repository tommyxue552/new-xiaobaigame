"""Tag model for game tagging."""

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.models.base import BaseModel


class Tag(BaseModel):
    """Tag for categorizing games."""

    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="标签名称")
    slug: Mapped[str] = mapped_column(String(150), unique=True, nullable=False, comment="URL 友好标识")

    # Relationships
    games: Mapped[list["Game"]] = relationship(
        "Game", secondary="game_tags", back_populates="tags", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Tag {self.name!r}>"
