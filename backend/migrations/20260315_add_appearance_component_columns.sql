-- Migration: add component-specific appearance columns for SQLite
-- Date: 2026-03-15

PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

ALTER TABLE appearance ADD COLUMN gridHeaderBgColor TEXT DEFAULT '#FFFFFF';
ALTER TABLE appearance ADD COLUMN gridBodyBgColor TEXT DEFAULT '#FFFFFF';
ALTER TABLE appearance ADD COLUMN gridIconColor TEXT DEFAULT '#3B82F6';
ALTER TABLE appearance ADD COLUMN tableHeaderBgColor TEXT DEFAULT '#F8FAFC';
ALTER TABLE appearance ADD COLUMN tableRowBgColor TEXT DEFAULT '#FFFFFF';
ALTER TABLE appearance ADD COLUMN menuBgColor TEXT DEFAULT '#FFFFFF';
ALTER TABLE appearance ADD COLUMN menuTextColor TEXT DEFAULT '#111827';
ALTER TABLE appearance ADD COLUMN loginBackgroundColor TEXT DEFAULT '#FFFFFF';
ALTER TABLE appearance ADD COLUMN loginFormBgColor TEXT DEFAULT '#FFFFFF';
ALTER TABLE appearance ADD COLUMN loginHeaderColor TEXT DEFAULT '#111827';
ALTER TABLE appearance ADD COLUMN isActive INTEGER DEFAULT 1;
ALTER TABLE appearance ADD COLUMN isDefault INTEGER DEFAULT 0;

COMMIT;
PRAGMA foreign_keys=on;
