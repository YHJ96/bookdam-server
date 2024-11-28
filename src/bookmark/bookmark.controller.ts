import { BookmarkService } from './bookmark.service';
import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateBookmarkDTO } from './bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  findAll() {
    return this.bookmarkService.findAllBookMark();
  }

  @Post()
  create(@Body() bookmark: CreateBookmarkDTO) {
    return this.bookmarkService.createBookmark(bookmark);
  }
}
