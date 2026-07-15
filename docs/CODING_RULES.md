# CODING_RULES.md — 编码规范

## Python (Backend)

### 风格指南
- 遵循 [PEP 8](https://peps.python.org/pep-0008/)
- 代码格式化使用 **ruff**（等同于 Black + isort + flake8）
- 行长度上限：100 字符
- 字符串引号：双引号

### 文件组织
```python
# 每个模块文件结构
"""Module docstring."""

# 1. 标准库导入
import os
from typing import Optional

# 2. 第三方库导入
from fastapi import APIRouter
from sqlalchemy import select

# 3. 本地导入
from backend.core.config import settings
```

### 类型注解
- 所有公共函数必须有类型注解
- 使用 `|` 语法而非 `Optional[]` 或 `Union[]`（Python 3.10+）
- 使用 Pydantic 进行运行时验证

### 异步编程
- 数据库操作使用 `async/await`
- 避免在异步函数中调用同步阻塞代码
- 使用 `async_session_factory` 管理数据库会话

### 错误处理
- 使用统一的 `AppException` 抛出业务异常
- 不要在 Service 层直接返回 HTTP 响应
- 使用 `APIResponse` 统一包装

### 日志
```python
import logging
logger = logging.getLogger(__name__)
logger.info("Processing game: id=%s", game_id)  # 使用 %s 延迟格式化
```

---

## TypeScript / React (Frontend)

### 风格指南
- 遵循 ESLint + Prettier 配置
- 缩进：2 空格
- 字符串引号：单引号
- 分号：必需

### 组件规范
```tsx
// 1. 导入顺序：React → 第三方 → 本地
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

// 2. 类型定义
interface GameCardProps {
  title: string;
  category: string;
  onSelect?: (id: string) => void;
}

// 3. 组件
export function GameCard({ title, category, onSelect }: GameCardProps) {
  return (
    <div className="rounded-md border p-4">
      <h3>{title}</h3>
      <span className="text-sm text-muted-foreground">{category}</span>
    </div>
  );
}
```

### 状态管理
- **服务端状态**：使用 React Query (`useQuery`, `useMutation`)
- **客户端 UI 状态**：使用 Zustand
- **表单状态**：使用 React Hook Form
- **URL 状态**：使用 Next.js `useSearchParams`

### 文件命名
- 组件文件：`kebab-case.tsx`（文件），导出 `PascalCase`
- 工具函数：`kebab-case.ts`
- 类型定义：`kebab-case.ts` 或 `index.ts`
- Hook 文件：`use-kebab-case.ts`
- 每个目录包含 `index.ts` 作为 barrel export

### 路径别名
- 使用 `@/` 引用 `src/` 目录
- 不使用超过 2 层的相对路径 (`../../`)

---

## 通用规范

### 注释
- 注释解释**为什么**，而不是**做什么**
- 代码本身应该清晰表达做什么
- 复杂算法/业务逻辑必须有注释
- TODO 格式：`// TODO(username): description`

### Git 提交
- 一个 commit 做一件事
- 提交信息使用英文
- 格式：`<type>(<scope>): <description>`

### 代码审查清单
- [ ] 代码遵循本规范
- [ ] 类型注解完整
- [ ] 错误处理充分
- [ ] 没有遗留的调试代码 (`console.log`, `print`)
- [ ] 没有硬编码的敏感信息
- [ ] 数据库查询使用参数化（防 SQL 注入）

---

*最后更新：2026-07-15 | v0.1.0*
