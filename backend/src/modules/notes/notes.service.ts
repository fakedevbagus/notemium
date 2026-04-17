import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { InMemoryStore, StoredNote } from '../../database/in-memory.store';
import { CreateNoteDto, UpdateNoteDto } from './notes.dto';

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

@Injectable()
export class NotesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly store: InMemoryStore,
  ) {}

  async findAll(userId?: number) {
    if (this.database.isAvailable()) {
      const userFilter = userId ? 'AND user_id = $1' : '';
      const result = await this.database.query<NoteRow>(
        `SELECT id, title, content, folder_id, tags, is_pinned, is_archived,
          is_trashed, user_id, created_at, updated_at
         FROM notes
         WHERE is_trashed = FALSE
         ${userFilter}
         ORDER BY is_pinned DESC, updated_at DESC, id DESC`,
        userId ? [userId] : [],
      );

      return result.rows.map((row) => this.mapRow(row));
    }

    return this.store.notes
      .filter((note) => !userId || note.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

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

  async create(createNoteDto: CreateNoteDto, userId?: number) {
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
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId?: number) {
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
  }

  async remove(id: number, userId?: number) {
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
  }

  private async createVersion(noteId: number, title: string, content: string) {
    await this.database.query(
      'INSERT INTO note_versions (note_id, title, content) VALUES ($1, $2, $3)',
      [noteId, title, content],
    );
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
