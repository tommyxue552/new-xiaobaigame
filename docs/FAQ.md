# FAQ.md — 常见问题

## 项目相关

### Q: 这是什么项目？
A: `web-xiaobaigame` 是一个游戏资源分享平台，用户可以浏览、搜索、下载、上传游戏相关资源（存档、模组、工具、攻略等）。

### Q: 当前版本有哪些功能？
A: v0.1.0 是项目初始化阶段，目前**没有任何业务功能**。我们已完成目录结构、基础架构、Docker 配置和文档体系的搭建。

### Q: 什么时候会有可用版本？
A: 预计 v0.2.0 会包含核心功能（游戏浏览、用户注册、资源上传下载）。详见 [ROADMAP.md](ROADMAP.md)。

---

## 技术相关

### Q: 为什么选择 FastAPI 而不是 Django？
A: FastAPI 是异步框架，性能更好，自动生成 OpenAPI 文档，类型安全（Pydantic）。本项目需要高性能和良好的 API 文档。

### Q: 为什么使用 UUID 而不是自增 ID？
A: UUID 在分布式环境下不会冲突，不暴露记录数量，更安全。详见 [DECISIONS.md](DECISIONS.md)。

### Q: 为什么用 MinIO 而不是直接存文件系统？
A: MinIO 兼容 S3 API，支持水平扩展，未来可以无缝迁移到云存储。

### Q: 是否支持国际化 (i18n)？
A: 当前阶段（v0.1.0）为中文。国际化计划在 v0.5.0 阶段实现。

---

## 开发相关

### Q: 如何参与开发？
A: 阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 和 [AGENTS.md](../AGENTS.md)，然后从 TODO.md 中选择任务。

### Q: AI 助手（ChatGPT/Codex）如何分工？
A: ChatGPT 负责设计和审查，Codex 负责实现。详见 [AGENTS.md](../AGENTS.md) 第 3 节。

### Q: 如何运行本地开发环境？
A:
```bash
# 使用 Docker（推荐）
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d

# 或手动启动 Backend + Frontend
# 详见 README.md
```

### Q: 数据库 Migration 怎么做？
A:
```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

---

## 运维相关

### Q: 生产环境如何部署？
A: 详见 [DEPLOY.md](DEPLOY.md)。基本流程：配置 .env → `docker compose up -d` → 配置 HTTPS。

### Q: 如何备份数据？
A: 数据库使用 `pg_dump`，文件使用 MinIO 数据卷备份。建议设置每日自动备份。

---

*最后更新：2026-07-15 | v0.1.0*
