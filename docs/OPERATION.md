# OPERATION.md — 运营运维手册

> 本文档为 web-xiaobaigame 项目的运营运维标准操作流程（SOP），覆盖上线、日常运营、检查、备份、发布和应急处理。

---

## 1. 网站上线流程

### 上线前准备

1. **环境检查**
   - 确认生产服务器已安装 Docker 和 Docker Compose
   - 确认 `.env` 文件中所有环境变量已配置为生产值
   - 确认 PostgreSQL、Redis、MinIO 服务可正常连接
   - 确认 Nginx 配置已指向正确端口

2. **代码审查**
   - 确认所有 PR 已通过 Code Review 并合并到 `develop`
   - 确认 `develop` → `main` 的合并已通过 CI 检查
   - 确认 CHANGELOG.md 已更新至当前版本

3. **数据库**
   - 在生产数据库上执行所有待运行的 Alembic Migration
   - 确认 Migration 执行无错误
   - 执行数据库备份

4. **静态资源**
   - 确认 Frontend 构建成功 (`npm run build` 无错误)
   - 确认所有图片/静态资源文件可访问

5. **安全检查**
   - 确认 DEBUG 模式已关闭
   - 确认 SECRET_KEY 已更换为强密码
   - 确认 JWT_SECRET 已配置
   - 确认 HTTPS 证书已配置（如使用）

### 上线步骤

1. 从 `main` 分支创建 `release/x.x.x` 分支
2. 在 staging 环境验证完整功能
3. 执行数据库备份：`pg_dump -U postgres xiaobaigame > backup_$(date +%Y%m%d_%H%M%S).sql`
4. 拉取最新代码：`git pull origin main`
5. 构建并启动：`docker compose -f docker-compose.yml up -d --build`
6. 执行数据库迁移：`docker compose exec backend alembic upgrade head`
7. 健康检查：`curl http://localhost:8000/api/v1/health`
8. 验证首页可访问：`curl http://localhost:3000`
9. 观察日志：`docker compose logs -f --tail=100`
10. 等待 30 分钟，确认无异常错误
11. 在 GitHub 上创建 Release Tag

### 上线后验证

- [ ] 首页正常加载
- [ ] 游戏列表和详情页正常
- [ ] 分类和标签页面正常
- [ ] 下载跳转功能正常
- [ ] 管理后台可登录
- [ ] API 返回正常
- [ ] Sitemap 可访问

---

## 2. 每日运营流程

### 每日检查清单

| 时间 | 项目 | 说明 |
|------|------|------|
| 09:00 | 服务器状态检查 | 检查 CPU、内存、磁盘使用率 |
| 09:00 | 服务运行检查 | 确认 Docker 容器全部运行 |
| 09:30 | 数据采集 | 采集当日新游戏资源 |
| 10:00 | 内容审核 | 审核待发布的游戏条目 |
| 10:00 | 死链检查 | 检查下载链接是否有效 |
| 14:00 | 内容发布 | 发布审核通过的游戏资源 |
| 14:30 | 备份检查 | 确认自动备份正常执行 |
| 15:00 | SEO 检查 | 检查收录和排名变化 |
| 17:00 | 日报 | 记录当日运营数据和异常 |

### 每日检查命令

```bash
# 服务状态
docker compose ps

# 磁盘使用率
df -h

# 内存使用
free -m

# 最近错误日志
docker compose logs backend --tail=50 | grep -i error

# API 健康检查
curl -s http://localhost:8000/api/v1/health
```

---

## 3. 每日采集流程

### 采集来源

1. 游戏社区论坛（如 3DM、游民星空、Nexus Mods 等）
2. GitHub 开源游戏项目
3. Steam、itch.io 等平台
4. 其他游戏资源分享站点

### 采集步骤

1. **发现资源**：从上述来源发现新游戏或更新
2. **信息整理**：收集游戏名称、简介、截图、分类、标签
3. **资源下载**：将资源文件下载到本地中转服务器
4. **上传至网盘**：
   - 百度网盘：使用官方客户端上传
   - 夸克网盘：使用官方客户端上传
   - 其他网盘：按优先级上传
5. **获取分享链接**：生成分享链接和提取码
6. **创建条目**：在管理后台创建游戏条目
7. **关联资源**：添加下载资源和渠道信息
8. **质量检查**：验证资源文件完整性和可下载性

### 采集规范

- 每个游戏至少提供 2 个下载渠道
- 资源文件命名规范：`{游戏名称}_v{版本号}.{格式}`
- 截图至少 3 张（主图 + 详情 + 界面）
- 标题和简介必须是中文
- 必须标注资源来源

---

## 4. 每日检查流程

### 自动化检查

建议使用 cron 定时任务执行以下脚本：

```bash
#!/bin/bash
# daily_check.sh

echo "=== 每日检查 $(date) ==="

# 1. 服务状态
docker compose ps | grep -v "Up" && echo "[WARN] 有容器未运行"

# 2. 磁盘空间
USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$USAGE" -gt 80 ]; then
    echo "[WARN] 磁盘使用率超过 80%: ${USAGE}%"
fi

# 3. API 响应
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/v1/health)
if [ "$HTTP_CODE" != "200" ]; then
    echo "[ERROR] API 健康检查失败: HTTP $HTTP_CODE"
fi

# 4. 数据库连接
docker compose exec -T db pg_isready -U postgres || echo "[ERROR] 数据库连接失败"

echo "=== 检查完成 ==="
```

### 手动检查项目

| 检查项 | 方法 | 预期结果 |
|--------|------|----------|
| 首页访问 | 浏览器打开网站 | 正常加载，无 5xx 错误 |
| 游戏列表 | 点击游戏分类 | 列表正常展示 |
| 游戏详情 | 点击任意游戏 | 详情页正常 |
| 下载跳转 | 点击下载按钮 | 跳转/二维码正常 |
| 管理后台 | 登录后台 | 可正常操作 |
| 搜索功能 | 输入关键词 | 搜索结果正常 |
| 响应速度 | 开发者工具 Network 面板 | 首屏 < 2s |

---

## 5. SEO 检查流程

### 每日 SEO 检查

1. **Google Search Console**
   - 检查是否有新的收录问题
   - 检查核心网页指标（Core Web Vitals）
   - 查看搜索流量变化

2. **百度站长平台**
   - 检查站点收录情况
   - 查看索引量变化
   - 检查死链提交状态

3. **Bing Webmaster Tools**
   - 检查收录和索引状态
   - 查看 SEO 报告

### 每周 SEO 检查

1. **Sitemap 检查**
   ```bash
   # 验证 sitemap 可访问
   curl -s https://yourdomain.com/sitemap.xml | head -20
   
   # 检查 sitemap 条目数
   curl -s https://yourdomain.com/sitemap-games.xml | grep -c "<url>"
   ```

2. **robots.txt 检查**
   ```bash
   curl -s https://yourdomain.com/robots.txt
   ```

3. **Meta 标签检查**
   - 抽查 5 个游戏页面，确认 `title`、`description`、`keywords` 标签完整
   - 确认 OpenGraph 标签正确
   - 确认 JSON-LD 结构化数据正确

4. **收录率检查**
   - Google: `site:yourdomain.com`
   - 百度: `site:yourdomain.com`
   - 对比 sitemap 总数，计算收录率

5. **排名监控**
   - 监控核心关键词排名变化
   - 记录 Top 10 关键词在 Google/百度的排名

### SEO 异常处理

| 问题 | 处理方案 |
|------|----------|
| 收录下降 | 检查 robots.txt 是否误屏蔽、sitemap 是否过期 |
| 排名下降 | 检查内容质量、竞品变化、算法更新 |
| 死链增加 | 执行死链检查流程，提交搜索引擎 |
| 页面速度变慢 | 检查图片大小、CDN 状态、服务器负载 |

---

## 6. 图片检查流程

### 每日图片检查

1. **加载检查**
   - 抽查首页游戏卡片封面是否正常显示
   - 抽查游戏详情页截图是否正常显示

2. **404 图片检测**
   ```bash
   # 扫描 Nginx 日志中的 404 图片请求
   grep " 404 " /var/log/nginx/access.log | grep -E "\.(png|jpg|jpeg|gif|webp)"
   ```

### 每周图片优化

1. **图片大小检查**
   - 检查是否有封面图片超过 500KB
   - 超过限制的图片进行压缩

2. **图片格式检查**
   - 优先使用 WebP 格式
   - 确保有 fallback 格式

3. **CDN 状态检查**（如使用 CDN）
   - 确认图片通过 CDN 正常加载
   - 检查 CDN 缓存命中率

### 图片规范

- 封面图：800x450 (16:9)，WebP 格式，< 300KB
- 截图：1920x1080，WebP 格式，< 500KB
- 图标/Logo：SVG 或 PNG，< 50KB

---

## 7. 死链检查流程

### 自动死链检查

建议每日自动执行死链扫描：

```bash
#!/bin/bash
# dead_link_check.sh

# 检查下载资源链接
docker compose exec -T backend python -c "
from app.core.database import async_session
from app.models.download_resource import DownloadResource
from sqlalchemy import select
import asyncio
import httpx

async def check_links():
    async with async_session() as db:
        result = await db.execute(
            select(DownloadResource).where(DownloadResource.deleted_at.is_(None))
        )
        resources = result.scalars().all()
        
        async with httpx.AsyncClient(timeout=10) as client:
            for r in resources:
                try:
                    resp = await client.head(r.download_url, follow_redirects=True)
                    if resp.status_code >= 400:
                        print(f'[DEAD] {r.id}: {r.download_url} => {resp.status_code}')
                except Exception as e:
                    print(f'[ERROR] {r.id}: {r.download_url} => {str(e)}')

asyncio.run(check_links())
"
```

### 手动死链检查

1. 在管理后台查看下载资源列表
2. 按状态筛选，查看 `expired` 和 `disabled` 的资源
3. 手动抽样检查 `active` 状态的链接
4. 发现失效链接立即标记为 `expired`

### 死链处理

| 情况 | 处理方式 |
|------|----------|
| 链接临时失效 | 标记为 `disabled`，尝试更新链接 |
| 链接永久失效 | 标记为 `expired`，寻找替代资源 |
| 网盘分享被取消 | 重新生成分享链接，更新提取码 |
| 网盘账号异常 | 切换到备用网盘渠道 |

---

## 8. 数据库备份流程

### 自动备份

建议配置每日自动备份 cron 任务：

```bash
#!/bin/bash
# db_backup.sh

BACKUP_DIR="/backups/database"
DB_NAME="xiaobaigame"
DB_USER="postgres"
RETENTION_DAYS=30

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

# 执行备份
docker compose exec -T db pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_FILE"

# 验证备份
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    echo "[OK] 备份成功: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
else
    echo "[ERROR] 备份失败"
    exit 1
fi

# 清理旧备份
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[OK] 已清理 ${RETENTION_DAYS} 天前的备份"
```

### 备份策略

| 类型 | 频率 | 保留时间 |
|------|------|----------|
| 全量备份 | 每日 | 30 天 |
| 周备份 | 每周 | 12 周 |
| 月备份 | 每月 | 12 月 |
| 版本发布前 | 每次发布 | 永久 |

### 备份恢复

```bash
#!/bin/bash
# db_restore.sh

BACKUP_FILE=$1
DB_NAME="xiaobaigame"
DB_USER="postgres"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "备份文件不存在: $BACKUP_FILE"
    exit 1
fi

# 停止应用（可选）
# docker compose stop backend

# 恢复数据库
gunzip -c "$BACKUP_FILE" | docker compose exec -T db psql -U $DB_USER $DB_NAME

# 启动应用
# docker compose start backend

echo "[OK] 恢复完成"
```

### 备份检查

每周执行一次恢复测试：
1. 在 staging 环境上恢复最近备份
2. 确认数据库结构完整
3. 确认数据完整性（抽查关键表）
4. 确认 Alembic 版本与备份一致

---

## 9. 网盘维护流程

### 网盘渠道管理

当前支持的网盘渠道及维护状态：

| 渠道 | Slug | 优先级 | 维护要求 |
|------|------|--------|----------|
| 百度网盘 | baidu | 0 | 每日检查分享链接有效性 |
| 夸克网盘 | kuake | 1 | 每日检查分享链接有效性 |
| 阿里云盘 | aliyun | 2 | 每周检查分享链接有效性 |
| 123 云盘 | yun123 | 3 | 每周检查分享链接有效性 |
| 蓝奏云 | lanzou | 4 | 每周检查分享链接有效性 |
| 天翼云盘 | tianyi | 5 | 每月检查分享链接有效性 |
| 腾讯微云 | weiyun | 6 | 每月检查分享链接有效性 |
| 其他 | other | 7 | 按需维护 |

### 网盘账号管理

- 每个网盘渠道至少准备 2 个账号（主账号 + 备用账号）
- 账号密码使用密码管理器存储，不记录在代码中
- SVIP/会员续费：提前 7 天提醒
- 账号风控：避免短时间内大量分享操作

### 网盘空间管理

- 每日检查各网盘剩余空间
- 空间不足 20% 时清理旧资源或扩容
- 热门资源保留在至少 2 个不同网盘

### 网盘分享维护

1. **每日检查**：抽查 20 个活跃分享链接的有效性
2. **到期续期**：检查分享链接过期时间，到期前续期
3. **违规处理**：被网盘下架的资源立即标记为 `expired`，重新打包上传

---

## 10. 版本发布流程

### 版本发布决策

- **PATCH (x.x.X)**：Bug 修复、文档更新 → 随时可发布
- **MINOR (x.X.x)**：新功能、新模块 → 积累到一定量后发布
- **MAJOR (X.x.x)**：重大架构变更 → 充分讨论后发布

### 发布步骤

1. **版本号更新**
   - 更新 `backend/core/config.py` 中的 `VERSION`
   - 更新 `frontend/package.json` 中的 `version`
   - 更新 `README.md` 中的版本说明

2. **文档更新**
   - 更新 `CHANGELOG.md`（使用 Keep a Changelog 格式）
   - 更新 `PROJECT.md`
   - 更新 `MODULES.md`（如有模块变更）
   - 更新 `DEVELOPMENT_STATUS.md`
   - 更新 `API.md`（如有 API 变更）
   - 更新 `DATABASE.md`（如有数据库变更）

3. **代码合并**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/x.x.x
   # 更新版本号
   git add .
   git commit -m "chore(release): bump version to x.x.x"
   git push origin release/x.x.x
   ```

4. **创建 PR**
   - 创建 `release/x.x.x` → `main` 的 Pull Request
   - 等待 CI 通过
   - Code Review 通过后合并

5. **生产部署**
   ```bash
   git checkout main
   git pull origin main
   docker compose -f docker-compose.yml up -d --build
   docker compose exec backend alembic upgrade head
   ```

6. **同步 develop**
   ```bash
   git checkout develop
   git merge main
   git push origin develop
   ```

7. **创建 GitHub Release**
   - Tag: `vx.x.x`
   - Release Title: `vx.x.x`
   - Description: 复制 CHANGELOG.md 中对应版本的内容

### 发布后验证

- [ ] 生产环境健康检查通过
- [ ] 首页正常访问
- [ ] API 响应正常
- [ ] 管理后台正常
- [ ] 数据库迁移成功
- [ ] 无新增错误日志
- [ ] SEO 相关页面正常

---

## 11. 上线 Checklist

### 首次上线 Checklist

#### 服务器
- [ ] 操作系统已更新到最新稳定版
- [ ] 防火墙已配置（仅开放 80、443 端口）
- [ ] 时区已设置为 Asia/Shanghai
- [ ] Swap 已配置（>= 2GB）

#### Docker
- [ ] Docker 已安装（最新稳定版）
- [ ] Docker Compose 已安装
- [ ] Docker 启动时自动启动容器

#### 数据库
- [ ] PostgreSQL 16 已安装并运行
- [ ] 数据库用户密码为强密码
- [ ] 远程连接已禁用（仅 localhost）
- [ ] 数据库备份 cron 已配置

#### 应用
- [ ] 所有环境变量已配置
- [ ] SECRET_KEY 已更换
- [ ] JWT_SECRET 已更换
- [ ] DEBUG=false
- [ ] CORS 已限制为实际域名

#### 域名和 HTTPS
- [ ] 域名已解析到服务器 IP
- [ ] SSL 证书已配置（Let's Encrypt 或商业证书）
- [ ] HTTP 自动跳转 HTTPS
- [ ] HSTS 已配置

#### 监控
- [ ] 日志收集已配置
- [ ] 异常告警已配置
- [ ] 服务器监控已配置

### 版本更新上线 Checklist

- [ ] 已在 staging 环境测试通过
- [ ] 数据库迁移已在 staging 验证
- [ ] 数据库已备份
- [ ] CI 所有检查已通过
- [ ] CHANGELOG.md 已更新
- [ ] 版本号已更新（3 处）
- [ ] 文档已同步更新
- [ ] 回滚方案已准备

---

## 12. 故障应急处理流程

### 故障分级

| 级别 | 定义 | 示例 | 响应时间 | 处理方式 |
|------|------|------|----------|----------|
| P0 | 网站完全不可用 | 服务器宕机、500 错误 | 15 分钟内 | 立即处理，通知全员 |
| P1 | 核心功能不可用 | API 全部报错、数据库连接失败 | 30 分钟内 | 立即处理 |
| P2 | 部分功能异常 | 下载链接失效、搜索异常 | 2 小时内 | 排入当日处理 |
| P3 | 轻微异常 | 图片加载失败、页面样式错乱 | 24 小时内 | 排入本周处理 |

### 常见故障处理

#### 网站无法访问

```bash
# 1. 检查 Docker 容器状态
docker compose ps

# 2. 检查 Nginx 状态
docker compose logs nginx --tail=50

# 3. 检查服务器资源
top
df -h
free -m

# 4. 重启服务
docker compose restart
```

#### 数据库连接失败

```bash
# 1. 检查数据库容器
docker compose ps db

# 2. 检查数据库日志
docker compose logs db --tail=50

# 3. 检查连接数
docker compose exec db psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# 4. 重启数据库
docker compose restart db
```

#### API 返回 500 错误

```bash
# 1. 查看 Backend 日志
docker compose logs backend --tail=100 | grep -i error

# 2. 检查数据库迁移状态
docker compose exec backend alembic current

# 3. 重启 Backend
docker compose restart backend
```

#### 磁盘空间不足

```bash
# 1. 检查磁盘使用
df -h

# 2. 清理 Docker 无用镜像和容器
docker system prune -a

# 3. 清理旧日志
find /var/log -name "*.log" -mtime +30 -delete

# 4. 检查 MinIO 数据量
du -sh /data/minio
```

#### SSL 证书过期

```bash
# Certbot 自动续期
certbot renew --dry-run  # 测试
certbot renew             # 执行

# 重启 Nginx
docker compose restart nginx
```

### 回滚流程

当新版本部署后出现严重问题，需立即回滚：

```bash
# 1. 查看最近的 Git Tag
git tag -l | sort -V | tail -5

# 2. 切换到上一个稳定版本
git checkout v{上一个版本号}

# 3. 重新构建和部署
docker compose -f docker-compose.yml up -d --build

# 4. 如果需要回滚数据库
# 先恢复备份（参考第 8 节）
# 然后执行：docker compose exec backend alembic downgrade -1
```

### 应急联系人

| 角色 | 职责 | 联系方式 |
|------|------|----------|
| 开发负责人 | 代码问题 | 待填写 |
| 运维负责人 | 服务器问题 | 待填写 |
| 内容负责人 | 内容审核 | 待填写 |
| 安全负责人 | 安全事件 | 待填写 |

### 故障记录模板

每次故障处理后，在 `docs/BUG.md` 中记录：

```markdown
### [日期] 故障标题

- **级别**：P0 / P1 / P2 / P3
- **发现时间**：YYYY-MM-DD HH:MM
- **恢复时间**：YYYY-MM-DD HH:MM
- **影响范围**：描述影响的功能和用户
- **根本原因**：技术原因分析
- **处理过程**：处理步骤记录
- **预防措施**：避免再次发生的措施
```

---

*最后更新：2026-07-16 | v1.0.2*