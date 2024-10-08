import { Transform } from 'class-transformer';
import { IsEmail, IsString, Max, Min, MinLength } from 'class-validator';

export class RegisterUserDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly username: string;

  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @IsString()
  @MinLength(8)
  readonly password: string;
}
