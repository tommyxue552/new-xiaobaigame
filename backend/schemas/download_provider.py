"""Download provider schemas — request/response models."""

from datetime import datetime
import uuid

from pydantic import BaseModel, Field


class DownloadProviderResponse(BaseModel):
    """Download provider response model."""

    id: uuid.UUID
    name: str
    slug: str
    icon_url: str | None = None
    website_url: str | None = None
    sort_order: int = 0
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DownloadProviderCreate(BaseModel):
    """Create download provider request body."""

    name: str = Field(..., min_length=1, max_length=100, description="Provider name")
    slug: str | None = Field(default=None, max_length=100, description="URL-friendly identifier (auto-generated if empty)")
    icon_url: str | None = Field(default=None, max_length=500, description="Icon URL")
    website_url: str | None = Field(default=None, max_length=500, description="Official website URL")
    sort_order: int = Field(default=0, ge=0, description="Display order")
    is_active: bool = Field(default=True, description="Whether the provider is enabled")


class DownloadProviderUpdate(BaseModel):
    """Update download provider request body. All fields optional."""

    name: str | None = Field(default=None, min_length=1, max_length=100, description="Provider name")
    slug: str | None = Field(default=None, max_length=100, description="URL-friendly identifier")
    icon_url: str | None = Field(default=None, max_length=500, description="Icon URL")
    website_url: str | None = Field(default=None, max_length=500, description="Official website URL")
    sort_order: int | None = Field(default=None, ge=0, description="Display order")
    is_active: bool | None = Field(default=None, description="Whether the provider is enabled")
