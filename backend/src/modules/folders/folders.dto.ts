
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  readonly name!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  readonly parentId?: number;
}

export class UpdateFolderDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  readonly parentId?: number;
}
