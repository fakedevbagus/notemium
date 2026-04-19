# Notemium — Architecture

## Overview

Notemium is a full-stack note-taking application organized as an npm workspace monorepo with two main packages:

```
notemium/
├── frontend/    Next.js 16 (App Router)
├── backend/     NestJS 11
└── shared via npm workspaces
```

## Frontend Architecture

### Framework
- **Next.js 16** with App Router (`/src/app/`)
- **React 19** with Server and Client Components
- **TypeScript** throughout

### State Management
- **Zustand** stores for notes and folders (`/src/store/`)
- Each store handles CRUD operations and loading/error states
- No prop drilling — stores are consumed directly via hooks

### Routing
```
/              → Home page
/notes         → Notes list + editor (split pane)
/folders       → Folders list + details
/search        → Full-text search
/settings      → Theme toggle, authentication
```

### Styling
- **Tailwind CSS 3** with `darkMode: 'class'`
- PostCSS pipeline with autoprefixer
- Global CSS with smooth theme transitions
- All components use utility classes (no CSS modules)

### Theme System
- Three modes: Light, Dark, System
- Persisted to `localStorage` key `notemium.theme`
- Applied via `<html>` class toggle (`dark`)
- Shared between ThemeToggle (header) and Settings page
- Responds to OS preference changes in System mode

### API Layer
```
src/lib/
├── http.ts        Base fetch wrapper with auth headers
├── api.ts         Notes CRUD functions
├── apiFolders.ts  Folders CRUD functions
├── apiSearch.ts   Search function
├── apiAuth.ts     Auth register/login/me
└── auth.ts        Token storage helpers
```

## Backend Architecture

### Framework
- **NestJS 11** with Express adapter
- Modular design with feature modules

### Modules
```
src/modules/
├── auth/           JWT authentication (optional)
├── notes/          Notes CRUD with ownership
├── folders/        Folders CRUD with ownership
├── search/         Full-text search across entities
├── collaboration/  Invite, comment, shared access
├── versioning/     Note history with diff/restore
└── ai/             Summarize, rewrite, auto-tag
```

### Database
- **PostgreSQL** primary database with migration system
- **In-memory fallback** when PostgreSQL is unavailable
- `DatabaseService` handles connection, migrations, and availability checking
- `InMemoryStore` provides identical API surface for local development

### Authentication
- JWT-based with `OptionalJwtAuthGuard`
- Unauthenticated requests are allowed (for local dev)
- When authenticated, resources are scoped to the user

### API Design
- RESTful endpoints under `/api` prefix
- Global validation pipe with class-validator DTOs
- CORS enabled for frontend dev server

## Data Flow

```
Browser → Next.js Page → Zustand Store → fetch() → NestJS Controller → Service → Database/Memory
```

## Key Design Decisions

1. **Optional auth** — The app works without login for local development
2. **In-memory fallback** — No PostgreSQL required to start developing
3. **Zustand over Redux** — Minimal boilerplate for simple CRUD state
4. **App Router** — Modern Next.js patterns with Server Components for layout
5. **Monorepo** — Shared tooling and single `npm install`
