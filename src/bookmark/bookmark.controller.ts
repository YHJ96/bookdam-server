import { BookmarkService } from './bookmark.service';
import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  findAll() {
    return this.bookmarkService.findAllBookmark();
  }

  @Post()
  create(@Body() bookmark: CreateBookmarkDTO) {
    return this.bookmarkService.createBookmark(bookmark);
  }

  @Patch('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() bookmark: UpdateBookmarkDTO,
  ) {
    return this.bookmarkService.updateBookmark(id, bookmark);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarkService.removeBookmark(id);
  }
}
