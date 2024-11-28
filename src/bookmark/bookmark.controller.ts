import { BookmarkService } from './bookmark.service';
import { Body, Controller, Post, Get, Patch } from '@nestjs/common';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  findAll() {
    return this.bookmarkService.findAllBookmark();
  }

  @Patch()
  update(@Body() bookmark: UpdateBookmarkDTO) {
    return this.bookmarkService.updateBookmark(bookmark);
  }

  @Post()
  create(@Body() bookmark: CreateBookmarkDTO) {
    return this.bookmarkService.createBookmark(bookmark);
  }
}
