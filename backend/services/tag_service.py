"""Tag service — business logic for tag operations."""

import uuid
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.tag import Tag
from backend.repositories.tag_repository import TagRepository
from backend.schemas.tag import TagCreate, TagUpdate
from backend.utils.slug import pinyin_slug


# ---------------------------------------------------------------------------
# Slug generation
# ---------------------------------------------------------------------------

async def generate_unique_slug(
    repo: TagRepository,
    base_name: str,
    exclude_id: uuid.UUID | None = None,
) -> str:
    """Generate a unique slug from a tag name.

    Tries the base slug first; appends a counter if it already exists.
    """
    base_slug = pinyin_slug(base_name, fallback_prefix="tag")
    if not base_slug:
        base_slug = f"tag-{int(datetime.now(timezone.utc).timestamp())}"

    candidate = base_slug
    counter = 1
    while await repo.slug_exists(candidate, exclude_id=exclude_id):
        candidate = f"{base_slug}-{counter}"
        counter += 1

    return candidate


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------

class TagService:
    """Business-logic layer for tag operations."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._repo = TagRepository(session)

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, tag_id: uuid.UUID) -> Tag | None:
        """Return a tag by ID."""
        return await self._repo.get_by_id(tag_id)

    async def get_by_slug(self, slug: str) -> Tag | None:
        """Return a tag by slug."""
        return await self._repo.get_by_slug(slug)

    async def list_tags(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
        keyword: str | None = None,
    ) -> tuple[list[Tag], int]:
        """List tags with pagination and optional keyword search."""
        return await self._repo.list_tags(
            page=page,
            page_size=page_size,
            keyword=keyword,
        )

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create(self, data: TagCreate) -> Tag:
        """Create a new tag."""
        # Check name uniqueness
        if await self._repo.name_exists(data.name):
            raise ValueError(f"Tag name '{data.name}' already exists")

        # Generate slug if not provided
        slug = data.slug
        if not slug:
            slug = await generate_unique_slug(self._repo, data.name)
        elif await self._repo.slug_exists(slug):
            raise ValueError(f"Tag slug '{slug}' already exists")

        tag = Tag(
            name=data.name,
            slug=slug,
        )

        return await self._repo.create(tag)

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(self, tag_id: uuid.UUID, data: TagUpdate) -> Tag | None:
        """Update an existing tag."""
        tag = await self._repo.get_by_id(tag_id)
        if tag is None:
            return None

        update_data = data.model_dump(exclude_unset=True)

        # Check name uniqueness
        if "name" in update_data and update_data["name"] != tag.name:
            if await self._repo.name_exists(update_data["name"], exclude_id=tag_id):
                raise ValueError(f"Tag name '{update_data['name']}' already exists")

        # Handle slug
        if "slug" in update_data:
            new_slug = update_data["slug"]
            if new_slug is None or new_slug == "":
                new_name = update_data.get("name", tag.name)
                new_slug = await generate_unique_slug(self._repo, new_name, exclude_id=tag_id)
            elif await self._repo.slug_exists(new_slug, exclude_id=tag_id):
                raise ValueError(f"Tag slug '{new_slug}' already exists")
            update_data["slug"] = new_slug

        for field, value in update_data.items():
            setattr(tag, field, value)

        return await self._repo.update(tag)

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, tag_id: uuid.UUID) -> bool:
        """Soft-delete a tag."""
        return await self._repo.soft_delete(tag_id)
