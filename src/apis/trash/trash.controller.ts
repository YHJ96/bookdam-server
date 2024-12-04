import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { Auth } from '@/helpers/decorators';
import { TrashService } from '@/apis/trash/trash.service';

@Controller('trash')
export class TrashController {
  constructor(private trashService: TrashService) {}

  @Get()
  findAll(@Auth() id: string) {
    return this.trashService.findAllTrashBookmark(id);
  }

  @Patch('/:id')
  redo(@Auth() userId: string, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.trashService.redoTrashBookmark(userId, bookmarkId);
  }

  @Delete('/:id')
  undo(@Auth() userId: string, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.trashService.undoTrashBookmark(userId, bookmarkId);
  }
}
