"""Category API endpoints — public tree + admin CRUD."""

import math
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.schemas.category import (
    CategoryCreate,
    CategoryDetailResponse,
    CategoryTreeNode,
    CategoryUpdate,
)
from backend.schemas.errors import ErrorCode
from backend.schemas.response import APIResponse
from backend.services.category_service import CategoryService

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

public_router = APIRouter(prefix="/categories", tags=["Categories"])
admin_router = APIRouter(prefix="/admin/categories", tags=["Admin - Categories"])


# ===================================================================
# Public endpoints
# ===================================================================

@public_router.get("", response_model=APIResponse[list[CategoryTreeNode]])
async def list_categories(
    db: AsyncSession = Depends(get_db),
):
    """Get the full category tree with game counts.

    Returns a hierarchical tree structure with infinite nesting.
    Each node includes a `children` array and a `game_count` field.
    """
    service = CategoryService(db)
    tree = await service.get_category_tree()
    return APIResponse.ok(data=tree)


@public_router.get("/{slug}", response_model=APIResponse[CategoryDetailResponse])
async def get_category(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single category by slug with game count.

    Returns 404 if the category does not exist or has been soft-deleted.
    """
    service = CategoryService(db)
    detail = await service.get_category_detail(slug)

    if detail is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Category not found"},
        )

    return APIResponse.ok(data=CategoryDetailResponse(**detail))


# ===================================================================
# Admin endpoints (no auth guard in v0.4.0)
# ===================================================================

@admin_router.post(
    "",
    response_model=APIResponse[CategoryDetailResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_category(
    data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new category.

    Slug is auto-generated from name if not provided.
    Supports optional parent_id for hierarchical categories.
    Category name must be unique.
    """
    service = CategoryService(db)
    try:
        category = await service.create(data)
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail={"code": ErrorCode.RESOURCE_CONFLICT, "message": str(e)},
        )

    game_counts = await service._repo.get_game_counts()
    detail = {
        "id": category.id,
        "name": category.name,
        "slug": category.slug,
        "description": category.description,
        "parent_id": category.parent_id,
        "sort_order": category.sort_order,
        "game_count": game_counts.get(category.id, 0),
        "created_at": category.created_at,
        "updated_at": category.updated_at,
    }
    return APIResponse.ok(data=CategoryDetailResponse(**detail), message="Category created")


@admin_router.put("/{category_id}", response_model=APIResponse[CategoryDetailResponse])
async def update_category(
    category_id: uuid.UUID,
    data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing category.

    Only provided fields are updated (partial update semantics).
    Returns 404 if the category does not exist.
    """
    service = CategoryService(db)
    try:
        category = await service.update(category_id, data)
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail={"code": ErrorCode.RESOURCE_CONFLICT, "message": str(e)},
        )

    if category is None:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Category not found"},
        )

    game_counts = await service._repo.get_game_counts()
    detail = {
        "id": category.id,
        "name": category.name,
        "slug": category.slug,
        "description": category.description,
        "parent_id": category.parent_id,
        "sort_order": category.sort_order,
        "game_count": game_counts.get(category.id, 0),
        "created_at": category.created_at,
        "updated_at": category.updated_at,
    }
    return APIResponse.ok(data=CategoryDetailResponse(**detail), message="Category updated")


@admin_router.delete("/{category_id}", response_model=APIResponse)
async def delete_category(
    category_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a category.

    Sets `deleted_at` timestamp; the category remains recoverable.
    Child categories will have their parent_id set to NULL (via DB constraint).
    Returns 404 if the category does not exist or is already deleted.
    """
    service = CategoryService(db)
    deleted = await service.soft_delete(category_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail={"code": ErrorCode.RESOURCE_NOT_FOUND, "message": "Category not found"},
        )

    return APIResponse.ok(message="Category deleted")
