import { Module } from '@nestjs/common';
import { NotesModule } from './modules/notes/notes.module';
import { FoldersModule } from './modules/folders/folders.module';
import { SearchModule } from './modules/search/search.module';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { VersioningModule } from './modules/versioning/versioning.module';
import { AiModule } from './modules/ai/ai.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    NotesModule,
    FoldersModule,
    SearchModule,
    CollaborationModule,
    VersioningModule,
    AiModule,
  ],
})
export class AppModule {}
