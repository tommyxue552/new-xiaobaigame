# TESTING.md — 测试规范

## 测试策略

### 测试金字塔
```
       ┌──────┐
       │ E2E  │  少量：关键用户流程
      ┌┴──────┴┐
      │  API   │  中层：API 集成测试
     ┌┴────────┴┐
     │   单元    │  基础：函数/方法测试
     └──────────┘
```

---

## Backend 测试

### 工具
- **pytest**：测试框架
- **pytest-asyncio**：异步测试支持
- **pytest-cov**：覆盖率报告
- **httpx**：API 测试客户端

### 目录结构
```
backend/tests/
├── conftest.py            # 共享 fixtures
├── unit/                  # 单元测试
│   ├── test_services/
│   └── test_utils/
├── api/                   # API 集成测试
│   └── v1/
│       ├── test_games.py
│       └── test_auth.py
└── factories/             # 测试数据工厂
```

### Fixtures 示例
```python
# conftest.py
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from backend.main import app

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
```

### API 测试示例
```python
async def test_health_check(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
```

### 覆盖率要求
- 整体覆盖率 ≥ 80%
- Service 层 ≥ 90%
- API 端点 100% 覆盖

### 运行命令
```bash
pytest --cov=. --cov-report=html --cov-report=term
```

---

## Frontend 测试

### 工具
- **Vitest**：单元/组件测试
- **Playwright**：E2E 测试
- **@testing-library/react**：组件测试

### 目录结构
```
frontend/tests/
├── unit/                  # 单元测试
│   ├── components/
│   ├── hooks/
│   └── utils/
└── e2e/                   # E2E 测试
    ├── homepage.spec.ts
    └── navigation.spec.ts
```

### 组件测试示例
```tsx
import { render, screen } from "@testing-library/react";
import { GameCard } from "@/features/games/components/game-card";

describe("GameCard", () => {
  it("renders game title", () => {
    render(<GameCard title="Zelda" category="Action" />);
    expect(screen.getByText("Zelda")).toBeInTheDocument();
  });
});
```

### E2E 测试示例
```typescript
import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("xiaobaigame");
});
```

---

## 测试原则

### 必须测试
- ✅ 所有 API 端点的正常和异常情况
- ✅ 所有 Service 层公共方法
- ✅ 关键用户流程 E2E
- ✅ 权限/认证边界
- ✅ 输入验证边界（空值、超长、特殊字符）

### 不需要测试
- ❌ 框架代码（如路由注册本身）
- ❌ 第三方库的内部实现
- ❌ 简单的 getter/setter
- ❌ 配置文件

### 命名规范
- 测试文件：`test_{module_name}.py` / `{name}.spec.ts`
- 测试函数：`test_{what}_{expected_behavior}`
- 描述性命名：看函数名就知道测试什么

---

*最后更新：2026-07-15 | v0.1.0*
