# SEO.md - SEO Configuration & Strategy

> This document describes the SEO implementation for web-xiaobaigame.

---

## Overview

The SEO module (M009) provides comprehensive search engine optimization across all pages. All SEO data is **dynamically generated** from the database, with sensible defaults when data is missing.

---

## Sitemaps

### Generated Sitemaps

| Sitemap | URL | Content |
|---------|-----|---------|
| Sitemap Index | `/sitemap.xml` | References all sub-sitemaps |
| Games Sitemap | `/sitemap-games.xml` | All published games |
| Categories Sitemap | `/sitemap-categories.xml` | All categories |
| Tags Sitemap | `/sitemap-tags.xml` | All tags |

All sitemaps are dynamically generated via Next.js route handlers, fetching data from backend API.

### Priority Assignments
- Home page: 1.0 (daily)
- Games with cover: 0.9 (weekly)
- Games without cover: 0.7 (weekly)
- Categories: 0.6 (weekly)
- Tags: 0.4 (weekly)

---

## Robots.txt

Served at `/robots.txt`, configured via Next.js `app/robots.ts`.

- Allows all crawlers at `/`
- Disallows: `/admin/`, `/api/`, `/download/`
- References sitemap index URL

---

## Per-Page SEO

### Home Page (`/`)
- **Title**: xiaobaigame - Game Resource Sharing
- **Description**: Discover and share game resources...
- **OpenGraph**: website type, summary_large_image
- **JSON-LD**: WebSite + SearchAction

### Category Page (`/category/{slug}`)
- **Title**: {Category Name} Games | xiaobaigame
- **Description**: From category description or auto-generated
- **JSON-LD**: CollectionPage

### Tag Page (`/tag/{slug}`)
- **Title**: {Tag Name} Games | xiaobaigame
- **Description**: Browse {tag} games and resources
- **JSON-LD**: CollectionPage

### Game Detail (`/game/{slug}`)
- **Title**: From seo_title field or "{game.title} | xiaobaigame"
- **Description**: From seo_description or summary or auto-generated
- **Keywords**: From seo_keywords field
- **OpenGraph**: article type
- **JSON-LD**: VideoGame + BreadcrumbList

### Download Page (`/download/{id}`)
- **Title**: Download {game} - {provider} | xiaobaigame
- **Robots**: noindex, nofollow

### 404 Page
- **Title**: Page Not Found | xiaobaigame
- **Robots**: noindex, nofollow
- **JSON-LD**: WebPage

---

## Image Optimization

All images use Next.js `<Image>` component with:
- `alt` text (always present)
- `fill` with parent aspect ratio (for responsive)
- `sizes` attribute for responsive sizing
- `loading="lazy"` for below-fold images
- `priority` for above-fold images

---

## Structured Data (JSON-LD)

| Page | Schema Type |
|------|-------------|
| Home | WebSite + SearchAction |
| Game Detail | VideoGame + BreadcrumbList |
| Category | CollectionPage |
| Tag | CollectionPage |
| 404 | WebPage |

---

## PWA / Other

| File | Purpose |
|------|---------|
| `/manifest.webmanifest` | PWA manifest |
| `/browserconfig.xml` | Windows tile config |
| `/favicon.ico` | Favicon |

---

## Performance

- Sitemaps cached for 1 hour (CDN-friendly)
- All data fetched server-side at request time
- Gzip supported by Next.js (automatic)
- CDN-ready architecture

---

## SEO Data Priority

For game detail pages, SEO fields follow this priority:

1. **Database** (seo_title, seo_keywords, seo_description fields in `games` table)
2. **Auto-generated defaults** (from game title, summary, etc.)

This ensures admins can customize SEO per game while having sensible defaults.

---

## URL Structure

| Page | URL Pattern |
|------|------------|
| Home | `/` |
| Game Detail | `/game/{slug}` |
| Category | `/category/{slug}` |
| Tag | `/tag/{slug}` |
| Download | `/download/{id}` |

---

*Last updated: 2026-07-16 | v1.0.0*
