import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { InMemoryStore, StoredNote } from '../../database/in-memory.store';
import { CreateNoteDto, NotesQueryDto, UpdateNoteDto } from './notes.dto';

type NoteRow = {
  id: number;
  user_id: number | null;
  title: string;
  content: string;
  folder_id: number | null;
  tags: string[] | null;
  is_pinned: boolean;
  is_archived: boolean;
  is_trashed: boolean;
  created_at: Date;
  updated_at: Date;
};

type CountRow = { count: string };

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    private readonly database: DatabaseService,
    private readonly store: InMemoryStore,
  ) {}

  // ── List (with pagination, folder filter, search) ─────────────

  async findAll(query: NotesQueryDto = {}, userId?: number) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 50, 100);
    const offset = (page - 1) * limit;
    const showTrashed = query.trashed === 'true';

    if (this.database.isAvailable()) {
      return this.findAllPg(userId, page, limit, offset, showTrashed, query);
    }

    return this.findAllMemory(userId, page, limit, offset, showTrashed, query);
  }

  private async findAllPg(
    userId: number | undefined,
    page: number,
    limit: number,
    offset: number,
    showTrashed: boolean,
    query: NotesQueryDto,
  ) {
    const conditions: string[] = [`is_trashed = ${showTrashed ? 'TRUE' : 'FALSE'}`];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (userId) {
      conditions.push(`user_id = $${paramIdx++}`);
      params.push(userId);
    }
    if (query.folderId) {
      conditions.push(`folder_id = $${paramIdx++}`);
      params.push(query.folderId);
    }
    if (query.search) {
      conditions.push(`(title ILIKE $${paramIdx} OR content ILIKE $${paramIdx})`);
      params.push(`%${query.search}%`);
      paramIdx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.database.query<CountRow>(
      `SELECT COUNT(*) AS count FROM notes ${where}`,
      params,
    );
    const total = Number(countResult.rows[0].count);

    const result = await this.database.query<NoteRow>(
      `SELECT id, title, content, folder_id, tags, is_pinned, is_archived,
        is_trashed, user_id, created_at, updated_at
       FROM notes
       ${where}
       ORDER BY is_pinned DESC, updated_at DESC, id DESC
       LIMIT $${paramIdx++} OFFSET $${paramIdx}`,
      [...params, limit, offset],
    );

    return {
      data: result.rows.map((row) => this.mapRow(row)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  private findAllMemory(
    userId: number | undefined,
    page: number,
    limit: number,
    offset: number,
    showTrashed: boolean,
    query: NotesQueryDto,
  ) {
    let filtered = this.store.notes.filter((note) => {
      if (note.isTrashed !== showTrashed) return false;
      if (userId && note.userId !== userId) return false;
      if (query.folderId && note.folderId !== query.folderId) return false;
      if (query.search) {
        const term = query.search.toLowerCase();
        if (
          !note.title.toLowerCase().includes(term) &&
          !note.content.toLowerCase().includes(term)
        ) {
          return false;
        }
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

    const total = filtered.length;
    const data = filtered.slice(offset, offset + limit);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ── Trash listing ─────────────────────────────────────────────

  async findTrashed(userId?: number) {
    if (this.database.isAvailable()) {
      const userFilter = userId ? 'AND user_id = $1' : '';
      const result = await this.database.query<NoteRow>(
        `SELECT id, title, content, folder_id, tags, is_pinned, is_archived,
          is_trashed, user_id, created_at, updated_at
         FROM notes
         WHERE is_trashed = TRUE
         ${userFilter}
         ORDER BY updated_at DESC, id DESC`,
        userId ? [userId] : [],
      );

      return result.rows.map((row) => this.mapRow(row));
    }

    return this.store.notes
      .filter((note) => note.isTrashed && (!userId || note.userId === userId))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  // ── Find one ──────────────────────────────────────────────────

  async findOne(id: number, userId?: number) {
    if (this.database.isAvailable()) {
      const userFilter = userId ? 'AND user_id = $2' : '';
      const result = await this.database.query<NoteRow>(
        `SELECT id, title, content, folder_id, tags, is_pinned, is_archived,
          is_trashed, user_id, created_at, updated_at
         FROM notes
         WHERE id = $1 ${userFilter}`,
        userId ? [id, userId] : [id],
      );

      const note = result.rows[0];

      if (!note) {
        throw new NotFoundException(`Note with id ${id} was not found`);
      }

      return this.mapRow(note);
    }

    const note = this.store.notes.find(
      (item) => item.id === id && (!userId || item.userId === userId),
    );

    if (!note) {
      throw new NotFoundException(`Note with id ${id} was not found`);
    }

    return note;
  }

  // ── Create ────────────────────────────────────────────────────

  async create(createNoteDto: CreateNoteDto, userId?: number) {
    try {
      if (this.database.isAvailable()) {
        const result = await this.database.query<NoteRow>(
          `INSERT INTO notes (title, content, folder_id, tags, user_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, title, content, folder_id, tags, is_pinned, is_archived,
            is_trashed, user_id, created_at, updated_at`,
          [
            createNoteDto.title,
            createNoteDto.content,
            createNoteDto.folderId ?? null,
            createNoteDto.tags ?? [],
            userId ?? null,
          ],
        );

        const note = this.mapRow(result.rows[0]);
        await this.createVersion(note.id, note.title, note.content);

        return note;
      }

      const timestamp = new Date().toISOString();
      const note: StoredNote = {
        id: this.store.nextNoteId(),
        userId,
        title: createNoteDto.title,
        content: createNoteDto.content,
        folderId: createNoteDto.folderId,
        tags: createNoteDto.tags ?? [],
        isPinned: false,
        isArchived: false,
        isTrashed: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      this.store.notes.push(note);
      this.createMemoryVersion(note);

      return note;
    } catch (error) {
      this.logger.error(`Failed to create note: ${error}`);
      throw error;
    }
  }

  // ── Update ────────────────────────────────────────────────────

  async update(id: number, updateNoteDto: UpdateNoteDto, userId?: number) {
    try {
      if (this.database.isAvailable()) {
        const existingNote = await this.findOne(id, userId);
        const nextNote = {
          title: updateNoteDto.title ?? existingNote.title,
          content: updateNoteDto.content ?? existingNote.content,
          folderId: updateNoteDto.folderId ?? existingNote.folderId ?? null,
          tags: updateNoteDto.tags ?? existingNote.tags ?? [],
          isPinned: updateNoteDto.isPinned ?? existingNote.isPinned,
          isArchived: updateNoteDto.isArchived ?? existingNote.isArchived,
          isTrashed: updateNoteDto.isTrashed ?? existingNote.isTrashed,
        };

        const result = await this.database.query<NoteRow>(
          `UPDATE notes
           SET title = $2, content = $3, folder_id = $4, tags = $5,
            is_pinned = $6, is_archived = $7, is_trashed = $8, updated_at = NOW()
           WHERE id = $1
           RETURNING id, title, content, folder_id, tags, is_pinned, is_archived,
            is_trashed, user_id, created_at, updated_at`,
          [
            id,
            nextNote.title,
            nextNote.content,
            nextNote.folderId,
            nextNote.tags,
            nextNote.isPinned,
            nextNote.isArchived,
            nextNote.isTrashed,
          ],
        );

        const note = this.mapRow(result.rows[0]);
        await this.createVersion(note.id, note.title, note.content);

        return note;
      }

      const note = await this.findOne(id, userId);

      Object.assign(note, updateNoteDto, {
        updatedAt: new Date().toISOString(),
      });

      this.createMemoryVersion(note);

      return note;
    } catch (error) {
      this.logger.error(`Failed to update note ${id}: ${error}`);
      throw error;
    }
  }

  // ── Soft delete (move to trash) ───────────────────────────────

  async softDelete(id: number, userId?: number) {
    try {
      if (this.database.isAvailable()) {
        const userFilter = userId ? 'AND user_id = $2' : '';
        const result = await this.database.query<NoteRow>(
          `UPDATE notes
           SET is_trashed = TRUE, updated_at = NOW()
           WHERE id = $1 ${userFilter}
           RETURNING id, title, content, folder_id, tags, is_pinned, is_archived,
            is_trashed, user_id, created_at, updated_at`,
          userId ? [id, userId] : [id],
        );

        const note = result.rows[0];

        if (!note) {
          throw new NotFoundException(`Note with id ${id} was not found`);
        }

        return this.mapRow(note);
      }

      const note = this.store.notes.find(
        (item) => item.id === id && (!userId || item.userId === userId),
      );

      if (!note) {
        throw new NotFoundException(`Note with id ${id} was not found`);
      }

      note.isTrashed = true;
      note.updatedAt = new Date().toISOString();

      return note;
    } catch (error) {
      this.logger.error(`Failed to soft-delete note ${id}: ${error}`);
      throw error;
    }
  }

  // ── Restore from trash ────────────────────────────────────────

  async restore(id: number, userId?: number) {
    try {
      if (this.database.isAvailable()) {
        const userFilter = userId ? 'AND user_id = $2' : '';
        const result = await this.database.query<NoteRow>(
          `UPDATE notes
           SET is_trashed = FALSE, updated_at = NOW()
           WHERE id = $1 ${userFilter}
           RETURNING id, title, content, folder_id, tags, is_pinned, is_archived,
            is_trashed, user_id, created_at, updated_at`,
          userId ? [id, userId] : [id],
        );

        const note = result.rows[0];

        if (!note) {
          throw new NotFoundException(`Note with id ${id} was not found`);
        }

        return this.mapRow(note);
      }

      const note = this.store.notes.find(
        (item) => item.id === id && (!userId || item.userId === userId),
      );

      if (!note) {
        throw new NotFoundException(`Note with id ${id} was not found`);
      }

      note.isTrashed = false;
      note.updatedAt = new Date().toISOString();

      return note;
    } catch (error) {
      this.logger.error(`Failed to restore note ${id}: ${error}`);
      throw error;
    }
  }

  // ── Permanent delete ──────────────────────────────────────────

  async remove(id: number, userId?: number) {
    try {
      if (this.database.isAvailable()) {
        const userFilter = userId ? 'AND user_id = $2' : '';
        const result = await this.database.query<NoteRow>(
          `DELETE FROM notes
           WHERE id = $1 ${userFilter}
           RETURNING id, title, content, folder_id, tags, is_pinned, is_archived,
            is_trashed, user_id, created_at, updated_at`,
          userId ? [id, userId] : [id],
        );

        const note = result.rows[0];

        if (!note) {
          throw new NotFoundException(`Note with id ${id} was not found`);
        }

        return this.mapRow(note);
      }

      const noteIndex = this.store.notes.findIndex(
        (item) => item.id === id && (!userId || item.userId === userId),
      );

      if (noteIndex === -1) {
        throw new NotFoundException(`Note with id ${id} was not found`);
      }

      const [removedNote] = this.store.notes.splice(noteIndex, 1);

      return removedNote;
    } catch (error) {
      this.logger.error(`Failed to permanently delete note ${id}: ${error}`);
      throw error;
    }
  }

  // ── Version helpers ───────────────────────────────────────────

  private async createVersion(noteId: number, title: string, content: string) {
    try {
      await this.database.query(
        'INSERT INTO note_versions (note_id, title, content) VALUES ($1, $2, $3)',
        [noteId, title, content],
      );
    } catch (error) {
      this.logger.warn(`Failed to create version for note ${noteId}: ${error}`);
    }
  }

  private createMemoryVersion(note: StoredNote) {
    this.store.versions.push({
      id: this.store.nextVersionId(),
      noteId: note.id,
      title: note.title,
      content: note.content,
      createdAt: new Date().toISOString(),
    });
  }

  // ── Row mapper ────────────────────────────────────────────────

  private mapRow(row: NoteRow): StoredNote {
    return {
      id: row.id,
      userId: row.user_id ?? undefined,
      title: row.title,
      content: row.content,
      folderId: row.folder_id ?? undefined,
      tags: row.tags ?? [],
      isPinned: row.is_pinned,
      isArchived: row.is_archived,
      isTrashed: row.is_trashed,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}
