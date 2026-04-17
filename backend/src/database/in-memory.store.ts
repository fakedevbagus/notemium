import { Injectable } from '@nestjs/common';

export type StoredNote = {
  id: number;
  userId?: number;
  title: string;
  content: string;
  folderId?: number;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoredFolder = {
  id: number;
  userId?: number;
  name: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
};

export type StoredVersion = {
  id: number;
  noteId: number;
  title: string;
  content: string;
  createdAt: string;
};

export type StoredCollaborator = {
  id: number;
  noteId: number;
  userId: number;
  role: string;
  invitedAt: string;
};

export type StoredComment = {
  id: number;
  noteId: number;
  userId: number;
  comment: string;
  createdAt: string;
};

export type StoredUser = {
  id: number;
  email: string;
  passwordHash: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class InMemoryStore {
  readonly users: StoredUser[] = [];
  readonly notes: StoredNote[] = [];
  readonly folders: StoredFolder[] = [];
  readonly versions: StoredVersion[] = [];
  readonly collaborators: StoredCollaborator[] = [];
  readonly comments: StoredComment[] = [];

  private noteId = 1;
  private userId = 1;
  private folderId = 1;
  private versionId = 1;
  private collaboratorId = 1;
  private commentId = 1;

  nextNoteId() {
    return this.noteId++;
  }

  nextUserId() {
    return this.userId++;
  }

  nextFolderId() {
    return this.folderId++;
  }

  nextVersionId() {
    return this.versionId++;
  }

  nextCollaboratorId() {
    return this.collaboratorId++;
  }

  nextCommentId() {
    return this.commentId++;
  }
}
