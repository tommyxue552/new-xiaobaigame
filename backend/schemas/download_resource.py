"""Download resource schemas — request/response models."""

from datetime import datetime
import uuid

from pydantic import BaseModel, Field


class DownloadProviderBrief(BaseModel):
    """Brief provider info embedded in download resource responses."""

    id: uuid.UUID
    name: str
    slug: str
    icon_url: str | None = None

    model_config = {"from_attributes": True}


class DownloadResourceResponse(BaseModel):
    """Download resource response model with nested provider."""

    id: uuid.UUID
    game_id: uuid.UUID
    provider: DownloadProviderBrief
    download_url: str
    extract_code: str | None = None
    priority: int = 0
    status: str = "active"
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DownloadResourceCreate(BaseModel):
    """Create download resource request body."""

    game_id: uuid.UUID = Field(..., description="Game ID")
    provider_id: uuid.UUID = Field(..., description="Download provider ID")
    download_url: str = Field(..., min_length=1, description="Download URL")
    extract_code: str | None = Field(default=None, max_length=50, description="Extraction code")
    priority: int = Field(default=0, ge=0, description="Display priority (lower = first)")
    status: str = Field(default="active", description="Status: active / expired / disabled")
    notes: str | None = Field(default=None, description="Optional notes")


class DownloadResourceUpdate(BaseModel):
    """Update download resource request body. All fields optional."""

    provider_id: uuid.UUID | None = Field(default=None, description="Download provider ID")
    download_url: str | None = Field(default=None, min_length=1, description="Download URL")
    extract_code: str | None = Field(default=None, max_length=50, description="Extraction code")
    priority: int | None = Field(default=None, ge=0, description="Display priority (lower = first)")
    status: str | None = Field(default=None, description="Status: active / expired / disabled")
    notes: str | None = Field(default=None, description="Optional notes")
