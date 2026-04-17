import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { InMemoryStore } from '../../database/in-memory.store';

@Injectable()
export class CollaborationService {
  constructor(
    private readonly database: DatabaseService,
    private readonly store: InMemoryStore,
  ) {}

  async invite(noteId: number, userId: number, role = 'viewer') {
    if (this.database.isAvailable()) {
      const result = await this.database.query(
        `INSERT INTO collaborators (note_id, user_id, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (note_id, user_id)
         DO UPDATE SET role = EXCLUDED.role, invited_at = NOW()
         RETURNING id, note_id, user_id, role, invited_at`,
        [noteId, userId, role],
      );

      return { success: true, collaborator: result.rows[0] };
    }

    const existing = this.store.collaborators.find(
      (item) => item.noteId === noteId && item.userId === userId,
    );

    if (existing) {
      existing.role = role;
      existing.invitedAt = new Date().toISOString();
      return { success: true, collaborator: existing };
    }

    const collaborator = {
      id: this.store.nextCollaboratorId(),
      noteId,
      userId,
      role,
      invitedAt: new Date().toISOString(),
    };

    this.store.collaborators.push(collaborator);

    return { success: true, collaborator };
  }

  async comment(noteId: number, userId: number, comment: string) {
    if (this.database.isAvailable()) {
      const result = await this.database.query(
        `INSERT INTO comments (note_id, user_id, comment)
         VALUES ($1, $2, $3)
         RETURNING id, note_id, user_id, comment, created_at`,
        [noteId, userId, comment],
      );

      return { success: true, comment: result.rows[0] };
    }

    const storedComment = {
      id: this.store.nextCommentId(),
      noteId,
      userId,
      comment,
      createdAt: new Date().toISOString(),
    };

    this.store.comments.push(storedComment);

    return { success: true, comment: storedComment };
  }

  async getCollaborators(noteId: number) {
    if (this.database.isAvailable()) {
      const collaborators = await this.database.query(
        `SELECT id, note_id, user_id, role, invited_at
         FROM collaborators
         WHERE note_id = $1
         ORDER BY invited_at DESC`,
        [noteId],
      );
      const comments = await this.database.query(
        `SELECT id, note_id, user_id, comment, created_at
         FROM comments
         WHERE note_id = $1
         ORDER BY created_at DESC`,
        [noteId],
      );

      return { collaborators: collaborators.rows, comments: comments.rows };
    }

    return {
      collaborators: this.store.collaborators.filter((item) => item.noteId === noteId),
      comments: this.store.comments.filter((item) => item.noteId === noteId),
    };
  }
}
