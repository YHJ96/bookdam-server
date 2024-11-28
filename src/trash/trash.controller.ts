import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { TrashService } from './trash.service';

@Controller('trash')
export class TrashController {
  constructor(private trashService: TrashService) {}

  @Get()
  findAll() {
    return this.trashService.findAllTrashBookmark();
  }

  @Patch('/:id')
  redo(@Param('id', ParseIntPipe) id: number) {
    return this.trashService.redoTrashBookmark(id);
  }

  @Delete()
  undo() {}
}
