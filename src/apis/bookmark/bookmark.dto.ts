import { Transform } from 'class-transformer';
import {
  IsString,
  IsUrl,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class GetOgTagDTO {
  @IsUrl()
  url: string;
}

export class FindAllBookmarkDTO {
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  tags: string[] = null;

  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  asc: boolean = true;
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
