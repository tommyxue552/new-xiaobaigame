# ARCHITECTURE.md — 系统架构

## 整体架构

```
┌─────────────────────────────────────────┐
│              Client (Browser)             │
├─────────────────────────────────────────┤
│              Nginx (Reverse Proxy)        │
├──────────────────┬──────────────────────┤
│   Next.js (SSR)  │   FastAPI (REST API)  │
│   Port: 3000     │   Port: 8000          │
├──────────────────┴──────────────────────┤
│          PostgreSQL  │  Redis  │  MinIO  │
│          Port: 5432  │  Port: 6379 │ :9000│
└─────────────────────────────────────────┘
```

## 前端架构 (Next.js)

```
┌──────────────────────────────────────┐
│           App Router (pages)          │
├──────────────────────────────────────┤
│         Features (业务模块)            │
├──────────────────────────────────────┤
│    Components (通用 UI 组件)           │
├──────────────────────────────────────┤
│  Hooks  │  Store (Zustand)  │  Lib   │
├──────────────────────────────────────┤
│  React Query (服务端状态)  │  Types   │
└──────────────────────────────────────┘
```

**设计原则**：
- App Router 负责路由和页面级数据获取
- Features 目录按业务模块组织，每个 feature 自包含
- Components 目录存放跨模块复用的 UI 组件
- Zustand 仅用于客户端 UI 状态（侧边栏、主题等）
- React Query 管理所有服务端状态（缓存、同步、分页）

## 后端架构 (FastAPI)

```
┌──────────────────────────────────────┐
│       API Router (v1)                 │
│       - Endpoints (资源路由)           │
│       - Dependencies (依赖注入)        │
├──────────────────────────────────────┤
│       Middleware                      │
│       - Security Headers              │
│       - Rate Limiting                 │
│       - Request Timing                │
├──────────────────────────────────────┤
│       Service Layer                   │
│       - Business Logic                │
│       - Validation                    │
│       - Orchestration                 │
├──────────────────────────────────────┤
│       Repository Layer                │
│       - Data Access                   │
│       - Query Building                │
├──────────────────────────────────────┤
│       Infrastructure                  │
│  ┌──────┐ ┌──────┐ ┌──────┐         │
│  │  DB  │ │Redis │ │ S3   │         │
│  └──────┘ └──────┘ └──────┘         │
└──────────────────────────────────────┘
```

**分层职责**：
- **API Layer**：路由定义、请求/响应处理、依赖注入
- **Service Layer**：业务逻辑、事务管理、权限校验
- **Repository Layer**：数据库查询封装、数据访问抽象
- **Infrastructure**：数据库连接、缓存、文件存储

## 数据流

```
用户请求
  → Nginx (反向代理)
    → Next.js SSR (页面渲染)
      → React Query (客户端数据获取)
        → Nginx (/api/* 路由)
          → FastAPI
            → Service Layer
              → Repository Layer
                → PostgreSQL / Redis / MinIO
              ← 数据
            ← 统一响应格式
          ← JSON
        ← 缓存 + 渲染
      ← SSR HTML
    ← 完整页面
  ← 浏览器渲染
```

## 关键技术决策

| 决策 | 原因 | 记录 |
|------|------|------|
| UUID 主键 | 分布式友好、安全性（不暴露记录数） | DECISIONS.md |
| 异步 ORM | 高并发场景、非阻塞 I/O | DECISIONS.md |
| App Router | Next.js 最新路由方案、Server Components | DECISIONS.md |
| MinIO 自托管 | 数据自主可控、S3 兼容 | DECISIONS.md |
| 软删除 | 数据可恢复、审计需求 | DECISIONS.md |

## 扩展性设计

- **水平扩展**：无状态 Backend 和 Frontend 可多实例部署
- **数据库扩展**：读写分离（预留）、连接池
- **缓存策略**：Redis 多层缓存（查询缓存、Session、限流）
- **文件存储**：MinIO 支持集群部署
- **任务队列**：Celery（预留）用于异步任务

---

*最后更新：2026-07-15 | v0.1.0*
