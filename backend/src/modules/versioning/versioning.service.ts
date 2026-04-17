import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { InMemoryStore } from '../../database/in-memory.store';

type VersionRow = {
  id: number;
  note_id: number;
  title: string | null;
  content: string;
  created_at: Date;
};

@Injectable()
export class VersioningService {
  constructor(
    private readonly database: DatabaseService,
    private readonly store: InMemoryStore,
  ) {}

  async getVersions(noteId: number) {
    if (this.database.isAvailable()) {
      const result = await this.database.query<VersionRow>(
        `SELECT id, note_id, title, content, created_at
         FROM note_versions
         WHERE note_id = $1
         ORDER BY created_at DESC, id DESC`,
        [noteId],
      );

      return { versions: result.rows.map((row) => this.mapRow(row)) };
    }

    return {
      versions: this.store.versions
        .filter((version) => version.noteId === noteId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  }

  async restoreVersion(versionId: number) {
    if (this.database.isAvailable()) {
      const versionResult = await this.database.query<VersionRow>(
        'SELECT id, note_id, title, content, created_at FROM note_versions WHERE id = $1',
        [versionId],
      );
      const version = versionResult.rows[0];

      if (!version) {
        throw new NotFoundException(`Version with id ${versionId} was not found`);
      }

      await this.database.query(
        'UPDATE notes SET title = COALESCE($2, title), content = $3, updated_at = NOW() WHERE id = $1',
        [version.note_id, version.title, version.content],
      );

      return { success: true, restored: this.mapRow(version) };
    }

    const version = this.store.versions.find((item) => item.id === versionId);

    if (!version) {
      throw new NotFoundException(`Version with id ${versionId} was not found`);
    }

    const note = this.store.notes.find((item) => item.id === version.noteId);

    if (!note) {
      throw new NotFoundException(`Note with id ${version.noteId} was not found`);
    }

    note.title = version.title;
    note.content = version.content;
    note.updatedAt = new Date().toISOString();

    return { success: true, restored: version };
  }

  async compareVersions(versionA: number, versionB: number) {
    const [first, second] = await Promise.all([
      this.findVersion(versionA),
      this.findVersion(versionB),
    ]);

    return {
      diff: {
        versionA: first,
        versionB: second,
        titleChanged: first.title !== second.title,
        contentChanged: first.content !== second.content,
      },
    };
  }

  private async findVersion(id: number) {
    if (this.database.isAvailable()) {
      const result = await this.database.query<VersionRow>(
        'SELECT id, note_id, title, content, created_at FROM note_versions WHERE id = $1',
        [id],
      );
      const version = result.rows[0];

      if (!version) {
        throw new NotFoundException(`Version with id ${id} was not found`);
      }

      return this.mapRow(version);
    }

    const version = this.store.versions.find((item) => item.id === id);

    if (!version) {
      throw new NotFoundException(`Version with id ${id} was not found`);
    }

    return version;
  }

  private mapRow(row: VersionRow) {
    return {
      id: row.id,
      noteId: row.note_id,
      title: row.title ?? '',
      content: row.content,
      createdAt: row.created_at.toISOString(),
    };
  }
}
