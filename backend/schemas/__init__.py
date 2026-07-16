"""Schemas package."""
from backend.schemas.admin_auth import AdminInfo, AdminLoginRequest, AdminLoginResponse
from backend.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryDetailResponse,
    CategoryTreeNode,
)
from backend.schemas.dashboard import DashboardRecentGame, DashboardStats
from backend.schemas.download_provider import (
    DownloadProviderCreate,
    DownloadProviderResponse,
    DownloadProviderUpdate,
)
from backend.schemas.download_resource import (
    DownloadProviderBrief,
    DownloadResourceCreate,
    DownloadResourceResponse,
    DownloadResourceUpdate,
)
from backend.schemas.game import (
    GameCreate,
    GameUpdate,
    GameDetailResponse,
    GameListItem,
    GameListParams,
    GameSortBy,
    GameStatus,
    SortOrder,
)
from backend.schemas.response import APIResponse, PaginatedData
from backend.schemas.setting import SettingResponse, SettingUpdate
from backend.schemas.tag import (
    TagCreate,
    TagUpdate,
    TagResponse,
)
