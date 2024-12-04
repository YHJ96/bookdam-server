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

  async findAllIncludeTags(tags: string[], isAsc: boolean) {
    const result = await this.prisma.bookmark.findMany({
      where: {
        is_deleted: false,
        tags: { some: { tag: { name: { in: tags, mode: 'insensitive' } } } },
      },
      orderBy: { created_at: order(isAsc) },
      include: { tags: { include: { tag: true } } },
    });

    return bookmarksConverter(result);
  }

  async findAllBookmark(isAsc: boolean) {
    const result = await this.prisma.bookmark.findMany({
      where: { is_deleted: false },
      orderBy: { created_at: order(isAsc) },
      include: { tags: { include: { tag: true } } },
    });

    return bookmarksConverter(result);
  }

  async createBookmark(bookmark: CreateBookmarkDTO) {
    const og = await this.getOpenGraph(bookmark.url);
    const tagIds = await this.tagService.createTags(bookmark.tags);

    const result = await this.prisma.bookmark.create({
      include: { tags: { include: { tag: true } } },
      data: { ...mergeBookmark(bookmark, og), tags: { create: tagIds } },
    });

    return bookmarkConverter(result);
  }

  async updateBookmark(id: number, bookmark: UpdateBookmarkDTO) {
    await this.tagsService.deleteManyTags(id);

    const tagIds = await this.tagService.createTags(bookmark.tags);
    Reflect.deleteProperty(bookmark, 'tags');

    const result = await this.prisma.bookmark.update({
      where: { id },
      include: { tags: { include: { tag: true } } },
      data: { ...bookmark, tags: { create: tagIds } },
    });

    return bookmarkConverter(result);
  }

  async removeBookmark(id: number) {
    return await this.prisma.bookmark.update({
      where: { id, is_deleted: false },
      data: { is_deleted: true },
    });
  }

  private async getOpenGraph(url: string) {
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
