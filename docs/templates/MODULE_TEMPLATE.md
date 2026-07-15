# MODULE_TEMPLATE.md — 模块开发模板

> 所有新模块开发必须使用此模板。复制本文件并填入实际内容。

---

## 模块信息

| 项目 | 内容 |
|------|------|
| **模块名称** | [模块名称] |
| **模块编号** | [M0XX] |
| **负责人** | [@username] |
| **版本** | [v0.X.X] |
| **开始时间** | [YYYY-MM-DD] |
| **完成时间** | [YYYY-MM-DD] |
| **状态** | planned / in_progress / completed / blocked |

---

## 依赖模块

| 依赖模块 | 状态 | 备注 |
|----------|------|------|
| [M0XX] [模块名] | completed | [说明] |
| — | — | 无依赖 |

---

## 数据库修改

| 表名 | 操作 | 说明 |
|------|------|------|
| [table_name] | CREATE / ALTER / DROP | [变更说明] |

### Migration 文件
- `alembic/versions/{YYYY}_{MM}_{DD}_{HHMM}-{description}.py`

---

## API 修改

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/resource` | GET/POST/PUT/DELETE | [说明] |

---

## 影响范围

| 层级 | 影响 |
|------|------|
| 前端页面 | [页面路径] |
| 前端组件 | [组件路径] |
| 后端 Service | [service 文件] |
| 后端 Repository | [repository 文件] |
| 数据表 | [表名] |

---

## 测试

| 测试类型 | 覆盖率 | 状态 |
|----------|--------|------|
| 单元测试 | [%] | ✅/❌ |
| API 集成测试 | [%] | ✅/❌ |
| 前端组件测试 | [%] | ✅/❌ |

---

## 风险

| 风险 | 级别 | 应对 |
|------|------|------|
| [风险描述] | High/Medium/Low | [应对方案] |
| 无 | — | — |

---

## 文档更新

| 文档 | 已更新 |
|------|--------|
| CHANGELOG.md | ✅/❌ |
| README.md | ✅/❌ |
| PROJECT.md | ✅/❌ |
| MODULES.md | ✅/❌ |
| API.md | ✅/❌ |
| DATABASE.md | ✅/❌ |
| DEVELOPMENT_STATUS.md | ✅/❌ |
| AI_MEMORY.md | ✅/❌ |

---

## Review

| 项目 | 状态 |
|------|------|
| Code Review | ✅/❌ |
| Review 人 | [@reviewer] |
| Review 日期 | [YYYY-MM-DD] |
| Review 意见 | [意见摘要] |

---

## 备注

[其他需要记录的信息]

---

*模板版本：v1.0 | 最后更新：2026-07-15*
