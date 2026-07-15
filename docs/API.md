# API.md — API 接口规范

## 基础信息

- **Base URL**：`/api/v1`
- **Content-Type**：`application/json`
- **字符编码**：UTF-8

## 统一响应格式

所有 API 端点必须返回以下格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 成功响应 (code = 0)

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid",
    "name": "Game Name"
  }
}
```

### 列表响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

### 错误响应

```json
{
  "code": 1000,
  "message": "Invalid credentials",
  "data": null
}
```

## 错误码体系

| 范围 | 类别 | 示例 |
|------|------|------|
| 1000-1999 | 认证/授权 | 1000: 认证失败, 1003: 权限不足 |
| 2000-2999 | 验证/业务逻辑 | 2000: 参数验证失败 |
| 3000-3999 | 资源 | 3000: 资源未找到, 3001: 资源冲突 |
| 4000-4999 | 文件/上传 | 4000: 文件过大, 4001: 类型不允许 |
| 5000-5999 | 服务器 | 5000: 内部错误, 5003: 速率限制 |

完整错误码列表见 `backend/schemas/errors.py`。

## RESTful 设计规范

### 资源命名
- 使用复数名词：`/games`, `/categories`, `/users`
- 层级关系：`/games/{game_id}/resources`
- 小写字母，连字符分隔：`/game-resources`

### HTTP 方法

| 方法 | 用途 | 示例 |
|------|------|------|
| GET | 获取资源 | `GET /games` `GET /games/{id}` |
| POST | 创建资源 | `POST /games` |
| PUT | 全量更新 | `PUT /games/{id}` |
| PATCH | 部分更新 | `PATCH /games/{id}` |
| DELETE | 删除（软删除） | `DELETE /games/{id}` |

### 查询参数

```
GET /api/v1/games?page=1&page_size=20&sort_by=created_at&sort_order=desc&category=action
```

### 状态码

| 状态码 | 场景 |
|--------|------|
| 200 | 成功（GET, PUT, PATCH） |
| 201 | 创建成功（POST） |
| 204 | 删除成功（DELETE，无响应体） |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源未找到 |
| 409 | 资源冲突 |
| 422 | 验证失败 |
| 429 | 请求过多 |
| 500 | 服务器内部错误 |

## 认证

- 使用 Bearer Token（JWT）
- Header：`Authorization: Bearer <access_token>`
- 访问令牌过期后使用刷新令牌获取新令牌

## 分页

- 参数：`page`（从 1 开始）、`page_size`（默认 20，最大 100）
- 响应包含：`items`, `total`, `page`, `page_size`, `total_pages`

## 版本管理

- URL 前缀：`/api/v1/`, `/api/v2/`
- 向后兼容：新版 API 不破坏旧版
- 废弃 API 提前 2 个版本通知

---

## Game API (v0.3.0)

### 公开接口

#### GET /api/v1/games

游戏列表，支持分页、分类/标签筛选、关键词搜索、排序。

**查询参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码 (>=1) |
| page_size | int | 20 | 每页数量 (1-100) |
| category | string | - | 按分类 slug 筛选 |
| tag | string | - | 按标签 slug 筛选 |
| keyword | string | - | 关键词搜索（标题/摘要） |
| sort_by | string | published_at | 排序字段: created_at, published_at, view_count, download_count, title |
| sort_order | string | desc | 排序方向: asc, desc |
| status | string | - | 状态筛选: draft, published, hidden |

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "游戏标题",
        "title_en": "Game Title",
        "slug": "game-slug",
        "summary": "简介",
        "cover": "https://...",
        "category": { "id": "uuid", "name": "分类", "slug": "category-slug" },
        "published_at": "2026-07-15T00:00:00Z",
        "view_count": 1000,
        "download_count": 500,
        "status": "published",
        "tags": [
          { "id": "uuid", "name": "标签", "slug": "tag-slug" }
        ]
      }
    ],
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

#### GET /api/v1/games/{slug}

游戏详情，包含分类、标签、截图、可用下载资源。

**路径参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| slug | string | 游戏 URL 标识 |

**响应**：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid",
    "title": "游戏标题",
    "slug": "game-slug",
    "summary": "简介",
    "content": "详细内容（Markdown/HTML）",
    "cover": "https://...",
    "category": { "id": "uuid", "name": "分类", "slug": "category-slug" },
    "published_at": "2026-07-15T00:00:00Z",
    "view_count": 1000,
    "download_count": 500,
    "status": "published",
    "seo_title": "SEO 标题",
    "seo_keywords": "keyword1,keyword2",
    "seo_description": "SEO 描述",
    "tags": [...],
    "screenshots": [
      { "id": "uuid", "image_url": "https://...", "title": "截图", "sort_order": 0 }
    ],
    "download_resources": [
      {
        "id": "uuid",
        "provider": { "id": "uuid", "name": "百度网盘", "slug": "baidu", "icon_url": null },
        "download_url": "https://...",
        "extract_code": "abcd",
        "priority": 0,
        "status": "active",
        "notes": null
      }
    ],
    "created_at": "2026-07-15T00:00:00Z",
    "updated_at": "2026-07-15T00:00:00Z"
  }
}
```

### 管理接口

> 注意：v0.3.0 版本暂无权限守卫，后续版本将添加认证。

#### POST /api/v1/admin/games

创建游戏。

**请求体**：
```json
{
  "title": "游戏标题",
  "title_en": "Game Title",
  "slug": "custom-slug",
  "summary": "简介",
  "content": "详细内容",
  "cover": "https://...",
  "category_id": "uuid",
  "published_at": "2026-07-15T00:00:00Z",
  "status": "draft",
  "seo_title": "SEO 标题",
  "seo_keywords": "keyword1,keyword2",
  "seo_description": "SEO 描述",
  "tag_ids": ["uuid1", "uuid2"]
}
```

- `slug` 可选，不提供时自动从标题生成（中文转拼音）
- `status` 默认 `draft`
- 返回 201 Created + 完整游戏详情

#### PUT /api/v1/admin/games/{id}

更新游戏。

**路径参数**：`id` (UUID) - 游戏 ID

**请求体**：同 POST，但所有字段均为可选（只传需要更新的字段）。

- `tag_ids` 传 `[]` 清空所有标签，传 `null`（或不传）不修改标签
- 返回完整更新后的游戏详情

#### DELETE /api/v1/admin/games/{id}

软删除游戏。

**路径参数**：`id` (UUID) - 游戏 ID

- 设置 `deleted_at` 时间戳
- 数据可恢复，不会物理删除
- 返回 200 + 成功消息

---

## Category API (v0.4.0)

### 公开接口

#### GET /api/v1/categories

获取完整分类树，支持无限层级嵌套。

**无需参数**。

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "uuid",
      "name": "动作游戏",
      "slug": "action",
      "description": "动作类游戏",
      "parent_id": null,
      "sort_order": 0,
      "game_count": 15,
      "children": [
        {
          "id": "uuid",
          "name": "射击游戏",
          "slug": "shooter",
          "description": null,
          "parent_id": "uuid",
          "sort_order": 0,
          "game_count": 8,
          "children": []
        }
      ]
    }
  ]
}
```

每个节点包含 `children` 数组（递归）和 `game_count` 字段。

#### GET /api/v1/categories/{slug}

获取单个分类详情（含游戏数量）。

**路径参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| slug | string | 分类 URL 标识 |

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid",
    "name": "动作游戏",
    "slug": "action",
    "description": "动作类游戏",
    "parent_id": null,
    "sort_order": 0,
    "game_count": 15,
    "created_at": "2026-07-15T00:00:00Z",
    "updated_at": "2026-07-15T00:00:00Z"
  }
}
```

### 管理接口

> 注意：v0.4.0 版本暂无权限守卫，后续版本将添加认证。

#### POST /api/v1/admin/categories

创建分类。

**请求体**：

```json
{
  "name": "动作游戏",
  "slug": "action",
  "description": "动作类游戏",
  "parent_id": null,
  "sort_order": 0
}
```

- `slug` 可选，不提供时自动从名称生成
- `parent_id` 可选，为 null 时创建顶级分类
- `sort_order` 默认 0
- 分类名称必须唯一
- 返回 201 Created

#### PUT /api/v1/admin/categories/{id}

更新分类。

**路径参数**：`id` (UUID) - 分类 ID

**请求体**：所有字段均为可选（只传需要更新的字段）。

- 自动检测名称唯一性
- `slug` 传空字符串时自动重新生成
- `parent_id` 不允许设置为自身
- 返回完整更新后的分类详情

#### DELETE /api/v1/admin/categories/{id}

软删除分类。

**路径参数**：`id` (UUID) - 分类 ID

- 设置 `deleted_at` 时间戳
- 子分类的 `parent_id` 自动设为 NULL（数据库约束）
- 数据可恢复
- 返回 200 + 成功消息

---

## Tag API (v0.4.0)

### 公开接口

#### GET /api/v1/tags

标签列表，支持分页和关键词搜索。

**查询参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码 (>=1) |
| page_size | int | 20 | 每页数量 (1-100) |
| keyword | string | - | 关键词搜索（名称/slug） |

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "RPG",
        "slug": "rpg",
        "game_count": 25,
        "created_at": "2026-07-15T00:00:00Z",
        "updated_at": "2026-07-15T00:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "page_size": 20,
    "total_pages": 3
  }
}
```

#### GET /api/v1/tags/{slug}

获取单个标签详情（含游戏数量）。

**路径参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| slug | string | 标签 URL 标识 |

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid",
    "name": "RPG",
    "slug": "rpg",
    "game_count": 25,
    "created_at": "2026-07-15T00:00:00Z",
    "updated_at": "2026-07-15T00:00:00Z"
  }
}
```

### 管理接口

> 注意：v0.4.0 版本暂无权限守卫，后续版本将添加认证。

#### POST /api/v1/admin/tags

创建标签。

**请求体**：

```json
{
  "name": "RPG",
  "slug": "rpg"
}
```

- `slug` 可选，不提供时自动从名称生成
- 标签名称必须唯一
- 返回 201 Created

#### PUT /api/v1/admin/tags/{id}

更新标签。

**路径参数**：`id` (UUID) - 标签 ID

**请求体**：所有字段均为可选（只传需要更新的字段）。

- 自动检测名称唯一性
- `slug` 传空字符串时自动重新生成
- 返回完整更新后的标签详情

#### DELETE /api/v1/admin/tags/{id}

软删除标签。

**路径参数**：`id` (UUID) - 标签 ID

- 设置 `deleted_at` 时间戳
- 关联的 `game_tags` 自动级联删除
- 数据可恢复
- 返回 200 + 成功消息

---

## Download API (v0.5.0)

### 公开接口

#### GET /api/v1/games/{slug}/downloads

获取指定游戏的所有可用下载资源。

只返回状态为 `active` 且渠道已启用的下载资源。

**路径参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| slug | string | 游戏 URL 标识 |

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "game_id": "uuid",
    "game_title": "游戏标题",
    "game_slug": "game-slug",
    "downloads": [
      {
        "id": "uuid",
        "game_id": "uuid",
        "provider": {
          "id": "uuid",
          "name": "百度网盘",
          "slug": "baidu",
          "icon_url": null
        },
        "download_url": "https://pan.baidu.com/s/xxxx",
        "extract_code": "abcd",
        "priority": 0,
        "status": "active",
        "notes": "含 DLC"
      }
    ]
  }
}
```

### 管理接口 — 下载资源

> 注意：v0.5.0 版本暂无权限守卫，后续版本将添加认证。

#### GET /api/v1/admin/downloads

下载资源列表，支持分页和按游戏筛选。

**查询参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码 (>=1) |
| page_size | int | 20 | 每页数量 (1-100) |
| game_id | uuid | - | 按游戏 ID 筛选 |

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "uuid",
        "game_id": "uuid",
        "provider": {
          "id": "uuid",
          "name": "百度网盘",
          "slug": "baidu",
          "icon_url": null
        },
        "download_url": "https://...",
        "extract_code": "abcd",
        "priority": 0,
        "status": "active",
        "notes": null,
        "created_at": "2026-07-16T00:00:00Z",
        "updated_at": "2026-07-16T00:00:00Z"
      }
    ],
    "total": 10,
    "page": 1,
    "page_size": 20,
    "total_pages": 1
  }
}
```

#### POST /api/v1/admin/downloads

创建下载资源。

**请求体**：

```json
{
  "game_id": "uuid",
  "provider_id": "uuid",
  "download_url": "https://pan.baidu.com/s/xxxx",
  "extract_code": "abcd",
  "priority": 0,
  "status": "active",
  "notes": "含 DLC"
}
```

- `game_id` 必须引用一个存在且未删除的游戏
- `provider_id` 必须引用一个存在且未删除的下载渠道
- `status` 可选值：`active`、`expired`、`disabled`，默认为 `active`
- `priority` 越小越靠前，默认为 0
- 返回 201 Created

#### PUT /api/v1/admin/downloads/{id}

更新下载资源。

**路径参数**：`id` (UUID) - 下载资源 ID

**请求体**：所有字段均为可选（只传需要更新的字段）。

- 更新 `provider_id` 时验证渠道存在性
- 更新 `status` 时验证值合法性
- 返回完整更新后的下载资源详情

#### DELETE /api/v1/admin/downloads/{id}

软删除下载资源。

**路径参数**：`id` (UUID) - 下载资源 ID

- 设置 `deleted_at` 时间戳
- 数据可恢复
- 返回 200 + 成功消息

### 管理接口 — 下载渠道

#### GET /api/v1/admin/download-providers

获取所有下载渠道列表。

**无需参数**。

**响应**：

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "uuid",
      "name": "百度网盘",
      "slug": "baidu",
      "icon_url": null,
      "website_url": "https://pan.baidu.com",
      "sort_order": 0,
      "is_active": true,
      "created_at": "2026-07-16T00:00:00Z",
      "updated_at": "2026-07-16T00:00:00Z"
    }
  ]
}
```

#### POST /api/v1/admin/download-providers

创建下载渠道。

**请求体**：

```json
{
  "name": "百度网盘",
  "slug": "baidu",
  "icon_url": "https://...",
  "website_url": "https://pan.baidu.com",
  "sort_order": 0,
  "is_active": true
}
```

- `slug` 可选，不提供时自动从名称生成
- 渠道名称必须唯一
- 返回 201 Created

#### PUT /api/v1/admin/download-providers/{id}

更新下载渠道。

**路径参数**：`id` (UUID) - 渠道 ID

**请求体**：所有字段均为可选（只传需要更新的字段）。

- 自动检测名称唯一性
- `slug` 传空字符串时自动重新生成
- 返回完整更新后的渠道详情

#### DELETE /api/v1/admin/download-providers/{id}

软删除下载渠道。

**路径参数**：`id` (UUID) - 渠道 ID

- 设置 `deleted_at` 时间戳
- 注意：有关联下载资源的渠道无法删除（RESTRICT 约束）
- 返回 200 + 成功消息

---

*最后更新：2026-07-16 | v0.5.0*
