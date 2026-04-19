import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { InMemoryStore, StoredFolder } from '../../database/in-memory.store';
import { CreateFolderDto, UpdateFolderDto } from './folders.dto';

type FolderRow = {
  id: number;
  user_id: number | null;
  name: string;
  parent_id: number | null;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class FoldersService {
  private readonly logger = new Logger(FoldersService.name);

  constructor(
    private readonly database: DatabaseService,
    private readonly store: InMemoryStore,
  ) {}

  async findAll(userId?: number) {
    if (this.database.isAvailable()) {
      const userFilter = userId ? 'WHERE user_id = $1' : '';
      const result = await this.database.query<FolderRow>(
        `SELECT id, name, parent_id, user_id, created_at, updated_at
         FROM folders
         ${userFilter}
         ORDER BY name ASC, id ASC`,
        userId ? [userId] : [],
      );

      return result.rows.map((row) => this.mapRow(row));
    }

    return this.store.folders
      .filter((folder) => !userId || folder.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async findOne(id: number, userId?: number) {
    if (this.database.isAvailable()) {
      const userFilter = userId ? 'AND user_id = $2' : '';
      const result = await this.database.query<FolderRow>(
        `SELECT id, name, parent_id, user_id, created_at, updated_at
         FROM folders
         WHERE id = $1 ${userFilter}`,
        userId ? [id, userId] : [id],
      );

      const folder = result.rows[0];

      if (!folder) {
        throw new NotFoundException(`Folder with id ${id} was not found`);
      }

      return this.mapRow(folder);
    }

    const folder = this.store.folders.find(
      (item) => item.id === id && (!userId || item.userId === userId),
    );

    if (!folder) {
      throw new NotFoundException(`Folder with id ${id} was not found`);
    }

    return folder;
  }

  async create(createFolderDto: CreateFolderDto, userId?: number) {
    try {
      if (this.database.isAvailable()) {
        const result = await this.database.query<FolderRow>(
          `INSERT INTO folders (name, parent_id, user_id)
           VALUES ($1, $2, $3)
           RETURNING id, name, parent_id, user_id, created_at, updated_at`,
          [createFolderDto.name, createFolderDto.parentId ?? null, userId ?? null],
        );

        return this.mapRow(result.rows[0]);
      }

      const timestamp = new Date().toISOString();
      const folder: StoredFolder = {
        id: this.store.nextFolderId(),
        userId,
        name: createFolderDto.name,
        parentId: createFolderDto.parentId,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      this.store.folders.push(folder);

      return folder;
    } catch (error) {
      this.logger.error(`Failed to create folder: ${error}`);
      throw error;
    }
  }

  async update(id: number, updateFolderDto: UpdateFolderDto, userId?: number) {
    try {
      if (this.database.isAvailable()) {
        const current = await this.findOne(id, userId);
        const result = await this.database.query<FolderRow>(
          `UPDATE folders
           SET name = $2, parent_id = $3, updated_at = NOW()
           WHERE id = $1
           RETURNING id, name, parent_id, user_id, created_at, updated_at`,
          [
            id,
            updateFolderDto.name ?? current.name,
            updateFolderDto.parentId ?? current.parentId ?? null,
          ],
        );

        return this.mapRow(result.rows[0]);
      }

      const folder = await this.findOne(id, userId);

      Object.assign(folder, updateFolderDto);
      folder.updatedAt = new Date().toISOString();

      return folder;
    } catch (error) {
      this.logger.error(`Failed to update folder ${id}: ${error}`);
      throw error;
    }
  }

  async remove(id: number, userId?: number) {
    try {
      if (this.database.isAvailable()) {
        const userFilter = userId ? 'AND user_id = $2' : '';
        const result = await this.database.query<FolderRow>(
          `DELETE FROM folders
           WHERE id = $1 ${userFilter}
           RETURNING id, name, parent_id, user_id, created_at, updated_at`,
          userId ? [id, userId] : [id],
        );

        const folder = result.rows[0];

        if (!folder) {
          throw new NotFoundException(`Folder with id ${id} was not found`);
        }

        return this.mapRow(folder);
      }

      const idx = this.store.folders.findIndex(
        (folder) => folder.id === id && (!userId || folder.userId === userId),
      );

      if (idx === -1) {
        throw new NotFoundException(`Folder with id ${id} was not found`);
      }

      const [removed] = this.store.folders.splice(idx, 1);

      return removed;
    } catch (error) {
      this.logger.error(`Failed to delete folder ${id}: ${error}`);
      throw error;
    }
  }

  private mapRow(row: FolderRow): StoredFolder {
    return {
      id: row.id,
      userId: row.user_id ?? undefined,
      name: row.name,
      parentId: row.parent_id ?? undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}
