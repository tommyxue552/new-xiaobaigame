"""Download resource service — business logic for download resource operations."""

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.download_resource import DownloadResource
from backend.repositories.download_resource_repository import DownloadResourceRepository
from backend.schemas.download_resource import DownloadResourceCreate, DownloadResourceUpdate


class DownloadResourceService:
    """Business-logic layer for download resource operations."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._repo = DownloadResourceRepository(session)

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, resource_id: uuid.UUID) -> DownloadResource | None:
        """Return a download resource by ID."""
        return await self._repo.get_by_id(resource_id)

    async def list_by_game(
        self, game_id: uuid.UUID, *, only_active: bool = False
    ) -> list[DownloadResource]:
        """List download resources for a specific game."""
        return await self._repo.list_by_game(game_id, only_active=only_active)

    async def list_all(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
        game_id: uuid.UUID | None = None,
    ) -> tuple[list[DownloadResource], int]:
        """List download resources with pagination and optional filtering."""
        return await self._repo.list_all(
            page=page, page_size=page_size, game_id=game_id,
        )

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create(self, data: DownloadResourceCreate) -> DownloadResource:
        """Create a new download resource."""
        if not await self._repo.game_exists(data.game_id):
            raise ValueError(f"Game '{data.game_id}' not found")
        if not await self._repo.provider_exists(data.provider_id):
            raise ValueError(f"Download provider '{data.provider_id}' not found")
        if data.status not in ("active", "expired", "disabled"):
            raise ValueError(f"Invalid status '{data.status}'")

        resource = DownloadResource(
            game_id=data.game_id,
            provider_id=data.provider_id,
            download_url=data.download_url,
            extract_code=data.extract_code,
            priority=data.priority,
            status=data.status,
            notes=data.notes,
        )

        return await self._repo.create(resource)

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(
        self, resource_id: uuid.UUID, data: DownloadResourceUpdate
    ) -> DownloadResource | None:
        """Update an existing download resource."""
        resource = await self._repo.get_by_id(resource_id)
        if resource is None:
            return None

        update_data = data.model_dump(exclude_unset=True)

        if "provider_id" in update_data:
            if not await self._repo.provider_exists(update_data["provider_id"]):
                raise ValueError(f"Download provider '{update_data['provider_id']}' not found")

        if "status" in update_data:
            if update_data["status"] not in ("active", "expired", "disabled"):
                raise ValueError(f"Invalid status '{update_data['status']}'")

        for field, value in update_data.items():
            setattr(resource, field, value)

        return await self._repo.update(resource)

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, resource_id: uuid.UUID) -> bool:
        """Soft-delete a download resource."""
        return await self._repo.soft_delete(resource_id)
