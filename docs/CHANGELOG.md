# CHANGELOG.md — 变更日志

本文件遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 格式。


## [0.5.0] — 2026-07-16

### Added
- M008 Download API: 下载资源管理完整后端 API
  - 公开接口：`GET /api/v1/games/{slug}/downloads` — 游戏下载资源列表（仅返回启用状态数据，含游戏名称、渠道名称、下载地址、提取码、排序）
  - 下载资源管理：`GET/POST/PUT/DELETE /api/v1/admin/downloads` — CRUD（分页 + 按游戏筛选）
  - 下载渠道管理：`GET/POST/PUT/DELETE /api/v1/admin/download-providers` — CRUD
- `backend/schemas/download_provider.py` — DownloadProviderResponse, DownloadProviderCreate, DownloadProviderUpdate
- `backend/schemas/download_resource.py` — DownloadProviderBrief, DownloadResourceResponse, DownloadResourceCreate, DownloadResourceUpdate
- `backend/repositories/download_provider_repository.py` — DownloadProviderRepository（CRUD、Slug/名称唯一性、列表、软删除）
- `backend/repositories/download_resource_repository.py` — DownloadResourceRepository（CRUD、按游戏查询、分页、仅启用过滤、存在性校验）
- `backend/services/download_provider_service.py` — DownloadProviderService（Slug 生成、名称唯一性、部分更新）
- `backend/services/download_resource_service.py` — DownloadResourceService（游戏/渠道存在性校验、状态验证）
- `backend/api/v1/endpoints/download_providers.py` — 管理路由（CRUD）
- `backend/api/v1/endpoints/download_resources.py` — 公开路由 + 管理路由
- `docs/API.md` — 新增 Download API 章节

### Changed
- `backend/core/config.py` VERSION 更新为 0.5.0
- `backend/api/v1/router.py` 引入 download_providers 和 download_resources 路由
- `backend/schemas/__init__.py` 导出 download_provider 和 download_resource schemas
- `backend/repositories/__init__.py` 导出 DownloadProviderRepository 和 DownloadResourceRepository
- `backend/services/__init__.py` 导出 DownloadProviderService 和 DownloadResourceService
- `backend/api/v1/endpoints/__init__.py` 导入 download_providers 和 download_resources
- `docs/MODULES.md` M008 状态更新为 completed，新增详细模块说明
- `docs/PROJECT.md` 版本更新、模块进度更新
- `docs/DEVELOPMENT_STATUS.md` 进度更新

### Security
- 管理接口暂无权限守卫（v0.5.0），后续 M005 auth 模块将添加

---

## [0.4.0] — 2026-07-15

### Added
- M002 Category API: 分类系统完整后端 API
  - `GET /api/v1/categories` — 分类树（无限级嵌套，含 game_count）
  - `GET /api/v1/categories/{slug}` — 分类详情（含 game_count）
  - `POST /api/v1/admin/categories` — 创建分类（自动 Slug 生成、名称唯一性校验）
  - `PUT /api/v1/admin/categories/{id}` — 更新分类（部分更新语义、禁止自引用）
  - `DELETE /api/v1/admin/categories/{id}` — 软删除（子分类自动置顶）
- Tag API: 标签系统完整后端 API
  - `GET /api/v1/tags` — 标签列表（分页 + 关键词搜索 + game_count）
  - `GET /api/v1/tags/{slug}` — 标签详情（含 game_count）
  - `POST /api/v1/admin/tags` — 创建标签（自动 Slug 生成、名称唯一性校验）
  - `PUT /api/v1/admin/tags/{id}` — 更新标签（部分更新语义）
  - `DELETE /api/v1/admin/tags/{id}` — 软删除（关联 game_tags 级联删除）
- `backend/schemas/category.py` — CategoryTreeNode, CategoryDetailResponse, CategoryCreate, CategoryUpdate
- `backend/schemas/tag.py` — TagResponse, TagCreate, TagUpdate
- `backend/repositories/category_repository.py` — CategoryRepository（树查询、Slug/名称唯一性检查、game_count 统计）
- `backend/repositories/tag_repository.py` — TagRepository（分页、搜索、game_count 统计）
- `backend/services/category_service.py` — CategoryService（树构建、Slug 自动生成、名称唯一性、循环引用防护）
- `backend/services/tag_service.py` — TagService（Slug 自动生成、名称唯一性）
- `backend/api/v1/endpoints/categories.py` — 公开路由 + 管理路由
- `backend/api/v1/endpoints/tags.py` — 公开路由 + 管理路由
- `backend/utils/slug.py` — 共享 Slug 生成工具（pinyin_slug）
- `docs/API.md` — 新增 Category API 和 Tag API 章节

### Changed
- `backend/core/config.py` VERSION 更新为 0.4.0
- `backend/api/v1/router.py` 引入 categories 和 tags 路由
- `backend/schemas/__init__.py` 导出 category 和 tag schemas
- `backend/repositories/__init__.py` 导出 CategoryRepository 和 TagRepository
- `backend/services/__init__.py` 导出 CategoryService 和 TagService
- `backend/api/v1/endpoints/__init__.py` 导入 categories 和 tags
- `docs/MODULES.md` M002 状态更新为 completed
- `docs/PROJECT.md` 版本更新
- `docs/DEVELOPMENT_STATUS.md` 进度更新

### Security
- 管理接口暂无权限守卫（v0.4.0），后续 M005 auth 模块将添加

---

## [0.3.0] — 2026-07-15

### Added
- M001 Game API: 游戏模块完整后端 API
  - `GET /api/v1/games` — 游戏列表，支持分页、分类/标签筛选、关键词搜索、多字段排序
  - `GET /api/v1/games/{slug}` — 游戏详情（含分类、标签、截图、可用下载资源）
  - `POST /api/v1/admin/games` — 创建游戏（Slug 自动生成/支持中文标题）
  - `PUT /api/v1/admin/games/{id}` — 更新游戏（部分更新语义）
  - `DELETE /api/v1/admin/games/{id}` — 软删除游戏
- `backend/models/game.py` — Game 模型新增 `category_id` FK 字段
- `backend/models/category.py` — Category 模型新增 `games` 反向关系
- `backend/schemas/game.py` — GameCreate, GameUpdate, GameDetailResponse, GameListItem, GameListParams
- `backend/repositories/game_repository.py` — GameRepository（async CRUD + 分页 + 筛选 + 搜索）
- `backend/services/game_service.py` — GameService（Slug 生成、业务逻辑）
- `backend/api/v1/endpoints/games.py` — 公开路由 + 管理路由
- `backend/alembic/versions/2026_07_15_0002-add_category_id_to_games.py` — 数据库迁移
- `docs/API.md` — 新增 Game API 章节
- `docs/MODULES.md` — M001 状态更新为 completed

### Changed
- `backend/core/config.py` VERSION 更新为 0.3.0
- `backend/api/v1/router.py` 重构为包含 games 路由
- `backend/schemas/__init__.py` 导出 game schemas
- `backend/repositories/__init__.py` 导出 GameRepository
- `backend/services/__init__.py` 导出 GameService

### Security
- 管理接口暂无权限守卫（v0.3.0），后续 M005 auth 模块将添加

---

## [0.2.0] — 2026-07-15

### Added
- Database Foundation: 9 张核心数据表 SQLAlchemy ORM 模型
  - `games` — 游戏条目（标题、Slug、封面、SEO、浏览量/下载量、状态）
  - `categories` — 层级分类（支持自引用父分类）
  - `tags` — 标签
  - `game_tags` — 游戏标签多对多关联
  - `screenshots` — 游戏截图（支持排序）
  - `download_providers` — 下载渠道（百度网盘、夸克网盘等 8 个预设渠道）
  - `download_resources` — 下载资源（关联游戏与渠道，支持提取码、优先级、状态）
  - `admins` — 后台管理员
  - `settings` — 系统配置键值存储
- `backend/models/base.py` — 共享基类（UUID PK、created_at/updated_at、软删除）
- Alembic Migration: `2026_07_15_0001-add_core_tables.py`
- 下载渠道种子数据（8 个常见网盘渠道）
- 部分索引优化（`deleted_at IS NULL` 条件索引）
- ER 图和关系说明文档 (DATABASE.md)

### Changed
- `backend/core/config.py` VERSION 更新为 0.2.0
- `backend/alembic/env.py` 启用 models 自动导入
- `backend/models/__init__.py` 导出所有模型
- `docs/DATABASE.md` 重写为完整的数据表设计文档
- `docs/MODULES.md` 新增 M000 database-foundation 模块
- `docs/DEVELOPMENT_STATUS.md` 更新开发状态

### Security
- admins 表密码使用 bcrypt 哈希存储

---

## [0.1.1] — 2026-07-15

### Added
- Documentation Driven Development (DDD) 模式规范
- Context Recovery Rule（上下文恢复规则）
- AI 开发固定流程（7 步流程）
- 模块修改规则（禁止跨模块、禁止修改已完成模块）
- `docs/DEVELOPMENT_STATUS.md` — 开发状态追踪
- `docs/AI_MEMORY.md` — AI 长期记忆
- `docs/templates/MODULE_TEMPLATE.md` — 模块开发统一模板
- `docs/PROMPT_RULES.md` — Prompt 编写规范
- 模块依赖关系图、Review 状态、冻结状态、完成百分比 (MODULES.md)
- 项目开发流程、AI 协作流程、文档索引、上下文恢复指南 (README.md)
- 长期运营原则、AI 开发原则、版本策略、项目生命周期 (PROJECT.md)

### Changed
- AGENTS.md 增加 DDD 规范、Context Recovery Rule、AI 开发流程、模块修改规则
- MODULES.md 增加依赖关系图、开发阶段、Review/冻结状态
- README.md 增加项目开发流程、文档索引、上下文恢复指南
- PROJECT.md 增加 DDD 原则、长期运营原则、版本策略、生命周期

### Security
- 无

---

## [0.1.0] — 2026-07-15

### Added
- 项目初始化：完整目录结构
- Backend FastAPI 骨架：路由、配置、数据库、安全、存储
- Frontend Next.js 骨架：App Router、TailwindCSS、Zustand
- Docker 配置：Frontend/Backend Dockerfile、docker-compose.yml、docker-compose.dev.yml
- Nginx 反向代理配置
- GitHub CI/CD 流水线
- Issue/PR 模板、CODEOWNERS
- 完整文档体系：README, AGENTS.md, PROJECT.md, MODULES.md, ARCHITECTURE.md, ROADMAP.md, API.md, DATABASE.md, SECURITY.md, SEO.md, TESTING.md, CODING_RULES.md, DEPLOY.md, DECISIONS.md, CONTRIBUTING.md, FAQ.md, TODO.md, BUG.md
- 统一 API 响应格式和错误码体系
- 环境变量模板 (.env.example)
- 代码质量工具配置 (ruff, pre-commit, editorconfig)

### Changed
- 无（初始版本）

### Deprecated
- 无

### Removed
- 无

### Fixed
- 无

### Security
- 安全规范文档建立
- JWT 认证骨架
- 安全中间件 (Security Headers)
- 密码哈希策略 (bcrypt)

---

*最后更新：2026-07-16 | v0.5.0*
