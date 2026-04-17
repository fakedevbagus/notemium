# Database

- Schemas: `schemas/`
- Migrations: `migrations/`
- Seeds: `seeds/`

The backend also carries executable TypeScript migrations in `backend/src/database/migrations.ts`.
Run them against a reachable PostgreSQL database with:

```sh
npm run migrate:backend
```

See `/docs/architecture` for schema diagrams and details.
