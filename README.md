# Notemium

A professional-grade, feature-rich note-taking web application built with **Next.js** and **NestJS**.

## ✨ Features

- **Notes** — Create, edit, delete, pin, archive, and organize notes
- **Folders** — Organize notes into folders with nested support
- **Search** — Full-text search across notes and folders
- **Authentication** — JWT-based auth with per-user note ownership
- **Dark mode** — Persistent light/dark/system theme with localStorage
- **Collaboration** — Invite collaborators and comment on shared notes
- **Versioning** — Automatic note history with compare and restore
- **AI helpers** — Summarize, rewrite, auto-tag, and semantic search
- **Responsive UI** — Tailwind CSS with smooth transitions

## 🏗 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Zustand |
| Backend   | NestJS 11, TypeScript, PostgreSQL, JWT |
| Testing   | Jest, Testing Library, Supertest  |
| Infra     | Docker Compose, PostgreSQL 15     |

## 📁 Monorepo Structure

```
├── frontend/     # Next.js application (port 3000)
├── backend/      # NestJS API server (port 3001)
├── database/     # Database schemas and seeds
├── docs/         # Project documentation
├── tests/        # Cross-project integration tests
├── infrastructure/
└── scripts/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd notemium
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start development servers**
   ```bash
   # Terminal 1 — Backend (http://localhost:3001)
   npm run dev:backend

   # Terminal 2 — Frontend (http://localhost:3000)
   npm run dev:frontend
   ```

> **Note:** PostgreSQL is optional for local development. If unavailable, the backend automatically falls back to in-memory storage.

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:frontend` | Start Next.js dev server |
| `npm run dev:backend` | Start NestJS dev server |
| `npm run build` | Build all workspaces |
| `npm run migrate:backend` | Apply database migrations |
| `npm test` | Run all tests |
| `npm run typecheck` | Type-check all workspaces |
| `npm run lint` | Lint frontend |
| `npm run quality` | Lint + typecheck + test |

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:3001/api` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret for JWT signing | — |
| `AI_API_KEY` | API key for AI features | — |

## 🐳 Docker Compose

```bash
cp .env.example .env
docker compose up
```

Services: `frontend` (3000), `backend` (3001), `db` (PostgreSQL 5432).

## 📚 Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Setup Guide](docs/setup.md)

## 📄 License

[MIT](LICENSE)
