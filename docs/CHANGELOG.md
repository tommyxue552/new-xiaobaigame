# CHANGELOG.md 鈥?鍙樻洿鏃ュ織

鏈枃浠堕伒寰?[Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 鏍煎紡銆?


## [0.6.0] — 2026-07-16

### Added
- M016 Frontend Home: 完整网站首页
  - rontend/src/components/layout/Header.tsx — 站点头部（Logo、导航栏、搜索占位框）
  - rontend/src/components/layout/Footer.tsx — 站点底部（链接分组、版权信息）
  - rontend/src/components/home/HeroBanner.tsx — 主页 Hero Banner（渐变背景、站点名称、标语）
  - rontend/src/components/home/CategorySection.tsx — 分类入口（分类卡片含游戏数量）
  - rontend/src/components/home/FeaturedGames.tsx — 精选游戏区（最新/热门 Tab 切换）
  - rontend/src/components/game/GameCard.tsx — 游戏卡片（封面、标题、分类、时间、下载数、标签）
  - rontend/src/components/game/GameCardSkeleton.tsx — 游戏卡片骨架屏
  - rontend/src/components/game/GameGrid.tsx — 响应式游戏网格布局
  - rontend/src/components/shared/Skeleton.tsx — 通用骨架屏组件
  - rontend/src/components/shared/Pagination.tsx — 分页导航
  - rontend/src/components/shared/EmptyState.tsx — 空数据提示
  - rontend/src/types/game.ts — GameListItem, GameDetail, GameListParams 等类型定义
  - rontend/src/types/category.ts — CategoryTreeNode 等类型定义
  - rontend/src/lib/api.ts — 基础 API 请求封装（统一错误处理、查询字符串构建）
  - rontend/src/features/games/api.ts — 游戏 API 函数（getGames, getHotGames, getGameBySlug）
  - rontend/src/features/categories/api.ts — 分类 API 函数（getCategories）
  - rontend/src/app/page.tsx — SSR 首页（服务端获取数据，SEO 元数据）
  - rontend/src/app/loading.tsx — 首页骨架加载页
  - rontend/src/app/error.tsx — 首页错误边界页

### Changed
- rontend/package.json version 更新为 0.6.0
- rontend/tailwind.config.js 增加 shadcn-style CSS 变量映射
- rontend/src/app/layout.tsx 添加 Header 和 Footer 到根布局
- docs/PROJECT.md 版本更新
- docs/MODULES.md 新增 M016 frontend-home 模块
- docs/DEVELOPMENT_STATUS.md 进度更新

### Technical Details
- 首页使用 SSR（服务端渲染），通过 Next.js App Router 的 async 组件获取数据
- 游戏列表支持分页，通过 URL searchParams 传递页码
- 响应式布局：移动端 1 列 → 平板 2 列 → 桌面 3-4 列
- 图片使用 Next.js Image 组件，支持懒加载和远程图片
- 骨架屏 Loading 覆盖所有数据区域
- SEO：title、description、OpenGraph、canonical
- 所有数据来自后端 API，无硬编码数据

---
## [0.5.0] 鈥?2026-07-16

### Added
- M008 Download API: 涓嬭浇璧勬簮绠＄悊瀹屾暣鍚庣 API
  - 鍏紑鎺ュ彛锛歚GET /api/v1/games/{slug}/downloads` 鈥?娓告垙涓嬭浇璧勬簮鍒楄〃锛堜粎杩斿洖鍚敤鐘舵€佹暟鎹紝鍚父鎴忓悕绉般€佹笭閬撳悕绉般€佷笅杞藉湴鍧€銆佹彁鍙栫爜銆佹帓搴忥級
  - 涓嬭浇璧勬簮绠＄悊锛歚GET/POST/PUT/DELETE /api/v1/admin/downloads` 鈥?CRUD锛堝垎椤?+ 鎸夋父鎴忕瓫閫夛級
  - 涓嬭浇娓犻亾绠＄悊锛歚GET/POST/PUT/DELETE /api/v1/admin/download-providers` 鈥?CRUD
- `backend/schemas/download_provider.py` 鈥?DownloadProviderResponse, DownloadProviderCreate, DownloadProviderUpdate
- `backend/schemas/download_resource.py` 鈥?DownloadProviderBrief, DownloadResourceResponse, DownloadResourceCreate, DownloadResourceUpdate
- `backend/repositories/download_provider_repository.py` 鈥?DownloadProviderRepository锛圕RUD銆丼lug/鍚嶇О鍞竴鎬с€佸垪琛ㄣ€佽蒋鍒犻櫎锛?- `backend/repositories/download_resource_repository.py` 鈥?DownloadResourceRepository锛圕RUD銆佹寜娓告垙鏌ヨ銆佸垎椤点€佷粎鍚敤杩囨护銆佸瓨鍦ㄦ€ф牎楠岋級
- `backend/services/download_provider_service.py` 鈥?DownloadProviderService锛圫lug 鐢熸垚銆佸悕绉板敮涓€鎬с€侀儴鍒嗘洿鏂帮級
- `backend/services/download_resource_service.py` 鈥?DownloadResourceService锛堟父鎴?娓犻亾瀛樺湪鎬ф牎楠屻€佺姸鎬侀獙璇侊級
- `backend/api/v1/endpoints/download_providers.py` 鈥?绠＄悊璺敱锛圕RUD锛?- `backend/api/v1/endpoints/download_resources.py` 鈥?鍏紑璺敱 + 绠＄悊璺敱
- `docs/API.md` 鈥?鏂板 Download API 绔犺妭

### Changed
- `backend/core/config.py` VERSION 鏇存柊涓?0.5.0
- `backend/api/v1/router.py` 寮曞叆 download_providers 鍜?download_resources 璺敱
- `backend/schemas/__init__.py` 瀵煎嚭 download_provider 鍜?download_resource schemas
- `backend/repositories/__init__.py` 瀵煎嚭 DownloadProviderRepository 鍜?DownloadResourceRepository
- `backend/services/__init__.py` 瀵煎嚭 DownloadProviderService 鍜?DownloadResourceService
- `backend/api/v1/endpoints/__init__.py` 瀵煎叆 download_providers 鍜?download_resources
- `docs/MODULES.md` M008 鐘舵€佹洿鏂颁负 completed锛屾柊澧炶缁嗘ā鍧楄鏄?- `docs/PROJECT.md` 鐗堟湰鏇存柊銆佹ā鍧楄繘搴︽洿鏂?- `docs/DEVELOPMENT_STATUS.md` 杩涘害鏇存柊

### Security
- 绠＄悊鎺ュ彛鏆傛棤鏉冮檺瀹堝崼锛坴0.5.0锛夛紝鍚庣画 M005 auth 妯″潡灏嗘坊鍔?
---

## [0.4.0] 鈥?2026-07-15

### Added
- M002 Category API: 鍒嗙被绯荤粺瀹屾暣鍚庣 API
  - `GET /api/v1/categories` 鈥?鍒嗙被鏍戯紙鏃犻檺绾у祵濂楋紝鍚?game_count锛?  - `GET /api/v1/categories/{slug}` 鈥?鍒嗙被璇︽儏锛堝惈 game_count锛?  - `POST /api/v1/admin/categories` 鈥?鍒涘缓鍒嗙被锛堣嚜鍔?Slug 鐢熸垚銆佸悕绉板敮涓€鎬ф牎楠岋級
  - `PUT /api/v1/admin/categories/{id}` 鈥?鏇存柊鍒嗙被锛堥儴鍒嗘洿鏂拌涔夈€佺姝㈣嚜寮曠敤锛?  - `DELETE /api/v1/admin/categories/{id}` 鈥?杞垹闄わ紙瀛愬垎绫昏嚜鍔ㄧ疆椤讹級
- Tag API: 鏍囩绯荤粺瀹屾暣鍚庣 API
  - `GET /api/v1/tags` 鈥?鏍囩鍒楄〃锛堝垎椤?+ 鍏抽敭璇嶆悳绱?+ game_count锛?  - `GET /api/v1/tags/{slug}` 鈥?鏍囩璇︽儏锛堝惈 game_count锛?  - `POST /api/v1/admin/tags` 鈥?鍒涘缓鏍囩锛堣嚜鍔?Slug 鐢熸垚銆佸悕绉板敮涓€鎬ф牎楠岋級
  - `PUT /api/v1/admin/tags/{id}` 鈥?鏇存柊鏍囩锛堥儴鍒嗘洿鏂拌涔夛級
  - `DELETE /api/v1/admin/tags/{id}` 鈥?杞垹闄わ紙鍏宠仈 game_tags 绾ц仈鍒犻櫎锛?- `backend/schemas/category.py` 鈥?CategoryTreeNode, CategoryDetailResponse, CategoryCreate, CategoryUpdate
- `backend/schemas/tag.py` 鈥?TagResponse, TagCreate, TagUpdate
- `backend/repositories/category_repository.py` 鈥?CategoryRepository锛堟爲鏌ヨ銆丼lug/鍚嶇О鍞竴鎬ф鏌ャ€乬ame_count 缁熻锛?- `backend/repositories/tag_repository.py` 鈥?TagRepository锛堝垎椤点€佹悳绱€乬ame_count 缁熻锛?- `backend/services/category_service.py` 鈥?CategoryService锛堟爲鏋勫缓銆丼lug 鑷姩鐢熸垚銆佸悕绉板敮涓€鎬с€佸惊鐜紩鐢ㄩ槻鎶わ級
- `backend/services/tag_service.py` 鈥?TagService锛圫lug 鑷姩鐢熸垚銆佸悕绉板敮涓€鎬э級
- `backend/api/v1/endpoints/categories.py` 鈥?鍏紑璺敱 + 绠＄悊璺敱
- `backend/api/v1/endpoints/tags.py` 鈥?鍏紑璺敱 + 绠＄悊璺敱
- `backend/utils/slug.py` 鈥?鍏变韩 Slug 鐢熸垚宸ュ叿锛坧inyin_slug锛?- `docs/API.md` 鈥?鏂板 Category API 鍜?Tag API 绔犺妭

### Changed
- `backend/core/config.py` VERSION 鏇存柊涓?0.4.0
- `backend/api/v1/router.py` 寮曞叆 categories 鍜?tags 璺敱
- `backend/schemas/__init__.py` 瀵煎嚭 category 鍜?tag schemas
- `backend/repositories/__init__.py` 瀵煎嚭 CategoryRepository 鍜?TagRepository
- `backend/services/__init__.py` 瀵煎嚭 CategoryService 鍜?TagService
- `backend/api/v1/endpoints/__init__.py` 瀵煎叆 categories 鍜?tags
- `docs/MODULES.md` M002 鐘舵€佹洿鏂颁负 completed
- `docs/PROJECT.md` 鐗堟湰鏇存柊
- `docs/DEVELOPMENT_STATUS.md` 杩涘害鏇存柊

### Security
- 绠＄悊鎺ュ彛鏆傛棤鏉冮檺瀹堝崼锛坴0.4.0锛夛紝鍚庣画 M005 auth 妯″潡灏嗘坊鍔?
---

## [0.3.0] 鈥?2026-07-15

### Added
- M001 Game API: 娓告垙妯″潡瀹屾暣鍚庣 API
  - `GET /api/v1/games` 鈥?娓告垙鍒楄〃锛屾敮鎸佸垎椤点€佸垎绫?鏍囩绛涢€夈€佸叧閿瘝鎼滅储銆佸瀛楁鎺掑簭
  - `GET /api/v1/games/{slug}` 鈥?娓告垙璇︽儏锛堝惈鍒嗙被銆佹爣绛俱€佹埅鍥俱€佸彲鐢ㄤ笅杞借祫婧愶級
  - `POST /api/v1/admin/games` 鈥?鍒涘缓娓告垙锛圫lug 鑷姩鐢熸垚/鏀寔涓枃鏍囬锛?  - `PUT /api/v1/admin/games/{id}` 鈥?鏇存柊娓告垙锛堥儴鍒嗘洿鏂拌涔夛級
  - `DELETE /api/v1/admin/games/{id}` 鈥?杞垹闄ゆ父鎴?- `backend/models/game.py` 鈥?Game 妯″瀷鏂板 `category_id` FK 瀛楁
- `backend/models/category.py` 鈥?Category 妯″瀷鏂板 `games` 鍙嶅悜鍏崇郴
- `backend/schemas/game.py` 鈥?GameCreate, GameUpdate, GameDetailResponse, GameListItem, GameListParams
- `backend/repositories/game_repository.py` 鈥?GameRepository锛坅sync CRUD + 鍒嗛〉 + 绛涢€?+ 鎼滅储锛?- `backend/services/game_service.py` 鈥?GameService锛圫lug 鐢熸垚銆佷笟鍔￠€昏緫锛?- `backend/api/v1/endpoints/games.py` 鈥?鍏紑璺敱 + 绠＄悊璺敱
- `backend/alembic/versions/2026_07_15_0002-add_category_id_to_games.py` 鈥?鏁版嵁搴撹縼绉?- `docs/API.md` 鈥?鏂板 Game API 绔犺妭
- `docs/MODULES.md` 鈥?M001 鐘舵€佹洿鏂颁负 completed

### Changed
- `backend/core/config.py` VERSION 鏇存柊涓?0.3.0
- `backend/api/v1/router.py` 閲嶆瀯涓哄寘鍚?games 璺敱
- `backend/schemas/__init__.py` 瀵煎嚭 game schemas
- `backend/repositories/__init__.py` 瀵煎嚭 GameRepository
- `backend/services/__init__.py` 瀵煎嚭 GameService

### Security
- 绠＄悊鎺ュ彛鏆傛棤鏉冮檺瀹堝崼锛坴0.3.0锛夛紝鍚庣画 M005 auth 妯″潡灏嗘坊鍔?
---

## [0.2.0] 鈥?2026-07-15

### Added
- Database Foundation: 9 寮犳牳蹇冩暟鎹〃 SQLAlchemy ORM 妯″瀷
  - `games` 鈥?娓告垙鏉＄洰锛堟爣棰樸€丼lug銆佸皝闈€丼EO銆佹祻瑙堥噺/涓嬭浇閲忋€佺姸鎬侊級
  - `categories` 鈥?灞傜骇鍒嗙被锛堟敮鎸佽嚜寮曠敤鐖跺垎绫伙級
  - `tags` 鈥?鏍囩
  - `game_tags` 鈥?娓告垙鏍囩澶氬澶氬叧鑱?  - `screenshots` 鈥?娓告垙鎴浘锛堟敮鎸佹帓搴忥級
  - `download_providers` 鈥?涓嬭浇娓犻亾锛堢櫨搴︾綉鐩樸€佸じ鍏嬬綉鐩樼瓑 8 涓璁炬笭閬擄級
  - `download_resources` 鈥?涓嬭浇璧勬簮锛堝叧鑱旀父鎴忎笌娓犻亾锛屾敮鎸佹彁鍙栫爜銆佷紭鍏堢骇銆佺姸鎬侊級
  - `admins` 鈥?鍚庡彴绠＄悊鍛?  - `settings` 鈥?绯荤粺閰嶇疆閿€煎瓨鍌?- `backend/models/base.py` 鈥?鍏变韩鍩虹被锛圲UID PK銆乧reated_at/updated_at銆佽蒋鍒犻櫎锛?- Alembic Migration: `2026_07_15_0001-add_core_tables.py`
- 涓嬭浇娓犻亾绉嶅瓙鏁版嵁锛? 涓父瑙佺綉鐩樻笭閬擄級
- 閮ㄥ垎绱㈠紩浼樺寲锛坄deleted_at IS NULL` 鏉′欢绱㈠紩锛?- ER 鍥惧拰鍏崇郴璇存槑鏂囨。 (DATABASE.md)

### Changed
- `backend/core/config.py` VERSION 鏇存柊涓?0.2.0
- `backend/alembic/env.py` 鍚敤 models 鑷姩瀵煎叆
- `backend/models/__init__.py` 瀵煎嚭鎵€鏈夋ā鍨?- `docs/DATABASE.md` 閲嶅啓涓哄畬鏁寸殑鏁版嵁琛ㄨ璁℃枃妗?- `docs/MODULES.md` 鏂板 M000 database-foundation 妯″潡
- `docs/DEVELOPMENT_STATUS.md` 鏇存柊寮€鍙戠姸鎬?
### Security
- admins 琛ㄥ瘑鐮佷娇鐢?bcrypt 鍝堝笇瀛樺偍

---

## [0.1.1] 鈥?2026-07-15

### Added
- Documentation Driven Development (DDD) 妯″紡瑙勮寖
- Context Recovery Rule锛堜笂涓嬫枃鎭㈠瑙勫垯锛?- AI 寮€鍙戝浐瀹氭祦绋嬶紙7 姝ユ祦绋嬶級
- 妯″潡淇敼瑙勫垯锛堢姝㈣法妯″潡銆佺姝慨鏀瑰凡瀹屾垚妯″潡锛?- `docs/DEVELOPMENT_STATUS.md` 鈥?寮€鍙戠姸鎬佽拷韪?- `docs/AI_MEMORY.md` 鈥?AI 闀挎湡璁板繂
- `docs/templates/MODULE_TEMPLATE.md` 鈥?妯″潡寮€鍙戠粺涓€妯℃澘
- `docs/PROMPT_RULES.md` 鈥?Prompt 缂栧啓瑙勮寖
- 妯″潡渚濊禆鍏崇郴鍥俱€丷eview 鐘舵€併€佸喕缁撶姸鎬併€佸畬鎴愮櫨鍒嗘瘮 (MODULES.md)
- 椤圭洰寮€鍙戞祦绋嬨€丄I 鍗忎綔娴佺▼銆佹枃妗ｇ储寮曘€佷笂涓嬫枃鎭㈠鎸囧崡 (README.md)
- 闀挎湡杩愯惀鍘熷垯銆丄I 寮€鍙戝師鍒欍€佺増鏈瓥鐣ャ€侀」鐩敓鍛藉懆鏈?(PROJECT.md)

### Changed
- AGENTS.md 澧炲姞 DDD 瑙勮寖銆丆ontext Recovery Rule銆丄I 寮€鍙戞祦绋嬨€佹ā鍧椾慨鏀硅鍒?- MODULES.md 澧炲姞渚濊禆鍏崇郴鍥俱€佸紑鍙戦樁娈点€丷eview/鍐荤粨鐘舵€?- README.md 澧炲姞椤圭洰寮€鍙戞祦绋嬨€佹枃妗ｇ储寮曘€佷笂涓嬫枃鎭㈠鎸囧崡
- PROJECT.md 澧炲姞 DDD 鍘熷垯銆侀暱鏈熻繍钀ュ師鍒欍€佺増鏈瓥鐣ャ€佺敓鍛藉懆鏈?
### Security
- 鏃?
---

## [0.1.0] 鈥?2026-07-15

### Added
- 椤圭洰鍒濆鍖栵細瀹屾暣鐩綍缁撴瀯
- Backend FastAPI 楠ㄦ灦锛氳矾鐢便€侀厤缃€佹暟鎹簱銆佸畨鍏ㄣ€佸瓨鍌?- Frontend Next.js 楠ㄦ灦锛欰pp Router銆乀ailwindCSS銆乑ustand
- Docker 閰嶇疆锛欶rontend/Backend Dockerfile銆乨ocker-compose.yml銆乨ocker-compose.dev.yml
- Nginx 鍙嶅悜浠ｇ悊閰嶇疆
- GitHub CI/CD 娴佹按绾?- Issue/PR 妯℃澘銆丆ODEOWNERS
- 瀹屾暣鏂囨。浣撶郴锛歊EADME, AGENTS.md, PROJECT.md, MODULES.md, ARCHITECTURE.md, ROADMAP.md, API.md, DATABASE.md, SECURITY.md, SEO.md, TESTING.md, CODING_RULES.md, DEPLOY.md, DECISIONS.md, CONTRIBUTING.md, FAQ.md, TODO.md, BUG.md
- 缁熶竴 API 鍝嶅簲鏍煎紡鍜岄敊璇爜浣撶郴
- 鐜鍙橀噺妯℃澘 (.env.example)
- 浠ｇ爜璐ㄩ噺宸ュ叿閰嶇疆 (ruff, pre-commit, editorconfig)

### Changed
- 鏃狅紙鍒濆鐗堟湰锛?
### Deprecated
- 鏃?
### Removed
- 鏃?
### Fixed
- 鏃?
### Security
- 瀹夊叏瑙勮寖鏂囨。寤虹珛
- JWT 璁よ瘉楠ㄦ灦
- 瀹夊叏涓棿浠?(Security Headers)
- 瀵嗙爜鍝堝笇绛栫暐 (bcrypt)

---

*鏈€鍚庢洿鏂帮細2026-07-16 | v0.6.0*
