import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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
