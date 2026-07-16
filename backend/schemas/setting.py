"""Setting schemas."""
from pydantic import BaseModel, Field


class SettingResponse(BaseModel):
    """Setting item response."""
    key: str
    value: str | None
    description: str | None

    model_config = {"from_attributes": True}


class SettingUpdate(BaseModel):
    """Update one or more settings."""
    settings: dict[str, str | None] = Field(
        ...,
        description="Key-value pairs of settings to update",
    )
