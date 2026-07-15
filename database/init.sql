-- Database initialization script.
-- Executed on first PostgreSQL container start.

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search

-- Placeholder: tables will be managed by Alembic migrations.
