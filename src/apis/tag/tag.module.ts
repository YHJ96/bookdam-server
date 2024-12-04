import { Module } from '@nestjs/common';
import { TagController } from '@/apis/tag/tag.controller';
import { TagService } from '@/apis/tag/tag.service';

@Module({
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
