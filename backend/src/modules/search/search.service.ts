import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { InMemoryStore } from '../../database/in-memory.store';

type SearchRow = {
  id: number;
  type: 'note' | 'folder';
  title: string;
  snippet: string | null;
};

@Injectable()
export class SearchService {
  constructor(
    private readonly database: DatabaseService,
    private readonly store: InMemoryStore,
  ) {}

  async search(query = '', userId?: number) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return [];
    }

    if (this.database.isAvailable()) {
      const term = `%${trimmedQuery}%`;
      const noteUserFilter = userId ? 'AND user_id = $2' : '';
      const folderUserFilter = userId ? 'AND user_id = $2' : '';
      const result = await this.database.query<SearchRow>(
        `SELECT id, 'note' AS type, title, LEFT(content, 160) AS snippet
         FROM notes
         WHERE is_trashed = FALSE AND (title ILIKE $1 OR content ILIKE $1)
         ${noteUserFilter}
         UNION ALL
         SELECT id, 'folder' AS type, name AS title, '' AS snippet
         FROM folders
         WHERE name ILIKE $1
         ${folderUserFilter}
         ORDER BY type ASC, title ASC
         LIMIT 50`,
        userId ? [term, userId] : [term],
      );

      return result.rows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        snippet: row.snippet ?? '',
      }));
    }

    const normalizedQuery = trimmedQuery.toLowerCase();
    const notes = this.store.notes
      .filter(
        (note) =>
          !note.isTrashed &&
          (!userId || note.userId === userId) &&
          (note.title.toLowerCase().includes(normalizedQuery) ||
            note.content.toLowerCase().includes(normalizedQuery)),
      )
      .map((note) => ({
        id: note.id,
        type: 'note' as const,
        title: note.title,
        snippet: note.content.slice(0, 160),
      }));

    const folders = this.store.folders
      .filter(
        (folder) =>
          (!userId || folder.userId === userId) &&
          folder.name.toLowerCase().includes(normalizedQuery),
      )
      .map((folder) => ({
        id: folder.id,
        type: 'folder' as const,
        title: folder.name,
        snippet: '',
      }));

    return [...notes, ...folders];
  }
}
