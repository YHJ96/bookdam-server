import { TrashService } from './trash.service';
import { Controller, Delete, Get, Patch } from '@nestjs/common';

@Controller('trash')
export class TrashController {
  constructor(private trashService: TrashService) {}

  @Get()
  findAll() {
    return this.trashService.findAllTrashBookmark();
  }

  @Patch()
  redo() {}

  @Delete()
  undo() {}
}
