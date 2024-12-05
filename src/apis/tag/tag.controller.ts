import { Controller, Get } from '@nestjs/common';
import { TagService } from '@/apis/tag/tag.service';
import { Auth } from '@/helpers/decorators';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  findAll(@Auth() id: string) {
    return this.tagService.findAllTags(id);
  }
}
