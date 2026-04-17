export class Note {
  id!: number;
  title!: string;
  content!: string;
  folderId?: number;
  tags?: string[];
  isPinned!: boolean;
  isArchived!: boolean;
  isTrashed!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
