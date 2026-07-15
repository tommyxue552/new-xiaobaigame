# AI_MEMORY.md — AI 长期记忆

> 本文档记录项目长期有效的重要约定、禁止事项、设计决策和踩坑经验。
> 不记录临时内容。只记录长期有效的信息。
> 每次开发前应阅读本文档以快速对齐项目约定。

---

## 项目重要约定

### 技术约定
- 所有表使用 UUID v4 主键，不使用自增 ID
- 所有删除操作使用软删除（`deleted_at`），禁止物理删除
- 所有表必须包含 `id`（UUID v4）、`created_at`、`updated_at`、`deleted_at`
- 数据库操作使用异步 SQLAlchemy 2.x（`asyncpg` 驱动）
- 文件存储使用 MinIO（S3 兼容），不直接操作本地文件系统
- Frontend 使用 Next.js App Router（非 Pages Router）
- 状态管理：服务端状态用 React Query，客户端 UI 状态用 Zustand

### API 约定
- 统一响应格式：`{"code": 0, "message": "success", "data": {}}`
- URL 版本化：`/api/v1/`
- RESTful 风格，资源名使用复数
- 所有端点通过 Pydantic 验证输入
- JWT Bearer Token 认证，访问令牌 30 分钟，刷新令牌 7 天

### 开发约定
- 先开发无依赖模块，再开发有依赖模块
- 模块开发顺序即为依赖拓扑排序结果
- 每个模块自包含，高内聚低耦合
- 文档驱动开发（DDD）：先读文档，再写代码

---

## 禁止事项

### 绝对禁止
- ❌ 物理删除数据（DROP、TRUNCATE、硬 DELETE）
- ❌ 修改已执行的 Migration 文件
- ❌ 跨模块修改代码
- ❌ 删除已有文件或功能
- ❌ 提前开发后续版本的模块
- ❌ 跳过文档更新直接提交代码
- ❌ 复制参考站点（gameshare.org）的任何版权内容
- ❌ 使用 `print()` 打印日志（使用 `logging` 模块）
- ❌ 硬编码密码、Token、密钥（使用环境变量）
- ❌ 拼接 SQL 字符串（使用参数化查询）

### 禁止操作
- ❌ 物理删除（软删除代替）
- ❌ CASCADE DELETE（软删除代替）
- ❌ 在 URL 中暴露数字 ID（使用 slug）

---

## 设计决策速查

| 决策 | 原因 | 详见 |
|------|------|------|
| UUID v4 主键 | 分布式友好、安全 | DECISIONS.md |
| 异步 ORM | 高并发、非阻塞 I/O | DECISIONS.md |
| MinIO 自托管 | 数据自主可控、S3 兼容 | DECISIONS.md |
| App Router | 最新路由方案、SSR/SSG 友好 | DECISIONS.md |
| 软删除 | 数据可恢复、审计需求 | DECISIONS.md |
| 模块开发顺序 | 先底层后上层、减少阻塞 | DECISIONS.md |

---

## 冻结模块

暂无冻结模块。

---

## 性能经验

> 待项目运行后补充。

---

## SEO 经验

> 待 SEO 模块开发后补充。

---

## 踩坑记录

> 待开发过程中发现并记录。

---

## 安全经验

- 密码使用 bcrypt 哈希（cost factor ≥ 12）
- 文件上传必须验证 MIME 类型和魔术字节（不仅依赖扩展名）
- 文件重命名为随机 UUID 存储
- 用户输入在渲染前必须转义
- Content-Security-Policy 头必须配置

---

## 以后扩展计划

### 预留但未实现
- Celery 任务队列（目录已预留）
- ClamAV 病毒扫描（预留集成）
- 数据库读写分离（预留）
- CDN 集成（预留）
- 国际化 i18n（预留）
- 广告位系统（预留）
- VIP 用户体系（预留）
- 支付集成（预留）

---

*最后更新：2026-07-15 | v0.1.1*
