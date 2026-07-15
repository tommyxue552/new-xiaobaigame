# API.md — API 接口规范

## 基础信息

- **Base URL**：`/api/v1`
- **Content-Type**：`application/json`
- **字符编码**：UTF-8

## 统一响应格式

所有 API 端点必须返回以下格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 成功响应 (code = 0)

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid",
    "name": "Game Name"
  }
}
```

### 列表响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

### 错误响应

```json
{
  "code": 1000,
  "message": "Invalid credentials",
  "data": null
}
```

## 错误码体系

| 范围 | 类别 | 示例 |
|------|------|------|
| 1000-1999 | 认证/授权 | 1000: 认证失败, 1003: 权限不足 |
| 2000-2999 | 验证/业务逻辑 | 2000: 参数验证失败 |
| 3000-3999 | 资源 | 3000: 资源未找到, 3001: 资源冲突 |
| 4000-4999 | 文件/上传 | 4000: 文件过大, 4001: 类型不允许 |
| 5000-5999 | 服务器 | 5000: 内部错误, 5003: 速率限制 |

完整错误码列表见 `backend/schemas/errors.py`。

## RESTful 设计规范

### 资源命名
- 使用复数名词：`/games`, `/categories`, `/users`
- 层级关系：`/games/{game_id}/resources`
- 小写字母，连字符分隔：`/game-resources`

### HTTP 方法

| 方法 | 用途 | 示例 |
|------|------|------|
| GET | 获取资源 | `GET /games` `GET /games/{id}` |
| POST | 创建资源 | `POST /games` |
| PUT | 全量更新 | `PUT /games/{id}` |
| PATCH | 部分更新 | `PATCH /games/{id}` |
| DELETE | 删除（软删除） | `DELETE /games/{id}` |

### 查询参数

```
GET /api/v1/games?page=1&page_size=20&sort_by=created_at&sort_order=desc&category=action
```

### 状态码

| 状态码 | 场景 |
|--------|------|
| 200 | 成功（GET, PUT, PATCH） |
| 201 | 创建成功（POST） |
| 204 | 删除成功（DELETE，无响应体） |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源未找到 |
| 409 | 资源冲突 |
| 422 | 验证失败 |
| 429 | 请求过多 |
| 500 | 服务器内部错误 |

## 认证

- 使用 Bearer Token（JWT）
- Header：`Authorization: Bearer <access_token>`
- 访问令牌过期后使用刷新令牌获取新令牌

## 分页

- 参数：`page`（从 1 开始）、`page_size`（默认 20，最大 100）
- 响应包含：`items`, `total`, `page`, `page_size`, `total_pages`

## 版本管理

- URL 前缀：`/api/v1/`, `/api/v2/`
- 向后兼容：新版 API 不破坏旧版
- 废弃 API 提前 2 个版本通知

---

*最后更新：2026-07-15 | v0.1.0*
