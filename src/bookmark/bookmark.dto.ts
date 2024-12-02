import { Transform } from 'class-transformer';
import { IsString, IsUrl, IsArray, IsOptional } from 'class-validator';

export class FindAllBookmarkDTO {
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  tags: string[] = null;
}

export class CreateBookmarkDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  url: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class UpdateBookmarkDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
