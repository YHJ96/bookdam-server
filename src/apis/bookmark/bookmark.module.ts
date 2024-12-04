import { Module } from '@nestjs/common';
import { BookmarkController, BookmarkService } from '@/apis/bookmark';
import { TagModule } from '@/apis/tag';

@Module({
  imports: [TagModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
