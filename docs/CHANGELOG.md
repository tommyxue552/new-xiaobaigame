# CHANGELOG.md — 变更日志

本文件遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 格式。


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

*最后更新：2026-07-15 | v0.1.1*
