# PROJECT.md �� ��Ŀ����

## ��Ŀ��λ

`web-xiaobaigame` ��һ��������Ϸ��ҺͿ����ߵ�**��Ϸ��Դ����ƽ̨**���û�������������������ظ�����Ϸ��Դ���浵��ģ�顢���ߡ����Եȣ���Ҳ�����ϴ��ͷ����Լ�����Դ��

## ��ĿĿ��

- **���ڣ�v0.1 ~ v0.3��**���������Ĺ��ܣ�������Ϸ��Ŀ�������Դ�ϴ����ء��û�ϵͳ
- **���ڣ�v0.4 ~ v0.7��**�������������ܣ����ۡ����֡��ղء�֪ͨ
- **���ڣ�v0.8 ~ v1.0��**��SEO �Ż������ʻ�����ҵ��׼��

## ���ڹ滮

����Ŀ���Ϊ **5~10 ��**��Ӫ���ڣ���˼ܹ������ѭ��

- ģ�黯������ϡ����ھ�
- ÿ��ģ��ɶ������������ԡ�����
- �ĵ��ʹ���ͬ��ά��
- ������ƾ��߼�¼�ڰ�

## ��ǰ�汾

**v0.4.0** — Category + Tag API 完成

## ����ջ

| �㼶 | ����ѡ�� | ԭ�� |
|------|---------|------|
| ǰ�˿�� | Next.js 14 (App Router) | SSR/SSG ֧�֡�SEO �Ѻá���̬���� |
| ����ϵͳ | TypeScript | ���Ͱ�ȫ��������Ŀ�ر� |
| CSS ��� | TailwindCSS + Shadcn UI | ԭ�ӻ� CSS������ɶ��� |
| ״̬���� | Zustand + React Query | �����������״̬�Ϳͻ���״̬���� |
| �����֤ | React Hook Form + Zod | ���ܺá����Ͱ�ȫ |
| ��˿�� | FastAPI | �������첽���Զ� OpenAPI �ĵ� |
| ORM | SQLAlchemy 2.x (async) | ����� Python ORM���첽֧�� |
| ���ݿ� | PostgreSQL 16 | ���ܷḻ����չ��ǿ |
| ���� | Redis 7 | �����ܡ�֧�ֶ������ݽṹ |
| ����洢 | MinIO (S3) | S3 ���ݡ������й� |
| ������ | Docker + Compose | ����һ���ԡ��򻯲��� |
| CI/CD | GitHub Actions | ��ѡ��� GitHub ��ȼ��� |

## �ܹ�˵��

��� [ARCHITECTURE.md](ARCHITECTURE.md)��

**�ֲ�ܹ�**��

```
Frontend (Next.js)
  �� HTTP/REST
Backend (FastAPI)
  ������ API Layer (routers, middleware)
  ������ Service Layer (business logic)
  ������ Repository Layer (data access)
  ������ Infrastructure (DB, Redis, S3)
```

## ģ��˵��

��� [MODULES.md](MODULES.md)��

��Ŀ���滮 **15 ��ģ��**����������ϵ�ֽ׶ο�����

| �׶� | �汾 | ģ�� |
|------|------|------|
| Phase 0 | v0.1.0 | ��Ŀ��ʼ��������ɣ� |
| Phase 0.1 | v0.3.0 | �ĵ��淶��ǿ����ǰ�� |
| Phase 1 | v0.1.2+ | games, categories, users, auth |
| Phase 2 | v0.2.x | resources, upload, download |
| Phase 3 | v0.3.x | search, comments, ratings |
| Phase 4 | v0.4.x | collections, notifications, admin, analytics |

---

## Documentation Driven Development

����Ŀ���� **Documentation Driven Development (DDD)** ����ģʽ��

### ����ԭ��
- �ĵ�����Ŀ��Ψһ������Դ��Single Source of Truth��
- ���п����������Ķ��ĵ������ø��ݼ��俪��
- �ĵ������ͬ����Ҫ��ͬ��ά��
- �³�Աͨ���ĵ����ɻָ�ȫ����Ŀ������
- ÿ�ζԻ���ʼ������ĵ��лָ�������

### �ĵ���ϵ

| �㼶 | �ĵ� | ���� |
|------|------|------|
| P0 | AGENTS.md, README.md | ��ں��ܸ� |
| P1 | PROJECT.md, MODULES.md, ARCHITECTURE.md, DEVELOPMENT_STATUS.md | ��ĿԪ��Ϣ |
| P2 | API.md, DATABASE.md, CODING_RULES.md �� | ����淶 |
| P3 | AI_MEMORY.md, DECISIONS.md, CHANGELOG.md | ���ڼ���ͼ�¼ |

---

## ������Ӫԭ��

����Ŀ���Ŀ��Ϊ **5~10 ��**�ĳ�����Ӫ���ڣ���ˣ�

- ���������Ϳ�ά���������ڿ����ٶ�
- �ܹ���Ʊ��뿼��δ����չ
- �ĵ����뱣�������ͬ��
- ÿ�����߱����� DECISIONS.md �м�¼ԭ��
- ����ծ������� TODO.md ��׷��
- ����һ���� hack������"���������ع�"
- ����ģ��Ԥ����չ����
- ���ݿ�ʹ����ɾ������������������ʷ

---

## AI ����ԭ��

### ��������
- �ȶ��ĵ�����д����
- ��ɨ��������Ŀ�������ȡ
- ����ģ���޸�
- ���޸������ģ��
- ���޸���ʷ Migration
- ���ֳ�ͻ������ݴ���
- ÿ�ο�����ѭ 7 ���̶�����

### ����Ҫ��
- ���й�����������������ע��
- �������ݿ�������ͨ�� Migration
- ���� API �˵����ͨ�� Pydantic ��֤
- ���Ը�����Ŀ�� �� 80%
- �����ύǰ����ͨ�� lint ���

---

## �汾����

��ѭ [Semantic Versioning](https://semver.org/)��

- **MAJOR (X.0.0)**�������ݵ� API ������ش�ܹ��ع�
- **MINOR (0.X.0)**�������ݵĹ�����������ģ�����
- **PATCH (0.0.X)**�������ݵ������޸����ĵ�����

�汾�ż�¼λ�ã�
- `backend/core/config.py` �� `VERSION`
- `frontend/package.json` �� `version`
- `README.md` �� �汾˵��
- `docs/CHANGELOG.md` �� �����¼

---

## ��Ŀ��������

```
Phase 0 (v0.1.x)    ��Ŀ��ʼ�� + �ĵ���ϵ + ������ʩ
Phase 1 (v0.1.x)    ���Ļ���ģ�� (users, auth, categories, games)
Phase 2 (v0.3.x)    ���Ĺ��� (resources, upload, download, search)
Phase 3 (v0.4.x)    �������� (comments, ratings, collections, notifications)
Phase 4 (v0.5.x)    ��ǿ���� (analytics, admin, SEO)
Phase 5 (v0.6~0.7)  �����Ż� + ��ȫ�ӹ� + �����
Phase 6 (v0.8~0.9)  ��ҵ��׼�� + �ȶ���
Phase 7 (v1.0.0)    ��ʽ����
```

ÿ���׶���ɺ������һ�׶Σ�������ǰ���������׶�ģ�顣

---

*�����£�2026-07-15 | v0.3.0*
