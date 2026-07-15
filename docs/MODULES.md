# MODULES.md — 模块清单

> 本文档记录项目的所有模块及其状态。每个模块必须登记后才能开始开发。

---

## 模块总览

| 编号 | 模块名称 | 状态 | 负责人 | 版本 | 依赖 | 开发顺序 |
|------|---------|------|--------|------|------|---------|
| M001 | games | planned | TBD | 0.1.0 | — | 1 |
| M002 | categories | planned | TBD | 0.1.0 | — | 2 |
| M003 | resources | planned | TBD | 0.1.0 | M001 | 6 |
| M004 | users | planned | TBD | 0.1.0 | — | 3 |
| M005 | auth | planned | TBD | 0.1.0 | M004 | 4 |
| M006 | search | planned | TBD | 0.2.0 | M001 | 9 |
| M007 | upload | planned | TBD | 0.1.0 | M003 | 7 |
| M008 | download | planned | TBD | 0.1.0 | M003, M005 | 8 |
| M009 | seo | planned | TBD | 0.3.0 | M001, M002 | 12 |
| M010 | comments | planned | TBD | 0.2.0 | M004, M001 | 10 |
| M011 | ratings | planned | TBD | 0.2.0 | M004, M001 | 11 |
| M012 | collections | planned | TBD | 0.3.0 | M004, M001 | 13 |
| M013 | notifications | planned | TBD | 0.3.0 | M004 | 14 |
| M014 | admin | planned | TBD | 0.2.0 | M005 | 15 |
| M015 | analytics | planned | TBD | 0.4.0 | — | 16 |

---

## 模块详情

### M001 — games（游戏条目管理）
- **描述**：游戏条目的创建、读取、更新、浏览和搜索
- **状态**：planned
- **后端目录**：`backend/models/`, `backend/services/game_service.py`, `backend/api/v1/endpoints/games.py`
- **前端目录**：`frontend/src/features/games/`
- **数据表**：`games`, `game_metadata`

### M002 — categories（分类系统）
- **描述**：游戏分类的层级分类体系
- **状态**：planned
- **后端目录**：`backend/models/`, `backend/services/category_service.py`
- **前端目录**：`frontend/src/features/categories/`
- **数据表**：`categories`, `game_categories`

### M003 — resources（资源文件）
- **描述**：可下载的游戏资源文件，关联到游戏条目
- **状态**：planned
- **依赖**：M001 (games)
- **数据表**：`resources`, `resource_versions`

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

---

*最后更新：2026-07-15 | v0.1.0*
