# SEO.md — SEO 规范

## URL 规范

### 规则
- 使用语义化 URL：`/games/zelda-breath-of-the-wild`
- 全小写，连字符分隔
- 避免数字 ID 在 URL 中暴露
- 使用 slug 替代标题

### 示例
```
✅ /games/zelda-breath-of-the-wild
✅ /categories/action-adventure
❌ /games/123
❌ /Games/Zelda_Breath_of_the_Wild
```

---

## Canonical URL

- 每个页面指定规范的 canonical URL
- 避免重复内容被搜索引擎惩罚

```html
<link rel="canonical" href="https://xiaobaigame.com/games/zelda-breath-of-the-wild" />
```

---

## Meta Tags

### 基础 Meta
```html
<title>Game Title - xiaobaigame</title>
<meta name="description" content="Download game resources, mods, saves for Game Title. Community-driven platform." />
```

### Open Graph
```html
<meta property="og:title" content="Game Title - xiaobaigame" />
<meta property="og:description" content="Download game resources for Game Title." />
<meta property="og:image" content="https://xiaobaigame.com/images/games/zelda-cover.jpg" />
<meta property="og:url" content="https://xiaobaigame.com/games/zelda" />
<meta property="og:type" content="website" />
```

### Twitter Card
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Game Title - xiaobaigame" />
<meta name="twitter:description" content="Download game resources for Game Title." />
<meta name="twitter:image" content="https://xiaobaigame.com/images/games/zelda-cover.jpg" />
```

---

## 结构化数据 (JSON-LD)

### 游戏详情页
```json
{
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "Game Title",
  "description": "Game description here.",
  "genre": ["Action", "Adventure"],
  "image": "https://xiaobaigame.com/images/games/zelda-cover.jpg",
  "url": "https://xiaobaigame.com/games/zelda"
}
```

### Breadcrumb
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://xiaobaigame.com" },
    { "@type": "ListItem", "position": 2, "name": "Games", "item": "https://xiaobaigame.com/games" },
    { "@type": "ListItem", "position": 3, "name": "Game Title" }
  ]
}
```

---

## Sitemap

- 自动生成 XML Sitemap
- 按优先级包含：首页 > 分类页 > 详情页 > 标签页
- 更新频率：每日

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://xiaobaigame.com/games/zelda</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## Robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: https://xiaobaigame.com/sitemap.xml
```

---

## RSS Feed

- 提供最新资源 RSS 订阅
- 格式：RSS 2.0 / Atom
- URL：`/feed.xml` 或 `/rss.xml`

---

## 分页 SEO

- 使用 `rel="next"` 和 `rel="prev"` 链接
- 或使用 `rel="canonical"` 指向第一页
- 分页 URL：`/games?page=2`

```html
<link rel="next" href="/games?page=3" />
<link rel="prev" href="/games?page=1" />
```

---

## 分类/TAG SEO

### 分类页
- 标题格式：`{Category Name} Games - xiaobaigame`
- 描述：包含分类关键词
- H1：分类名称

### TAG 页
- 每个 TAG 有独立页面（如需要）
- Meta description 包含 TAG 关键词
- 避免 TAG 页内容过于单薄

---

*最后更新：2026-07-15 | v0.1.0*
