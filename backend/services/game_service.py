"""Game service 鈥?business logic for game operations."""

import re
import unicodedata
import uuid
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.game import Game
from backend.repositories.game_repository import GameRepository
from backend.schemas.game import GameCreate, GameUpdate


# ---------------------------------------------------------------------------
# Slug generation
# ---------------------------------------------------------------------------

def _pinyin_slug(text: str) -> str:
    """Generate a URL-safe slug from Chinese text.

    Attempts pinyin transliteration; falls back to a timestamp-based
    slug when the title is entirely non-Latin.
    """
    # Normalize unicode
    text = unicodedata.normalize("NFKD", text)
    # Replace non-alphanumeric chars with hyphens
    slug = re.sub(r"[^a-zA-Z0-9\u4e00-\u9fff]+", "-", text.strip()).strip("-").lower()
    # If there are still Chinese characters and no Latin, use a fallback
    if re.search(r"[\u4e00-\u9fff]", slug) and not re.search(r"[a-z0-9]", slug):
        # Fallback: use a prefix with timestamp
        slug = f"game-{int(datetime.now(timezone.utc).timestamp())}"
    # Collapse multiple hyphens
    slug = re.sub(r"-+", "-", slug)
    return slug[:200]


async def generate_unique_slug(
    repo: GameRepository,
    base_title: str,
    exclude_id: uuid.UUID | None = None,
) -> str:
    """Generate a unique slug from a title.

    Tries the base slug first; appends a counter if it already exists.
    """
    base_slug = _pinyin_slug(base_title)
    if not base_slug:
        base_slug = f"game-{int(datetime.now(timezone.utc).timestamp())}"

    candidate = base_slug
    counter = 1
    while await repo.slug_exists(candidate, exclude_id=exclude_id):
        candidate = f"{base_slug}-{counter}"
        counter += 1

    return candidate


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------

class GameService:
    """Business-logic layer for game operations."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._repo = GameRepository(session)

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_slug(self, slug: str) -> Game | None:
        """Return full game detail by slug."""
        return await self._repo.get_by_slug(slug)

    async def get_by_id(self, game_id: uuid.UUID) -> Game | None:
        """Return full game detail by ID."""
        return await self._repo.get_by_id(game_id)

    async def list_games(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
        category_slug: str | None = None,
        tag_slug: str | None = None,
        keyword: str | None = None,
        sort_by: str = "published_at",
        sort_order: str = "desc",
        status: str | None = None,
    ) -> tuple[list[Game], int]:
        """List games with pagination and filtering."""
        return await self._repo.list_games(
            page=page,
            page_size=page_size,
            category_slug=category_slug,
            tag_slug=tag_slug,
            keyword=keyword,
            sort_by=sort_by,
            sort_order=sort_order,
            status=status,
        )

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create(self, data: GameCreate) -> Game:
        """Create a new game entry."""
        # Generate slug if not provided
        slug = data.slug
        if not slug:
            slug = await generate_unique_slug(self._repo, data.title)

        game = Game(
            title=data.title,
            title_en=data.title_en,
            slug=slug,
            summary=data.summary,
            content=data.content,
            cover=data.cover,
            category_id=data.category_id,
            published_at=data.published_at,
            status=data.status.value,
            seo_title=data.seo_title,
            seo_keywords=data.seo_keywords,
            seo_description=data.seo_description,
        )

        game = await self._repo.create(game)

        # Associate tags
        if data.tag_ids:
            await self._repo.set_tags(game.id, data.tag_ids)

        # Reload with relations
        return await self._repo.get_by_id(game.id)

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(self, game_id: uuid.UUID, data: GameUpdate) -> Game | None:
        """Update an existing game entry."""
        game = await self._repo.get_by_id(game_id)
        if game is None:
            return None

        # Apply partial updates
        update_data = data.model_dump(exclude_unset=True, exclude={"tag_ids"})

        # Handle slug regeneration
        if "slug" in update_data and update_data["slug"] is None:
            update_data["slug"] = await generate_unique_slug(
                self._repo, update_data.get("title", game.title), exclude_id=game_id
            )

        # Handle status enum
        if "status" in update_data and update_data["status"] is not None:
            update_data["status"] = update_data["status"].value

        for field, value in update_data.items():
            setattr(game, field, value)

        game = await self._repo.update(game)

        # Update tags if provided
        if data.tag_ids is not None:
            await self._repo.set_tags(game_id, data.tag_ids)

        # Reload with relations
        return await self._repo.get_by_id(game_id)

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, game_id: uuid.UUID) -> bool:
        """Soft-delete a game."""
        return await self._repo.soft_delete(game_id)
