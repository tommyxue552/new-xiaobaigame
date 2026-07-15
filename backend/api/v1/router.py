"""API v1 router that aggregates all endpoint routers."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from backend.schemas.errors import ERROR_MESSAGES

api_router = APIRouter()


# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------

class AppException(HTTPException):
    """Base application exception with unified error code."""

    def __init__(self, error_code: int, status_code: int = 400, detail: str | None = None):
        self.error_code = error_code
        super().__init__(status_code=status_code, detail=detail or ERROR_MESSAGES.get(error_code, "Unknown error"))


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@api_router.get("/health", tags=["System"])
async def health_check():
    """Kubernetes-style liveness probe."""
    return JSONResponse(content={"status": "ok", "version": "0.1.0"})
