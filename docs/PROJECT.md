# PROJECT.md 鈥?椤圭洰鎬昏

## 椤圭洰瀹氫綅

`web-xiaobaigame` 鏄竴涓潰鍚戞父鎴忕帺瀹跺拰寮€鍙戣€呯殑**娓告垙璧勬簮鍒嗕韩骞冲彴**銆傜敤鎴峰彲浠ユ祻瑙堛€佹悳绱㈠拰涓嬭浇鍚勭娓告垙璧勬簮锛堝瓨妗ｃ€佹ā缁勩€佸伐鍏枫€佽剼鏈瓑锛夛紝涔熷彲浠ヤ笂浼犲拰鍒嗕韩鑷繁鐨勮祫婧愩€?
## 椤圭洰鐩爣

- **杩戞湡锛坴0.1 ~ v0.3锛?*锛氬缓绔嬫牳蹇冨姛鑳斤紝鍖呮嫭娓告垙鏉＄洰銆佽祫婧愪笂浼犱笅杞姐€佺敤鎴风郴缁?- **涓湡锛坴0.4 ~ v0.7锛?*锛氬寮虹ぞ鍖哄姛鑳斤紝璇勮銆佽瘎鍒嗐€佹敹钘忋€侀€氱煡
- **杩滄湡锛坴0.8 ~ v1.0锛?*锛歋EO 浼樺寲銆佸浗闄呭寲銆佷紒涓氱骇鏍囧噯

## 闀挎湡瑙勫垝

鏈」鐩璁′负 **5~10 骞?*杩愯惀鍛ㄦ湡锛屽洜姝ゆ灦鏋勮璁￠伒寰細

- 妯″潡鍖栥€侀珮鍐呰仛銆佷綆鑰﹀悎
- 姣忎釜妯″潡鍙嫭绔嬪紑鍙戙€佹祴璇曘€侀儴缃?- 鏂囨。鍜屼唬鐮佸悓姝ョ淮鎶?- 鎵€鏈夎璁″喅绛栬褰曞湪妗?
## 褰撳墠鐗堟湰

**v1.0.1** 鈥?Download API 瀹屾垚

## 鎶€鏈爤

| 灞傜骇 | 鎶€鏈€夊瀷 | 鍘熷洜 |
|------|---------|------|
| 鍓嶇妗嗘灦 | Next.js 14 (App Router) | SSR/SSG 鏀寔銆丼EO 鍙嬪ソ銆佺敓鎬佷赴瀵?|
| 绫诲瀷绯荤粺 | TypeScript | 绫诲瀷瀹夊叏銆佸ぇ鍨嬮」鐩繀澶?|
| CSS 妗嗘灦 | TailwindCSS + Shadcn UI | 鍘熷瓙鍖?CSS銆侀珮搴﹀彲瀹氬埗 |
| 鐘舵€佺鐞?| Zustand + React Query | 杞婚噺绾с€佹湇鍔＄鐘舵€佸拰瀹㈡埛绔姸鎬佸垎绂?|
| 琛ㄥ崟楠岃瘉 | React Hook Form + Zod | 鎬ц兘濂姐€佺被鍨嬪畨鍏?|
| 鍚庣妗嗘灦 | FastAPI | 鍘熺敓寮傛銆佽嚜鍔?OpenAPI 鏂囨。 |
| ORM | SQLAlchemy 2.x (async) | 鏈€娴佽 Python ORM銆佸紓姝ユ敮鎸?|
| 鏁版嵁搴?| PostgreSQL 16 | 鍔熻兘涓板瘜銆佹墿灞曟€у己 |
| 缂撳瓨 | Redis 7 | 楂樻€ц兘銆佹敮鎸佸绉嶆暟鎹粨鏋?|
| 瀵硅薄瀛樺偍 | MinIO (S3) | S3 鍏煎銆佸彲鑷墭绠?|
| 瀹瑰櫒鍖?| Docker + Compose | 鐜涓€鑷存€с€佺畝鍖栭儴缃?|
| CI/CD | GitHub Actions | 鍏嶈垂銆佷笌 GitHub 娣卞害闆嗘垚 |

## 鏋舵瀯璇存槑

璇﹁ [ARCHITECTURE.md](ARCHITECTURE.md)銆?
**鍒嗗眰鏋舵瀯**锛?
```
Frontend (Next.js)
  鈫?HTTP/REST
Backend (FastAPI)
  鈹溾攢鈹€ API Layer (routers, middleware)
  鈹溾攢鈹€ Service Layer (business logic)
  鈹溾攢鈹€ Repository Layer (data access)
  鈹斺攢鈹€ Infrastructure (DB, Redis, S3)
```

## 妯″潡璇存槑

璇﹁ [MODULES.md](MODULES.md)銆?
椤圭洰鍏辫鍒?**15 涓ā鍧?*锛屾寜渚濊禆鍏崇郴鍒嗛樁娈靛紑鍙戯細

| 闃舵 | 鐗堟湰 | 妯″潡 |
|------|------|------|
| Phase 0 | v0.1.0 | 椤圭洰鍒濆鍖栵紙宸插畬鎴愶級 |
| Phase 0.1 | v0.1.1 | 鏂囨。瑙勮寖澧炲己锛堝凡瀹屾垚锛?|
| Phase 1 | v0.2.0+ | database-foundation, games, categories, users, auth |
| Phase 2 | v0.8.0 | download |
| Phase 3 | v0.6.x | search, comments, ratings |
| Phase 4 | v0.7.x | collections, notifications, admin, analytics |

---

## Documentation Driven Development

鏈」鐩噰鐢?**Documentation Driven Development (DDD)** 寮€鍙戞ā寮忋€?
### 鏍稿績鍘熷垯
- 鏂囨。鏄」鐩殑鍞竴鐪熺浉鏉ユ簮锛圫ingle Source of Truth锛?- 鎵€鏈夊紑鍙戝繀椤诲厛闃呰鏂囨。锛屼笉寰楁牴鎹蹇嗗紑鍙?- 鏂囨。涓庝唬鐮佸悓绛夐噸瑕侊紝鍚屾缁存姢
- 鏂版垚鍛橀€氳繃鏂囨。鍗冲彲鎭㈠鍏ㄩ儴椤圭洰涓婁笅鏂?- 姣忔瀵硅瘽鐨勫紑濮嬶紝浠庢枃妗ｄ腑鎭㈠涓婁笅鏂?
### 鏂囨。浣撶郴

| 灞傜骇 | 鏂囨。 | 浣滅敤 |
|------|------|------|
| P0 | AGENTS.md, README.md | 鍏ュ彛鍜屾€荤翰 |
| P1 | PROJECT.md, MODULES.md, ARCHITECTURE.md, DEVELOPMENT_STATUS.md | 椤圭洰鍏冧俊鎭?|
| P2 | API.md, DATABASE.md, CODING_RULES.md 绛?| 棰嗗煙瑙勮寖 |
| P3 | AI_MEMORY.md, DECISIONS.md, CHANGELOG.md | 闀挎湡璁板繂鍜岃褰?|

---

## 闀挎湡杩愯惀鍘熷垯

鏈」鐩璁＄洰鏍囦负 **5~10 骞?*鐨勯暱鏈熻繍钀ュ懆鏈燂紝鍥犳锛?
- 浠ｇ爜璐ㄩ噺鍜屽彲缁存姢鎬т紭鍏堜簬寮€鍙戦€熷害
- 鏋舵瀯璁捐蹇呴』鑰冭檻鏈潵鎵╁睍
- 鏂囨。蹇呴』淇濇寔涓庝唬鐮佸悓姝?- 姣忎釜鍐崇瓥蹇呴』鍦?DECISIONS.md 涓褰曞師鍥?- 鎶€鏈€哄姟蹇呴』鍦?TODO.md 涓拷韪?- 涓嶅仛涓€娆℃€?hack锛屼笉鍋?鍏堜笂绾垮啀閲嶆瀯"
- 鎵€鏈夋ā鍧楅鐣欐墿灞曡兘鍔?- 鏁版嵁搴撲娇鐢ㄨ蒋鍒犻櫎锛屼繚鐣欏畬鏁村巻鍙?
---

## AI 寮€鍙戝師鍒?
### 寮€鍙戠邯寰?- 鍏堣鏂囨。锛屽啀鍐欎唬鐮?- 涓嶆壂鎻忔暣涓」鐩紝绮惧噯璇诲彇
- 涓嶈法妯″潡淇敼
- 涓嶄慨鏀瑰凡瀹屾垚妯″潡
- 涓嶄慨鏀瑰巻鍙?Migration
- 鍐茬獊鏃朵紭鍏堜繚璇佸彲缁存姢鎬?- 姣忔寮€鍙戦伒寰?7 姝ュ浐瀹氭祦绋?
### 璐ㄩ噺瑕佹眰
- 鎵€鏈夊叕鍏辨帴鍙ｅ繀椤绘湁 OpenAPI 娉ㄩ噴
- 鎵€鏈夋暟鎹簱鍙樻洿蹇呴』閫氳繃 Migration
- 鎵€鏈?API 绔偣蹇呴』閫氳繃 Pydantic 楠岃瘉
- 娴嬭瘯瑕嗙洊鐜囩洰鏍?鈮?80%
- 浠ｇ爜鎻愪氦鍓嶅繀椤婚€氳繃 lint 妫€鏌?
---

## 鐗堟湰绛栫暐

閬靛惊 [Semantic Versioning](https://semver.org/)銆?
- **MAJOR (X.0.0)**锛氫笉鍏煎鐨?API 鍙樻洿鎴栭噸澶ф灦鏋勯噸鏋?- **MINOR (0.X.0)**锛氬悜鍚庡吋瀹圭殑鍔熻兘鏂板鎴栨柊妯″潡瀹屾垚
- **PATCH (0.0.X)**锛氬悜鍚庡吋瀹圭殑闂淇鎴栨枃妗ｆ洿鏂?
鐗堟湰鍙疯褰曚綅缃細
- `backend/core/config.py` 鈫?`VERSION`
- `frontend/package.json` 鈫?`version`
- `README.md` 鈫?鐗堟湰璇存槑
- `docs/CHANGELOG.md` 鈫?鍙樻洿璁板綍

---

## 椤圭洰鐢熷懡鍛ㄦ湡

```
Phase 0 (v0.1.x)    椤圭洰鍒濆鍖?+ 鏂囨。浣撶郴 + 鍩虹璁炬柦
Phase 1 (v0.1.x)    鏍稿績鍩虹妯″潡 (users, auth, categories, games)
Phase 2 (v0.3.x)    鏍稿績鍔熻兘 (resources, upload, download, search)
Phase 3 (v0.4.x)    绀惧尯鍔熻兘 (comments, ratings, collections, notifications)
Phase 4 (v0.5.x)    澧炲己鍔熻兘 (analytics, admin, SEO)
Phase 5 (v0.6~0.7)  鎬ц兘浼樺寲 + 瀹夊叏鍔犲浐 + 鍥介檯鍖?Phase 6 (v0.8~0.9)  浼佷笟绾ф爣鍑?+ 绋冲畾鎬?Phase 7 (v1.0.0)    姝ｅ紡鍙戝竷
```

姣忎釜闃舵瀹屾垚鍚庢墠杩涘叆涓嬩竴闃舵锛屼笉鎻愬墠寮€鍙戝悗缁樁娈垫ā鍧椼€?
---

*鏈€鍚庢洿鏂帮細2026-07-16 | v0.8.0*
