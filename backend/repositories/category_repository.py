"""Category repository — async data-access layer for categories."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.models.category import Category
from backend.models.game import Game


class CategoryRepository:
    """Async repository for Category CRUD and queries."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    # ------------------------------------------------------------------
    # Query helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _base_query() -> Select:
        """Return a base SELECT for non-deleted categories."""
        return (
            select(Category)
            .where(Category.deleted_at.is_(None))
            .order_by(Category.sort_order, Category.name)
        )

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, category_id: uuid.UUID) -> Category | None:
        """Get a category by its UUID."""
        result = await self._session.execute(
            self._base_query().where(Category.id == category_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Category | None:
        """Get a category by its slug."""
        result = await self._session.execute(
            self._base_query().where(Category.slug == slug)
        )
        return result.scalar_one_or_none()

    async def slug_exists(
        self, slug: str, exclude_id: uuid.UUID | None = None
    ) -> bool:
        """Check whether a slug is already in use by a non-deleted category."""
        stmt = select(func.count(Category.id)).where(
            Category.slug == slug, Category.deleted_at.is_(None)
        )
        if exclude_id is not None:
            stmt = stmt.where(Category.id != exclude_id)
        result = await self._session.execute(stmt)
        return result.scalar_one() > 0

    async def name_exists(
        self, name: str, exclude_id: uuid.UUID | None = None
    ) -> bool:
        """Check whether a category name is already in use (non-deleted)."""
        stmt = select(func.count(Category.id)).where(
            Category.name == name, Category.deleted_at.is_(None)
        )
        if exclude_id is not None:
            stmt = stmt.where(Category.id != exclude_id)
        result = await self._session.execute(stmt)
        return result.scalar_one() > 0

    # ------------------------------------------------------------------
    # List all (for tree building)
    # ------------------------------------------------------------------

    async def get_all(self) -> list[Category]:
        """Get all non-deleted categories, ordered by sort_order then name."""
        result = await self._session.execute(self._base_query())
        return list(result.scalars().all())

    # ------------------------------------------------------------------
    # Game count per category
    # ------------------------------------------------------------------

    async def get_game_counts(self) -> dict[uuid.UUID, int]:
        """Return a mapping of category_id -> count of non-deleted games."""
        stmt = (
            select(Game.category_id, func.count(Game.id))
            .where(
                Game.deleted_at.is_(None),
                Game.category_id.is_not(None),
            )
            .group_by(Game.category_id)
        )
        result = await self._session.execute(stmt)
        return {row[0]: row[1] for row in result.all()}

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create(self, category: Category) -> Category:
        """Persist a new category."""
        self._session.add(category)
        await self._session.flush()
        await self._session.refresh(category, attribute_names=["id", "created_at", "updated_at"])
        return category

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(self, category: Category) -> Category:
        """Update an existing category (merge)."""
        await self._session.merge(category)
        await self._session.flush()
        return category

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, category_id: uuid.UUID) -> bool:
        """Soft-delete a category by setting deleted_at."""
        category = await self.get_by_id(category_id)
        if category is None:
            return False
        category.deleted_at = datetime.now(timezone.utc)
        await self._session.flush()
        return True
