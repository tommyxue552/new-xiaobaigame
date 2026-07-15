# DATABASE.md — 数据库规范

> v0.2.0 — Database Foundation 已建立，本文档包含完整的数据表设计。

---

## 命名规范

### 表名
- 格式：`snake_case` 复数
- 示例：`games`, `game_resources`, `user_profiles`
- 关联表：`{table1}_{table2}`（按字母序），如 `game_tags`

### 列名
- 格式：`snake_case`
- 主键：`id` (UUID v4)
- 外键：`{referenced_table_singular}_id`，如 `game_id`, `provider_id`
- 时间戳：`created_at`, `updated_at`, `deleted_at`
- 布尔值：`is_` 前缀，如 `is_active`

### 索引命名
- 普通索引：`ix_{table}_{column}`
- 唯一索引：`uq_{table}_{column}`
- 外键：`fk_{table}_{column}_{ref_table}`
- 复合索引：`ix_{table}_{col1}_{col2}`

### 约束命名
- 主键：隐式（由 ORM 管理）
- 外键：`fk_{table}_{column}_{ref_table}`
- 唯一约束：`uq_{table}_{column}`
- 检查约束：`ck_{table}_{description}`

---

## 字段规范

### 必须字段
每个业务表必须包含：

```sql
id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
deleted_at  TIMESTAMPTZ  -- 软删除
```

### 字段类型选择

| 用途 | PostgreSQL 类型 |
|------|----------------|
| UUID 主键 | `UUID` |
| 短文本 (≤255) | `VARCHAR(255)` |
| 长文本 | `TEXT` |
| 整数 | `INTEGER` / `BIGINT` |
| 布尔值 | `BOOLEAN` |
| 日期时间 | `TIMESTAMPTZ` |
| JSON 数据 | `JSONB` (预留) |
| 枚举 | `VARCHAR` + 注释说明可选值 |

---

## 核心数据表

### 1. games — 游戏条目

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 主键 |
| title | VARCHAR(255) | NOT NULL | 游戏标题 |
| title_en | VARCHAR(255) | NULL | 英文标题 |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL 友好标识 |
| summary | TEXT | NULL | 简介 |
| content | TEXT | NULL | 详细内容 (Markdown/HTML) |
| cover | VARCHAR(500) | NULL | 封面图片 URL |
| published_at | TIMESTAMPTZ | NULL | 发布日期 |
| view_count | BIGINT | NOT NULL, DEFAULT 0 | 浏览量 |
| download_count | BIGINT | NOT NULL, DEFAULT 0 | 下载量 |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'draft' | draft / published / hidden |
| seo_title | VARCHAR(255) | NULL | SEO 标题 |
| seo_keywords | VARCHAR(500) | NULL | SEO 关键词 |
| seo_description | TEXT | NULL | SEO 描述 |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | 软删除 |

**索引**:
- `ix_games_slug` (UNIQUE) — 通过 slug 查找游戏
- `ix_games_status` — 按状态过滤
- `ix_games_published_at` — 按发布日期排序
- `ix_games_deleted_at` (部分索引 WHERE deleted_at IS NULL) — 软删除过滤
- `ix_games_title` — 按标题搜索

---

### 2. categories — 分类（支持父分类）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| name | VARCHAR(100) | NOT NULL | 分类名称 |
| slug | VARCHAR(150) | UNIQUE, NOT NULL | URL 友好标识 |
| description | TEXT | NULL | 分类描述 |
| parent_id | UUID | FK → categories.id, ON DELETE SET NULL | 父分类 ID |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | 排序 |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | 软删除 |

**索引**:
- `ix_categories_slug` (UNIQUE)
- `ix_categories_parent_id` — 查询子分类
- `ix_categories_deleted_at` (部分索引)

---

### 3. tags — 标签

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| name | VARCHAR(100) | NOT NULL | 标签名称 |
| slug | VARCHAR(150) | UNIQUE, NOT NULL | URL 友好标识 |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | 软删除 |

**索引**:
- `ix_tags_slug` (UNIQUE)
- `ix_tags_deleted_at` (部分索引)

---

### 4. game_tags — 游戏标签关联

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| game_id | UUID | FK → games.id, ON DELETE CASCADE | 游戏 ID |
| tag_id | UUID | FK → tags.id, ON DELETE CASCADE | 标签 ID |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |

**约束**:
- `uq_game_tags_game_tag` (UNIQUE: game_id, tag_id)

**索引**:
- `ix_game_tags_game_id`
- `ix_game_tags_tag_id`

---

### 5. screenshots — 游戏截图

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| game_id | UUID | FK → games.id, ON DELETE CASCADE | 游戏 ID |
| image_url | VARCHAR(500) | NOT NULL | 截图 URL |
| title | VARCHAR(255) | NULL | 截图标题 |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | 排序 |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | 软删除 |

**索引**:
- `ix_screenshots_game_id`
- `ix_screenshots_sort_order`
- `ix_screenshots_deleted_at` (部分索引)

---

### 6. download_providers — 下载渠道

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| name | VARCHAR(100) | NOT NULL | 渠道名称（百度网盘、夸克网盘等） |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL 友好标识 |
| icon_url | VARCHAR(500) | NULL | 图标 URL |
| website_url | VARCHAR(500) | NULL | 官网 URL |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 | 排序 |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | 是否启用 |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | 软删除 |

**索引**:
- `ix_download_providers_slug` (UNIQUE)
- `ix_download_providers_deleted_at` (部分索引)

**初始种子数据**: 百度网盘、夸克网盘、阿里云盘、115网盘、迅雷、UC网盘、天翼云盘、移动云盘

---

### 7. download_resources — 下载资源

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| game_id | UUID | FK → games.id, ON DELETE CASCADE | 游戏 ID |
| provider_id | UUID | FK → download_providers.id, ON DELETE RESTRICT | 下载渠道 ID |
| download_url | TEXT | NOT NULL | 下载地址 |
| extract_code | VARCHAR(50) | NULL | 提取码 |
| priority | INTEGER | NOT NULL, DEFAULT 0 | 优先级（越小越靠前） |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' | active / expired / disabled |
| notes | TEXT | NULL | 备注 |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | 软删除 |

**索引**:
- `ix_download_resources_game_id`
- `ix_download_resources_provider_id`
- `ix_download_resources_status`
- `ix_download_resources_deleted_at` (部分索引)

---

### 8. admins — 后台管理员

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| username | VARCHAR(100) | UNIQUE, NOT NULL | 用户名 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt 密码哈希 |
| display_name | VARCHAR(100) | NULL | 显示名称 |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'admin' | admin / super_admin |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | 是否启用 |
| last_login_at | TIMESTAMPTZ | NULL | 最后登录时间 |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |
| deleted_at | TIMESTAMPTZ | NULL | 软删除 |

**索引**:
- `ix_admins_username` (UNIQUE)
- `ix_admins_email` (UNIQUE)
- `ix_admins_deleted_at` (部分索引)

---

### 9. settings — 系统配置

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| key | VARCHAR(255) | UNIQUE, NOT NULL | 配置键 |
| value | TEXT | NULL | 配置值 |
| description | VARCHAR(500) | NULL | 配置说明 |
| created_at | TIMESTAMPTZ | NOT NULL | — |
| updated_at | TIMESTAMPTZ | NOT NULL | — |

> 注: settings 表不使用软删除，配置项生命周期由应用层管理。

**索引**:
- `ix_settings_key` (UNIQUE)

---

## ER 图

```
┌──────────────────┐       ┌──────────────────┐
│     games        │       │    categories    │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ title            │       │ name             │
│ title_en         │       │ slug (UQ)        │
│ slug (UQ)        │       │ description      │
│ summary          │       │ parent_id (FK) ──┼──→ categories.id
│ content          │       │ sort_order       │
│ cover            │       │ created_at       │
│ published_at     │       │ updated_at       │
│ view_count       │       │ deleted_at       │
│ download_count   │       └──────────────────┘
│ status           │
│ seo_*            │       ┌──────────────────┐
│ created_at       │       │      tags        │
│ updated_at       │       ├──────────────────┤
│ deleted_at       │       │ id (PK)          │
└────────┬─────────┘       │ name             │
         │                 │ slug (UQ)        │
         │                 │ created_at       │
         │                 │ updated_at       │
         │                 │ deleted_at       │
         │                 └────────┬─────────┘
         │                          │
         │         ┌────────────────┘
         │         │
    ┌────┴─────────┴────┐
    │    game_tags      │
    ├───────────────────┤
    │ id (PK)           │
    │ game_id (FK) ────→ games.id
    │ tag_id (FK) ─────→ tags.id
    │ created_at        │
    │ updated_at        │
    │ UQ(game_id,tag_id)│
    └───────────────────┘

┌──────────────────┐       ┌───────────────────────┐
│   screenshots    │       │  download_providers   │
├──────────────────┤       ├───────────────────────┤
│ id (PK)          │       │ id (PK)               │
│ game_id (FK) ────┼──→    │ name                  │
│ image_url        │  🎮   │ slug (UQ)             │
│ title            │       │ icon_url              │
│ sort_order       │       │ website_url           │
│ created_at       │       │ sort_order            │
│ updated_at       │       │ is_active             │
│ deleted_at       │       │ created_at / updated  │
└──────────────────┘       │ deleted_at            │
                           └───────────┬───────────┘
                                       │
                           ┌───────────┴───────────┐
                           │  download_resources   │
                           ├───────────────────────┤
                           │ id (PK)               │
                           │ game_id (FK) ────────→ games.id
                           │ provider_id (FK) ────→ download_providers.id
                           │ download_url          │
                           │ extract_code          │
                           │ priority              │
                           │ status                │
                           │ notes                 │
                           │ created_at / updated  │
                           │ deleted_at            │
                           └───────────────────────┘

┌──────────────────┐       ┌──────────────────┐
│     admins       │       │    settings      │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ username (UQ)    │       │ key (UQ)         │
│ email (UQ)       │       │ value            │
│ password_hash    │       │ description      │
│ display_name     │       │ created_at       │
│ role             │       │ updated_at       │
│ is_active        │       └──────────────────┘
│ last_login_at    │
│ created_at       │
│ updated_at       │
│ deleted_at       │
└──────────────────┘
```

---

## 关系说明

| 关系 | 类型 | 说明 |
|------|------|------|
| games ↔ tags | 多对多 (via game_tags) | 一个游戏可有多个标签，一个标签可关联多个游戏 |
| games → screenshots | 一对多 | 一个游戏可有多张截图 |
| games → download_resources | 一对多 | 一个游戏可有多个下载资源 |
| download_providers → download_resources | 一对多 | 一个渠道可有多个下载资源 |
| categories → categories | 自引用一对多 | 分类支持无限层级嵌套 |

---

## 删除规范

### 软删除
- 所有删除操作使用软删除（设置 `deleted_at`）
- 查询默认过滤 `WHERE deleted_at IS NULL`
- 除 `settings` 表外，所有业务表均支持软删除

### 外键删除策略
- `game_tags`: CASCADE — 删除游戏/标签时自动清除关联
- `screenshots`: CASCADE — 删除游戏时自动清除截图
- `download_resources → games`: CASCADE — 删除游戏时清除下载资源
- `download_resources → download_providers`: RESTRICT — 有下载资源时不允许删除渠道
- `categories.parent_id`: SET NULL — 删除父分类时子分类变为顶级

### 禁止操作
- ❌ 物理删除（DROP、TRUNCATE、硬 DELETE）
- ❌ 修改已执行的 Migration 文件

---

## Migration 规范

### 文件命名
```
alembic/versions/{YYYY}_{MM}_{DD}_{HHMM}-{description}.py
```

### 当前 Migration

| 文件 | 说明 |
|------|------|
| `2026_07_15_0001-add_core_tables.py` | v0.2.0 Database Foundation — 创建全部 9 张核心表 + 种子数据 |

### Migration 要求
- 每个 Migration 必须同时实现 `upgrade()` 和 `downgrade()`
- 数据迁移和结构迁移分开
- 新 Migration 不能修改已合并的 Migration

### 执行流程
```bash
# 生成迁移
alembic revision --autogenerate -m "description"

# 执行迁移
alembic upgrade head

# 回滚
alembic downgrade -1
```

---

## 性能规范

- 避免 `SELECT *`，明确列出所需列
- 使用连接池（默认 20 连接）
- 大量数据查询必须分页
- 慢查询记录到日志（> 100ms）
- 定期执行 `VACUUM ANALYZE`
- 所有外键和常用查询列已建立索引
- `deleted_at` 使用部分索引（仅索引未删除行）

---

*最后更新：2026-07-15 | v0.2.0*
