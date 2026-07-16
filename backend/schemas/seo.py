"""SEO / sitemap schemas."""

from datetime import datetime
from pydantic import BaseModel


class SitemapUrl(BaseModel):
    """Single sitemap URL entry."""
    loc: str
    lastmod: datetime | None = None
    changefreq: str = "weekly"
    priority: str = "0.5"


class SitemapIndexEntry(BaseModel):
    """Entry in a sitemap index."""
    loc: str
    lastmod: datetime | None = None
