"""Download provider API endpoints — admin CRUD only."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.schemas.download_provider import (
    DownloadProviderCreate,
    DownloadProviderResponse,
    DownloadProviderUpdate,
)
from backend.schemas.errors import ErrorCode
from backend.schemas.response import APIResponse
from backend.services.download_provider_service import DownloadProviderService

# ---------------------------------------------------------------------------
# Router (admin only — no public provider endpoints)
# ---------------------------------------------------------------------------

admin_router = APIRouter(prefix="/admin/download-providers", tags=["Admin - Download Providers"])


# ===================================================================
# Admin endpoints (no auth guard in v0.5.0)
# ===================================================================

@admin_router.get("", response_model=APIResponse[list[DownloadProviderResponse]])
async def list_providers(
    db: AsyncSession = Depends(get_db),
):
    """List all download providers, ordered by sort_order and name."""
    service = DownloadProviderService(db)
    providers = await service.list_all()

    return APIResponse.ok(
        data=[
            DownloadProviderResponse.model_validate(p)
            for p in providers
        ]
    )


@admin_router.post(
    "",
    response_model=APIResponse[DownloadProviderResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_provider(
    data: DownloadProviderCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new download provider.

    Slug is auto-generated from name if not provided.
    Provider name must be unique.
    """
    service = DownloadProviderService(db)
    try:
        provider = await service.create(data)
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail={"code": ErrorCode.RESOURCE_CONFLICT, "message": str(e)},
        )

    return APIResponse.ok(
        data=DownloadProviderResponse.model_validate(provider),
        message="Download provider created",
    )


@admin_router.put("/{provider_id}", response_model=APIResponse[DownloadProviderResponse])
async def update_provider(
    provider_id: uuid.UUID,
    data: DownloadProviderUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing download provider.

    Only provided fields are updated (partial update semantics).
    Returns 404 if the provider does not exist.
    """
    service = DownloadProviderService(db)
    try:
        provider = await service.update(provider_id, data)
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail={"code": ErrorCode.RESOURCE_CONFLICT, "message": str(e)},
        )

    if provider is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Download provider not found"},
        )

    return APIResponse.ok(
        data=DownloadProviderResponse.model_validate(provider),
        message="Download provider updated",
    )


@admin_router.delete("/{provider_id}", response_model=APIResponse)
async def delete_provider(
    provider_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a download provider.

    Sets `deleted_at` timestamp; the provider remains recoverable.
    Note: providers with associated download resources cannot be deleted
    due to RESTRICT foreign key constraint.
    Returns 404 if the provider does not exist or is already deleted.
    """
    service = DownloadProviderService(db)
    deleted = await service.soft_delete(provider_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Download provider not found"},
        )

    return APIResponse.ok(message="Download provider deleted")
