import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNoteDto {
  @IsString()
  readonly title!: string;

  @IsString()
  readonly content!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  readonly folderId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[];
}

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  readonly folderId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[];

  @IsOptional()
  @IsBoolean()
  readonly isPinned?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isArchived?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isTrashed?: boolean;
}

/** Query params for paginated note listing */
export class NotesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly folderId?: number;

  @IsOptional()
  @IsString()
  readonly search?: string;

  @IsOptional()
  @IsString()
  readonly trashed?: string;
}
