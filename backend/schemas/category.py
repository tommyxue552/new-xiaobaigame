"""Category schemas for request/response validation."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from backend.schemas.response import PaginatedData


# ---------------------------------------------------------------------------
# Shared / nested
# ---------------------------------------------------------------------------

class CategoryBase(BaseModel):
    """Shared fields for category schemas."""
    name: str
    slug: str
    description: str | None = None
    sort_order: int = 0


# ---------------------------------------------------------------------------
# Tree node (self-referencing for infinite-level categories)
# ---------------------------------------------------------------------------

class CategoryTreeNode(BaseModel):
    """A single node in the category tree, supports recursive children."""
    id: uuid.UUID
    name: str
    slug: str
    description: str | None = None
    parent_id: uuid.UUID | None = None
    sort_order: int
    game_count: int = 0
    children: list["CategoryTreeNode"] = []

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Detail response (flat, no children, for GET /categories/{slug})
# ---------------------------------------------------------------------------

class CategoryDetailResponse(BaseModel):
    """Full category detail, no recursion."""
    id: uuid.UUID
    name: str
    slug: str
    description: str | None = None
    parent_id: uuid.UUID | None = None
    sort_order: int
    game_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Create / Update
# ---------------------------------------------------------------------------

class CategoryCreate(BaseModel):
    """Schema for POST /api/v1/admin/categories."""
    name: str = Field(..., min_length=1, max_length=100, description="Category name (unique)")
    slug: str | None = Field(
        default=None,
        max_length=150,
        description="URL slug; auto-generated from name if omitted",
    )
    description: str | None = Field(default=None, description="Category description")
    parent_id: uuid.UUID | None = Field(default=None, description="Parent category ID (null = root)")
    sort_order: int = Field(default=0, ge=0, description="Display sort order")


class CategoryUpdate(BaseModel):
    """Schema for PUT /api/v1/admin/categories/{id}."""
    name: str | None = Field(default=None, min_length=1, max_length=100, description="Category name")
    slug: str | None = Field(default=None, max_length=150, description="URL slug")
    description: str | None = Field(default=None, description="Category description")
    parent_id: uuid.UUID | None = Field(default=None, description="Parent category ID")
    sort_order: int | None = Field(default=None, ge=0, description="Display sort order")
