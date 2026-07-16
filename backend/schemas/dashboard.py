"""Dashboard stats schemas."""
from pydantic import BaseModel


class DashboardStats(BaseModel):
    """Admin dashboard statistics."""
    games_count: int
    categories_count: int
    tags_count: int
    downloads_count: int
    recent_games: list["DashboardRecentGame"]


class DashboardRecentGame(BaseModel):
    """Brief game info for dashboard recent list."""
    id: str
    title: str
    slug: str
    cover: str | None
    status: str
    published_at: str | None
    created_at: str

    model_config = {"from_attributes": True}
