"""API v1 router that aggregates all endpoint routers."""

from fastapi import APIRouter

from backend.api.v1.endpoints.categories import admin_router as categories_admin_router
from backend.api.v1.endpoints.categories import public_router as categories_router
from backend.api.v1.endpoints.download_providers import admin_router as download_providers_admin_router
from backend.api.v1.endpoints.download_resources import admin_router as downloads_admin_router
from backend.api.v1.endpoints.download_jump import download_jump_router
from backend.api.v1.endpoints.download_resources import public_router as downloads_router
from backend.api.v1.endpoints.games import admin_router as games_admin_router
from backend.api.v1.endpoints.games import public_router as games_router
from backend.api.v1.endpoints.tags import admin_router as tags_admin_router
from backend.api.v1.endpoints.tags import public_router as tags_router
from backend.api.v1.endpoints.admin_auth import router as admin_auth_router
from backend.api.v1.endpoints.dashboard import router as dashboard_router
from backend.api.v1.endpoints.settings import router as settings_router
from backend.api.v1.endpoints.seo import router as seo_router

api_router = APIRouter()

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@api_router.get("/health", tags=["System"])
async def health_check():
    """Kubernetes-style liveness probe."""
    return {"status": "ok", "version": "1.0.0"}


# ---------------------------------------------------------------------------
# Include endpoint routers
# ---------------------------------------------------------------------------

api_router.include_router(games_router)
api_router.include_router(games_admin_router)
api_router.include_router(categories_router)
api_router.include_router(categories_admin_router)
api_router.include_router(tags_router)
api_router.include_router(tags_admin_router)
api_router.include_router(download_jump_router)
api_router.include_router(downloads_router)
api_router.include_router(downloads_admin_router)
api_router.include_router(download_providers_admin_router)
api_router.include_router(admin_auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(settings_router)
api_router.include_router(seo_router)
