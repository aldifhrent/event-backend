import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  readonly email?: string;

  @IsString()
  readonly password: string;
}
