"""add_core_tables

Revision ID: 2026_07_15_0001
Revises:
Create Date: 2026-07-15 12:00:00.000000

Database Foundation — all core tables for web-xiaobaigame v0.2.0:
  games, categories, tags, game_tags, screenshots,
  download_providers, download_resources, admins, settings
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "2026_07_15_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable uuid-ossp extension for UUID generation
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    # ----------------------------------------------------------------
    # games
    # ----------------------------------------------------------------
    op.create_table(
        "games",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False, comment="游戏标题"),
        sa.Column("title_en", sa.String(255), nullable=True, comment="英文标题"),
        sa.Column("slug", sa.String(255), nullable=False, comment="URL 友好标识"),
        sa.Column("summary", sa.Text(), nullable=True, comment="简介"),
        sa.Column("content", sa.Text(), nullable=True, comment="详细内容"),
        sa.Column("cover", sa.String(500), nullable=True, comment="封面图片 URL"),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True, comment="发布日期"),
        sa.Column("view_count", sa.BigInteger(), nullable=False, server_default="0", comment="浏览量"),
        sa.Column("download_count", sa.BigInteger(), nullable=False, server_default="0", comment="下载量"),
        sa.Column("status", sa.String(20), nullable=False, server_default="'draft'", comment="状态: draft / published / hidden"),
        sa.Column("seo_title", sa.String(255), nullable=True, comment="SEO 标题"),
        sa.Column("seo_keywords", sa.String(500), nullable=True, comment="SEO 关键词"),
        sa.Column("seo_description", sa.Text(), nullable=True, comment="SEO 描述"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_games_slug", "games", ["slug"], unique=True)
    op.create_index("ix_games_status", "games", ["status"])
    op.create_index("ix_games_published_at", "games", ["published_at"])
    op.create_index("ix_games_deleted_at", "games", ["deleted_at"], postgresql_where=sa.text("deleted_at IS NULL"))
    op.create_index("ix_games_title", "games", ["title"])

    # ----------------------------------------------------------------
    # categories
    # ----------------------------------------------------------------
    op.create_table(
        "categories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False, comment="分类名称"),
        sa.Column("slug", sa.String(150), nullable=False, comment="URL 友好标识"),
        sa.Column("description", sa.Text(), nullable=True, comment="分类描述"),
        sa.Column("parent_id", postgresql.UUID(as_uuid=True), nullable=True, comment="父分类 ID"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0", comment="排序"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_categories_slug", "categories", ["slug"], unique=True)
    op.create_index("ix_categories_parent_id", "categories", ["parent_id"])
    op.create_index("ix_categories_deleted_at", "categories", ["deleted_at"], postgresql_where=sa.text("deleted_at IS NULL"))
    op.create_foreign_key("fk_categories_parent_id_categories", "categories", "categories", ["parent_id"], ["id"], ondelete="SET NULL")

    # ----------------------------------------------------------------
    # tags
    # ----------------------------------------------------------------
    op.create_table(
        "tags",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False, comment="标签名称"),
        sa.Column("slug", sa.String(150), nullable=False, comment="URL 友好标识"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_tags_slug", "tags", ["slug"], unique=True)
    op.create_index("ix_tags_deleted_at", "tags", ["deleted_at"], postgresql_where=sa.text("deleted_at IS NULL"))

    # ----------------------------------------------------------------
    # game_tags (association table)
    # ----------------------------------------------------------------
    op.create_table(
        "game_tags",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("game_id", postgresql.UUID(as_uuid=True), nullable=False, comment="游戏 ID"),
        sa.Column("tag_id", postgresql.UUID(as_uuid=True), nullable=False, comment="标签 ID"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_game_tags_game_id", "game_tags", ["game_id"])
    op.create_index("ix_game_tags_tag_id", "game_tags", ["tag_id"])
    op.create_unique_constraint("uq_game_tags_game_tag", "game_tags", ["game_id", "tag_id"])
    op.create_foreign_key("fk_game_tags_game_id_games", "game_tags", "games", ["game_id"], ["id"], ondelete="CASCADE")
    op.create_foreign_key("fk_game_tags_tag_id_tags", "game_tags", "tags", ["tag_id"], ["id"], ondelete="CASCADE")

    # ----------------------------------------------------------------
    # screenshots
    # ----------------------------------------------------------------
    op.create_table(
        "screenshots",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("game_id", postgresql.UUID(as_uuid=True), nullable=False, comment="游戏 ID"),
        sa.Column("image_url", sa.String(500), nullable=False, comment="截图 URL"),
        sa.Column("title", sa.String(255), nullable=True, comment="截图标题"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0", comment="排序"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_screenshots_game_id", "screenshots", ["game_id"])
    op.create_index("ix_screenshots_sort_order", "screenshots", ["sort_order"])
    op.create_index("ix_screenshots_deleted_at", "screenshots", ["deleted_at"], postgresql_where=sa.text("deleted_at IS NULL"))
    op.create_foreign_key("fk_screenshots_game_id_games", "screenshots", "games", ["game_id"], ["id"], ondelete="CASCADE")

    # ----------------------------------------------------------------
    # download_providers
    # ----------------------------------------------------------------
    op.create_table(
        "download_providers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False, comment="渠道名称"),
        sa.Column("slug", sa.String(100), nullable=False, comment="URL 友好标识"),
        sa.Column("icon_url", sa.String(500), nullable=True, comment="图标 URL"),
        sa.Column("website_url", sa.String(500), nullable=True, comment="官网 URL"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0", comment="排序"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true", comment="是否启用"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_download_providers_slug", "download_providers", ["slug"], unique=True)
    op.create_index("ix_download_providers_deleted_at", "download_providers", ["deleted_at"], postgresql_where=sa.text("deleted_at IS NULL"))

    # ----------------------------------------------------------------
    # download_resources
    # ----------------------------------------------------------------
    op.create_table(
        "download_resources",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("game_id", postgresql.UUID(as_uuid=True), nullable=False, comment="游戏 ID"),
        sa.Column("provider_id", postgresql.UUID(as_uuid=True), nullable=False, comment="下载渠道 ID"),
        sa.Column("download_url", sa.Text(), nullable=False, comment="下载地址"),
        sa.Column("extract_code", sa.String(50), nullable=True, comment="提取码"),
        sa.Column("priority", sa.Integer(), nullable=False, server_default="0", comment="优先级"),
        sa.Column("status", sa.String(20), nullable=False, server_default="'active'", comment="状态: active / expired / disabled"),
        sa.Column("notes", sa.Text(), nullable=True, comment="备注"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_download_resources_game_id", "download_resources", ["game_id"])
    op.create_index("ix_download_resources_provider_id", "download_resources", ["provider_id"])
    op.create_index("ix_download_resources_status", "download_resources", ["status"])
    op.create_index("ix_download_resources_deleted_at", "download_resources", ["deleted_at"], postgresql_where=sa.text("deleted_at IS NULL"))
    op.create_foreign_key("fk_download_resources_game_id_games", "download_resources", "games", ["game_id"], ["id"], ondelete="CASCADE")
    op.create_foreign_key("fk_download_resources_provider_id_download_providers", "download_resources", "download_providers", ["provider_id"], ["id"], ondelete="RESTRICT")

    # ----------------------------------------------------------------
    # admins
    # ----------------------------------------------------------------
    op.create_table(
        "admins",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("username", sa.String(100), nullable=False, comment="用户名"),
        sa.Column("email", sa.String(255), nullable=False, comment="邮箱"),
        sa.Column("password_hash", sa.String(255), nullable=False, comment="密码哈希"),
        sa.Column("display_name", sa.String(100), nullable=True, comment="显示名称"),
        sa.Column("role", sa.String(50), nullable=False, server_default="'admin'", comment="角色: admin / super_admin"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true", comment="是否启用"),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True, comment="最后登录时间"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_admins_username", "admins", ["username"], unique=True)
    op.create_index("ix_admins_email", "admins", ["email"], unique=True)
    op.create_index("ix_admins_deleted_at", "admins", ["deleted_at"], postgresql_where=sa.text("deleted_at IS NULL"))

    # ----------------------------------------------------------------
    # settings
    # ----------------------------------------------------------------
    op.create_table(
        "settings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("key", sa.String(255), nullable=False, comment="配置键"),
        sa.Column("value", sa.Text(), nullable=True, comment="配置值"),
        sa.Column("description", sa.String(500), nullable=True, comment="配置说明"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_settings_key", "settings", ["key"], unique=True)

    # ----------------------------------------------------------------
    # Seed data: download_providers
    # ----------------------------------------------------------------
    op.execute("""
        INSERT INTO download_providers (id, name, slug, sort_order, is_active, created_at, updated_at)
        VALUES
            (uuid_generate_v4(), '百度网盘', 'baidu', 1, true, NOW(), NOW()),
            (uuid_generate_v4(), '夸克网盘', 'quark', 2, true, NOW(), NOW()),
            (uuid_generate_v4(), '阿里云盘', 'aliyun', 3, true, NOW(), NOW()),
            (uuid_generate_v4(), '115网盘', '115', 4, true, NOW(), NOW()),
            (uuid_generate_v4(), '迅雷', 'xunlei', 5, true, NOW(), NOW()),
            (uuid_generate_v4(), 'UC网盘', 'uc', 6, true, NOW(), NOW()),
            (uuid_generate_v4(), '天翼云盘', 'tianyi', 7, true, NOW(), NOW()),
            (uuid_generate_v4(), '移动云盘', 'yidong', 8, true, NOW(), NOW())
    """)


def downgrade() -> None:
    op.drop_table("settings")
    op.drop_table("admins")
    op.drop_table("download_resources")
    op.drop_table("download_providers")
    op.drop_table("screenshots")
    op.drop_table("game_tags")
    op.drop_table("tags")
    op.drop_table("categories")
    op.drop_table("games")
    op.execute('DROP EXTENSION IF EXISTS "uuid-ossp"')
