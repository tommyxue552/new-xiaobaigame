# SECURITY.md — 安全规范

## 认证与授权

### JWT 策略
- 访问令牌（Access Token）：有效期 30 分钟
- 刷新令牌（Refresh Token）：有效期 7 天
- 密钥使用环境变量，不得硬编码
- Token 在服务端不存储（无状态 JWT）
- 登出时客户端清除 Token

### 密码策略
- 使用 bcrypt 哈希（cost factor ≥ 12）
- 密码最小长度：8 字符
- 密码必须包含：大写字母 + 小写字母 + 数字
- 禁止明文存储密码
- 密码重置 Token 有效期 15 分钟

### RBAC 权限模型
- 角色：`guest`, `user`, `moderator`, `admin`
- 权限：按资源 + 操作定义（如 `games:read`, `games:write`）
- 角色-权限映射在数据库中配置
- API 端点使用依赖注入检查权限

---

## 输入安全

### SQL 注入防护
- 所有数据库查询使用参数化（SQLAlchemy 自动处理）
- 禁止拼接 SQL 字符串
- 原始 SQL 必须使用 `:param` 绑定参数

### XSS 防护
- 用户输入在渲染前必须转义（React 默认转义）
- 富文本内容使用 DOMPurify 清洗
- Content-Security-Policy 头配置
- `X-XSS-Protection: 1; mode=block`

### CSRF 防护
- API 使用 Bearer Token 认证（天然防 CSRF）
- 如使用 Cookie，必须设置 `SameSite=Strict`
- 敏感操作需要二次确认

---

## 上传安全

### 文件验证
- 白名单扩展名：`.zip`, `.rar`, `.7z`, `.tar.gz`, `.tar.xz`, `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- 最大文件大小：100 MB
- MIME 类型检查（不仅依赖扩展名）
- 文件内容魔术字节验证

### 存储安全
- 文件重命名为随机 UUID
- 禁止直接访问原始文件（通过 API 代理下载）
- MinIO bucket 策略：禁止公共读取
- 病毒扫描（预留 ClamAV 集成）

---

## 速率限制

### IP 级别
- 全局：60 次/分钟
- 登录端点：5 次/分钟/IP
- 注册端点：3 次/分钟/IP
- 文件下载：10 次/分钟/用户

### 实现方式
- 使用 Redis 计数器
- 超出限制返回 429 状态码
- 返回 `Retry-After` 头

---

## 日志与审计

### 记录内容
- 登录/登出事件
- 权限变更
- 敏感操作（删除、权限修改）
- 文件上传/下载
- 异常错误

### 不记录内容
- 密码（任何形式）
- Token 完整值（仅记录前 8 位）
- 个人身份信息（脱敏处理）

---

## HTTP 安全头

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

*最后更新：2026-07-15 | v0.1.0*
