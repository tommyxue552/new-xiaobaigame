"""Game schemas for request/response validation."""

import uuid
from datetime import datetime
from enum import Enum
from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints, field_validator, model_validator

from backend.schemas.response import PaginatedData


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class GameStatus(str, Enum):
    """Game publication status."""
    DRAFT = "draft"
    PUBLISHED = "published"
    HIDDEN = "hidden"


class GameSortBy(str, Enum):
    """Sort fields for game listing."""
    CREATED_AT = "created_at"
    PUBLISHED_AT = "published_at"
    VIEW_COUNT = "view_count"
    DOWNLOAD_COUNT = "download_count"
    TITLE = "title"


class SortOrder(str, Enum):
    """Sort direction."""
    ASC = "asc"
    DESC = "desc"


# ---------------------------------------------------------------------------
# Nested / related schemas
# ---------------------------------------------------------------------------

class TagResponse(BaseModel):
    """Tag in a game response."""
    id: uuid.UUID
    name: str
    slug: str

    model_config = {"from_attributes": True}


class ScreenshotResponse(BaseModel):
    """Screenshot in a game response."""
    id: uuid.UUID
    image_url: str
    title: str | None = None
    sort_order: int

    model_config = {"from_attributes": True}


class DownloadProviderResponse(BaseModel):
    """Download provider info in a resource response."""
    id: uuid.UUID
    name: str
    slug: str
    icon_url: str | None = None

    model_config = {"from_attributes": True}


class DownloadResourceResponse(BaseModel):
    """Download resource in a game detail response."""
    id: uuid.UUID
    provider: DownloadProviderResponse | None = None
    download_url: str
    extract_code: str | None = None
    priority: int
    status: str
    notes: str | None = None

    model_config = {"from_attributes": True}


class CategoryResponse(BaseModel):
    """Category in a game response."""
    id: uuid.UUID
    name: str
    slug: str

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Game list / detail response
# ---------------------------------------------------------------------------

class GameListItem(BaseModel):
    """Game summary used in list responses (no heavy relations)."""
    id: uuid.UUID
    title: str
    title_en: str | None = None
    slug: str
    summary: str | None = None
    cover: str | None = None
    category: CategoryResponse | None = None
    published_at: datetime | None = None
    view_count: int
    download_count: int
    status: str
    tags: list[TagResponse] = []

    model_config = {"from_attributes": True}


class GameDetailResponse(BaseModel):
    """Full game detail including screenshots and download resources."""
    id: uuid.UUID
    title: str
    title_en: str | None = None
    slug: str
    summary: str | None = None
    content: str | None = None
    cover: str | None = None
    category: CategoryResponse | None = None
    published_at: datetime | None = None
    view_count: int
    download_count: int
    status: str
    seo_title: str | None = None
    seo_keywords: str | None = None
    seo_description: str | None = None
    tags: list[TagResponse] = []
    screenshots: list[ScreenshotResponse] = []
    download_resources: list[DownloadResourceResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Query parameters
# ---------------------------------------------------------------------------

class GameListParams(BaseModel):
    """Query parameters for GET /api/v1/games."""
    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")
    category: str | None = Field(default=None, description="Filter by category slug")
    tag: str | None = Field(default=None, description="Filter by tag slug")
    keyword: str | None = Field(default=None, max_length=200, description="Search keyword (title/summary)")
    sort_by: GameSortBy = Field(default=GameSortBy.PUBLISHED_AT, description="Sort field")
    sort_order: SortOrder = Field(default=SortOrder.DESC, description="Sort direction")
    status: GameStatus | None = Field(default=None, description="Filter by status")


# ---------------------------------------------------------------------------
# Create / Update
# ---------------------------------------------------------------------------

SlugStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]


class GameCreate(BaseModel):
    """Schema for POST /api/admin/games 鈥?create a new game."""
    title: str = Field(..., min_length=1, max_length=255, description="Game title")
    title_en: str | None = Field(default=None, max_length=255, description="English title")
    slug: str | None = Field(
        default=None,
        max_length=255,
        description="URL slug; auto-generated from title if omitted",
    )
    summary: str | None = Field(default=None, description="Brief summary")
    content: str | None = Field(default=None, description="Detailed content (Markdown/HTML)")
    cover: str | None = Field(default=None, max_length=500, description="Cover image URL")
    category_id: uuid.UUID | None = Field(default=None, description="Category ID")
    published_at: datetime | None = Field(default=None, description="Publication date")
    status: GameStatus = Field(default=GameStatus.DRAFT, description="Publication status")
    seo_title: str | None = Field(default=None, max_length=255, description="SEO title")
    seo_keywords: str | None = Field(default=None, max_length=500, description="SEO keywords")
    seo_description: str | None = Field(default=None, description="SEO description")
    tag_ids: list[uuid.UUID] = Field(default=[], description="Tag IDs to associate")


class GameUpdate(BaseModel):
    """Schema for PUT /api/admin/games/{id} 鈥?update an existing game."""
    title: str | None = Field(default=None, min_length=1, max_length=255, description="Game title")
    title_en: str | None = Field(default=None, max_length=255, description="English title")
    slug: str | None = Field(default=None, max_length=255, description="URL slug")
    summary: str | None = Field(default=None, description="Brief summary")
    content: str | None = Field(default=None, description="Detailed content (Markdown/HTML)")
    cover: str | None = Field(default=None, max_length=500, description="Cover image URL")
    category_id: uuid.UUID | None = Field(default=None, description="Category ID")
    published_at: datetime | None = Field(default=None, description="Publication date")
    status: GameStatus | None = Field(default=None, description="Publication status")
    seo_title: str | None = Field(default=None, max_length=255, description="SEO title")
    seo_keywords: str | None = Field(default=None, max_length=500, description="SEO keywords")
    seo_description: str | None = Field(default=None, description="SEO description")
    tag_ids: list[uuid.UUID] | None = Field(default=None, description="Tag IDs to associate (replaces existing)")
