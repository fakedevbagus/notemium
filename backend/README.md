# Notepad Pro Backend

Node.js (NestJS/Express) API for Notepad Pro.

- Modular, scalable, secure
- REST endpoints for auth, notes, folders, search, collaboration, versioning, and AI helpers
- PostgreSQL persistence with in-memory fallback for local tests
- JWT authentication with per-user ownership for notes/folders when a bearer token is present
- See `/docs` for requirements

## Migrations

Build and apply migrations against a reachable PostgreSQL database:

```sh
npm run build
npm run migrate
```

## Testing

- **Test Runner:** Jest (with ts-jest)
- **Test Utilities:** @nestjs/testing, supertest
- **Test Location:** `test/*.e2e-spec.ts`
- **How to Run:**
	```sh
	npx jest --runInBand test/
	```
- **Coverage:** All API endpoints (CRUD for notes, folders, search, etc.)
- **Config:** In-memory service logic for isolated e2e tests.
