"""SQLAlchemy ORM models — all models must be imported here for Alembic autogenerate."""

from backend.models.base import BaseModel

from backend.models.game import Game
from backend.models.category import Category
from backend.models.tag import Tag
from backend.models.game_tag import GameTag
from backend.models.screenshot import Screenshot
from backend.models.download_provider import DownloadProvider
from backend.models.download_resource import DownloadResource
from backend.models.admin import Admin
from backend.models.setting import Setting

__all__ = [
    "BaseModel",
    "Game",
    "Category",
    "Tag",
    "GameTag",
    "Screenshot",
    "DownloadProvider",
    "DownloadResource",
    "Admin",
    "Setting",
]
