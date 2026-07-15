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

**v0.1.0** — 项目初始化阶段

- 目录结构搭建
- 基础架构代码
- 文档体系建立
- Docker 化配置
- CI/CD 流水线

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
| Phase 1 | v0.1.0 | 项目初始化（当前） |
| Phase 2 | v0.1.x | games, categories, users, auth |
| Phase 3 | v0.2.x | resources, upload, download |
| Phase 4 | v0.3.x | search, comments, ratings |
| Phase 5 | v0.4.x | collections, notifications, admin, analytics |

---

*最后更新：2026-07-15 | v0.1.0*
