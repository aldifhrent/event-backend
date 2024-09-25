import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsOptional, IsDate } from 'class-validator';

export class EventDTO {
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  readonly date: Date;

  @IsString()
  readonly location: string;
}
