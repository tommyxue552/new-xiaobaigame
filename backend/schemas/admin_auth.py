"""Admin auth schemas."""
from pydantic import BaseModel, Field


class AdminLoginRequest(BaseModel):
    """Admin login request."""
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=1, max_length=128)


class AdminLoginResponse(BaseModel):
    """Admin login response."""
    access_token: str
    token_type: str = "bearer"
    admin: "AdminInfo"


class AdminInfo(BaseModel):
    """Admin public info."""
    id: str
    username: str
    email: str
    display_name: str | None
    role: str

    model_config = {"from_attributes": True}
