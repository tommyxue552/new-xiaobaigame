"""Download resource API endpoints — public game downloads + admin CRUD."""

import math
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.repositories.game_repository import GameRepository
from backend.schemas.download_resource import (
    DownloadResourceCreate,
    DownloadResourceResponse,
    DownloadResourceUpdate,
)
from backend.schemas.errors import ErrorCode
from backend.schemas.response import APIResponse, PaginatedData
from backend.services.download_resource_service import DownloadResourceService

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

public_router = APIRouter(prefix="/games", tags=["Downloads"])
admin_router = APIRouter(prefix="/admin/downloads", tags=["Admin - Downloads"])


# ===================================================================
# Public endpoint
# ===================================================================

@public_router.get("/{slug}/downloads", response_model=APIResponse)
async def get_game_downloads(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """Get all available download resources for a specific game.

    Only returns active download resources from enabled providers.
    Returns 404 if the game does not exist.
    """
    # Look up game by slug
    game_repo = GameRepository(db)
    game = await game_repo.get_by_slug(slug)

    if game is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Game not found"},
        )

    service = DownloadResourceService(db)
    resources = await service.list_by_game(game.id, only_active=True)

    resource_data = [
        DownloadResourceResponse.model_validate(r)
        for r in resources
    ]

    return APIResponse.ok(
        data={
            "game_id": game.id,
            "game_title": game.title,
            "game_slug": game.slug,
            "downloads": resource_data,
        }
    )


# ===================================================================
# Admin endpoints (no auth guard in v0.5.0)
# ===================================================================

@admin_router.get("", response_model=APIResponse[PaginatedData[DownloadResourceResponse]])
async def list_downloads(
    page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    game_id: uuid.UUID | None = Query(default=None, description="Filter by game ID"),
    db: AsyncSession = Depends(get_db),
):
    """List download resources with pagination and optional game filter."""
    service = DownloadResourceService(db)
    items, total = await service.list_all(
        page=page,
        page_size=page_size,
        game_id=game_id,
    )

    total_pages = max(1, math.ceil(total / page_size))

    return APIResponse.ok(
        data=PaginatedData[DownloadResourceResponse](
            items=[DownloadResourceResponse.model_validate(r) for r in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
    )


@admin_router.post(
    "",
    response_model=APIResponse[DownloadResourceResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_download(
    data: DownloadResourceCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new download resource for a game.

    game_id must reference an existing, non-deleted game.
    provider_id must reference an existing, non-deleted provider.
    """
    service = DownloadResourceService(db)
    try:
        resource = await service.create(data)
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail={"code": ErrorCode.RESOURCE_CONFLICT, "message": str(e)},
        )

    return APIResponse.ok(
        data=DownloadResourceResponse.model_validate(resource),
        message="Download resource created",
    )


@admin_router.put("/{resource_id}", response_model=APIResponse[DownloadResourceResponse])
async def update_download(
    resource_id: uuid.UUID,
    data: DownloadResourceUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing download resource.

    Only provided fields are updated (partial update semantics).
    Returns 404 if the resource does not exist.
    """
    service = DownloadResourceService(db)
    try:
        resource = await service.update(resource_id, data)
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail={"code": ErrorCode.RESOURCE_CONFLICT, "message": str(e)},
        )

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Download resource not found"},
        )

    return APIResponse.ok(
        data=DownloadResourceResponse.model_validate(resource),
        message="Download resource updated",
    )


@admin_router.delete("/{resource_id}", response_model=APIResponse)
async def delete_download(
    resource_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a download resource.

    Sets `deleted_at` timestamp; the resource remains recoverable.
    Returns 404 if the resource does not exist or is already deleted.
    """
    service = DownloadResourceService(db)
    deleted = await service.soft_delete(resource_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Download resource not found"},
        )

    return APIResponse.ok(message="Download resource deleted")
