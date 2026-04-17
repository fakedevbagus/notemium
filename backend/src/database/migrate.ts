import { DatabaseService } from './database.service';

async function main() {
  const database = new DatabaseService();

  try {
    await database.runMigrations();
  } finally {
    await database.onModuleDestroy();
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
