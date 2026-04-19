# Notemium Backend

NestJS 11 REST API powering the Notemium note-taking application.

## Features

- **Modular architecture** — Auth, Notes, Folders, Search, Collaboration, Versioning, AI
- **PostgreSQL** persistence with automatic migrations
- **In-memory fallback** — works without a database for local development
- **JWT authentication** with optional per-user ownership
- **Soft delete (trash)** for notes with restore support
- **Pagination** with page/limit/total metadata
- **Folder filtering & inline search** on notes listing
- **Version history** — every note edit is tracked
- **Validation** — class-validator pipes on all endpoints

## Prerequisites

- **Node.js** 20+
- **npm** 10+
- **PostgreSQL** 15+ _(optional — falls back to in-memory storage)_

## Setup

```bash
# From monorepo root
npm install

# Or from backend/ directory
npm install
```

## Environment Variables

Create a `.env` file in the monorepo root (or set environment variables directly):

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `DATABASE_HOST` | DB host (alt. to connection string) | — |
| `DATABASE_PORT` | DB port | `5432` |
| `DATABASE_NAME` | DB name | — |
| `DATABASE_USER` | DB user | — |
| `DATABASE_PASSWORD` | DB password | — |
| `JWT_SECRET` | Secret for JWT signing | `dev-notepad-secret` |
| `PORT` | Server port | `3001` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |

> **Tip:** If no database is configured, the backend falls back to in-memory storage automatically.

## Running

```bash
# Development (watch mode)
npm run start:dev    # http://localhost:3001/api

# Production
npm run build
npm run start
```

Or from monorepo root:

```bash
npm run dev:backend
```

## Database Migrations

Migrations run automatically on startup when PostgreSQL is available. To run them manually:

```bash
npm run build
npm run migrate
```

## API Endpoints

All routes are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `GET` | `/api/auth/me` | Get current user (requires Bearer token) |

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes` | List notes (paginated, filterable) |
| `GET` | `/api/notes/trash` | List trashed notes |
| `GET` | `/api/notes/:id` | Get a single note |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Soft delete (move to trash) |
| `PATCH` | `/api/notes/:id/restore` | Restore from trash |
| `DELETE` | `/api/notes/:id/permanent` | Permanently delete |

**Query params for `GET /api/notes`:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 50, max: 100) |
| `folderId` | number | Filter by folder |
| `search` | string | Search title/content |
| `trashed` | string | `"true"` to list trashed notes |

### Folders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/folders` | List all folders |
| `GET` | `/api/folders/:id` | Get a single folder |
| `POST` | `/api/folders` | Create a folder |
| `PUT` | `/api/folders/:id` | Update a folder |
| `DELETE` | `/api/folders/:id` | Delete a folder |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search?q=<query>` | Search notes and folders |

### Versioning

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/versioning/:noteId` | List versions of a note |
| `POST` | `/api/versioning/restore/:versionId` | Restore a version |
| `POST` | `/api/versioning/compare` | Compare two versions |

### Collaboration

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/collaboration/invite` | Invite collaborator |
| `POST` | `/api/collaboration/comment/:noteId` | Add comment |
| `GET` | `/api/collaboration/shared/:noteId` | Get collaborators & comments |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/summarize` | Summarize content |
| `POST` | `/api/ai/rewrite` | Rewrite content |
| `POST` | `/api/ai/auto-tag` | Auto-generate tags |
| `POST` | `/api/ai/semantic-search` | Semantic search |

## Testing

```bash
# Unit tests
npm test

# E2E tests
npx jest --runInBand test/

# Manual testing with curl
curl http://localhost:3001/api/notes
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello world"}'
```

## Architecture

```
src/
├── main.ts                 # Bootstrap & global config
├── app.module.ts           # Root module
├── database/
│   ├── database.module.ts  # Global DB module
│   ├── database.service.ts # PostgreSQL connection + migrations
│   ├── in-memory.store.ts  # In-memory fallback
│   ├── migrations.ts       # SQL migrations
│   └── migrate.ts          # CLI migration runner
└── modules/
    ├── auth/               # JWT authentication
    ├── notes/              # Notes CRUD + trash
    ├── folders/            # Folders CRUD
    ├── search/             # Full-text search
    ├── collaboration/      # Sharing & comments
    ├── versioning/         # Note version history
    └── ai/                 # AI helpers (local)
```
