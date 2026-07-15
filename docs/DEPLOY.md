# DEPLOY.md — 部署指南

## 前置条件

- Docker 24+
- Docker Compose v2+
- 域名（生产环境）
- SSL 证书（生产环境）

---

## 开发环境部署

```bash
# 1. 克隆仓库
git clone <repo-url>
cd web-xiaobaigame

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，修改密钥和密码

# 3. 启动服务
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d

# 4. 运行数据库迁移
docker compose exec backend alembic upgrade head

# 5. 验证
# Frontend: http://localhost:3000
# Backend Docs: http://localhost:8000/api/v1/docs
# MinIO Console: http://localhost:9001
```

---

## 生产环境部署

### 1. 服务器准备

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
sudo apt-get install docker-compose-plugin
```

### 2. 项目配置

```bash
git clone <repo-url>
cd web-xiaobaigame

# 配置 .env（生产环境必须修改所有默认值）
cp .env.example .env
```

必须修改的环境变量：
- `JWT_SECRET_KEY`：64 字符随机字符串
- `S3_ACCESS_KEY` / `S3_SECRET_KEY`：MinIO 凭证
- `POSTGRES_PASSWORD`：数据库密码
- `DEBUG=false`

### 3. 启动

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 4. HTTPS 配置

在 `nginx/conf.d/default.conf` 中添加 SSL 配置：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # ... 其余配置同上
}
```

---

## 健康检查

```bash
# Backend
curl http://localhost:8000/api/v1/health

# Frontend
curl http://localhost:3000

# Database
docker compose exec db pg_isready -U postgres

# Redis
docker compose exec redis redis-cli ping
```

---

## 备份策略

### 数据库备份
```bash
docker compose exec db pg_dump -U postgres xiaobaigame > backup_$(date +%Y%m%d).sql
```

### 文件备份
```bash
# MinIO 数据卷备份
docker run --rm -v xiaobaigame_minio_data:/data -v $(pwd):/backup alpine tar czf /backup/minio_backup.tar.gz -C /data .
```

### 定时备份 (crontab)
```
0 2 * * * cd /path/to/project && docker compose exec db pg_dump -U postgres xiaobaigame > backups/backup_$(date +\%Y\%m\%d).sql
```

---

## 更新部署

```bash
git pull
docker compose -f docker/docker-compose.yml build
docker compose -f docker/docker-compose.yml up -d
docker compose exec backend alembic upgrade head
```

---

## 日志查看

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务
docker compose logs -f backend
docker compose logs -f nginx
```

---

*最后更新：2026-07-15 | v0.1.0*
