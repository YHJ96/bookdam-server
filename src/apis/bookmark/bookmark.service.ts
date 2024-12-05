import { Injectable } from '@nestjs/common';
import ogs from 'open-graph-scraper';
import { PrismaService } from '@/prisma';
import { TagService } from '@/apis/tag/tag.service';
import { bookmarksConverter, bookmarkConverter, order } from '@/utils';
import { TagsService } from '@/modules/tags/tags.service';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './bookmark.dto';
import { extractOgImage, mergeBookmark } from './bookmark.manager';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService,
    private tagService: TagService,
  ) {}

  async findAllIncludeTags(id: string, tags: string[], isAsc: boolean) {
    const result = await this.prisma.bookmark.findMany({
      omit: { user_id: true },
      where: {
        user_id: id,
        is_deleted: false,
        tags: { some: { tag: { name: { in: tags, mode: 'insensitive' } } } },
      },
      orderBy: { created_at: order(isAsc) },
      include: { tags: { include: { tag: true } } },
    });

    return bookmarksConverter(result);
  }

  async findAllBookmark(id: string, isAsc: boolean) {
    const result = await this.prisma.bookmark.findMany({
      omit: { user_id: true },
      where: { user_id: id, is_deleted: false },
      orderBy: { created_at: order(isAsc) },
      include: { tags: { include: { tag: true } } },
    });

    return bookmarksConverter(result);
  }

  async createBookmark(id: string, bookmark: CreateBookmarkDTO) {
    const og = await this.getOpenGraph(bookmark.url);

    return await this.prisma.$transaction(async (prisma) => {
      const tagIds = await this.tagService.createTags(bookmark.tags, prisma);

      const result = await prisma.bookmark.create({
        omit: { user_id: true },
        include: { tags: { include: { tag: true } } },
        data: {
          ...mergeBookmark(bookmark, og),
          user_id: id,
          tags: { create: tagIds },
        },
      });

      return bookmarkConverter(result);
    });
  }

  async updateBookmark(
    userId: string,
    bookmarkId: number,
    bookmark: UpdateBookmarkDTO,
  ) {
    await this.tagsService.deleteManyTags(bookmarkId);

    return await this.prisma.$transaction(async (prisma) => {
      const tagIds = await this.tagService.createTags(bookmark.tags, prisma);
      Reflect.deleteProperty(bookmark, 'tags');

      const result = await prisma.bookmark.update({
        omit: { user_id: true },
        where: { user_id: userId, id: bookmarkId },
        include: { tags: { include: { tag: true } } },
        data: { ...bookmark, tags: { create: tagIds } },
      });

      return bookmarkConverter(result);
    });
  }

  async removeBookmark(useId: string, bookmarkId: number) {
    return await this.prisma.bookmark.update({
      omit: { user_id: true },
      where: { user_id: useId, id: bookmarkId, is_deleted: false },
      data: { is_deleted: true },
    });
  }

  async getOpenGraph(url: string) {
    const { result } = await ogs({ url });
    const { ogTitle, ogDescription, ogImage, requestUrl } = result;

    return {
      title: ogTitle,
      description: ogDescription,
      image: extractOgImage(ogImage),
      url: requestUrl,
    };
  }
}
