"""SEO endpoints: sitemap data for dynamic sitemap generation."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.models.game import Game
from backend.models.category import Category
from backend.models.tag import Tag
from backend.schemas.response import APIResponse
from backend.schemas.seo import SitemapUrl, SitemapIndexEntry

router = APIRouter(prefix="/seo", tags=["SEO"])


@router.get("/sitemap-games", response_model=APIResponse[list[SitemapUrl]])
async def get_sitemap_games(
    db: AsyncSession = Depends(get_db),
):
    """Return all published games for sitemap generation."""
    result = await db.execute(
        select(Game.id, Game.slug, Game.updated_at, Game.published_at, Game.cover)
        .where(Game.status == "published", Game.deleted_at.is_(None))
        .order_by(Game.updated_at.desc())
    )
    rows = result.all()

    urls: list[SitemapUrl] = []
    for row in rows:
        lastmod = row.updated_at or row.published_at
        priority = "0.9" if row.cover else "0.7"
        urls.append(SitemapUrl(
            loc=f"/game/{row.slug}",
            lastmod=lastmod,
            changefreq="weekly",
            priority=priority,
        ))
    return APIResponse.ok(data=urls)


@router.get("/sitemap-categories", response_model=APIResponse[list[SitemapUrl]])
async def get_sitemap_categories(
    db: AsyncSession = Depends(get_db),
):
    """Return all categories for sitemap generation."""
    result = await db.execute(
        select(Category.id, Category.slug, Category.updated_at)
        .where(Category.deleted_at.is_(None))
        .order_by(Category.sort_order)
    )
    rows = result.all()

    urls: list[SitemapUrl] = []
    for row in rows:
        urls.append(SitemapUrl(
            loc=f"/category/{row.slug}",
            lastmod=row.updated_at,
            changefreq="weekly",
            priority="0.6",
        ))
    return APIResponse.ok(data=urls)


@router.get("/sitemap-tags", response_model=APIResponse[list[SitemapUrl]])
async def get_sitemap_tags(
    db: AsyncSession = Depends(get_db),
):
    """Return all tags for sitemap generation."""
    result = await db.execute(
        select(Tag.id, Tag.slug, Tag.updated_at)
        .where(Tag.deleted_at.is_(None))
        .order_by(Tag.name)
    )
    rows = result.all()

    urls: list[SitemapUrl] = []
    for row in rows:
        urls.append(SitemapUrl(
            loc=f"/tag/{row.slug}",
            lastmod=row.updated_at,
            changefreq="weekly",
            priority="0.4",
        ))
    return APIResponse.ok(data=urls)


@router.get("/sitemap-static", response_model=APIResponse[list[SitemapUrl]])
async def get_sitemap_static():
    """Return static pages for sitemap generation."""
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    urls = [
        SitemapUrl(loc="/", lastmod=now, changefreq="daily", priority="1.0"),
    ]
    return APIResponse.ok(data=urls)
