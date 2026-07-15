"""S3/MinIO storage abstraction layer."""

from io import BytesIO

from minio import Minio

from backend.core.config import settings

_client: Minio | None = None


def get_s3_client() -> Minio:
    """Return a thread-safe MinIO client singleton."""
    global _client
    if _client is None:
        _client = Minio(
            endpoint=settings.S3_ENDPOINT,
            access_key=settings.S3_ACCESS_KEY,
            secret_key=settings.S3_SECRET_KEY,
            secure=settings.S3_SECURE,
        )
        # Ensure bucket exists
        if not _client.bucket_exists(settings.S3_BUCKET):
            _client.make_bucket(settings.S3_BUCKET)
    return _client


async def upload_file(
    object_name: str,
    data: bytes,
    content_type: str = "application/octet-stream",
) -> str:
    """Upload a file to S3 and return its object path."""
    client = get_s3_client()
    client.put_object(
        bucket_name=settings.S3_BUCKET,
        object_name=object_name,
        data=BytesIO(data),
        length=len(data),
        content_type=content_type,
    )
    return object_name


async def get_file_url(object_name: str) -> str:
    """Generate a presigned download URL (valid 1 hour)."""
    client = get_s3_client()
    return client.presigned_get_object(
        bucket_name=settings.S3_BUCKET,
        object_name=object_name,
        expires=3600,
    )


async def delete_file(object_name: str) -> None:
    """Delete a file from S3."""
    client = get_s3_client()
    client.remove_object(
        bucket_name=settings.S3_BUCKET,
        object_name=object_name,
    )
