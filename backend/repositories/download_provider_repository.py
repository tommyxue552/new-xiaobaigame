"""Download provider repository — async data-access layer for download providers."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Select, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.download_provider import DownloadProvider


class DownloadProviderRepository:
    """Async repository for DownloadProvider CRUD and queries."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    # ------------------------------------------------------------------
    # Query helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _base_query() -> Select:
        """Return a base SELECT for non-deleted download providers."""
        return (
            select(DownloadProvider)
            .where(DownloadProvider.deleted_at.is_(None))
            .order_by(DownloadProvider.sort_order, DownloadProvider.name)
        )

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, provider_id: uuid.UUID) -> DownloadProvider | None:
        """Get a download provider by its UUID."""
        result = await self._session.execute(
            self._base_query().where(DownloadProvider.id == provider_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> DownloadProvider | None:
        """Get a download provider by its slug."""
        result = await self._session.execute(
            self._base_query().where(DownloadProvider.slug == slug)
        )
        return result.scalar_one_or_none()

    async def slug_exists(
        self, slug: str, exclude_id: uuid.UUID | None = None
    ) -> bool:
        """Check whether a slug is already in use by a non-deleted provider."""
        stmt = select(func.count(DownloadProvider.id)).where(
            DownloadProvider.slug == slug, DownloadProvider.deleted_at.is_(None)
        )
        if exclude_id is not None:
            stmt = stmt.where(DownloadProvider.id != exclude_id)
        result = await self._session.execute(stmt)
        return result.scalar_one() > 0

    async def name_exists(
        self, name: str, exclude_id: uuid.UUID | None = None
    ) -> bool:
        """Check whether a provider name is already in use (non-deleted)."""
        stmt = select(func.count(DownloadProvider.id)).where(
            DownloadProvider.name == name, DownloadProvider.deleted_at.is_(None)
        )
        if exclude_id is not None:
            stmt = stmt.where(DownloadProvider.id != exclude_id)
        result = await self._session.execute(stmt)
        return result.scalar_one() > 0

    # ------------------------------------------------------------------
    # List all
    # ------------------------------------------------------------------

    async def list_all(self) -> list[DownloadProvider]:
        """List all non-deleted download providers, ordered by sort_order."""
        result = await self._session.execute(self._base_query())
        return list(result.scalars().all())

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create(self, provider: DownloadProvider) -> DownloadProvider:
        """Persist a new download provider."""
        self._session.add(provider)
        await self._session.flush()
        await self._session.refresh(provider, attribute_names=["id", "created_at", "updated_at"])
        return provider

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(self, provider: DownloadProvider) -> DownloadProvider:
        """Update an existing download provider (merge)."""
        await self._session.merge(provider)
        await self._session.flush()
        return provider

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, provider_id: uuid.UUID) -> bool:
        """Soft-delete a download provider by setting deleted_at."""
        provider = await self.get_by_id(provider_id)
        if provider is None:
            return False
        provider.deleted_at = datetime.now(timezone.utc)
        await self._session.flush()
        return True
