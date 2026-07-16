"""Dashboard stats endpoint."""
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.models.category import Category
from backend.models.download_resource import DownloadResource
from backend.models.game import Game
from backend.models.tag import Tag
from backend.schemas.dashboard import DashboardRecentGame, DashboardStats
from backend.schemas.response import APIResponse

router = APIRouter(prefix="/admin/dashboard", tags=["Admin - Dashboard"])


@router.get("", response_model=APIResponse[DashboardStats])
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
):
    """Get dashboard statistics including counts and recent games."""
    # Count games
    games_count_result = await db.execute(
        select(func.count(Game.id)).where(Game.deleted_at.is_(None))
    )
    games_count = games_count_result.scalar_one()

    # Count categories
    categories_count_result = await db.execute(
        select(func.count(Category.id)).where(Category.deleted_at.is_(None))
    )
    categories_count = categories_count_result.scalar_one()

    # Count tags
    tags_count_result = await db.execute(
        select(func.count(Tag.id)).where(Tag.deleted_at.is_(None))
    )
    tags_count = tags_count_result.scalar_one()

    # Count download resources
    downloads_count_result = await db.execute(
        select(func.count(DownloadResource.id)).where(
            DownloadResource.deleted_at.is_(None)
        )
    )
    downloads_count = downloads_count_result.scalar_one()

    # Recent 10 games
    recent_result = await db.execute(
        select(Game)
        .where(Game.deleted_at.is_(None))
        .order_by(Game.created_at.desc())
        .limit(10)
    )
    recent_games = recent_result.scalars().all()

    return APIResponse.ok(
        data=DashboardStats(
            games_count=games_count,
            categories_count=categories_count,
            tags_count=tags_count,
            downloads_count=downloads_count,
            recent_games=[DashboardRecentGame.model_validate(g) for g in recent_games],
        )
    )
