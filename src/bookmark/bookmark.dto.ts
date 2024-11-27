import { IsString, IsUrl } from 'class-validator';

export class CreateBookmarkDTO {
  @IsString({ message: '제목을 입력해야 합니다.' })
  title: string;

  @IsString({ message: '내용을 입력해야 합니다.' })
  description: string;

  @IsUrl({}, { message: 'URL 형식이 아닙니다.' })
  url: string;
}
