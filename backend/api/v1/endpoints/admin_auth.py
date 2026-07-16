"""Admin authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import settings
from backend.core.database import get_db
from backend.core.security import create_access_token, verify_password
from backend.models.admin import Admin
from backend.schemas.admin_auth import AdminInfo, AdminLoginRequest, AdminLoginResponse
from backend.schemas.errors import ErrorCode
from backend.schemas.response import APIResponse

router = APIRouter(prefix="/admin/auth", tags=["Admin - Auth"])


@router.post("/login", response_model=APIResponse[AdminLoginResponse])
async def admin_login(
    data: AdminLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate admin and return JWT access token."""
    result = await db.execute(
        select(Admin).where(
            Admin.username == data.username,
            Admin.deleted_at.is_(None),
            Admin.is_active.is_(True),
        )
    )
    admin = result.scalar_one_or_none()

    if admin is None or not verify_password(data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": ErrorCode.AUTH_INVALID_CREDENTIALS, "message": "Invalid credentials"},
        )

    access_token = create_access_token(subject=str(admin.id))

    return APIResponse.ok(
        data=AdminLoginResponse(
            access_token=access_token,
            admin=AdminInfo.model_validate(admin),
        )
    )
