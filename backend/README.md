# Backend (NestJS)

This is a minimal NestJS backend for the Project Manager application.

Quick start:

1. cd backend
2. npm install
3. npm run start:dev

API endpoints (high level):
- POST /api/modules
- GET  /api/modules
- GET  /api/modules/:id
- PUT  /api/modules/:id
- DELETE /api/modules/:id
- GET  /api/modules/role/:roleId

This backend uses TypeORM with SQLite (`data/sqlite.db`).

## API Docs (OpenAPI / Swagger)

When backend is running, open:

- `http://localhost:3001/api/docs`

From this view you can:

- See all endpoint types (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- Inspect request/response schemas
- Execute requests directly from Swagger UI

## Unit tests for endpoints

Run controller endpoint unit tests with:

```bash
npm test
```

Useful variants:

```bash
npm run test:watch
npm run test:cov
```

## Useful API curl examples

Below are quick curl commands you can use during development. Replace HOST and IDs as needed (default backend host: `http://localhost:3001`).

- List roles (returns role UUIDs):

```bash
curl http://localhost:3001/api/roles
```

- Get permissions for a role (replace ROLE_ID):

```bash
curl http://localhost:3001/api/permissions/role/ROLE_ID
```

- Login (returns `token` and `id`). Use the returned token for Authorization header.

```bash
curl -X POST http://localhost:3001/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@test.com","password":"admin123"}'
```

- Attempt to delete a user (requires DELETE permission on `/users`). Replace USER_ID and use token from login (example token format: `fake-jwt-token-<userId>`):

```bash
curl -X DELETE http://localhost:3001/api/users/USER_ID \
	-H "Authorization: Bearer fake-jwt-token-<userId>"
```

Notes:

- If your seed previously stored `roleId` as a role name (e.g. `"admin"`) the frontend attempts to resolve that name to the role UUID at startup; the seeder also corrects existing users on backend restart.

## Permission guard strict mode

The backend guard that enforces permissions will by default allow requests when no matching module is found for the request route (backwards compatible for unknown routes). You can enable a stricter policy that denies requests when a module is not found by setting the `PERMISSION_STRICT` environment variable.

Example (enable strict mode):

```bash
export PERMISSION_STRICT=true
npm run start:dev
```

Set `PERMISSION_STRICT=false` (default) to keep the permissive behavior.
