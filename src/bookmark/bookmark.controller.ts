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
  Query,
} from '@nestjs/common';
import {
  CreateBookmarkDTO,
  FindAllBookmarkDTO,
  UpdateBookmarkDTO,
} from './bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  findAll(@Query() { tags }: FindAllBookmarkDTO) {
    if (tags === null) return this.bookmarkService.findAllBookmark();
    return this.bookmarkService.findAllIncludeTags(tags);
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
