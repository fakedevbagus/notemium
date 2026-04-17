# Notepad Pro

A professional-grade, feature-rich, and scalable Notepad / note-taking web application inspired by Notion, Evernote, OneNote, and Google Keep.

## Monorepo Structure

- `frontend/` - Next.js (React) application
- `backend/` - NestJS API
- `database/` - Database schemas, migrations, and seeds
- `tests/` - Cross-project integration and quality checks
- `docs/` - Project documentation
- `infrastructure/` - Deployment and infrastructure assets
- `scripts/` - Utility scripts

## Workspace Requirements

- Node.js 20+
- npm 10+ with workspace support

This repository is configured as an npm workspace monorepo. Use the root `package-lock.json` as the source of truth for dependency resolution.

## Getting Started

1. Copy the example environment file:
   - Windows: `copy .env.example .env`
   - macOS/Linux: `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Start the applications in separate terminals:
   - `npm run dev:backend`
   - `npm run dev:frontend`

The backend uses PostgreSQL when `DATABASE_URL` or the `DATABASE_*` environment variables point to a reachable database. If PostgreSQL is unavailable in local tests, the API falls back to in-memory storage.

Auth is available through `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/me`. Notes, folders, and search are scoped to the authenticated user when an `Authorization: Bearer <token>` header is present; unauthenticated requests remain supported for local development and legacy tests.

## Root Scripts

- `npm run dev:frontend` - Start the Next.js development server
- `npm run dev:backend` - Start the NestJS development server
- `npm run build:frontend` - Build the frontend
- `npm run build:backend` - Build the backend
- `npm run build` - Build all workspaces
- `npm run migrate:backend` - Build the backend and apply database migrations
- `npm run test:frontend` - Run frontend tests
- `npm run test:backend` - Run backend tests
- `npm test` - Run all workspace tests
- `npm run lint:frontend` - Run frontend linting
- `npm run typecheck` - Type-check all workspaces

## Docker Compose

The root `docker-compose.yml` provides local dependencies for development:

- `db` - PostgreSQL 15 with a named data volume
- `backend` - NestJS service built from `backend/Dockerfile.backend`
- `frontend` - Next.js service built from `frontend/Dockerfile.frontend`

Before running Docker Compose, create a local `.env` file from `.env.example`.

Inside Docker Compose, the backend overrides `DATABASE_URL` to point at the `db` service. For local non-Docker migrations, start PostgreSQL first and then run `npm run migrate:backend`.

## Documentation

- Root docs index: `docs/README.md`

## Notes

- Keep secrets out of version control. Use `.env` locally and secure secret management in deployment environments.
