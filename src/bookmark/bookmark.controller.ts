import { BookmarkService } from './bookmark.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateBookmarkDTO } from './bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  async create(@Body() bookmark: CreateBookmarkDTO) {
    return await this.bookmarkService.createBookmark(bookmark);
  }
}
