import { Controller, Get } from '@nestjs/common';
import { TagService } from '@/apis/tag';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  findAll() {
    return this.tagService.findAllTags();
  }
}
