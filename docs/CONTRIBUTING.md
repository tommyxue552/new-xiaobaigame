# CONTRIBUTING.md — 贡献指南

## 欢迎贡献

感谢你对 `web-xiaobaigame` 项目的关注！

## 行为准则

- 尊重所有贡献者
- 建设性讨论，就事论事
- 接受不同意见，以项目利益为重

## 如何贡献

### 报告 Bug

1. 搜索 [BUG.md](BUG.md) 确认是否已被记录
2. 使用 Bug Report Issue 模板提交
3. 提供详细的复现步骤和环境信息

### 提交功能请求

1. 检查 [ROADMAP.md](ROADMAP.md) 确认是否已在计划中
2. 使用 Feature Request Issue 模板提交
3. 说明功能的价值和使用场景

### 提交代码

1. **阅读 [AGENTS.md](../AGENTS.md)**（最重要）
2. Fork 仓库并从 `develop` 分支创建 feature 分支
3. 遵循 [CODING_RULES.md](CODING_RULES.md) 编码规范
4. 添加测试（见 [TESTING.md](TESTING.md)）
5. 更新相关文档（见 AGENTS.md 第 5 节）
6. 提交 PR 到 `develop` 分支
7. 等待 Code Review

## PR 要求

- [ ] 代码通过 lint 检查
- [ ] 测试全部通过
- [ ] 覆盖率不降低
- [ ] 文档已同步更新
- [ ] 数据库变更包含 Migration
- [ ] 没有跨模块修改
- [ ] PR 描述清晰完整

## 开发环境设置

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pre-commit install

# Frontend
cd frontend
npm install
npm run dev
```

---

*最后更新：2026-07-15 | v0.1.0*
