"""Tag API endpoints — public listing + admin CRUD."""

import math
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.schemas.errors import ErrorCode
from backend.schemas.response import APIResponse, PaginatedData
from backend.schemas.tag import TagCreate, TagResponse, TagUpdate
from backend.services.tag_service import TagService

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

public_router = APIRouter(prefix="/tags", tags=["Tags"])
admin_router = APIRouter(prefix="/admin/tags", tags=["Admin - Tags"])


# ===================================================================
# Public endpoints
# ===================================================================

@public_router.get("", response_model=APIResponse[PaginatedData[TagResponse]])
async def list_tags(
    page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    keyword: str | None = Query(default=None, max_length=100, description="Search keyword (name/slug)"),
    db: AsyncSession = Depends(get_db),
):
    """List tags with pagination and optional keyword search.

    Each tag includes a `game_count` field.
    """
    service = TagService(db)
    items, total = await service.list_tags(
        page=page,
        page_size=page_size,
        keyword=keyword,
    )

    # Get game counts
    game_counts = await service._repo.get_game_counts()

    total_pages = max(1, math.ceil(total / page_size))

    tag_responses = []
    for tag in items:
        tag_responses.append(
            TagResponse(
                id=tag.id,
                name=tag.name,
                slug=tag.slug,
                game_count=game_counts.get(tag.id, 0),
                created_at=tag.created_at,
                updated_at=tag.updated_at,
            )
        )

    return APIResponse.ok(
        data=PaginatedData[TagResponse](
            items=tag_responses,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
    )


@public_router.get("/{slug}", response_model=APIResponse[TagResponse])
async def get_tag(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single tag by slug with game count.

    Returns 404 if the tag does not exist or has been soft-deleted.
    """
    service = TagService(db)
    tag = await service.get_by_slug(slug)

    if tag is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Tag not found"},
        )

    game_count = await service._repo.get_game_count(tag.id)

    return APIResponse.ok(
        data=TagResponse(
            id=tag.id,
            name=tag.name,
            slug=tag.slug,
            game_count=game_count,
            created_at=tag.created_at,
            updated_at=tag.updated_at,
        )
    )


# ===================================================================
# Admin endpoints (no auth guard in v0.4.0)
# ===================================================================

@admin_router.post(
    "",
    response_model=APIResponse[TagResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_tag(
    data: TagCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new tag.

    Slug is auto-generated from name if not provided.
    Tag name must be unique.
    """
    service = TagService(db)
    try:
        tag = await service.create(data)
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail={"code": ErrorCode.RESOURCE_CONFLICT, "message": str(e)},
        )

    return APIResponse.ok(
        data=TagResponse(
            id=tag.id,
            name=tag.name,
            slug=tag.slug,
            game_count=0,
            created_at=tag.created_at,
            updated_at=tag.updated_at,
        ),
        message="Tag created",
    )


@admin_router.put("/{tag_id}", response_model=APIResponse[TagResponse])
async def update_tag(
    tag_id: uuid.UUID,
    data: TagUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing tag.

    Only provided fields are updated (partial update semantics).
    Returns 404 if the tag does not exist.
    """
    service = TagService(db)
    try:
        tag = await service.update(tag_id, data)
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail={"code": ErrorCode.RESOURCE_CONFLICT, "message": str(e)},
        )

    if tag is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Tag not found"},
        )

    game_count = await service._repo.get_game_count(tag.id)

    return APIResponse.ok(
        data=TagResponse(
            id=tag.id,
            name=tag.name,
            slug=tag.slug,
            game_count=game_count,
            created_at=tag.created_at,
            updated_at=tag.updated_at,
        ),
        message="Tag updated",
    )


@admin_router.delete("/{tag_id}", response_model=APIResponse)
async def delete_tag(
    tag_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a tag.

    Sets `deleted_at` timestamp; the tag remains recoverable.
    Associated game_tags will be cascade-deleted (via DB constraint).
    Returns 404 if the tag does not exist or is already deleted.
    """
    service = TagService(db)
    deleted = await service.soft_delete(tag_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Tag not found"},
        )

    return APIResponse.ok(message="Tag deleted")
