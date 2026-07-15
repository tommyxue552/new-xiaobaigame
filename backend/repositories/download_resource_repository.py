"""Download resource repository — async data-access layer for download resources."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from backend.models.download_resource import DownloadResource
from backend.models.download_provider import DownloadProvider
from backend.models.game import Game


class DownloadResourceRepository:
    """Async repository for DownloadResource CRUD and queries."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    # ------------------------------------------------------------------
    # Query helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _base_query() -> Select:
        """Return a base SELECT for non-deleted download resources with provider eager-loaded."""
        return (
            select(DownloadResource)
            .where(DownloadResource.deleted_at.is_(None))
            .options(joinedload(DownloadResource.provider))
            .order_by(DownloadResource.priority, DownloadResource.created_at)
        )

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, resource_id: uuid.UUID) -> DownloadResource | None:
        """Get a download resource by its UUID."""
        result = await self._session.execute(
            self._base_query().where(DownloadResource.id == resource_id)
        )
        return result.scalar_one_or_none()

    # ------------------------------------------------------------------
    # List by game
    # ------------------------------------------------------------------

    async def list_by_game(
        self, game_id: uuid.UUID, *, only_active: bool = False
    ) -> list[DownloadResource]:
        """List download resources for a specific game.

        Args:
            game_id: The game UUID.
            only_active: If True, only return resources with status='active'
                         and whose provider is active.
        """
        query = self._base_query().where(DownloadResource.game_id == game_id)

        if only_active:
            query = query.where(
                DownloadResource.status == "active",
                DownloadProvider.is_active == True,  # noqa: E712
            )

        result = await self._session.execute(query)
        return list(result.scalars().all())

    # ------------------------------------------------------------------
    # List all (admin)
    # ------------------------------------------------------------------

    async def list_all(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
        game_id: uuid.UUID | None = None,
    ) -> tuple[list[DownloadResource], int]:
        """List download resources with pagination and optional game filter.

        Returns:
            Tuple of (items, total_count).
        """
        query = self._base_query()

        if game_id is not None:
            query = query.where(DownloadResource.game_id == game_id)

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
    # Create
    # ------------------------------------------------------------------

    async def create(self, resource: DownloadResource) -> DownloadResource:
        """Persist a new download resource."""
        self._session.add(resource)
        await self._session.flush()
        await self._session.refresh(resource, attribute_names=["id", "created_at", "updated_at"])
        # Re-fetch with provider eager-loaded
        return await self.get_by_id(resource.id)

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(self, resource: DownloadResource) -> DownloadResource:
        """Update an existing download resource (merge)."""
        await self._session.merge(resource)
        await self._session.flush()
        return await self.get_by_id(resource.id)

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, resource_id: uuid.UUID) -> bool:
        """Soft-delete a download resource by setting deleted_at."""
        resource = await self._session.execute(
            select(DownloadResource).where(
                DownloadResource.id == resource_id,
                DownloadResource.deleted_at.is_(None),
            )
        )
        resource = resource.scalar_one_or_none()
        if resource is None:
            return False
        resource.deleted_at = datetime.now(timezone.utc)
        await self._session.flush()
        return True

    # ------------------------------------------------------------------
    # Validation helpers
    # ------------------------------------------------------------------

    async def game_exists(self, game_id: uuid.UUID) -> bool:
        """Check whether a non-deleted game exists."""
        stmt = select(func.count(Game.id)).where(
            Game.id == game_id, Game.deleted_at.is_(None)
        )
        result = await self._session.execute(stmt)
        return result.scalar_one() > 0

    async def provider_exists(self, provider_id: uuid.UUID) -> bool:
        """Check whether a non-deleted provider exists."""
        stmt = select(func.count(DownloadProvider.id)).where(
            DownloadProvider.id == provider_id,
            DownloadProvider.deleted_at.is_(None),
        )
        result = await self._session.execute(stmt)
        return result.scalar_one() > 0
