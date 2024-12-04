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
import { BookmarkService } from '@/apis/bookmark/bookmark.service';
import {
  CreateBookmarkDTO,
  FindAllBookmarkDTO,
  UpdateBookmarkDTO,
} from './bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  findAll(@Query() { tags, asc }: FindAllBookmarkDTO) {
    if (tags === null) return this.bookmarkService.findAllBookmark(asc);
    return this.bookmarkService.findAllIncludeTags(tags, asc);
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
