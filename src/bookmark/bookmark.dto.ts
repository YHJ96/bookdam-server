import { IsString, IsUrl, IsOptional, IsNumber } from 'class-validator';

/* [TODO] 메세지 로그 정리 */
export class CreateBookmarkDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  url: string;
}

export class UpdateBookmarkDTO {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
