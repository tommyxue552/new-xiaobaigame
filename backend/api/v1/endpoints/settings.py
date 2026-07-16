"""System settings endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.models.setting import Setting
from backend.schemas.errors import ErrorCode
from backend.schemas.response import APIResponse
from backend.schemas.setting import SettingResponse, SettingUpdate

router = APIRouter(prefix="/admin/settings", tags=["Admin - Settings"])


@router.get("", response_model=APIResponse[dict[str, str | None]])
async def get_settings(
    db: AsyncSession = Depends(get_db),
):
    """Get all system settings as key-value pairs."""
    result = await db.execute(select(Setting))
    items = result.scalars().all()
    return APIResponse.ok(data={s.key: s.value for s in items})


@router.put("", response_model=APIResponse[dict[str, str | None]])
async def update_settings(
    data: SettingUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update system settings. Creates new keys if they don't exist."""
    for key, value in data.settings.items():
        result = await db.execute(select(Setting).where(Setting.key == key))
        setting = result.scalar_one_or_none()
        if setting:
            setting.value = value
        else:
            db.add(Setting(key=key, value=value))
    await db.flush()

    # Return all settings
    result = await db.execute(select(Setting))
    items = result.scalars().all()
    return APIResponse.ok(
        data={s.key: s.value for s in items},
        message="Settings updated",
    )
