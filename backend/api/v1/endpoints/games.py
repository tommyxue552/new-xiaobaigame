"""Game API endpoints 鈥?public listing + admin CRUD."""

import math
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.schemas.errors import ErrorCode
from backend.schemas.game import (
    GameCreate,
    GameDetailResponse,
    GameListItem,
    GameListParams,
    GameSortBy,
    GameStatus,
    GameUpdate,
    SortOrder,
)
from backend.schemas.response import APIResponse, PaginatedData
from backend.services.game_service import GameService

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

public_router = APIRouter(prefix="/games", tags=["Games"])
admin_router = APIRouter(prefix="/admin/games", tags=["Admin - Games"])


# ===================================================================
# Public endpoints
# ===================================================================

@public_router.get("", response_model=APIResponse[PaginatedData[GameListItem]])
async def list_games(
    page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    category: str | None = Query(default=None, description="Filter by category slug"),
    tag: str | None = Query(default=None, description="Filter by tag slug"),
    keyword: str | None = Query(default=None, max_length=200, description="Search keyword"),
    sort_by: GameSortBy = Query(default=GameSortBy.PUBLISHED_AT, description="Sort field"),
    sort_order: SortOrder = Query(default=SortOrder.DESC, description="Sort direction"),
    status: GameStatus | None = Query(default=None, description="Filter by status"),
    db: AsyncSession = Depends(get_db),
):
    """List games with pagination, category/tag filtering, keyword search, and sorting.

    Public endpoint. Only published games are returned by default; use `status`
    to override (admin use only, no authorization guard in this version).
    """
    service = GameService(db)
    items, total = await service.list_games(
        page=page,
        page_size=page_size,
        category_slug=category,
        tag_slug=tag,
        keyword=keyword,
        sort_by=sort_by.value,
        sort_order=sort_order.value,
        status=status.value if status else None,
    )

    total_pages = max(1, math.ceil(total / page_size))

    return APIResponse.ok(
        data=PaginatedData[GameListItem](
            items=[GameListItem.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
    )


@public_router.get("/{slug}", response_model=APIResponse[GameDetailResponse])
async def get_game(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """Get full game detail by slug.

    Includes category, tags, screenshots, and active download resources.
    Returns 404 if the game does not exist or has been soft-deleted.
    """
    service = GameService(db)
    game = await service.get_by_slug(slug)

    if game is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Game not found"},
        )

    return APIResponse.ok(data=GameDetailResponse.model_validate(game))


# ===================================================================
# Admin endpoints (no auth guard in v0.3.0)
# ===================================================================

@admin_router.post(
    "",
    response_model=APIResponse[GameDetailResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_game(
    data: GameCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new game entry.

    Slug is auto-generated from title if not provided.
    Tag associations are set via `tag_ids`.
    """
    service = GameService(db)
    game = await service.create(data)
    return APIResponse.ok(data=GameDetailResponse.model_validate(game), message="Game created")


@admin_router.put("/{game_id}", response_model=APIResponse[GameDetailResponse])
async def update_game(
    game_id: uuid.UUID,
    data: GameUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing game.

    Only provided fields are updated (partial update semantics via PUT).
    Tag associations are replaced entirely when `tag_ids` is provided.
    Returns 404 if the game does not exist.
    """
    service = GameService(db)
    game = await service.update(game_id, data)

    if game is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Game not found"},
        )

    return APIResponse.ok(data=GameDetailResponse.model_validate(game), message="Game updated")


@admin_router.delete("/{game_id}", response_model=APIResponse)
async def delete_game(
    game_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a game.

    Sets `deleted_at` timestamp; the game remains recoverable.
    Returns 404 if the game does not exist or is already deleted.
    """
    service = GameService(db)
    deleted = await service.soft_delete(game_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Game not found"},
        )

    return APIResponse.ok(message="Game deleted")
