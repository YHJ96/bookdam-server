import { IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateBookmarkDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  url: string;
}

export class UpdateBookmarkDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
