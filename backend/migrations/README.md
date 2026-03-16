Migration usage (SQLite)

This project uses TypeORM with SQLite (see `src/app.module.ts`). You can apply the SQL migration below in two ways:

1) Using `sqlite3` CLI (quick):

- Open a terminal in the `backend` folder and run:

```bash
# apply migration file directly to DB
sqlite3 data/sqlite.db < migrations/20260315_add_appearance_component_columns.sql
```

- Verify the columns exist:

```bash
sqlite3 data/sqlite.db "PRAGMA table_info('appearance');"
```

2) Using TypeORM migrations (recommended for production workflows):

- If you prefer TypeORM-managed migrations, convert the SQL into a proper TypeORM migration class and run with the TypeORM CLI. The SQL file is provided for immediate application.

Notes:
- `app.module.ts` currently has `synchronize: true` which will auto-sync entities on app start. If you want deterministic migrations, set `synchronize: false` in `src/app.module.ts` and use TypeORM migrations instead.
- Backup your `data/sqlite.db` before applying migrations in production.
