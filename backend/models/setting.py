"""System settings key-value store."""

import uuid

from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base
from backend.models.base import TimestampMixin


class Setting(Base, TimestampMixin):
    """System-wide configuration stored as key-value pairs."""

    __tablename__ = "settings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    key: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, comment="配置键")
    value: Mapped[str | None] = mapped_column(Text, nullable=True, comment="配置值")
    description: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="配置说明")

    def __repr__(self) -> str:
        return f"<Setting {self.key!r}>"
