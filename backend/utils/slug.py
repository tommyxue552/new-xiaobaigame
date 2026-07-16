"""Shared slug generation utilities for the application."""

import re
import unicodedata
from datetime import datetime, timezone


def pinyin_slug(text: str, fallback_prefix: str = "item") -> str:
    """Generate a URL-safe slug from text (supports Chinese via pinyin fallback).

    Args:
        text: The source text to convert.
        fallback_prefix: Prefix for timestamp-based fallback when text is
            entirely non-Latin. Defaults to "item".

    Returns:
        Lowercase hyphenated slug string, max 200 chars.
    """
    # Normalize unicode
    text = unicodedata.normalize("NFKD", text)
    # Replace non-alphanumeric chars with hyphens
    slug = re.sub(r"[^a-zA-Z0-9\u4e00-\u9fff]+", "-", text.strip()).strip("-").lower()
    # If there are still Chinese characters and no Latin, use a fallback
    if re.search(r"[\u4e00-\u9fff]", slug) and not re.search(r"[a-z0-9]", slug):
        slug = f"{fallback_prefix}-{int(datetime.now(timezone.utc).timestamp())}"
    # Collapse multiple hyphens
    slug = re.sub(r"-+", "-", slug)
    return slug[:200]
