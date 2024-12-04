import { Module } from '@nestjs/common';
import { TagService, TagController } from '@/apis/tag';

@Module({
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
