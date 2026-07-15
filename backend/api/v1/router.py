"""API v1 router that aggregates all endpoint routers."""

from fastapi import APIRouter

from backend.api.v1.endpoints.games import admin_router as games_admin_router
from backend.api.v1.endpoints.games import public_router as games_router
from backend.schemas.errors import ERROR_MESSAGES

api_router = APIRouter()

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@api_router.get("/health", tags=["System"])
async def health_check():
    """Kubernetes-style liveness probe."""
    return {"status": "ok", "version": "0.3.0"}


# ---------------------------------------------------------------------------
# Include endpoint routers
# ---------------------------------------------------------------------------

api_router.include_router(games_router)
api_router.include_router(games_admin_router)
