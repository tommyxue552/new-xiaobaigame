# web-xiaobaigame

> ��Ϸ��Դ����ƽ̨ �� ��ҵ��ȫջ��Ŀ

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.0-informational)]()

---

## ��Ŀ����

`web-xiaobaigame` ��һ��������Ϸ��ҺͿ����ߵ���Դ����ƽ̨���û�������������������ظ�����Ϸ��Դ���浵��ģ�顢���ߡ����Եȣ���Ҳ�����ϴ��ͷ����Լ�����Դ��

**���Ŀ��**����ҵ���ܹ���֧�� 5~10 �곤����Ӫ��

---

## ��Ŀ�ṹ

```
web-xiaobaigame/
������ frontend/                # Next.js (App Router) ǰ��
��   ������ src/
��   ��   ������ app/             # App Router ҳ��
��   ��   ������ components/      # ͨ�����
��   ��   ������ features/        # ����ģ��
��   ��   ������ hooks/           # �Զ��� Hooks
��   ��   ������ lib/             # ���߿�
��   ��   ������ store/           # Zustand ״̬����
��   ��   ������ styles/          # ȫ����ʽ
��   ��   ������ types/           # TypeScript ���Ͷ���
��   ��   ������ utils/           # ���ߺ���
��   ������ public/              # ��̬��Դ
��   ������ tests/               # ǰ�˲���
������ backend/                 # FastAPI ���
��   ������ api/                 # API ·��
��   ��   ������ v1/              # v1 �汾
��   ������ core/                # ��������
��   ������ models/              # SQLAlchemy ģ��
��   ������ schemas/             # Pydantic ģʽ
��   ������ services/            # ҵ���߼���
��   ������ repositories/        # ���ݷ��ʲ�
��   ������ middleware/           # �м��
��   ������ permissions/         # Ȩ�޿���
��   ������ tasks/               # Celery ����Ԥ���
��   ������ utils/               # ���ߺ���
��   ������ alembic/             # ���ݿ�Ǩ��
��   ������ storage/             # �ļ��洢
��   ������ tests/               # ��˲���
������ docker/                  # Docker ����
������ nginx/                   # Nginx ����
������ database/                # ���ݿ��ʼ���ű�
������ docs/                    # ��Ŀ�ĵ�
������ scripts/                 # ��ά�ű�
������ .github/                 # GitHub ����
��   ������ workflows/           # CI/CD
��   ������ ISSUE_TEMPLATE/      # Issue ģ��
������ AGENTS.md                # AI Э���淶������Ҫ��
������ README.md                # ���ļ�
������ .env.example             # ��������ģ��
```

---

## �������

### ǰ������

- Docker & Docker Compose
- Node.js 20+
- Python 3.12+
- PostgreSQL 16+

### ����������Docker Compose��

```bash
# 1. ���ƻ�������
cp .env.example .env

# 2. ������з���
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d

# 3. �������ݿ�Ǩ��
docker compose exec backend alembic upgrade head

# 4. ����
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1/docs
# MinIO Console: http://localhost:9001
```

### ���ؿ�������ʹ�� Docker��

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

## ����ʽ

��� [DEPLOY.md](docs/DEPLOY.md)��

```bash
# ������������
docker compose -f docker/docker-compose.yml up -d
```

---

## �����淶

����Ŀ���ϸ�Ŀ����淶�����в����ߣ����� AI ���֣��������ء�

| �ĵ� | ���� |
|------|------|
| [AGENTS.md](AGENTS.md) | **AI Э���淶������Ҫ���ض���** |
| [CODING_RULES.md](docs/CODING_RULES.md) | ����淶 |
| [API.md](docs/API.md) | API �ӿڹ淶 |
| [DATABASE.md](docs/DATABASE.md) | ���ݿ�淶 |
| [TESTING.md](docs/TESTING.md) | ���Թ淶 |
| [SECURITY.md](docs/SECURITY.md) | ��ȫ�淶 |
| [SEO.md](docs/SEO.md) | SEO �淶 |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | ����ָ�� |

---

## Ŀ¼˵��

| Ŀ¼ | ˵�� |
|------|------|
| `frontend/` | Next.js ǰ��Ӧ�ã�App Router �ܹ� |
| `backend/` | FastAPI ���Ӧ�ã�ģ�黯 DDD �ܹ� |
| `docker/` | Dockerfile �� Compose ���� |
| `nginx/` | Nginx ����������� |
| `database/` | ���ݿ��ʼ���ű� |
| `docs/` | ��Ŀ�ĵ� |
| `scripts/` | ��ά�Ͳ���ű� |
| `.github/` | GitHub Actions CI/CD��Issue/PR ģ�� |
| `tests/` | �˵��˲��� |

---

## �汾˵��

| �汾 | ���� | ˵�� |
|------|------|------|
| v0.1.1 | 2026-07-15 | �ĵ��淶��ǿ��DDD ģʽ��AI �������̡�ģ��ģ�塢�����Ļָ� |
| v0.1.0 | 2026-07-15 | ��Ŀ��ʼ����Ŀ¼�ṹ�������ܹ����ĵ���ϵ |

��� [CHANGELOG.md](docs/CHANGELOG.md) �� [ROADMAP.md](docs/ROADMAP.md)��

---


## ��Ŀ��������

����Ŀ���� **Documentation Driven Development (DDD)** ģʽ�����п���������ѭ�������̣�

1. **�ָ���Ŀ������** �� �Ķ� AGENTS.md, README.md, PROJECT.md, MODULES.md, ARCHITECTURE.md, DEVELOPMENT_STATUS.md
2. **��������** �� ȷ���������ģ�顢��������Ƿ�����
3. **�������** �� ȷ�ϲ��漰����ģ�顢����ģ���޸�
4. **���ɿ����ƻ�** �� �г�����嵥��Ӱ�췶Χ������µ��ĵ�
5. **����** �� ���ƻ�ִ�У�ͬ����д����
6. **�����ĵ�** �� ������������ĵ�
7. **����ܽ�** �� �г�����ļ�����һģ�齨��

---

## AI Э������

| ��ɫ | ְ�� |
|------|------|
| **ChatGPT** | ����������ܹ�������󡢴�����顢�ĵ�׫д��������ơ���ȫ��� |
| **Codex** | ����ʵ�֡��Զ����ű���Docker/CI ���á�Migration ��д����Ŀ���ּ� |

Э�����̣�ChatGPT �����Ʒ��� �� ��¼�� DECISIONS.md �� Codex ʵ�� �� ChatGPT Code Review �� Codex �޸� �� �ϲ�

---

## �汾����

��ѭ [Semantic Versioning](https://semver.org/)��

- **MAJOR**�������ݵ� API ���
- **MINOR**�������ݵĹ�������
- **PATCH**�������ݵ������޸�

�汾�ż�¼λ�ã�ackend/core/config.py��rontend/package.json��README.md

---

## �ĵ�����

| ��� | �ĵ� | ˵�� |
|------|------|------|
| **Э���淶** | [AGENTS.md](AGENTS.md) | AI Э���ܸ٣�����Ҫ���ض��� |
| **Э���淶** | [PROMPT_RULES.md](docs/PROMPT_RULES.md) | Prompt ��д�淶��ģ�� |
| **��Ŀ����** | [PROJECT.md](docs/PROJECT.md) | ��Ŀ��λ������ջ���ܹ� |
| **��Ŀ����** | [MODULES.md](docs/MODULES.md) | ģ���嵥��״̬ |
| **��Ŀ����** | [ARCHITECTURE.md](docs/ARCHITECTURE.md) | ϵͳ�ܹ���� |
| **��Ŀ����** | [ROADMAP.md](docs/ROADMAP.md) | �汾·��ͼ |
| **��Ŀ����** | [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) | ��ǰ����״̬ |
| **�����淶** | [CODING_RULES.md](docs/CODING_RULES.md) | ����淶 |
| **�����淶** | [API.md](docs/API.md) | API �ӿڹ淶 |
| **�����淶** | [DATABASE.md](docs/DATABASE.md) | ���ݿ�淶 |
| **�����淶** | [TESTING.md](docs/TESTING.md) | ���Թ淶 |
| **�����淶** | [SECURITY.md](docs/SECURITY.md) | ��ȫ�淶 |
| **�����淶** | [SEO.md](docs/SEO.md) | SEO �淶 |
| **�����淶** | [AI_MEMORY.md](docs/AI_MEMORY.md) | AI ���ڼ��� |
| **��¼** | [DECISIONS.md](docs/DECISIONS.md) | �ܹ����߼�¼ |
| **��¼** | [CHANGELOG.md](docs/CHANGELOG.md) | �����־ |
| **��¼** | [TODO.md](docs/TODO.md) | �������� |
| **��¼** | [BUG.md](docs/BUG.md) | ��֪���� |
| **ģ��** | [MODULE_TEMPLATE.md](docs/templates/MODULE_TEMPLATE.md) | ģ�鿪��ģ�� |

---

## ��ο�ʼһ����ģ��

1. �Ķ� [AGENTS.md](AGENTS.md) �� [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) �ָ�������
2. �� [MODULES.md](docs/MODULES.md) �н�ģ��״̬��Ϊ in_progress
3. ���� [docs/templates/MODULE_TEMPLATE.md](docs/templates/MODULE_TEMPLATE.md) ��ģ��Ŀ¼
4. �� AI �������̣�7 ����ִ�п���
5. ��ɺ���� [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) �� [CHANGELOG.md](docs/CHANGELOG.md)

---

## ��λָ���Ŀ������

ÿ���µĿ����Ի���ʼʱ����˳���Ķ������ĵ����ɻָ�ȫ����Ŀ�����ģ�

| ˳�� | �ĵ� | Ŀ�� |
|------|------|------|
| 1 | [AGENTS.md](AGENTS.md) | �˽�Э���淶�ͽ�ֹ���� |
| 2 | [README.md](README.md) | �˽���Ŀ�ṹ�Ϳ������ |
| 3 | [PROJECT.md](docs/PROJECT.md) | �˽���Ŀ��λ�͵�ǰ�汾 |
| 4 | [MODULES.md](docs/MODULES.md) | �˽�ģ��״̬��������ϵ |
| 5 | [ARCHITECTURE.md](docs/ARCHITECTURE.md) | �˽�ϵͳ�ܹ� |
| 6 | [DEVELOPMENT_STATUS.md](docs/DEVELOPMENT_STATUS.md) | �˽⵱ǰ�������� |
| 7 | [AI_MEMORY.md](docs/AI_MEMORY.md) | �˽ⳤ��Լ���ͲȿӾ��� |

����ɨ��������Ŀ��ȫ��Դ��������ֿ⡣

---
## License

MIT

