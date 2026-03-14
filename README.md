# 🗂️ Project Manager

Administra, gestiona y crea tus proyectos futuros.

## Features

- **Create** new projects with name, description, status, priority, and due date
- **View** all projects in a responsive card grid with colour-coded priority borders
- **Edit** any project via a clean modal form
- **Delete** projects with a confirmation dialog
- **Filter** projects by status or priority
- **Search** projects by name or description
- **Stats dashboard** showing totals by status

## Tech Stack

- **Backend**: Node.js + Express 5 + SQLite (via `better-sqlite3`)
- **Frontend**: Vanilla HTML / CSS / JavaScript (no build step)

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Set a custom port with the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List all projects (supports `?search=`, `?status=`, `?priority=`) |
| GET | `/api/projects/:id` | Get a single project |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

### Project fields

| Field | Type | Values |
|-------|------|--------|
| `name` | string | Required |
| `description` | string | Optional |
| `status` | string | `pending`, `in-progress`, `completed`, `on-hold`, `cancelled` |
| `priority` | string | `low`, `medium`, `high`, `critical` |
| `due_date` | string | ISO date (`YYYY-MM-DD`), optional |

## Running Tests

```bash
npm test
```

