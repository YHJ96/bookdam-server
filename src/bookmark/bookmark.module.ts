import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [TagModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
