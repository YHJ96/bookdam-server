import { Injectable } from '@nestjs/common';
import ogs from 'open-graph-scraper';
import { PrismaService } from '@/prisma';
import { TagService } from '@/apis/tag';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './bookmark.dto';
import { extractOGImage, mergeBookmark } from './bookmark.manager';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    private tagService: TagService,
  ) {}

  async findAllIncludeTags(tags: string[], isAsc: boolean) {
    const bookmarks = await this.prisma.bookmarks.findMany({
      omit: { is_deleted: true },
      where: {
        is_deleted: false,
        bookmarkTags: {
          some: { tags: { name: { in: tags, mode: 'insensitive' } } },
        },
      },
      orderBy: { created_at: isAsc ? 'asc' : 'desc' },
      include: {
        bookmarkTags: { select: { tags: { select: { name: true } } } },
      },
    });

    return bookmarks.map((bookmark) => {
      const { bookmarkTags, ...rest } = bookmark;
      const tags = bookmarkTags.map((relation) => relation.tags.name);
      return { ...rest, tags };
    });
  }

  async findAllBookmark(isAsc: boolean) {
    const bookmarks = await this.prisma.bookmarks.findMany({
      omit: { is_deleted: true },
      where: { is_deleted: false },
      orderBy: { created_at: isAsc ? 'asc' : 'desc' },
      include: {
        bookmarkTags: { select: { tags: { select: { name: true } } } },
      },
    });

    return bookmarks.map((bookmark) => {
      const { bookmarkTags, ...rest } = bookmark;
      const tags = bookmarkTags.map((relation) => relation.tags.name);
      return { ...rest, tags };
    });
  }

  async createBookmark(bookmark: CreateBookmarkDTO) {
    const og = await this.getOpenGraph(bookmark.url);
    const tagIds = await this.tagService.createTags(bookmark.tags);

    const { bookmarkTags, ...rest } = await this.prisma.bookmarks.create({
      omit: { is_deleted: true },
      include: {
        bookmarkTags: { select: { tags: { select: { name: true } } } },
      },
      data: {
        ...mergeBookmark(bookmark, og),
        bookmarkTags: {
          create: tagIds,
        },
      },
    });

    const tags = bookmarkTags.map((relation) => relation.tags.name);

    return { ...rest, tags };
  }

  async updateBookmark(id: number, bookmark: UpdateBookmarkDTO) {
    await this.prisma.bookmarkTags.deleteMany({ where: { bookmark_id: id } });

    const tagIds = await this.tagService.createTags(bookmark.tags);
    Reflect.deleteProperty(bookmark, 'tags');

    const { bookmarkTags, ...rest } = await this.prisma.bookmarks.update({
      where: { id },
      omit: { is_deleted: true },
      include: {
        bookmarkTags: { select: { tags: { select: { name: true } } } },
      },
      data: { ...bookmark, bookmarkTags: { create: tagIds } },
    });

    const tags = bookmarkTags.map((relation) => relation.tags.name);

    return { ...rest, tags };
  }

  async removeBookmark(id: number) {
    const { bookmarkTags, ...rest } = await this.prisma.bookmarks.update({
      where: { id, is_deleted: false },
      include: {
        bookmarkTags: { select: { tags: { select: { name: true } } } },
      },
      data: { is_deleted: true },
    });

    const tags = bookmarkTags.map((relation) => relation.tags.name);

    return { ...rest, tags };
  }

  private async getOpenGraph(url: string) {
    const { result } = await ogs({ url });
    const { ogTitle, ogDescription, ogImage, requestUrl } = result;

    return {
      title: ogTitle,
      description: ogDescription,
      image: extractOGImage(ogImage),
      url: requestUrl,
    };
  }
}
