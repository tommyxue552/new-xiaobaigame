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
## 17. Documentation Driven Development（文档驱动开发）

本项目采用 **Documentation Driven Development (DDD)** 模式。

### 核心原则

- 所有开发必须先阅读文档，不得根据记忆开发
- 文档是项目的唯一真相来源（Single Source of Truth）
- 文档与代码同等重要，同步维护
- 新成员（含 AI）通过文档即可恢复全部项目上下文
- 每次对话的开始，必须从文档中恢复上下文，而非依赖历史聊天记录

### 文档层级

| 优先级 | 文档 | 作用 |
|--------|------|------|
| P0 | AGENTS.md | AI 协作总纲，每次必读 |
| P0 | README.md | 项目入口和快速导航 |
| P1 | PROJECT.md | 项目定位和总览 |
| P1 | MODULES.md | 模块清单和状态 |
| P1 | ARCHITECTURE.md | 系统架构 |
| P2 | 当前模块涉及文档 | 按需阅读 |

### 开发前必须阅读的文档

**每次开发前**，至少阅读以下文档：

1. AGENTS.md
2. README.md  
3. PROJECT.md
4. MODULES.md
5. ARCHITECTURE.md
6. 当前模块涉及的相关文档（API.md, DATABASE.md 等）

### Context Recovery Rule（上下文恢复规则）

每次开始开发之前，按以下顺序恢复项目上下文：

1. 阅读 AGENTS.md → 了解协作规范和禁止事项
2. 阅读 README.md → 了解项目结构和快速启动
3. 阅读 PROJECT.md → 了解项目定位和当前版本
4. 阅读 MODULES.md → 了解模块状态和依赖关系
5. 阅读 ARCHITECTURE.md → 了解系统架构
6. 阅读 DEVELOPMENT_STATUS.md → 了解当前开发进度

**禁止行为**：
- ❌ 不要扫描整个项目
- ❌ 不要扫描全部源码
- ❌ 不要一次读取整个仓库
- ❌ 不要依赖 AI 记忆中的历史信息

**如需查看代码**：
- ✅ 只读取当前模块涉及的代码文件
- ✅ 按需读取，精准定位

---

## 18. AI 开发流程

所有 AI 开发必须遵循以下固定流程，不得跳过任何步骤：

### 第一步：恢复项目上下文
- 阅读 P0 和 P1 级文档
- 阅读 DEVELOPMENT_STATUS.md
- 确认当前版本、当前模块、项目状态

### 第二步：分析需求
- 理解用户需求
- 确认需求归属的模块
- 检查模块依赖是否已满足
- 确认是否需要数据库修改 / API 修改 / Migration

### 第三步：检查依赖
- 确认依赖模块已完成
- 确认不涉及冻结模块
- 确认不跨模块修改
- 确认不修改已完成模块

### 第四步：生成开发计划
- 列出具体变更清单
- 预估影响范围
- 确认需要更新的文档
- 如有设计冲突，记录到 DECISIONS.md

### 第五步：开发
- 严格按照开发计划执行
- 遵循 CODING_RULES.md
- 同步编写测试
- 不得提前开发后续模块

### 第六步：更新文档
- 按文档维护要求更新所有相关文档
- 更新 CHANGELOG.md
- 更新 DEVELOPMENT_STATUS.md
- 如需，更新 AI_MEMORY.md

### 第七步：输出总结
- 列出新增文件
- 列出修改文件
- 列出新增规则
- 提供下一模块建议

---

## 19. 模块修改规则

### 禁止修改范围

未经明确要求，**绝对禁止**：
- ❌ 修改其他模块的代码
- ❌ 修改已完成模块的代码
- ❌ 重构整个项目
- ❌ 修改历史 Migration 文件
- ❌ 删除已有文件
- ❌ 删除已有功能

### 冲突处理

如开发过程中发现与已有设计冲突：
- ✅ 必须采用兼容方式处理
- ✅ 必须记录到 DECISIONS.md
- ✅ 优先保证可维护性
- ❌ 不得擅自推翻已有设计决策

### 模块独立性

- 每个模块自包含，高内聚低耦合
- 模块间通过明确的接口交互
- 修改模块 A 时只动模块 A 的文件
- 如需跨模块协调，先在 DECISIONS.md 中记录
---

*最后更新：2026-07-15 | v0.1.1*


## 20. 模块完成自检 (Module Completion Self-Check)

每个模块完成时，必须执行以下检查，全部通过后方可标记模块为 `completed`：

- [ ] TypeScript 编译：`npx tsc --noEmit` 无错误
- [ ] Python 编译：`python -m py_compile` 无错误
- [ ] Import 检查：所有 import 路径正确，无循环引用
- [ ] API 自检：所有端点返回统一格式，HTTP 状态码正确
- [ ] 路由检查：前端路由无冲突，动态路由参数正确
- [ ] 页面检查：页面在所有目标分辨率下渲染正常，无布局错乱
- [ ] 文档同步检查：相关文档已更新
- [ ] 无 Warning：lint/type check 无新增 Warning
- [ ] 无 Error：控制台无 Error 输出

未全部通过，不允许标记模块完成。

---

## 21. 稳定模块保护规则 (Stable Module Protection Rule)

禁止为了优化代码主动修改已经完成且稳定运行的模块。

### 仅允许以下情况修改

1. **修复 Bug**：已确认的缺陷修复
2. **修复安全漏洞**：安全扫描或渗透测试发现的安全问题
3. **新模块依赖**：新模块必须依赖旧模块，并且保持向后兼容

### 除此之外，绝对禁止

- ❌ 重构已完成模块
- ❌ 修改已完成模块的数据库结构
- ❌ 修改已完成模块的 API 接口
- ❌ 修改已完成模块的目录结构
- ❌ 修改已完成模块的文件名
- ❌ 为追求一致性而修改已完成模块的代码风格

### 如需修改

如确需修改已完成模块（超出上述 3 种允许情况），必须：
1. 在 `DECISIONS.md` 中记录修改原因和影响范围
2. 确保向后兼容，不破坏已有功能
3. 更新所有相关文档
4. 修改后执行完整的模块完成自检（第 20 节）

---

## 22. 模块开发完成规则 (Module Completion Rule)

每完成一个模块，必须同步更新以下文档：

| 序号 | 文档 | 更新内容 |
|------|------|----------|
| 1 | `PROJECT.md` | 更新版本号和模块进度 |
| 2 | `MODULES.md` | 更新模块状态为 `completed`，记录完成版本 |
| 3 | `CHANGELOG.md` | 记录本次变更内容（Added / Changed / Fixed） |
| 4 | `DEVELOPMENT_STATUS.md` | 更新开发进度百分比和下一个模块 |
| 5 | `API.md` | 如涉及接口变更，新增或更新 API 章节 |
| 6 | `DATABASE.md` | 如涉及数据库变更，新增或更新数据表说明 |
| 7 | `DEPLOY.md` | 如涉及部署变更，更新部署步骤 |
| 8 | `SEO.md` | 如涉及 SEO 变更，更新 SEO 策略 |

**严禁**：模块标记为 `completed` 后，上述文档未同步更新。

---

## 23. 上下文恢复规则 (Context Recovery Rule — 增强版)

### 每次打开新对话时

Codex 必须按以下规则恢复项目上下文，**不得扫描整个项目**：

#### 必读文档（每次必读）

| 文档 | 用途 |
|------|------|
| `AGENTS.md` | 协作规范和禁止事项 |
| `PROJECT.md` | 项目定位和当前版本 |
| `MODULES.md` | 模块状态和依赖关系 |
| `DEVELOPMENT_STATUS.md` | 当前开发进度 |

#### 按需阅读文档

| 场景 | 需阅读的文档 |
|------|-------------|
| 开发 API 接口 | `API.md` |
| 开发数据库相关 | `DATABASE.md` |
| 开发架构相关 | `ARCHITECTURE.md` |
| 运营相关任务 | `OPERATION.md` |
| 部署相关 | `DEPLOY.md` |
| SEO 相关 | `SEO.md` |

### 禁止行为

- ❌ 不要扫描整个项目目录
- ❌ 不要扫描全部源码文件
- ❌ 不要一次读取整个仓库
- ❌ 不要依赖 AI 记忆中的历史信息
- ❌ 不要跳过文档直接根据记忆开发

### 如需查看代码

- ✅ 只读取当前模块涉及的代码文件
- ✅ 按需读取，精准定位
- ✅ 先读文档确认文件路径，再读代码

---

*最后更新：2026-07-16 | v1.0.2*