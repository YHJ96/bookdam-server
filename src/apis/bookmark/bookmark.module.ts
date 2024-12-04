import { Module } from '@nestjs/common';
import { BookmarkController } from '@/apis/bookmark/bookmark.controller';
import { BookmarkService } from '@/apis/bookmark/bookmark.service';
import { TagModule } from '@/apis/tag/tag.module';

@Module({
  imports: [TagModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
