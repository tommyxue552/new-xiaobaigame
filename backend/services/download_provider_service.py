"""Download provider service — business logic for download provider operations."""

import uuid
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.download_provider import DownloadProvider
from backend.repositories.download_provider_repository import DownloadProviderRepository
from backend.schemas.download_provider import DownloadProviderCreate, DownloadProviderUpdate
from backend.utils.slug import pinyin_slug


# ---------------------------------------------------------------------------
# Slug generation
# ---------------------------------------------------------------------------

async def generate_unique_provider_slug(
    repo: DownloadProviderRepository,
    base_name: str,
    exclude_id: uuid.UUID | None = None,
) -> str:
    """Generate a unique slug from a provider name."""
    base_slug = pinyin_slug(base_name, fallback_prefix="provider")
    if not base_slug:
        base_slug = f"provider-{int(datetime.now(timezone.utc).timestamp())}"

    candidate = base_slug
    counter = 1
    while await repo.slug_exists(candidate, exclude_id=exclude_id):
        candidate = f"{base_slug}-{counter}"
        counter += 1

    return candidate


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------

class DownloadProviderService:
    """Business-logic layer for download provider operations."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._repo = DownloadProviderRepository(session)

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, provider_id: uuid.UUID) -> DownloadProvider | None:
        """Return a provider by ID."""
        return await self._repo.get_by_id(provider_id)

    async def get_by_slug(self, slug: str) -> DownloadProvider | None:
        """Return a provider by slug."""
        return await self._repo.get_by_slug(slug)

    async def list_all(self) -> list[DownloadProvider]:
        """List all non-deleted providers."""
        return await self._repo.list_all()

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create(self, data: DownloadProviderCreate) -> DownloadProvider:
        """Create a new download provider."""
        if await self._repo.name_exists(data.name):
            raise ValueError(f"Provider name '{data.name}' already exists")

        slug = data.slug
        if not slug:
            slug = await generate_unique_provider_slug(self._repo, data.name)
        elif await self._repo.slug_exists(slug):
            raise ValueError(f"Provider slug '{slug}' already exists")

        provider = DownloadProvider(
            name=data.name,
            slug=slug,
            icon_url=data.icon_url,
            website_url=data.website_url,
            sort_order=data.sort_order,
            is_active=data.is_active,
        )

        return await self._repo.create(provider)

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(
        self, provider_id: uuid.UUID, data: DownloadProviderUpdate
    ) -> DownloadProvider | None:
        """Update an existing download provider."""
        provider = await self._repo.get_by_id(provider_id)
        if provider is None:
            return None

        update_data = data.model_dump(exclude_unset=True)

        if "name" in update_data and update_data["name"] != provider.name:
            if await self._repo.name_exists(update_data["name"], exclude_id=provider_id):
                raise ValueError(f"Provider name '{update_data['name']}' already exists")

        if "slug" in update_data:
            new_slug = update_data["slug"]
            if new_slug is None or new_slug == "":
                new_name = update_data.get("name", provider.name)
                new_slug = await generate_unique_provider_slug(
                    self._repo, new_name, exclude_id=provider_id
                )
            elif await self._repo.slug_exists(new_slug, exclude_id=provider_id):
                raise ValueError(f"Provider slug '{new_slug}' already exists")
            update_data["slug"] = new_slug

        for field, value in update_data.items():
            setattr(provider, field, value)

        return await self._repo.update(provider)

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, provider_id: uuid.UUID) -> bool:
        """Soft-delete a download provider."""
        return await self._repo.soft_delete(provider_id)
