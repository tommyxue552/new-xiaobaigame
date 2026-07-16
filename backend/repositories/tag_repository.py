"""Tag repository — async data-access layer for tags."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Select, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.game import Game
from backend.models.game_tag import GameTag
from backend.models.tag import Tag


class TagRepository:
    """Async repository for Tag CRUD and queries."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    # ------------------------------------------------------------------
    # Query helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _base_query() -> Select:
        """Return a base SELECT for non-deleted tags."""
        return (
            select(Tag)
            .where(Tag.deleted_at.is_(None))
            .order_by(Tag.name)
        )

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, tag_id: uuid.UUID) -> Tag | None:
        """Get a tag by its UUID."""
        result = await self._session.execute(
            self._base_query().where(Tag.id == tag_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Tag | None:
        """Get a tag by its slug."""
        result = await self._session.execute(
            self._base_query().where(Tag.slug == slug)
        )
        return result.scalar_one_or_none()

    async def slug_exists(
        self, slug: str, exclude_id: uuid.UUID | None = None
    ) -> bool:
        """Check whether a slug is already in use by a non-deleted tag."""
        stmt = select(func.count(Tag.id)).where(
            Tag.slug == slug, Tag.deleted_at.is_(None)
        )
        if exclude_id is not None:
            stmt = stmt.where(Tag.id != exclude_id)
        result = await self._session.execute(stmt)
        return result.scalar_one() > 0

    async def name_exists(
        self, name: str, exclude_id: uuid.UUID | None = None
    ) -> bool:
        """Check whether a tag name is already in use (non-deleted)."""
        stmt = select(func.count(Tag.id)).where(
            Tag.name == name, Tag.deleted_at.is_(None)
        )
        if exclude_id is not None:
            stmt = stmt.where(Tag.id != exclude_id)
        result = await self._session.execute(stmt)
        return result.scalar_one() > 0

    # ------------------------------------------------------------------
    # List with pagination and optional keyword search
    # ------------------------------------------------------------------

    async def list_tags(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
        keyword: str | None = None,
    ) -> tuple[list[Tag], int]:
        """List tags with pagination and optional keyword search.

        Returns:
            Tuple of (items, total_count).
        """
        query = self._base_query()

        if keyword:
            ilike_pattern = f"%{keyword}%"
            query = query.where(
                or_(
                    Tag.name.ilike(ilike_pattern),
                    Tag.slug.ilike(ilike_pattern),
                )
            )

        # Count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self._session.execute(count_query)
        total = total_result.scalar_one()

        # Pagination
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await self._session.execute(query)
        items = list(result.scalars().all())

        return items, total

    # ------------------------------------------------------------------
    # Game count per tag
    # ------------------------------------------------------------------

    async def get_game_counts(self) -> dict[uuid.UUID, int]:
        """Return a mapping of tag_id -> count of non-deleted games."""
        stmt = (
            select(GameTag.tag_id, func.count(GameTag.game_id))
            .join(Game, Game.id == GameTag.game_id)
            .where(Game.deleted_at.is_(None))
            .group_by(GameTag.tag_id)
        )
        result = await self._session.execute(stmt)
        return {row[0]: row[1] for row in result.all()}

    async def get_game_count(self, tag_id: uuid.UUID) -> int:
        """Get game count for a single tag."""
        stmt = (
            select(func.count(GameTag.game_id))
            .join(Game, Game.id == GameTag.game_id)
            .where(
                GameTag.tag_id == tag_id,
                Game.deleted_at.is_(None),
            )
        )
        result = await self._session.execute(stmt)
        return result.scalar_one()

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create(self, tag: Tag) -> Tag:
        """Persist a new tag."""
        self._session.add(tag)
        await self._session.flush()
        await self._session.refresh(tag, attribute_names=["id", "created_at", "updated_at"])
        return tag

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(self, tag: Tag) -> Tag:
        """Update an existing tag (merge)."""
        await self._session.merge(tag)
        await self._session.flush()
        return tag

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, tag_id: uuid.UUID) -> bool:
        """Soft-delete a tag by setting deleted_at."""
        tag = await self.get_by_id(tag_id)
        if tag is None:
            return False
        tag.deleted_at = datetime.now(timezone.utc)
        await self._session.flush()
        return True
