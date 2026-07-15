# PROJECT.md — 项目总览

## 项目定位

`web-xiaobaigame` 是一个面向游戏玩家和开发者的**游戏资源分享平台**。用户可以浏览、搜索、下载各类游戏资源（存档、模组、工具、攻略等），也可以上传和分享自己的资源。

## 项目目标

- **短期（v0.1 ~ v0.3）**：建立核心功能，包括游戏条目管理、资源上传下载、用户系统
- **中期（v0.4 ~ v0.7）**：完善社区功能，评论、评分、收藏、通知
- **长期（v0.8 ~ v1.0）**：SEO 优化、国际化、商业化准备

## 长期规划

本项目设计为 **5~10 年**运营周期，因此架构设计遵循：

- 模块化、低耦合、高内聚
- 每个模块可独立开发、测试、部署
- 文档和代码同步维护
- 所有设计决策记录在案

## 当前版本

**v0.1.1** — 文档规范增强

- Documentation Driven Development 模式建立
- AI 开发流程标准化（7 步流程）
- 模块开发模板
- 上下文恢复规则
- 项目状态追踪

**无业务功能**。

## 技术栈

| 层级 | 技术选型 | 原因 |
|------|---------|------|
| 前端框架 | Next.js 14 (App Router) | SSR/SSG 支持、SEO 友好、生态成熟 |
| 类型系统 | TypeScript | 类型安全、大型项目必备 |
| CSS 框架 | TailwindCSS + Shadcn UI | 原子化 CSS、组件可定制 |
| 状态管理 | Zustand + React Query | 轻量、服务端状态和客户端状态分离 |
| 表单验证 | React Hook Form + Zod | 性能好、类型安全 |
| 后端框架 | FastAPI | 高性能异步、自动 OpenAPI 文档 |
| ORM | SQLAlchemy 2.x (async) | 成熟的 Python ORM、异步支持 |
| 数据库 | PostgreSQL 16 | 功能丰富、扩展性强 |
| 缓存 | Redis 7 | 高性能、支持多种数据结构 |
| 对象存储 | MinIO (S3) | S3 兼容、可自托管 |
| 容器化 | Docker + Compose | 环境一致性、简化部署 |
| CI/CD | GitHub Actions | 免费、与 GitHub 深度集成 |

## 架构说明

详见 [ARCHITECTURE.md](ARCHITECTURE.md)。

**分层架构**：

```
Frontend (Next.js)
  ↓ HTTP/REST
Backend (FastAPI)
  ├── API Layer (routers, middleware)
  ├── Service Layer (business logic)
  ├── Repository Layer (data access)
  └── Infrastructure (DB, Redis, S3)
```

## 模块说明

详见 [MODULES.md](MODULES.md)。

项目共规划 **15 个模块**，按依赖关系分阶段开发：

| 阶段 | 版本 | 模块 |
|------|------|------|
| Phase 0 | v0.1.0 | 项目初始化（已完成） |
| Phase 0.1 | v0.1.1 | 文档规范增强（当前） |
| Phase 1 | v0.1.2+ | games, categories, users, auth |
| Phase 2 | v0.2.x | resources, upload, download |
| Phase 3 | v0.3.x | search, comments, ratings |
| Phase 4 | v0.4.x | collections, notifications, admin, analytics |

---

## Documentation Driven Development

本项目采用 **Documentation Driven Development (DDD)** 开发模式。

### 核心原则
- 文档是项目的唯一真相来源（Single Source of Truth）
- 所有开发必须先阅读文档，不得根据记忆开发
- 文档与代码同等重要，同步维护
- 新成员通过文档即可恢复全部项目上下文
- 每次对话开始必须从文档中恢复上下文

### 文档体系

| 层级 | 文档 | 作用 |
|------|------|------|
| P0 | AGENTS.md, README.md | 入口和总纲 |
| P1 | PROJECT.md, MODULES.md, ARCHITECTURE.md, DEVELOPMENT_STATUS.md | 项目元信息 |
| P2 | API.md, DATABASE.md, CODING_RULES.md 等 | 领域规范 |
| P3 | AI_MEMORY.md, DECISIONS.md, CHANGELOG.md | 长期记忆和记录 |

---

## 长期运营原则

本项目设计目标为 **5~10 年**的长期运营周期，因此：

- 代码质量和可维护性优先于开发速度
- 架构设计必须考虑未来扩展
- 文档必须保持与代码同步
- 每个决策必须在 DECISIONS.md 中记录原因
- 技术债务必须在 TODO.md 中追踪
- 不做一次性 hack，不做"先上线再重构"
- 所有模块预留扩展能力
- 数据库使用软删除，保留完整数据历史

---

## AI 开发原则

### 开发纪律
- 先读文档，再写代码
- 不扫描整个项目，按需读取
- 不跨模块修改
- 不修改已完成模块
- 不修改历史 Migration
- 发现冲突必须兼容处理
- 每次开发遵循 7 步固定流程

### 质量要求
- 所有公共函数必须有类型注解
- 所有数据库变更必须通过 Migration
- 所有 API 端点必须通过 Pydantic 验证
- 测试覆盖率目标 ≥ 80%
- 代码提交前必须通过 lint 检查

---

## 版本策略

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR (X.0.0)**：不兼容的 API 变更、重大架构重构
- **MINOR (0.X.0)**：向后兼容的功能新增、新模块完成
- **PATCH (0.0.X)**：向后兼容的问题修复、文档更新

版本号记录位置：
- `backend/core/config.py` → `VERSION`
- `frontend/package.json` → `version`
- `README.md` → 版本说明
- `docs/CHANGELOG.md` → 变更记录

---

## 项目生命周期

```
Phase 0 (v0.1.x)    项目初始化 + 文档体系 + 基础设施
Phase 1 (v0.1.x)    核心基础模块 (users, auth, categories, games)
Phase 2 (v0.2.x)    核心功能 (resources, upload, download, search)
Phase 3 (v0.3.x)    社区功能 (comments, ratings, collections, notifications)
Phase 4 (v0.4.x)    增强功能 (analytics, admin, SEO)
Phase 5 (v0.5~0.7)  体验优化 + 安全加固 + 社区深化
Phase 6 (v0.8~0.9)  商业化准备 + 稳定性
Phase 7 (v1.0.0)    正式发布
```

每个阶段完成后进入下一阶段，不得提前开发后续阶段模块。

---

*最后更新：2026-07-15 | v0.1.1*