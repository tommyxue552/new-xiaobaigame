# AGENTS.md — AI 协作开发规范

> 本文档是 `web-xiaobaigame` 项目最重要的文件。所有 AI 助手（ChatGPT、Codex）和人类开发者都必须严格遵守本文件中的每一条规则。

---

## 1. 项目目标

构建一个**企业级、可长期运营 5~10 年**的游戏资源分享网站。

**核心原则**：企业级、高内聚、低耦合、模块化、DDD（适度）、SOLID、RESTful、可维护、可扩展。

**参考站点**：https://www.gameshare.org（仅参考布局、交互、页面结构。严禁复制任何版权内容、图片、文字、CSS、源代码）。

---

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| Frontend | Next.js (App Router), TypeScript, TailwindCSS, Shadcn UI, React Query, Zustand, React Hook Form, Zod |
| Backend | FastAPI, SQLAlchemy 2.x (async), Alembic, Pydantic v2 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Storage | MinIO (S3-compatible) |
| Queue | Celery（预留） |
| Deploy | Docker, Docker Compose, Nginx |
| CI | GitHub Actions |

---

## 3. AI 协作分工

### ChatGPT 负责
- 需求分析与拆解
- 架构设计评审
- 代码审查（Code Review）
- 文档撰写与维护
- 测试用例设计
- 安全审计
- SEO 策略
- 疑难问题调试

### Codex 负责
- 代码实现（根据 ChatGPT 的设计方案）
- 自动化脚本编写
- Docker / CI 配置
- 数据库 Migration 编写
- 项目初始化和脚手架搭建

### 协作流程
1. ChatGPT 输出设计方案 → 记录到 `DECISIONS.md`
2. Codex 根据方案实现代码
3. ChatGPT 进行 Code Review
4. Codex 根据 Review 修改
5. 合并到 develop 分支

---

## 4. 开发纪律

### 4.1 绝对禁止
- ❌ 提前开发后续版本的计划模块
- ❌ 自行删除任何已有文件
- ❌ 跨模块修改代码（修改模块 A 时必须只动模块 A 的文件）
- ❌ 删除或破坏已有功能
- ❌ 修改已执行的 Migration 文件
- ❌ 跳过文档更新直接提交代码
- ❌ 复制参考站点的任何版权内容、图片、文字、CSS、源代码

### 4.2 强制要求
- ✅ 所有代码必须可维护、可扩展
- ✅ 所有目录必须预留扩展能力
- ✅ 新增功能必须同步更新文档
- ✅ 数据库变更必须写 Migration
- ✅ 新增模块必须在 MODULES.md 中登记
- ✅ 设计冲突时优先保证可维护性，并在 DECISIONS.md 中记录原因

---

## 5. 文档维护要求

新增功能后，必须同步更新以下文档（按相关性）：

| 变更类型 | 必须更新的文档 |
|----------|---------------|
| 任何代码变更 | CHANGELOG.md |
| 新增模块/功能 | README.md, PROJECT.md, MODULES.md |
| API 变更 | API.md |
| 数据库变更 | DATABASE.md + Migration |
| 架构变更 | ARCHITECTURE.md, DECISIONS.md |
| 计划变更 | ROADMAP.md |
| 测试变更 | TESTING.md |

---

## 6. 版本管理

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向后兼容的功能新增
- **PATCH**：向后兼容的问题修复

当前版本：`v0.1.0`（项目初始化阶段，无业务功能）

版本号记录位置：
- `backend/core/config.py` → `VERSION`
- `frontend/package.json` → `version`
- `README.md` → 版本说明

---

## 7. 模块开发流程

1. 在 MODULES.md 中登记模块信息（编号、名称、状态改为 `in_progress`、负责人、依赖）
2. 按模块的开发顺序实现（先实现无依赖模块，再实现有依赖模块）
3. 完成开发后状态改为 `completed`
4. 更新 CHANGELOG.md

---

## 8. 代码审查流程

1. 开发者提交 PR 到 `develop` 分支
2. ChatGPT 进行 Code Review，检查项包括：
   - 是否符合 CODING_RULES.md
   - 是否跨模块修改
   - 是否有充分的测试覆盖
   - 文档是否同步更新
   - 数据库 Migration 是否正确
3. Review 通过后合并

---

## 9. 数据库规范

详见 `DATABASE.md`。

**核心规则**：
- 所有表必须包含 `id`（UUID v4）、`created_at`、`updated_at`
- 使用 `uuid` 作为主键，不使用自增 ID
- 软删除（`deleted_at` 字段），禁止物理删除
- 索引命名：`ix_{table}_{column}`
- 外键命名：`fk_{table}_{column}_{ref_table}`
- 所有变更必须通过 Alembic Migration

---

## 10. Git 规范

### 分支策略
- `main`：生产环境分支，只接受来自 `develop` 和 `hotfix/*` 的合并
- `develop`：开发主分支
- `feature/*`：功能分支，从 `develop` 拉出，完成后合并回 `develop`
- `hotfix/*`：紧急修复分支，从 `main` 拉出
- `release/*`：发布准备分支

Codex 创建的 feature 分支统一使用 `codex/` 前缀。

### Commit 格式
```
<type>(<scope>): <subject>

[body]
```

类型：`feat` | `fix` | `docs` | `style` | `refactor` | `test` | `chore` | `perf` | `ci`

示例：
```
feat(games): add game list endpoint with pagination
fix(auth): resolve token refresh race condition
docs(api): update error code documentation
```

---

## 11. 命名规范

### Python (Backend)
- 文件：`snake_case.py`
- 类：`PascalCase`
- 函数/变量：`snake_case`
- 常量：`UPPER_SNAKE_CASE`
- 私有方法：`_leading_underscore`

### TypeScript (Frontend)
- 文件：`kebab-case.tsx` | `kebab-case.ts`
- 组件：`PascalCase`
- 函数/变量：`camelCase`
- 类型/接口：`PascalCase`
- 常量：`UPPER_SNAKE_CASE`

### 数据库
- 表名：`snake_case` 复数（如 `games`, `game_resources`）
- 列名：`snake_case`
- 迁移文件：`{YYYY}_{MM}_{DD}_{HHMM}-{description}.py`

---

## 12. API 规范

详见 `API.md`。

**核心规则**：
- 统一返回格式：`{"code": 0, "message": "success", "data": {}}`
- RESTful 风格
- 版本化 URL：`/api/v1/`
- 错误码体系见 `backend/schemas/errors.py`
- 所有端点必须通过 Pydantic 验证输入

---

## 13. 日志规范

- 使用 Python `logging` 模块，不使用 `print()`
- 日志级别：DEBUG < INFO < WARNING < ERROR < CRITICAL
- 生产环境最低 INFO 级别
- 敏感信息（密码、Token）不得写入日志

---

## 14. 测试规范

详见 `TESTING.md`。

**核心规则**：
- Backend: pytest + pytest-asyncio，覆盖率目标 ≥80%
- Frontend: Vitest + Playwright
- API 测试使用 httpx AsyncClient
- 每个模块至少包含单元测试 + API 集成测试

---

## 15. 安全规范

详见 `SECURITY.md`。

**核心规则**：
- 所有密码使用 bcrypt 哈希
- JWT 鉴权，token 有过期时间
- RBAC 权限控制
- 输入验证（防 SQL 注入、XSS）
- 文件上传类型和大小限制
- IP 级别的速率限制

---

## 16. 长期运营目标

本项目设计目标为 **5~10 年**的长期运营周期，因此：

- 代码质量和可维护性优先于开发速度
- 架构设计必须考虑未来扩展
- 文档必须保持与代码同步
- 每个决策必须在 DECISIONS.md 中记录原因
- 技术债务必须在 TODO.md 中追踪
- 不做一次性 hack，不做"先上线再重构"

---

*最后更新：2026-07-15 | v0.1.0*
