"""Tag schemas for request/response validation."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------

class TagResponse(BaseModel):
    """Tag in list/detail responses."""
    id: uuid.UUID
    name: str
    slug: str
    game_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Create / Update
# ---------------------------------------------------------------------------

class TagCreate(BaseModel):
    """Schema for POST /api/v1/admin/tags."""
    name: str = Field(..., min_length=1, max_length=100, description="Tag name (unique)")
    slug: str | None = Field(
        default=None,
        max_length=150,
        description="URL slug; auto-generated from name if omitted",
    )


class TagUpdate(BaseModel):
    """Schema for PUT /api/v1/admin/tags/{id}."""
    name: str | None = Field(default=None, min_length=1, max_length=100, description="Tag name")
    slug: str | None = Field(default=None, max_length=150, description="URL slug")
