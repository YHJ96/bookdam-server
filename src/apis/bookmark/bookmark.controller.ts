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
import { BookmarkService } from '../../apis/bookmark/bookmark.service';
import { Auth, Public } from '../../helpers/decorators';
import {
  GetOgTagDTO,
  CreateBookmarkDTO,
  FindAllBookmarkDTO,
  UpdateBookmarkDTO,
} from './bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  findAll(@Auth() id: string, @Query() { tags, asc }: FindAllBookmarkDTO) {
    if (tags === null) return this.bookmarkService.findAllBookmark(id, asc);
    return this.bookmarkService.findAllIncludeTags(id, tags, asc);
  }

  @Public()
  @Get('/og')
  getOgTag(@Query() { url }: GetOgTagDTO) {
    return this.bookmarkService.getOpenGraph(url);
  }

  @Post()
  create(@Auth() id: string, @Body() bookmark: CreateBookmarkDTO) {
    return this.bookmarkService.createBookmark(id, bookmark);
  }

  @Patch('/:id')
  update(
    @Auth() userId: string,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() bookmark: UpdateBookmarkDTO,
  ) {
    return this.bookmarkService.updateBookmark(userId, bookmarkId, bookmark);
  }

  @Delete('/:id')
  remove(
    @Auth() userId: string,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.removeBookmark(userId, bookmarkId);
  }
}
