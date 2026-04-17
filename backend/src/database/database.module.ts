import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { InMemoryStore } from './in-memory.store';

@Global()
@Module({
  providers: [DatabaseService, InMemoryStore],
  exports: [DatabaseService, InMemoryStore],
})
export class DatabaseModule {}
