# Notemium — Setup Guide

## Prerequisites

- **Node.js** 20 or later
- **npm** 10 or later
- **PostgreSQL** 15 (optional — the app works without it)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

This installs all dependencies for both frontend and backend workspaces.

### 2. Configure environment

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` with your values. For local development, only `JWT_SECRET` matters if using auth.

### 3. Start the backend

```bash
npm run dev:backend
```

The NestJS server starts on **http://localhost:3001**. If PostgreSQL is not available, it automatically falls back to in-memory storage (data resets on restart).

### 4. Start the frontend

```bash
npm run dev:frontend
```

The Next.js dev server starts on **http://localhost:3000**.

### 5. Open the app

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup (optional)

If you want persistent data, set up PostgreSQL:

### Option A: Docker

```bash
docker compose up db -d
```

This starts PostgreSQL on port 5432 with the credentials from `.env.example`.

### Option B: Local PostgreSQL

1. Create a database named `notemium`
2. Set `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/notemium
   ```
3. Run migrations:
   ```bash
   npm run migrate:backend
   ```

---

## Docker Compose (full stack)

To run the entire stack in Docker:

```bash
cp .env.example .env
docker compose up
```

| Service    | Port  |
|------------|-------|
| Frontend   | 3000  |
| Backend    | 3001  |
| PostgreSQL | 5432  |

---

## Troubleshooting

### "Failed to fetch" on the frontend
- Ensure the backend is running on port 3001
- Check that `NEXT_PUBLIC_API_BASE_URL` in `.env` matches the backend URL

### Theme resets on navigation
- Clear `localStorage` and refresh — the new theme system persists correctly

### PostgreSQL connection errors
- The backend gracefully falls back to in-memory storage
- Check the console for `PostgreSQL is unavailable; using in-memory storage`

### Tailwind styles not loading
- Ensure `postcss.config.js` exists in `frontend/`
- Ensure `globals.css` is imported in `layout.tsx`
- Run `npm install` to ensure `autoprefixer` is available
