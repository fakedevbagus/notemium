import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { migrations } from './migrations';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;
  private available = false;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : undefined,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
    });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT 1');
      await this.runMigrations();
      this.available = true;
    } catch (error) {
      this.available = false;
      this.logger.warn(
        `PostgreSQL is unavailable; using in-memory storage. ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  isAvailable() {
    return this.available;
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: unknown[] = [],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  async runMigrations() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT NOW()
      )
    `);

    for (const migration of migrations) {
      const applied = await this.pool.query(
        'SELECT id FROM schema_migrations WHERE id = $1',
        [migration.id],
      );

      if (applied.rowCount) {
        continue;
      }

      await this.pool.query('BEGIN');
      try {
        await this.pool.query(migration.sql);
        await this.pool.query('INSERT INTO schema_migrations (id) VALUES ($1)', [
          migration.id,
        ]);
        await this.pool.query('COMMIT');
        this.logger.log(`Applied migration ${migration.id}`);
      } catch (error) {
        await this.pool.query('ROLLBACK');
        throw error;
      }
    }
  }
}
