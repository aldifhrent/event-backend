import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginUserDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  readonly email?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  readonly username?: string;

  @IsString()
  readonly password: string;
}
