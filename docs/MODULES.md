# MODULES.md 鈥?妯″潡娓呭崟

> 鏈枃妗ｈ褰曢」鐩殑鎵€鏈夋ā鍧楀強鍏剁姸鎬併€傛瘡涓ā鍧楀繀椤荤櫥璁板悗鎵嶈兘寮€濮嬪紑鍙戙€?
---

## 妯″潡鎬昏

| 缂栧彿 | 妯″潡鍚嶇О | 鐘舵€?| 璐熻矗浜?| 鐗堟湰 | 渚濊禆 | 寮€鍙戦『搴?| 杩涘害 | Review | 鍐荤粨 |
|------|---------|------|--------|------|------|---------|------|--------|------|
| M000 | database-foundation | completed | Codex | 0.2.0 | - | 0 | 100% | pending | 鍚?|
| M001 | games | completed | Codex | 0.3.0 | M000 | 1 | 100% | pending | 鍚?|
| M002 | categories | completed | Codex | 0.4.0 | M000 | 2 | 100% | pending | 鍚?|
| M003 | resources | planned | TBD | 0.1.0 | M001 | 6 | 0% | - | 鍚?|
| M004 | users | planned | TBD | 0.1.0 | M000 | 3 | 0% | - | 鍚?|
| M005 | auth | planned | TBD | 0.1.0 | M004 | 4 | 0% | - | 鍚?|
| M006 | search | planned | TBD | 0.2.0 | M001 | 9 | 0% | - | 鍚?|
| M007 | upload | planned | TBD | 0.1.0 | M003 | 7 | 0% | - | 鍚?|
| M008 | download | completed | Codex | 0.5.0 | M000, M001 | 8 | 100% | pending | 鍚?|
| M009 | seo | planned | TBD | 0.3.0 | M001, M002 | 12 | 0% | - | 鍚?|
| M010 | comments | planned | TBD | 0.2.0 | M004, M001 | 10 | 0% | - | 鍚?|
| M011 | ratings | planned | TBD | 0.2.0 | M004, M001 | 11 | 0% | - | 鍚?|
| M012 | collections | planned | TBD | 0.3.0 | M004, M001 | 13 | 0% | - | 鍚?|
| M013 | notifications | planned | TBD | 0.3.0 | M004 | 14 | 0% | - | 鍚?|
| M014 | admin | planned | TBD | 0.2.0 | M005 | 15 | 0% | - | 鍚?|
| M016 | frontend-home | completed | Codex | 0.6.0 | M001, M002, M008 | 8.5 | 100% | pending | 鍚?|
| M017 | game-detail | completed | Codex | 0.7.0 | M001, M002, M008 | 9 | 100% | pending | ? |
| M018 | download-jump | completed | Codex | 0.9.0 | M008, M001 | 10 | 100% | pending | ? |
| M015 | analytics | planned | TBD | 0.4.0 | - | 16 | 0% | - | 鍚?|

---

## 妯″潡渚濊禆鍏崇郴鍥?```
M000 (database-foundation) 鈥?鎵€鏈夋ā鍧楃殑鍩虹

M001 (games) 鈫愨攢鈹€鈹€ M003 (resources) 鈫愨攢鈹€鈹€ M007 (upload)
    鈫?              鈫?                  M008 (download)
    鈫?              鈫?    鈫愨攢鈹€鈹€ M006 (search)
    鈹溾攢鈹€鈹€ M010 (comments) 鈫愨攢鈹€鈹€ M004 (users) 鈫愨攢鈹€鈹€ M005 (auth) 鈫愨攢鈹€鈹€ M014 (admin)
    鈹溾攢鈹€鈹€ M011 (ratings)   鈫愨攢鈹€鈹€ M004           M013 (notifications)
    鈹溾攢鈹€鈹€ M012 (collections)
    鈹斺攢鈹€鈹€ M009 (seo) 鈫愨攢鈹€鈹€ M002 (categories)

M015 (analytics) 鈥?鐙珛妯″潡锛屾棤渚濊禆
```

### 寮€鍙戦樁娈?| 闃舵 | 鐗堟湰 | 妯″潡 | 璇存槑 |
|------|------|------|------|
| Phase 0 | v0.1.0 | - | 椤圭洰鍒濆鍖?鉁?|
| Phase 0.1 | v0.1.1 | - | 鏂囨。瑙勮寖澧炲己 鉁?|
| Phase 0.2 | v0.2.0 | M000 | 鏁版嵁搴撳熀纭€ 鉁?|
| Phase 1 | v0.3.0 | M001 | 娓告垙 API 鉁?|
| Phase 2 | v0.4.0 | M002 | Category + Tag API 鉁?|
| Phase 2.5 | v0.5.0 | M008 | Download API 鉁?|
| Phase 3 | v0.4.x | M004, M005 | 鏍稿績鍩虹妯″潡 |
| Phase 4 | v0.5.x | M003, M007, M006, M010, M011, M014 | 鏍稿績鍔熻兘 |
| Phase 5 | v0.6.x | M012, M013, M009 | 绀惧尯鍔熻兘 + SEO |
| Phase 6 | v0.7.x | M015 | 鏁版嵁鍒嗘瀽 |

---

## 妯″潡璇︽儏

### M000 鈥?database-foundation锛堟暟鎹簱鍩虹锛?- **鎻忚堪**锛歅ostgreSQL 鏁版嵁搴撴牳蹇冭〃璁捐锛屽寘鍚?games銆乧ategories銆乼ags銆乻creenshots銆乨ownload_providers銆乨ownload_resources銆乤dmins銆乻ettings 鍏?9 寮犺〃
- **鐘舵€?*锛歝ompleted
- **鐗堟湰**锛?.2.0
- **鍚庣鐩綍**锛歚backend/models/`, `backend/alembic/versions/`
- **鏁版嵁琛?*锛歚games`, `categories`, `tags`, `game_tags`, `screenshots`, `download_providers`, `download_resources`, `admins`, `settings`

### M001 鈥?games锛堟父鎴忔潯鐩鐞嗭級
- **鎻忚堪**锛氭父鎴忔潯鐩殑鍒涘缓銆佽鍙栥€佹洿鏂般€佹祻瑙堝拰鎼滅储 API
- **鐘舵€?*锛歝ompleted
- **鐗堟湰**锛?.3.0
- **鍚庣鐩綍**锛歚backend/models/game.py`, `backend/repositories/game_repository.py`, `backend/services/game_service.py`, `backend/api/v1/endpoints/games.py`, `backend/schemas/game.py`
- **鍓嶇鐩綍**锛歚frontend/src/features/games/`锛堝緟寮€鍙戯級
- **鏁版嵁琛?*锛歚games`, `game_tags`, `screenshots`
- **鎺ュ彛**锛?  - `GET /api/v1/games` 鈥?娓告垙鍒楄〃锛堝垎椤?+ 绛涢€?+ 鎼滅储 + 鎺掑簭锛?  - `GET /api/v1/games/{slug}` 鈥?娓告垙璇︽儏
  - `POST /api/v1/admin/games` 鈥?鍒涘缓娓告垙
  - `PUT /api/v1/admin/games/{id}` 鈥?鏇存柊娓告垙
  - `DELETE /api/v1/admin/games/{id}` 鈥?杞垹闄?
### M002 鈥?categories锛堝垎绫荤郴缁燂級 + tags锛堟爣绛剧郴缁燂級

- **鎻忚堪**锛氭父鎴忓垎绫荤殑灞傜骇鍒嗙被浣撶郴锛屾敮鎸佹棤闄愮骇宓屽銆佽嚜鍔?Slug 鐢熸垚銆佽蒋鍒犻櫎锛涙爣绛剧郴缁燂紝鏀寔鍒嗛〉銆佹悳绱€乬ame_count
- **鐘舵€?*锛歝ompleted
- **鐗堟湰**锛?.4.0
- **鍚庣鐩綍**锛歚backend/models/category.py`, `backend/models/tag.py`, `backend/repositories/category_repository.py`, `backend/repositories/tag_repository.py`, `backend/services/category_service.py`, `backend/services/tag_service.py`, `backend/api/v1/endpoints/categories.py`, `backend/api/v1/endpoints/tags.py`, `backend/schemas/category.py`, `backend/schemas/tag.py`
- **鍓嶇鐩綍**锛歚frontend/src/features/categories/`, `frontend/src/features/tags/`锛堝緟寮€鍙戯級
- **鏁版嵁琛?*锛歚categories`, `tags`, `game_tags`
- **鎺ュ彛**锛?  - `GET /api/v1/categories` 鈥?鍒嗙被鏍戯紙鍚?game_count + children锛?  - `GET /api/v1/categories/{slug}` 鈥?鍒嗙被璇︽儏
  - `POST /api/v1/admin/categories` 鈥?鍒涘缓鍒嗙被
  - `PUT /api/v1/admin/categories/{id}` 鈥?鏇存柊鍒嗙被
  - `DELETE /api/v1/admin/categories/{id}` 鈥?杞垹闄?  - `GET /api/v1/tags` 鈥?鏍囩鍒楄〃锛堝垎椤?+ 鎼滅储锛?  - `GET /api/v1/tags/{slug}` 鈥?鏍囩璇︽儏
  - `POST /api/v1/admin/tags` 鈥?鍒涘缓鏍囩
  - `PUT /api/v1/admin/tags/{id}` 鈥?鏇存柊鏍囩
  - `DELETE /api/v1/admin/tags/{id}` 鈥?杞垹闄?
### M003 鈥?resources锛堣祫婧愭枃浠讹級
- **鎻忚堪**锛氬彲涓嬭浇鐨勬父鎴忚祫婧愭枃浠讹紝鍏宠仈鍒版父鎴忔潯鐩?- **鐘舵€?*锛歱lanned
- **渚濊禆**锛歁001 (games)
- **鏁版嵁琛?*锛歚download_resources`

### M004 鈥?users锛堢敤鎴风郴缁燂級
- **鎻忚堪**锛氱敤鎴锋敞鍐屻€佷釜浜鸿祫鏂欍€佽鑹插拰鏉冮檺
- **鐘舵€?*锛歱lanned
- **鏁版嵁琛?*锛歚users`, `user_profiles`, `roles`, `permissions`

### M005 鈥?auth锛堣璇佹巿鏉冿級
- **鎻忚堪**锛欽WT 璁よ瘉銆佺櫥褰曘€佹敞鍐屻€乀oken 鍒锋柊
- **鐘舵€?*锛歱lanned
- **渚濊禆**锛歁004 (users)
- **鏁版嵁琛?*锛歚refresh_tokens`

### M006 鈥?search锛堝叏鏂囨悳绱級
- **鎻忚堪**锛氬熀浜?PostgreSQL pg_trgm 鐨勫叏鏂囨悳绱?- **鐘舵€?*锛歱lanned
- **鐗堟湰**锛?.2.0
- **渚濊禆**锛歁001 (games)

### M007 鈥?upload锛堟枃浠朵笂浼狅級
- **鎻忚堪**锛氭枃浠朵笂浼犲埌 MinIO锛屽惈鏍煎紡鍜屽ぇ灏忛獙璇?- **鐘舵€?*锛歱lanned
- **渚濊禆**锛歁003 (resources)

### M008 鈥?download锛堜笅杞借祫婧愮鐞嗭級
- **鎻忚堪**锛氭父鎴忎笅杞借祫婧愮鐞嗭紝鏀寔澶氫笅杞芥笭閬撱€佷紭鍏堢骇鎺掑簭銆佹彁鍙栫爜銆佸惎鐢?绂佺敤鐘舵€?- **鐘舵€?*锛歝ompleted
- **鐗堟湰**锛?.5.0
- **渚濊禆**锛歁000 (database-foundation), M001 (games)
- **鍚庣鐩綍**锛歚backend/models/download_provider.py`, `backend/models/download_resource.py`, `backend/repositories/download_provider_repository.py`, `backend/repositories/download_resource_repository.py`, `backend/services/download_provider_service.py`, `backend/services/download_resource_service.py`, `backend/api/v1/endpoints/download_providers.py`, `backend/api/v1/endpoints/download_resources.py`, `backend/schemas/download_provider.py`, `backend/schemas/download_resource.py`
- **鏁版嵁琛?*锛歚download_providers`, `download_resources`
- **鎺ュ彛**锛?  - `GET /api/v1/games/{slug}/downloads` 鈥?娓告垙涓嬭浇璧勬簮锛堜粎杩斿洖鍚敤鐘舵€侊級
  - `GET /api/v1/admin/downloads` 鈥?涓嬭浇璧勬簮鍒楄〃锛堝垎椤?+ 鎸夋父鎴忕瓫閫夛級
  - `POST /api/v1/admin/downloads` 鈥?鍒涘缓涓嬭浇璧勬簮
  - `PUT /api/v1/admin/downloads/{id}` 鈥?鏇存柊涓嬭浇璧勬簮
  - `DELETE /api/v1/admin/downloads/{id}` 鈥?杞垹闄や笅杞借祫婧?  - `GET /api/v1/admin/download-providers` 鈥?涓嬭浇娓犻亾鍒楄〃
  - `POST /api/v1/admin/download-providers` 鈥?鍒涘缓涓嬭浇娓犻亾
  - `PUT /api/v1/admin/download-providers/{id}` 鈥?鏇存柊涓嬭浇娓犻亾
  - `DELETE /api/v1/admin/download-providers/{id}` 鈥?杞垹闄や笅杞芥笭閬?
### M009 鈥?seo锛堟悳绱㈠紩鎿庝紭鍖栵級
- **鎻忚堪**锛歋itemap銆丮eta 鏍囩銆佺粨鏋勫寲鏁版嵁銆丼SR 浼樺寲
- **鐘舵€?*锛歱lanned
- **鐗堟湰**锛?.3.0
- **渚濊禆**锛歁001 (games), M002 (categories)

### M010 鈥?comments锛堣瘎璁虹郴缁燂級
- **鎻忚堪**锛氬祵濂楄瘎璁猴紝鍚鏍告満鍒?- **鐘舵€?*锛歱lanned
- **鐗堟湰**锛?.2.0
- **渚濊禆**锛歁004 (users), M001 (games)

### M011 鈥?ratings锛堣瘎鍒嗙郴缁燂級
- **鎻忚堪**锛氭父鎴忔槦绾ц瘎鍒嗗拰璇勪环
- **鐘舵€?*锛歱lanned
- **鐗堟湰**锛?.2.0
- **渚濊禆**锛歁004 (users), M001 (games)

### M012 鈥?collections锛堟敹钘忓悎闆嗭級
- **鎻忚堪**锛氱敤鎴峰垱寤虹殑娓告垙鏀惰棌鍚堥泦
- **鐘舵€?*锛歱lanned
- **鐗堟湰**锛?.3.0
- **渚濊禆**锛歁004 (users), M001 (games)

### M013 鈥?notifications锛堥€氱煡绯荤粺锛?- **鎻忚堪**锛氱珯鍐呴€氱煡鍜岄偖浠堕€氱煡
- **鐘舵€?*锛歱lanned
- **鐗堟湰**锛?.3.0
- **渚濊禆**锛歁004 (users)

### M014 鈥?admin锛堢鐞嗗悗鍙帮級
- **鎻忚堪**锛氱鐞嗗憳瀹℃牳鍜岀鐞嗛潰鏉?- **鐘舵€?*锛歱lanned
- **鐗堟湰**锛?.2.0
- **渚濊禆**锛歁005 (auth)
- **鏁版嵁琛?*锛歚admins`

### M015 鈥?analytics锛堟暟鎹垎鏋愶級
- **鎻忚堪**锛氫笅杞界粺璁°€佺敤鎴峰垎鏋愩€佹祦閲忕洃鎺?- **鐘舵€?*锛歱lanned
- **鐗堟湰**锛?.4.0

---


### M016 鈥?frontend-home锛堝墠绔椤碉級
- **鎻忚堪**锛氱綉绔欓椤靛紑鍙戯紝鍖呭惈 Header銆丗ooter銆丠ero Banner銆佸垎绫诲叆鍙ｃ€佹父鎴忓崱鐗囥€佸垎椤电瓑
- **鐘舵€?*锛歝ompleted
- **鐗堟湰**锛?.6.0
- **鍓嶇鐩綍**锛歚frontend/src/app/page.tsx`, `frontend/src/components/`
- **API 璋冪敤**锛?  - `GET /api/v1/games` 鈥?娓告垙鍒楄〃锛堟渶鏂?鐑棬/鍒嗛〉锛?  - `GET /api/v1/categories` 鈥?鍒嗙被鏍?- **缁勪欢**锛欻eader, Footer, HeroBanner, CategorySection, FeaturedGames, GameCard, GameGrid, Pagination, Skeleton, EmptyState

---
## 鐘舵€佽鏄?| 鐘舵€?| 鍚箟 |
|------|------|
| planned | 宸茶鍒掞紝灏氭湭寮€濮?|
| in_progress | 寮€鍙戜腑 |
| completed | 宸插畬鎴?|
| blocked | 琚樆濉烇紙闇€娉ㄦ槑鍘熷洜锛?|
| deprecated | 宸插簾寮?|
| frozen | 宸插喕缁擄紙鏆傚仠寮€鍙戯紝鐩綍淇濈暀锛?|

---

## Review 鐘舵€佽鏄?| 鐘舵€?| 鍚箟 |
|------|------|
| - | 灏氭湭寮€濮嬶紝鏃犻渶 Review |
| pending | 寰?Review |
| approved | Review 閫氳繃 |
| changes_requested | 闇€瑕佷慨鏀?|
| blocked | Review 闃诲 |


### M017 ? game-detail???????
- **??**??????????????????????????????
- **??**?completed
- **??**?0.7.0
- **????**?`frontend/src/app/game/[slug]/`, `frontend/src/components/game/`
- **??**?GameHeader, GameInfo, GameGallery, DownloadSection, RelatedGames, GameDetailSkeleton, TagList, Breadcrumb

### M018 ? download-jump??????
- **??**??????????????????????PC ??????
- **??**?completed
- **??**?0.9.0
- **??**?M008 (download), M001 (games)
- **????**?`backend/api/v1/endpoints/download_jump.py`
- *

*?????2026-07-16 | v0.9.0*
