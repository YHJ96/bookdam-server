import { Module } from '@nestjs/common';
import { BookmarkController } from '../../apis/bookmark/bookmark.controller';
import { BookmarkService } from '../../apis/bookmark/bookmark.service';
import { TagModule } from '../../apis/tag/tag.module';
import { TagsModule } from '../../modules/tags/tags.module';

@Module({
  imports: [TagModule, TagsModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
