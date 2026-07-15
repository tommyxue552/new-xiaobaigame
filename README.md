# web-xiaobaigame

> 游戏资源分享平台 — 企业级全栈项目

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-informational)]()

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
| v0.1.0 | 2026-07-15 | 项目初始化：目录结构、基础架构、文档体系 |

详见 [CHANGELOG.md](docs/CHANGELOG.md) 和 [ROADMAP.md](docs/ROADMAP.md)。

---

## License

MIT
