# web-xiaobaigame

> 游戏资源分享平台 — 企业级全栈项目

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.1-informational)]()

---

## 项目介绍

`web-xiaobaigame` 是一个面向游戏玩家和开发者的资源分享平台。用户可以浏览、搜索、下载各类游戏资源（存档、模组、工具、攻略等），也可以上传和分享自己的资源。

**设计目标**：企业级架构，支持 5~10 年长期运营。

---

## 项目结构

```
web-xiaobaigame/
├── frontend/                # Next.js (App Router) 前端
│   ├── src/
│   │   ├── app/             # App Router 页面
│   │   ├── components/      # 通用组件
│   │   ├── features/        # 功能模块
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── lib/             # 工具库
│   │   ├── store/           # Zustand 状态管理
│   │   ├── styles/          # 全局样式
│   │   ├── types/           # TypeScript 类型定义
│   │   └── utils/           # 工具函数
│   ├── public/              # 静态资源
│   └── tests/               # 前端测试
├── backend/                 # FastAPI 后端
│   ├── api/                 # API 路由
│   │   └── v1/              # v1 版本
│   ├── core/                # 核心配置
│   ├── models/              # SQLAlchemy 模型
│   ├── schemas/             # Pydantic 模式
│   ├── services/            # 业务逻辑层
│   ├── repositories/        # 数据访问层
│   ├── middleware/           # 中间件
│   ├── permissions/         # 权限控制
│   ├── tasks/               # Celery 任务（预留）
│   ├── utils/               # 工具函数
│   ├── alembic/             # 数据库迁移
│   ├── storage/             # 文件存储
│   └── tests/               # 后端测试
├── docker/                  # Docker 配置
├── nginx/                   # Nginx 配置
├── database/                # 数据库初始化脚本
├── docs/                    # 项目文档
├── scripts/                 # 运维脚本
├── .github/                 # GitHub 配置
│   ├── workflows/           # CI/CD
│   └── ISSUE_TEMPLATE/      # Issue 模板
├── AGENTS.md                # AI 协作规范（最重要）
├── README.md                # 本文件
└── .env.example             # 环境变量模板
```

---

## 快速启动

### 前置条件

- Docker & Docker Compose
- Node.js 20+
- Python 3.12+
- PostgreSQL 16+

### 开发环境（Docker Compose）

```bash
# 1. 复制环境变量
cp .env.example .env

# 2. 启动所有服务
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d

# 3. 运行数据库迁移
docker compose exec backend alembic upgrade head

# 4. 访问
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1/docs
# MinIO Console: http://localhost:9001
```

### 本地开发（不使用 Docker）

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

---

## 部署方式

详见 [DEPLOY.md](docs/DEPLOY.md)。

```bash
# 生产环境部署
docker compose -f docker/docker-compose.yml up -d
```

---

## 开发规范

本项目有严格的开发规范，所有参与者（包括 AI 助手）必须遵守。

| 文档 | 内容 |
|------|------|
| [AGENTS.md](AGENTS.md) | **AI 协作规范（最重要，必读）** |
| [CODING_RULES.md](docs/CODING_RULES.md) | 编码规范 |
| [API.md](docs/API.md) | API 接口规范 |
| [DATABASE.md](docs/DATABASE.md) | 数据库规范 |
| [TESTING.md](docs/TESTING.md) | 测试规范 |
| [SECURITY.md](docs/SECURITY.md) | 安全规范 |
| [SEO.md](docs/SEO.md) | SEO 规范 |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | 贡献指南 |

---

## 目录说明

| 目录 | 说明 |
|------|------|
| `frontend/` | Next.js 前端应用，App Router 架构 |
| `backend/` | FastAPI 后端应用，模块化 DDD 架构 |
| `docker/` | Dockerfile 和 Compose 配置 |
| `nginx/` | Nginx 反向代理配置 |
| `database/` | 数据库初始化脚本 |
| `docs/` | 项目文档 |
| `scripts/` | 运维和部署脚本 |
| `.github/` | GitHub Actions CI/CD、Issue/PR 模板 |
| `tests/` | 端到端测试 |

---

## 版本说明

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1.1 | 2026-07-15 | 文档规范增强：DDD 模式、AI 开发流程、模块模板、上下文恢复 |
| v0.1.0 | 2026-07-15 | 项目初始化：目录结构、基础架构、文档体系 |

详见 [CHANGELOG.md](docs/CHANGELOG.md) 和 [ROADMAP.md](docs/ROADMAP.md)。

---


## 项目开发流程

本项目采用 **Documentation Driven Development (DDD)** 模式。所有开发必须遵循以下流程：

1. **恢复项目上下文** — 阅读 AGENTS.md, README.md, PROJECT.md, MODULES.md, ARCHITECTURE.md, DEVELOPMENT_STATUS.md
2. **分析需求** — 确认需求归属模块、检查依赖是否满足
3. **检查依赖** — 确认不涉及冻结模块、不跨模块修改
4. **生成开发计划** — 列出变更清单、影响范围、需更新的文档
5. **开发** — 按计划执行，同步编写测试
6. **更新文档** — 更新所有相关文档
7. **输出总结** — 列出变更文件和下一模块建议

---

## AI 协作流程

| 角色 | 职责 |
|------|------|
| **ChatGPT** | 需求分析、架构设计评审、代码审查、文档撰写、测试设计、安全审计 |
| **Codex** | 代码实现、自动化脚本、Docker/CI 配置、Migration 编写、项目脚手架 |

协作流程：ChatGPT 输出设计方案 → 记录到 DECISIONS.md → Codex 实现 → ChatGPT Code Review → Codex 修改 → 合并

---

## 版本管理

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向后兼容的功能新增
- **PATCH**：向后兼容的问题修复

版本号记录位置：ackend/core/config.py、rontend/package.json、README.md

---

## 文档索引

| 类别 | 文档 | 说明 |
|------|------|------|
| **协作规范** | [AGENTS.md](AGENTS.md) | AI 协作总纲（最重要，必读） |
| **协作规范** | [PROMPT_RULES.md](docs/PROMPT_RULES.md) | Prompt 编写规范和模板 |
| **项目总览** | [PROJECT.md](docs/PROJECT.md) | 项目定位、技术栈、架构 |
| **项目总览** | [MODULES.md](docs/MODULES.md) | 模块清单和状态 |
| **项目总览** | [ARCHITECTURE.md](docs/ARCHITECTURE.md) | 系统架构设计 |
| **项目总览** | [ROADMAP.md](docs/ROADMAP.md) | 版本路线图 |
| **项目总览** | [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) | 当前开发状态 |
| **开发规范** | [CODING_RULES.md](docs/CODING_RULES.md) | 编码规范 |
| **开发规范** | [API.md](docs/API.md) | API 接口规范 |
| **开发规范** | [DATABASE.md](docs/DATABASE.md) | 数据库规范 |
| **开发规范** | [TESTING.md](docs/TESTING.md) | 测试规范 |
| **开发规范** | [SECURITY.md](docs/SECURITY.md) | 安全规范 |
| **开发规范** | [SEO.md](docs/SEO.md) | SEO 规范 |
| **开发规范** | [AI_MEMORY.md](docs/AI_MEMORY.md) | AI 长期记忆 |
| **记录** | [DECISIONS.md](docs/DECISIONS.md) | 架构决策记录 |
| **记录** | [CHANGELOG.md](docs/CHANGELOG.md) | 变更日志 |
| **记录** | [TODO.md](docs/TODO.md) | 待办事项 |
| **记录** | [BUG.md](docs/BUG.md) | 已知问题 |
| **模板** | [MODULE_TEMPLATE.md](docs/templates/MODULE_TEMPLATE.md) | 模块开发模板 |

---

## 如何开始一个新模块

1. 阅读 [AGENTS.md](AGENTS.md) 和 [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) 恢复上下文
2. 在 [MODULES.md](docs/MODULES.md) 中将模块状态改为 in_progress
3. 复制 [docs/templates/MODULE_TEMPLATE.md](docs/templates/MODULE_TEMPLATE.md) 到模块目录
4. 按 AI 开发流程（7 步）执行开发
5. 完成后更新 [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) 和 [CHANGELOG.md](docs/CHANGELOG.md)

---

## 如何恢复项目上下文

每次新的开发对话开始时，按顺序阅读以下文档即可恢复全部项目上下文：

| 顺序 | 文档 | 目的 |
|------|------|------|
| 1 | [AGENTS.md](AGENTS.md) | 了解协作规范和禁止事项 |
| 2 | [README.md](README.md) | 了解项目结构和快速启动 |
| 3 | [PROJECT.md](docs/PROJECT.md) | 了解项目定位和当前版本 |
| 4 | [MODULES.md](docs/MODULES.md) | 了解模块状态和依赖关系 |
| 5 | [ARCHITECTURE.md](docs/ARCHITECTURE.md) | 了解系统架构 |
| 6 | [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) | 了解当前开发进度 |
| 7 | [AI_MEMORY.md](docs/AI_MEMORY.md) | 了解长期约定和踩坑经验 |

无需扫描整个项目、全部源码或整个仓库。

---
## License

MIT
