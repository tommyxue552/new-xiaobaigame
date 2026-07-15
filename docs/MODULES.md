# MODULES.md — 模块清单

> 本文档记录项目的所有模块及其状态。每个模块必须登记后才能开始开发。

---

## 模块总览

| 编号 | 模块名称 | 状态 | 负责人 | 版本 | 依赖 | 开发顺序 | 进度 | Review | 冻结 |
|------|---------|------|--------|------|------|---------|------|--------|------|
| M000 | database-foundation | completed | Codex | 0.2.0 | - | 0 | 100% | pending | 否 |
| M001 | games | completed | Codex | 0.3.0 | M000 | 1 | 100% | pending | 否 |
| M002 | categories | planned | TBD | 0.1.0 | M000 | 2 | 0% | - | 否 |
| M003 | resources | planned | TBD | 0.1.0 | M001 | 6 | 0% | - | 否 |
| M004 | users | planned | TBD | 0.1.0 | M000 | 3 | 0% | - | 否 |
| M005 | auth | planned | TBD | 0.1.0 | M004 | 4 | 0% | - | 否 |
| M006 | search | planned | TBD | 0.2.0 | M001 | 9 | 0% | - | 否 |
| M007 | upload | planned | TBD | 0.1.0 | M003 | 7 | 0% | - | 否 |
| M008 | download | planned | TBD | 0.1.0 | M003, M005 | 8 | 0% | - | 否 |
| M009 | seo | planned | TBD | 0.3.0 | M001, M002 | 12 | 0% | - | 否 |
| M010 | comments | planned | TBD | 0.2.0 | M004, M001 | 10 | 0% | - | 否 |
| M011 | ratings | planned | TBD | 0.2.0 | M004, M001 | 11 | 0% | - | 否 |
| M012 | collections | planned | TBD | 0.3.0 | M004, M001 | 13 | 0% | - | 否 |
| M013 | notifications | planned | TBD | 0.3.0 | M004 | 14 | 0% | - | 否 |
| M014 | admin | planned | TBD | 0.2.0 | M005 | 15 | 0% | - | 否 |
| M015 | analytics | planned | TBD | 0.4.0 | - | 16 | 0% | - | 否 |

---

## 模块依赖关系图
```
M000 (database-foundation) — 所有模块的基础

M001 (games) ←─── M003 (resources) ←─── M007 (upload)
    ↓               ↓                   M008 (download)
    ↓               ↓     ←─── M006 (search)
    ├─── M010 (comments) ←─── M004 (users) ←─── M005 (auth) ←─── M014 (admin)
    ├─── M011 (ratings)   ←─── M004           M013 (notifications)
    ├─── M012 (collections)
    └─── M009 (seo) ←─── M002 (categories)

M015 (analytics) — 独立模块，无依赖
```

### 开发阶段
| 阶段 | 版本 | 模块 | 说明 |
|------|------|------|------|
| Phase 0 | v0.1.0 | - | 项目初始化 ✓ |
| Phase 0.1 | v0.1.1 | - | 文档规范增强 ✓ |
| Phase 0.2 | v0.2.0 | M000 | 数据库基础 ✓ |
| Phase 1 | v0.3.0 | M001 | 游戏 API ✓ |
| Phase 2 | v0.3.x | M002, M004, M005 | 核心基础模块 |
| Phase 3 | v0.4.x | M003, M007, M008, M006, M010, M011, M014 | 核心功能 |
| Phase 4 | v0.5.x | M012, M013, M009 | 社区功能 + SEO |
| Phase 5 | v0.6.x | M015 | 数据分析 |

---

## 模块详情

### M000 — database-foundation（数据库基础）
- **描述**：PostgreSQL 数据库核心表设计，包含 games、categories、tags、screenshots、download_providers、download_resources、admins、settings 共 9 张表
- **状态**：completed
- **版本**：0.2.0
- **后端目录**：`backend/models/`, `backend/alembic/versions/`
- **数据表**：`games`, `categories`, `tags`, `game_tags`, `screenshots`, `download_providers`, `download_resources`, `admins`, `settings`

### M001 — games（游戏条目管理）
- **描述**：游戏条目的创建、读取、更新、浏览和搜索 API
- **状态**：completed
- **版本**：0.3.0
- **后端目录**：`backend/models/game.py`, `backend/repositories/game_repository.py`, `backend/services/game_service.py`, `backend/api/v1/endpoints/games.py`, `backend/schemas/game.py`
- **前端目录**：`frontend/src/features/games/`（待开发）
- **数据表**：`games`, `game_tags`, `screenshots`
- **接口**：
  - `GET /api/v1/games` — 游戏列表（分页 + 筛选 + 搜索 + 排序）
  - `GET /api/v1/games/{slug}` — 游戏详情
  - `POST /api/v1/admin/games` — 创建游戏
  - `PUT /api/v1/admin/games/{id}` — 更新游戏
  - `DELETE /api/v1/admin/games/{id}` — 软删除

### M002 — categories（分类系统）
- **描述**：游戏分类的层级分类体系
- **状态**：planned
- **后端目录**：`backend/models/`, `backend/services/category_service.py`
- **前端目录**：`frontend/src/features/categories/`
- **数据表**：`categories`

### M003 — resources（资源文件）
- **描述**：可下载的游戏资源文件，关联到游戏条目
- **状态**：planned
- **依赖**：M001 (games)
- **数据表**：`download_resources`

### M004 — users（用户系统）
- **描述**：用户注册、个人资料、角色和权限
- **状态**：planned
- **数据表**：`users`, `user_profiles`, `roles`, `permissions`

### M005 — auth（认证授权）
- **描述**：JWT 认证、登录、注册、Token 刷新
- **状态**：planned
- **依赖**：M004 (users)
- **数据表**：`refresh_tokens`

### M006 — search（全文搜索）
- **描述**：基于 PostgreSQL pg_trgm 的全文搜索
- **状态**：planned
- **版本**：0.2.0
- **依赖**：M001 (games)

### M007 — upload（文件上传）
- **描述**：文件上传到 MinIO，含格式和大小验证
- **状态**：planned
- **依赖**：M003 (resources)

### M008 — download（文件下载）
- **描述**：带速率限制的文件下载和追踪
- **状态**：planned
- **依赖**：M003 (resources), M005 (auth)

### M009 — seo（搜索引擎优化）
- **描述**：Sitemap、Meta 标签、结构化数据、SSR 优化
- **状态**：planned
- **版本**：0.3.0
- **依赖**：M001 (games), M002 (categories)

### M010 — comments（评论系统）
- **描述**：嵌套评论，含审核机制
- **状态**：planned
- **版本**：0.2.0
- **依赖**：M004 (users), M001 (games)

### M011 — ratings（评分系统）
- **描述**：游戏星级评分和评价
- **状态**：planned
- **版本**：0.2.0
- **依赖**：M004 (users), M001 (games)

### M012 — collections（收藏合集）
- **描述**：用户创建的游戏收藏合集
- **状态**：planned
- **版本**：0.3.0
- **依赖**：M004 (users), M001 (games)

### M013 — notifications（通知系统）
- **描述**：站内通知和邮件通知
- **状态**：planned
- **版本**：0.3.0
- **依赖**：M004 (users)

### M014 — admin（管理后台）
- **描述**：管理员审核和管理面板
- **状态**：planned
- **版本**：0.2.0
- **依赖**：M005 (auth)
- **数据表**：`admins`

### M015 — analytics（数据分析）
- **描述**：下载统计、用户分析、流量监控
- **状态**：planned
- **版本**：0.4.0

---

## 状态说明
| 状态 | 含义 |
|------|------|
| planned | 已规划，尚未开始 |
| in_progress | 开发中 |
| completed | 已完成 |
| blocked | 被阻塞（需注明原因） |
| deprecated | 已废弃 |
| frozen | 已冻结（暂停开发，目录保留） |

---

## Review 状态说明
| 状态 | 含义 |
|------|------|
| - | 尚未开始，无需 Review |
| pending | 待 Review |
| approved | Review 通过 |
| changes_requested | 需要修改 |
| blocked | Review 阻塞 |

---

## 冻结说明

当模块因外部原因需要暂停开发时，标记为冻结：
- 冻结的模块目录和代码保留
- 不得在冻结期间修改冻结模块
- 解冻需在 DECISIONS.md 中记录原因
- 目前无冻结模块

---

*最后更新：2026-07-15 | v0.3.0*
