"""Application configuration via Pydantic settings."""

from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Global application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Project
    PROJECT_NAME: str = "web-xiaobaigame"
    VERSION: str = "0.3.0"
    DEBUG: bool = False

    # API
    API_V1_PREFIX: str = "/api/v1"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/xiaobaigame"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 40

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # JWT
    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # MinIO / S3
    S3_ENDPOINT: str = "minio:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET: str = "xiaobaigame"
    S3_SECURE: bool = False

    # Upload
    MAX_UPLOAD_SIZE_MB: int = 100
    ALLOWED_UPLOAD_EXTENSIONS: List[str] = [
        ".zip", ".rar", ".7z", ".tar.gz", ".tar.xz",
        ".jpg", ".jpeg", ".png", ".gif", ".webp",
    ]

    # Rate Limit
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60

    # Celery (reserved for future use)
    CELERY_BROKER_URL: str = "redis://redis:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/2"


settings = Settings()
