# web-xiaobaigame

> 锟斤拷戏锟斤拷源锟斤拷锟斤拷平台 锟斤拷 锟斤拷业锟斤拷全栈锟斤拷目

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.0-informational)]()

---

## 锟斤拷目锟斤拷锟斤拷

`web-xiaobaigame` 锟斤拷一锟斤拷锟斤拷锟斤拷锟斤拷戏锟斤拷液涂锟斤拷锟斤拷叩锟斤拷锟皆达拷锟斤拷锟狡教拷锟斤拷没锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟截革拷锟斤拷锟斤拷戏锟斤拷源锟斤拷锟芥档锟斤拷模锟介、锟斤拷锟竭★拷锟斤拷锟皆等ｏ拷锟斤拷也锟斤拷锟斤拷锟较达拷锟酵凤拷锟斤拷锟皆硷拷锟斤拷锟斤拷源锟斤拷

**锟斤拷锟侥匡拷锟?*锟斤拷锟斤拷业锟斤拷锟杰癸拷锟斤拷支锟斤拷 5~10 锟疥长锟斤拷锟斤拷营锟斤拷

---

## 锟斤拷目锟结构

```
web-xiaobaigame/
锟斤拷锟斤拷锟斤拷 frontend/                # Next.js (App Router) 前锟斤拷
锟斤拷   锟斤拷锟斤拷锟斤拷 src/
锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 app/             # App Router 页锟斤拷
锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 components/      # 通锟斤拷锟斤拷锟?锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 features/        # 锟斤拷锟斤拷模锟斤拷
锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 hooks/           # 锟皆讹拷锟斤拷 Hooks
锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 lib/             # 锟斤拷锟竭匡拷
锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 store/           # Zustand 状态锟斤拷锟斤拷
锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 styles/          # 全锟斤拷锟斤拷式
锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 types/           # TypeScript 锟斤拷锟酵讹拷锟斤拷
锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 utils/           # 锟斤拷锟竭猴拷锟斤拷
锟斤拷   锟斤拷锟斤拷锟斤拷 public/              # 锟斤拷态锟斤拷源
锟斤拷   锟斤拷锟斤拷锟斤拷 tests/               # 前锟剿诧拷锟斤拷
锟斤拷锟斤拷锟斤拷 backend/                 # FastAPI 锟斤拷锟?锟斤拷   锟斤拷锟斤拷锟斤拷 api/                 # API 路锟斤拷
锟斤拷   锟斤拷   锟斤拷锟斤拷锟斤拷 v1/              # v1 锟芥本
锟斤拷   锟斤拷锟斤拷锟斤拷 core/                # 锟斤拷锟斤拷锟斤拷锟斤拷
锟斤拷   锟斤拷锟斤拷锟斤拷 models/              # SQLAlchemy 模锟斤拷
锟斤拷   锟斤拷锟斤拷锟斤拷 schemas/             # Pydantic 模式
锟斤拷   锟斤拷锟斤拷锟斤拷 services/            # 业锟斤拷锟竭硷拷锟斤拷
锟斤拷   锟斤拷锟斤拷锟斤拷 repositories/        # 锟斤拷锟捷凤拷锟绞诧拷
锟斤拷   锟斤拷锟斤拷锟斤拷 middleware/           # 锟叫硷拷锟?锟斤拷   锟斤拷锟斤拷锟斤拷 permissions/         # 权锟睫匡拷锟斤拷
锟斤拷   锟斤拷锟斤拷锟斤拷 tasks/               # Celery 锟斤拷锟斤拷预锟斤拷锟?锟斤拷   锟斤拷锟斤拷锟斤拷 utils/               # 锟斤拷锟竭猴拷锟斤拷
锟斤拷   锟斤拷锟斤拷锟斤拷 alembic/             # 锟斤拷锟捷匡拷迁锟斤拷
锟斤拷   锟斤拷锟斤拷锟斤拷 storage/             # 锟侥硷拷锟芥储
锟斤拷   锟斤拷锟斤拷锟斤拷 tests/               # 锟斤拷瞬锟斤拷锟?锟斤拷锟斤拷锟斤拷 docker/                  # Docker 锟斤拷锟斤拷
锟斤拷锟斤拷锟斤拷 nginx/                   # Nginx 锟斤拷锟斤拷
锟斤拷锟斤拷锟斤拷 database/                # 锟斤拷锟捷匡拷锟绞硷拷锟斤拷疟锟?锟斤拷锟斤拷锟斤拷 docs/                    # 锟斤拷目锟侥碉拷
锟斤拷锟斤拷锟斤拷 scripts/                 # 锟斤拷维锟脚憋拷
锟斤拷锟斤拷锟斤拷 .github/                 # GitHub 锟斤拷锟斤拷
锟斤拷   锟斤拷锟斤拷锟斤拷 workflows/           # CI/CD
锟斤拷   锟斤拷锟斤拷锟斤拷 ISSUE_TEMPLATE/      # Issue 模锟斤拷
锟斤拷锟斤拷锟斤拷 AGENTS.md                # AI 协锟斤拷锟芥范锟斤拷锟斤拷锟斤拷要锟斤拷
锟斤拷锟斤拷锟斤拷 README.md                # 锟斤拷锟侥硷拷
锟斤拷锟斤拷锟斤拷 .env.example             # 锟斤拷锟斤拷锟斤拷锟斤拷模锟斤拷
```

---

## 锟斤拷锟斤拷锟斤拷锟?
### 前锟斤拷锟斤拷锟斤拷

- Docker & Docker Compose
- Node.js 20+
- Python 3.12+
- PostgreSQL 16+

### 锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷Docker Compose锟斤拷

```bash
# 1. 锟斤拷锟狡伙拷锟斤拷锟斤拷锟斤拷
cp .env.example .env

# 2. 锟斤拷锟斤拷锟斤拷蟹锟斤拷锟?docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d

# 3. 锟斤拷锟斤拷锟斤拷锟捷匡拷迁锟斤拷
docker compose exec backend alembic upgrade head

# 4. 锟斤拷锟斤拷
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1/docs
# MinIO Console: http://localhost:9001
```

### 锟斤拷锟截匡拷锟斤拷锟斤拷锟斤拷使锟斤拷 Docker锟斤拷

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

---

## 锟斤拷锟斤拷式

锟斤拷锟?[DEPLOY.md](docs/DEPLOY.md)锟斤拷

```bash
# 锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷
docker compose -f docker/docker-compose.yml up -d
```

---

## 锟斤拷锟斤拷锟芥范

锟斤拷锟斤拷目锟斤拷锟较革拷目锟斤拷锟斤拷娣讹拷锟斤拷锟斤拷胁锟斤拷锟斤拷撸锟斤拷锟斤拷锟?AI 锟斤拷锟街ｏ拷锟斤拷锟斤拷锟斤拷锟截★拷

| 锟侥碉拷 | 锟斤拷锟斤拷 |
|------|------|
| [AGENTS.md](AGENTS.md) | **AI 协锟斤拷锟芥范锟斤拷锟斤拷锟斤拷要锟斤拷锟截讹拷锟斤拷** |
| [CODING_RULES.md](docs/CODING_RULES.md) | 锟斤拷锟斤拷娣?|
| [API.md](docs/API.md) | API 锟接口规范 |
| [DATABASE.md](docs/DATABASE.md) | 锟斤拷锟捷匡拷娣?|
| [TESTING.md](docs/TESTING.md) | 锟斤拷锟皆规范 |
| [SECURITY.md](docs/SECURITY.md) | 锟斤拷全锟芥范 |
| [SEO.md](docs/SEO.md) | SEO 锟芥范 |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | 锟斤拷锟斤拷指锟斤拷 |

---

## 目录说锟斤拷

| 目录 | 说锟斤拷 |
|------|------|
| `frontend/` | Next.js 前锟斤拷应锟矫ｏ拷App Router 锟杰癸拷 |
| `backend/` | FastAPI 锟斤拷锟接︼拷茫锟侥ｏ拷榛?DDD 锟杰癸拷 |
| `docker/` | Dockerfile 锟斤拷 Compose 锟斤拷锟斤拷 |
| `nginx/` | Nginx 锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟?|
| `database/` | 锟斤拷锟捷匡拷锟绞硷拷锟斤拷疟锟?|
| `docs/` | 锟斤拷目锟侥碉拷 |
| `scripts/` | 锟斤拷维锟酵诧拷锟斤拷疟锟?|
| `.github/` | GitHub Actions CI/CD锟斤拷Issue/PR 模锟斤拷 |
| `tests/` | 锟剿碉拷锟剿诧拷锟斤拷 |

---

## 锟芥本说锟斤拷

| 锟芥本 | 锟斤拷锟斤拷 | 说锟斤拷 |
|------|------|------|
| v0.1.1 | 2026-07-15 | 锟侥碉拷锟芥范锟斤拷强锟斤拷DDD 模式锟斤拷AI 锟斤拷锟斤拷锟斤拷锟教★拷模锟斤拷模锟藉、锟斤拷锟斤拷锟侥恢革拷 |
| v0.1.0 | 2026-07-15 | 锟斤拷目锟斤拷始锟斤拷锟斤拷目录锟结构锟斤拷锟斤拷锟斤拷锟杰癸拷锟斤拷锟侥碉拷锟斤拷系 |

锟斤拷锟?[CHANGELOG.md](docs/CHANGELOG.md) 锟斤拷 [ROADMAP.md](docs/ROADMAP.md)锟斤拷

---


## 锟斤拷目锟斤拷锟斤拷锟斤拷锟斤拷

锟斤拷锟斤拷目锟斤拷锟斤拷 **Documentation Driven Development (DDD)** 模式锟斤拷锟斤拷锟叫匡拷锟斤拷锟斤拷锟斤拷锟斤拷循锟斤拷锟斤拷锟斤拷锟教ｏ拷

1. **锟街革拷锟斤拷目锟斤拷锟斤拷锟斤拷** 锟斤拷 锟侥讹拷 AGENTS.md, README.md, PROJECT.md, MODULES.md, ARCHITECTURE.md, DEVELOPMENT_STATUS.md
2. **锟斤拷锟斤拷锟斤拷锟斤拷** 锟斤拷 确锟斤拷锟斤拷锟斤拷锟斤拷锟侥ｏ拷椤拷锟斤拷锟斤拷锟斤拷锟角凤拷锟斤拷锟斤拷
3. **锟斤拷锟斤拷锟斤拷锟?* 锟斤拷 确锟较诧拷锟芥及锟斤拷锟斤拷模锟介、锟斤拷锟斤拷模锟斤拷锟睫革拷
4. **锟斤拷锟缴匡拷锟斤拷锟狡伙拷** 锟斤拷 锟叫筹拷锟斤拷锟斤拷宓ワ拷锟接帮拷旆段э拷锟斤拷锟斤拷锟铰碉拷锟侥碉拷
5. **锟斤拷锟斤拷** 锟斤拷 锟斤拷锟狡伙拷执锟叫ｏ拷同锟斤拷锟斤拷写锟斤拷锟斤拷
6. **锟斤拷锟斤拷锟侥碉拷** 锟斤拷 锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷牡锟?7. **锟斤拷锟斤拷芙锟?* 锟斤拷 锟叫筹拷锟斤拷锟斤拷募锟斤拷锟斤拷锟揭荒ｏ拷榻拷锟?
---

## AI 协锟斤拷锟斤拷锟斤拷

| 锟斤拷色 | 职锟斤拷 |
|------|------|
| **ChatGPT** | 锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷芄锟斤拷锟斤拷锟斤拷锟襟、达拷锟斤拷锟斤拷椤拷牡锟阶达拷锟斤拷锟斤拷锟斤拷锟狡★拷锟斤拷全锟斤拷锟?|
| **Codex** | 锟斤拷锟斤拷实锟街★拷锟皆讹拷锟斤拷锟脚憋拷锟斤拷Docker/CI 锟斤拷锟矫★拷Migration 锟斤拷写锟斤拷锟斤拷目锟斤拷锟街硷拷 |

协锟斤拷锟斤拷锟教ｏ拷ChatGPT 锟斤拷锟斤拷锟狡凤拷锟斤拷 锟斤拷 锟斤拷录锟斤拷 DECISIONS.md 锟斤拷 Codex 实锟斤拷 锟斤拷 ChatGPT Code Review 锟斤拷 Codex 锟睫革拷 锟斤拷 锟较诧拷

---

## 锟芥本锟斤拷锟斤拷

锟斤拷循 [Semantic Versioning](https://semver.org/)锟斤拷

- **MAJOR**锟斤拷锟斤拷锟斤拷锟捷碉拷 API 锟斤拷锟?- **MINOR**锟斤拷锟斤拷锟斤拷锟捷的癸拷锟斤拷锟斤拷锟斤拷
- **PATCH**锟斤拷锟斤拷锟斤拷锟捷碉拷锟斤拷锟斤拷锟睫革拷

锟芥本锟脚硷拷录位锟矫ｏ拷ackend/core/config.py锟斤拷rontend/package.json锟斤拷README.md

---

## 锟侥碉拷锟斤拷锟斤拷

| 锟斤拷锟?| 锟侥碉拷 | 说锟斤拷 |
|------|------|------|
| **协锟斤拷锟芥范** | [AGENTS.md](AGENTS.md) | AI 协锟斤拷锟杰纲ｏ拷锟斤拷锟斤拷要锟斤拷锟截讹拷锟斤拷 |
| **协锟斤拷锟芥范** | [PROMPT_RULES.md](docs/PROMPT_RULES.md) | Prompt 锟斤拷写锟芥范锟斤拷模锟斤拷 |
| **锟斤拷目锟斤拷锟斤拷** | [PROJECT.md](docs/PROJECT.md) | 锟斤拷目锟斤拷位锟斤拷锟斤拷锟斤拷栈锟斤拷锟杰癸拷 |
| **锟斤拷目锟斤拷锟斤拷** | [MODULES.md](docs/MODULES.md) | 模锟斤拷锟藉单锟斤拷状态 |
| **锟斤拷目锟斤拷锟斤拷** | [ARCHITECTURE.md](docs/ARCHITECTURE.md) | 系统锟杰癸拷锟斤拷锟?|
| **锟斤拷目锟斤拷锟斤拷** | [ROADMAP.md](docs/ROADMAP.md) | 锟芥本路锟斤拷图 |
| **锟斤拷目锟斤拷锟斤拷** | [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) | 锟斤拷前锟斤拷锟斤拷状态 |
| **锟斤拷锟斤拷锟芥范** | [CODING_RULES.md](docs/CODING_RULES.md) | 锟斤拷锟斤拷娣?|
| **锟斤拷锟斤拷锟芥范** | [API.md](docs/API.md) | API 锟接口规范 |
| **锟斤拷锟斤拷锟芥范** | [DATABASE.md](docs/DATABASE.md) | 锟斤拷锟捷匡拷娣?|
| **锟斤拷锟斤拷锟芥范** | [TESTING.md](docs/TESTING.md) | 锟斤拷锟皆规范 |
| **锟斤拷锟斤拷锟芥范** | [SECURITY.md](docs/SECURITY.md) | 锟斤拷全锟芥范 |
| **锟斤拷锟斤拷锟芥范** | [SEO.md](docs/SEO.md) | SEO 锟芥范 |
| **锟斤拷锟斤拷锟芥范** | [AI_MEMORY.md](docs/AI_MEMORY.md) | AI 锟斤拷锟节硷拷锟斤拷 |
| **锟斤拷录** | [DECISIONS.md](docs/DECISIONS.md) | 锟杰癸拷锟斤拷锟竭硷拷录 |
| **锟斤拷录** | [CHANGELOG.md](docs/CHANGELOG.md) | 锟斤拷锟斤拷锟街?|
| **锟斤拷录** | [TODO.md](docs/TODO.md) | 锟斤拷锟斤拷锟斤拷锟斤拷 |
| **锟斤拷录** | [BUG.md](docs/BUG.md) | 锟斤拷知锟斤拷锟斤拷 |
| **模锟斤拷** | [MODULE_TEMPLATE.md](docs/templates/MODULE_TEMPLATE.md) | 模锟介开锟斤拷模锟斤拷 |

---

## 锟斤拷慰锟绞家伙拷锟斤拷锟侥ｏ拷锟?
1. 锟侥讹拷 [AGENTS.md](AGENTS.md) 锟斤拷 [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) 锟街革拷锟斤拷锟斤拷锟斤拷
2. 锟斤拷 [MODULES.md](docs/MODULES.md) 锟叫斤拷模锟斤拷状态锟斤拷为 in_progress
3. 锟斤拷锟斤拷 [docs/templates/MODULE_TEMPLATE.md](docs/templates/MODULE_TEMPLATE.md) 锟斤拷模锟斤拷目录
4. 锟斤拷 AI 锟斤拷锟斤拷锟斤拷锟教ｏ拷7 锟斤拷锟斤拷执锟叫匡拷锟斤拷
5. 锟斤拷珊锟斤拷锟斤拷 [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) 锟斤拷 [CHANGELOG.md](docs/CHANGELOG.md)

---

## 锟斤拷位指锟斤拷锟侥匡拷锟斤拷锟斤拷锟?
每锟斤拷锟铰的匡拷锟斤拷锟皆伙拷锟斤拷始时锟斤拷锟斤拷顺锟斤拷锟侥讹拷锟斤拷锟斤拷锟侥碉拷锟斤拷锟缴恢革拷全锟斤拷锟斤拷目锟斤拷锟斤拷锟侥ｏ拷

| 顺锟斤拷 | 锟侥碉拷 | 目锟斤拷 |
|------|------|------|
| 1 | [AGENTS.md](AGENTS.md) | 锟剿斤拷协锟斤拷锟芥范锟酵斤拷止锟斤拷锟斤拷 |
| 2 | [README.md](README.md) | 锟剿斤拷锟斤拷目锟结构锟酵匡拷锟斤拷锟斤拷锟?|
| 3 | [PROJECT.md](docs/PROJECT.md) | 锟剿斤拷锟斤拷目锟斤拷位锟酵碉拷前锟芥本 |
| 4 | [MODULES.md](docs/MODULES.md) | 锟剿斤拷模锟斤拷状态锟斤拷锟斤拷锟斤拷锟斤拷系 |
| 5 | [ARCHITECTURE.md](docs/ARCHITECTURE.md) | 锟剿斤拷系统锟杰癸拷 |
| 6 | [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) | 锟剿解当前锟斤拷锟斤拷锟斤拷锟斤拷 |
| 7 | [AI_MEMORY.md](docs/AI_MEMORY.md) | 锟剿解长锟斤拷约锟斤拷锟酵踩坑撅拷锟斤拷 |

锟斤拷锟斤拷扫锟斤拷锟斤拷锟斤拷锟斤拷目锟斤拷全锟斤拷源锟斤拷锟斤拷锟斤拷锟斤拷挚狻?
---
## License

MIT

