# DATABASE.md — 数据库规范

> 当前阶段（v0.1.0）暂不设计具体数据表。本文档仅规定数据库命名、索引、Migration 等规范。

---

## 命名规范

### 表名
- 格式：`snake_case` 复数
- 示例：`games`, `game_resources`, `user_profiles`
- 关联表：`{table1}_{table2}`（按字母序），如 `game_categories`

### 列名
- 格式：`snake_case`
- 主键：`id` (UUID v4)
- 外键：`{referenced_table_singular}_id`，如 `game_id`, `user_id`
- 时间戳：`created_at`, `updated_at`, `deleted_at`
- 布尔值：`is_` 前缀，如 `is_active`, `is_verified`

### 索引命名
- 普通索引：`ix_{table}_{column}`
- 唯一索引：`uq_{table}_{column}`
- 外键索引：`fk_{table}_{column}_{ref_table}`
- 复合索引：`ix_{table}_{col1}_{col2}`

### 约束命名
- 主键：`pk_{table}`
- 外键：`fk_{table}_{column}_{ref_table}`
- 唯一约束：`uq_{table}_{column}`
- 检查约束：`ck_{table}_{description}`

---

## 字段规范

### 必须字段
每个业务表必须包含：

```sql
id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
deleted_at  TIMESTAMPTZ  -- 软删除
```

### 字段类型选择

| 用途 | PostgreSQL 类型 |
|------|----------------|
| UUID 主键 | `UUID` |
| 短文本 (≤255) | `VARCHAR(255)` |
| 长文本 | `TEXT` |
| 整数 | `INTEGER` / `BIGINT` |
| 小数 | `NUMERIC(precision, scale)` |
| 布尔值 | `BOOLEAN` |
| 日期时间 | `TIMESTAMPTZ` |
| JSON 数据 | `JSONB` |
| 枚举 | `VARCHAR(50)` + CHECK 约束 |
| 文件大小 | `BIGINT` (bytes) |

---

## 索引规范

### 必须建索引的场景
- 所有外键列
- WHERE 条件中频繁使用的列
- ORDER BY 列
- 唯一约束列
- 软删除查询常用列：`(deleted_at)` 部分索引

### 索引原则
- 避免过多索引（影响写入性能）
- 复合索引列顺序：等值查询在前，范围查询在后
- 使用部分索引减少索引大小：`WHERE deleted_at IS NULL`

---

## 删除规范

### 软删除
- 所有删除操作使用软删除（设置 `deleted_at`）
- 查询默认过滤 `WHERE deleted_at IS NULL`
- 定期归档 `deleted_at` 超过 N 天的数据

### 禁止操作
- ❌ 物理删除（DROP、TRUNCATE、硬 DELETE）
- ❌ CASCADE DELETE（使用软删除代替）
- ❌ 修改已有 Migration 文件

---

## Migration 规范

### 文件命名
```
alembic/versions/{YYYY}_{MM}_{DD}_{HHMM}-{description}.py
```

示例：`2026_07_15_1430-add_games_table.py`

### Migration 要求
- 每个 Migration 只做一件事
- 必须同时实现 `upgrade()` 和 `downgrade()`
- 数据迁移和结构迁移分开
- 新 Migration 不能修改已合并的 Migration

### 执行流程
```bash
# 生成迁移
alembic revision --autogenerate -m "add_games_table"

# 执行迁移
alembic upgrade head

# 回滚
alembic downgrade -1
```

---

## 性能规范

- 避免 `SELECT *`，明确列出所需列
- 使用连接池（默认 20 连接）
- 大量数据查询必须分页
- 慢查询记录到日志（> 100ms）
- 定期执行 `VACUUM ANALYZE`

---

*最后更新：2026-07-15 | v0.1.0*
