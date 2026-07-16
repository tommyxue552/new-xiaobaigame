"""Download jump endpoint 鈥?public single download resource lookup for redirect/QR page."""

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.repositories.download_resource_repository import DownloadResourceRepository
from backend.repositories.game_repository import GameRepository
from backend.schemas.download_resource import DownloadResourceResponse
from backend.schemas.errors import ErrorCode
from backend.schemas.response import APIResponse

# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

download_jump_router = APIRouter(prefix="/downloads", tags=["Download Jump"])


# ===================================================================
# Public endpoint
# ===================================================================

@download_jump_router.get("/{resource_id}", response_model=APIResponse)
async def get_download_by_id(
    resource_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a single download resource by ID (for download jump page).

    Returns the download resource with game and provider info.
    Only returns active resources from enabled providers.
    Returns 404 if the resource does not exist or is inactive.
    """
    download_repo = DownloadResourceRepository(db)
    resource = await download_repo.get_by_id(resource_id)

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Download resource not found"},
        )

    # Only return active resources
    if resource.status != "active":
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Download resource is not active"},
        )

    # Verify the provider is still active
    if resource.provider is None or not resource.provider.is_active:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Download provider is not available"},
        )

    # Look up game info
    game_repo = GameRepository(db)
    game = await game_repo.get_by_id(resource.game_id)

    if game is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Game not found"},
        )

    resource_data = DownloadResourceResponse.model_validate(resource)

    return APIResponse.ok(
        data={
            "id": str(resource_data.id),
            "game_id": str(resource_data.game_id),
            "game_title": game.title,
            "game_slug": game.slug,
            "download_url": resource_data.download_url,
            "extract_code": resource_data.extract_code,
            "provider": {
                "id": str(resource_data.provider.id),
                "name": resource_data.provider.name,
                "slug": resource_data.provider.slug,
                "icon_url": resource_data.provider.icon_url,
            },
        }
    )
