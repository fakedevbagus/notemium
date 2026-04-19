# Notemium Backend

NestJS API server for Notemium.

- Modular architecture with REST endpoints
- Auth, Notes, Folders, Search, Collaboration, Versioning, AI
- PostgreSQL persistence with in-memory fallback
- JWT authentication with optional per-user ownership

## Development

```bash
npm run start:dev  # http://localhost:3001 (watch mode)
npm run build      # Compile TypeScript
```

## Migrations

```bash
npm run build
npm run migrate
```

## Testing

- **Runner:** Jest with ts-jest
- **Location:** `test/*.e2e-spec.ts`
- **Run:** `npx jest --runInBand test/`
