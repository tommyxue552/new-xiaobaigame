"""Download provider model (e.g. 百度网盘, 夸克网盘)."""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.models.base import BaseModel


class DownloadProvider(BaseModel):
    """Download channel/provider configuration."""

    __tablename__ = "download_providers"

    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="渠道名称")
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, comment="URL 友好标识")
    icon_url: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="图标 URL")
    website_url: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="官网 URL")
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False, comment="排序")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", nullable=False, comment="是否启用")

    # Relationships
    download_resources: Mapped[list["DownloadResource"]] = relationship(
        "DownloadResource", back_populates="provider", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<DownloadProvider {self.name!r}>"
