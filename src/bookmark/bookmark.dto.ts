import { IsString, IsUrl, IsOptional, IsArray } from 'class-validator';

export class CreateBookmarkDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class UpdateBookmarkDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
