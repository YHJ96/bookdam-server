import { Module } from '@nestjs/common';
import { TagController } from '@/apis/tag/tag.controller';
import { TagService } from '@/apis/tag/tag.service';
import { TagsModule } from '@/modules/tags/tags.module';

@Module({
  imports: [TagsModule],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
