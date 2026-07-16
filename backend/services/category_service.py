"""Category service — business logic for category operations."""

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.category import Category
from backend.repositories.category_repository import CategoryRepository
from backend.schemas.category import CategoryCreate, CategoryTreeNode, CategoryUpdate
from backend.utils.slug import pinyin_slug


# ---------------------------------------------------------------------------
# Slug generation
# ---------------------------------------------------------------------------

async def generate_unique_slug(
    repo: CategoryRepository,
    base_name: str,
    exclude_id: uuid.UUID | None = None,
) -> str:
    """Generate a unique slug from a category name.

    Tries the base slug first; appends a counter if it already exists.
    """
    base_slug = pinyin_slug(base_name, fallback_prefix="category")
    if not base_slug:
        base_slug = f"category-{int(datetime.now(timezone.utc).timestamp())}"

    candidate = base_slug
    counter = 1
    while await repo.slug_exists(candidate, exclude_id=exclude_id):
        candidate = f"{base_slug}-{counter}"
        counter += 1

    return candidate


# ---------------------------------------------------------------------------
# Tree building
# ---------------------------------------------------------------------------

def build_category_tree(
    categories: list[Category],
    game_counts: dict[uuid.UUID, int],
) -> list[CategoryTreeNode]:
    """Build a hierarchical category tree from a flat list.

    Args:
        categories: All non-deleted categories.
        game_counts: Mapping of category_id -> game count.

    Returns:
        List of root-level CategoryTreeNode objects with populated children.
    """
    # Build lookup: id -> CategoryTreeNode
    nodes: dict[uuid.UUID, CategoryTreeNode] = {}
    for cat in categories:
        nodes[cat.id] = CategoryTreeNode(
            id=cat.id,
            name=cat.name,
            slug=cat.slug,
            description=cat.description,
            parent_id=cat.parent_id,
            sort_order=cat.sort_order,
            game_count=game_counts.get(cat.id, 0),
            children=[],
        )

    # Build tree: attach children to parents
    roots: list[CategoryTreeNode] = []
    for node in nodes.values():
        if node.parent_id and node.parent_id in nodes:
            nodes[node.parent_id].children.append(node)
        else:
            roots.append(node)

    # Sort children within each parent by sort_order then name
    def sort_children(n: CategoryTreeNode) -> None:
        n.children.sort(key=lambda c: (c.sort_order, c.name))
        for child in n.children:
            sort_children(child)

    for root in roots:
        sort_children(root)

    # Sort roots
    roots.sort(key=lambda r: (r.sort_order, r.name))

    return roots


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------

class CategoryService:
    """Business-logic layer for category operations."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._repo = CategoryRepository(session)

    # ------------------------------------------------------------------
    # Read
    # ------------------------------------------------------------------

    async def get_by_id(self, category_id: uuid.UUID) -> Category | None:
        """Return a category by ID."""
        return await self._repo.get_by_id(category_id)

    async def get_by_slug(self, slug: str) -> Category | None:
        """Return a category by slug."""
        return await self._repo.get_by_slug(slug)

    async def get_category_tree(self) -> list[CategoryTreeNode]:
        """Return the full category tree with game counts."""
        categories = await self._repo.get_all()
        game_counts = await self._repo.get_game_counts()
        return build_category_tree(categories, game_counts)

    async def get_category_detail(self, slug: str) -> dict[str, Any] | None:
        """Return category detail dict with game_count."""
        category = await self._repo.get_by_slug(slug)
        if category is None:
            return None
        game_counts = await self._repo.get_game_counts()
        return {
            "id": category.id,
            "name": category.name,
            "slug": category.slug,
            "description": category.description,
            "parent_id": category.parent_id,
            "sort_order": category.sort_order,
            "game_count": game_counts.get(category.id, 0),
            "created_at": category.created_at,
            "updated_at": category.updated_at,
        }

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    async def create(self, data: CategoryCreate) -> Category:
        """Create a new category."""
        # Check name uniqueness
        if await self._repo.name_exists(data.name):
            raise ValueError(f"Category name '{data.name}' already exists")

        # Generate slug if not provided
        slug = data.slug
        if not slug:
            slug = await generate_unique_slug(self._repo, data.name)
        elif await self._repo.slug_exists(slug):
            raise ValueError(f"Category slug '{slug}' already exists")

        # Validate parent exists if specified
        if data.parent_id:
            parent = await self._repo.get_by_id(data.parent_id)
            if parent is None:
                raise ValueError(f"Parent category '{data.parent_id}' not found")

        category = Category(
            name=data.name,
            slug=slug,
            description=data.description,
            parent_id=data.parent_id,
            sort_order=data.sort_order,
        )

        return await self._repo.create(category)

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    async def update(self, category_id: uuid.UUID, data: CategoryUpdate) -> Category | None:
        """Update an existing category."""
        category = await self._repo.get_by_id(category_id)
        if category is None:
            return None

        update_data = data.model_dump(exclude_unset=True)

        # Check name uniqueness
        if "name" in update_data and update_data["name"] != category.name:
            if await self._repo.name_exists(update_data["name"], exclude_id=category_id):
                raise ValueError(f"Category name '{update_data['name']}' already exists")

        # Handle slug
        if "slug" in update_data:
            new_slug = update_data["slug"]
            if new_slug is None or new_slug == "":
                # Regenerate from name
                new_name = update_data.get("name", category.name)
                new_slug = await generate_unique_slug(self._repo, new_name, exclude_id=category_id)
            elif await self._repo.slug_exists(new_slug, exclude_id=category_id):
                raise ValueError(f"Category slug '{new_slug}' already exists")
            update_data["slug"] = new_slug

        # Validate parent
        if "parent_id" in update_data and update_data["parent_id"] is not None:
            if update_data["parent_id"] != category_id:  # Prevent self-reference
                parent = await self._repo.get_by_id(update_data["parent_id"])
                if parent is None:
                    raise ValueError(f"Parent category '{update_data['parent_id']}' not found")

        for field, value in update_data.items():
            setattr(category, field, value)

        return await self._repo.update(category)

    # ------------------------------------------------------------------
    # Soft delete
    # ------------------------------------------------------------------

    async def soft_delete(self, category_id: uuid.UUID) -> bool:
        """Soft-delete a category."""
        return await self._repo.soft_delete(category_id)
