"""Admin user model for backend management."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.models.base import BaseModel


class Admin(BaseModel):
    """Backend administrator account."""

    __tablename__ = "admins"

    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, comment="用户名")
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, comment="邮箱")
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False, comment="密码哈希")
    display_name: Mapped[str | None] = mapped_column(String(100), nullable=True, comment="显示名称")
    role: Mapped[str] = mapped_column(
        String(50), default="admin", server_default="'admin'", nullable=False,
        comment="角色: admin / super_admin"
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", nullable=False, comment="是否启用")
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, comment="最后登录时间")

    def __repr__(self) -> str:
        return f"<Admin {self.username!r}>"
