import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  readonly email!: string;

  @IsString()
  @MinLength(8)
  readonly password!: string;

  @IsOptional()
  @IsString()
  readonly name?: string;
}

export class LoginDto {
  @IsEmail()
  readonly email!: string;

  @IsString()
  readonly password!: string;
}
