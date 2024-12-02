import { IsString, IsUrl, IsArray } from 'class-validator';

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
