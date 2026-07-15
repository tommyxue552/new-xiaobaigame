"""Game repository 鈥?async data-access layer for games."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Select, func, or_, select, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from backend.models.category import Category
from backend.models.download_provider import DownloadProvider
from backend.models.download_resource import DownloadResource
from backend.models.game import Game
from backend.models.game_tag import GameTag
from backend.models.screenshot import Screenshot
from backend.models.tag import Tag


class GameRepository:
    """Async repository for Game CRUD and queries."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    # ------------------------------------------------------------------
    # Query helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _base_query() -> Select:
        """Return a base SELECT for games (non-deleted only)."""
        return (
            select(Game)
            .where(Game.deleted_at.is_(None))
            .options(
                selectinload(Game.category),
                selectinload(Game.tags),
            )
        )

    @staticmethod
    def _detail_query() -> Select:
        """Return a SELECT for game detail with all relationships."""
        return (
            select(Game)
            .where(Game.deleted_at.is_(None))
            .options(
                selectinload(Game.category),
                selectinload(Game.tags),
                selectinload(Game.screenshots.and_(Screenshot.deleted_at.is_(None))),
                selectinload(
                    Game.download_resources.and_(
                        DownloadResource.deleted_at.is_(None),
                        DownloadResource.status == "active",
                    )
                ).joinedload(DownloadResource.provider),
            )
        )

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, game_id: uuid.UUID) -> Game | None:
        """Get a game by its UUID, including all relations."""
        result = await self._session.execute(
            self._detail_query().where(Game.id == game_id)
        )
        return result.unique().scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Game | None:
        """Get a game by its slug, including all relations."""
        result = await self._session.execute(
            self._detail_query().where(Game.slug == slug)
        )
        return result.unique().scalar_one_or_none()

    async def slug_exists(self, slug: str, exclude_id: uuid.UUID | None = None) -> bool:
        """Check whether a slug is already in use."""
        stmt = select(func.count(Game.id)).where(Game.slug == slug, Game.deleted_at.is_(None))
        if exclude_id is not None:
            stmt = stmt.where(Game.id != exclude_id)
        result = await self._session.execute(stmt)
        return result.scalar_one() > 0

    # ------------------------------------------------------------------
    # List with pagination, filtering, sorting
    # ------------------------------------------------------------------

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
        """List games with pagination, filtering, and sorting.

        Returns:
            Tuple of (items, total_count).
        """
        # Base query
        query = self._base_query()

        # --- Category filter ---
        if category_slug:
            query = query.join(Game.category).where(
                Category.slug == category_slug,
                Category.deleted_at.is_(None),
            )

        # --- Tag filter ---
        if tag_slug:
            query = (
                query.join(Game.tags)
                .where(Tag.slug == tag_slug, Tag.deleted_at.is_(None))
            )

        # --- Keyword search ---
        if keyword:
            ilike_pattern = f"%{keyword}%"
            query = query.where(
                or_(
                    Game.title.ilike(ilike_pattern),
                    Game.title_en.ilike(ilike_pattern),
                    Game.summary.ilike(ilike_pattern),
                )
            )

        # --- Status filter ---
        if status:
            query = query.where(Game.status == status)

        # --- Count (before pagination) ---
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self._session.execute(count_query)
        total = total_result.scalar_one()

        # --- Sorting ---
        sort_column = getattr(Game, sort_by, Game.published_at)
        if sort_order == "asc":
            query = query.order_by(sort_column.asc().nulls_last())
        else:
            query = query.order_by(sort_column.desc().nulls_last())

        # --- Pagination ---
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await self._session.execute(query)
        items = list(result.unique().scalars().all())

        return items, total

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create(self, game: Game) -> Game:
        """Persist a new game."""
        self._session.add(game)
        await self._session.flush()
        await self._session.refresh(game, attribute_names=["id", "created_at", "updated_at"])
        return game

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(self, game: Game) -> Game:
        """Update an existing game (merge)."""
        await self._session.merge(game)
        await self._session.flush()
        return game

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, game_id: uuid.UUID) -> bool:
        """Soft-delete a game by setting deleted_at."""
        game = await self.get_by_id(game_id)
        if game is None:
            return False
        game.deleted_at = datetime.now(timezone.utc)
        await self._session.flush()
        return True

    # ------------------------------------------------------------------
    # Tag association helpers
    # ------------------------------------------------------------------

    async def set_tags(self, game_id: uuid.UUID, tag_ids: list[uuid.UUID]) -> None:
        """Replace all tag associations for a game."""
        # Remove existing
        await self._session.execute(
            text("DELETE FROM game_tags WHERE game_id = :game_id"),
            {"game_id": game_id},
        )
        # Insert new
        now = datetime.now(timezone.utc)
        for tag_id in tag_ids:
            self._session.add(
                GameTag(
                    game_id=game_id,
                    tag_id=tag_id,
                    created_at=now,
                    updated_at=now,
                )
            )
        await self._session.flush()
