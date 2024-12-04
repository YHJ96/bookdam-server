import { Injectable } from '@nestjs/common';
import ogs from 'open-graph-scraper';
import { PrismaService } from '@/prisma';
import { TagService } from '@/apis/tag/tag.service';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './bookmark.dto';
import { extractOgImage, mergeBookmark } from './bookmark.manager';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    private tagService: TagService,
  ) {}

  async findAllIncludeTags(tags: string[], isAsc: boolean) {
    return await this.prisma.bookmark.findMany({
      where: {
        is_deleted: false,
        tags: {
          some: { tag: { name: { in: tags, mode: 'insensitive' } } },
        },
      },
      orderBy: { created_at: isAsc ? 'asc' : 'desc' },
      include: {
        tags: { select: { tag: { select: { name: true } } } },
      },
    });
  }

  async findAllBookmark(isAsc: boolean) {
    return await this.prisma.bookmark.findMany({
      where: { is_deleted: false },
      orderBy: { created_at: isAsc ? 'asc' : 'desc' },
      include: {
        tags: { select: { tag: { select: { name: true } } } },
      },
    });
  }

  async createBookmark(bookmark: CreateBookmarkDTO) {
    const og = await this.getOpenGraph(bookmark.url);
    const tagIds = await this.tagService.createTags(bookmark.tags);

    return await this.prisma.bookmark.create({
      omit: { is_deleted: true },
      include: {
        tags: { select: { tag: { select: { name: true } } } },
      },
      data: {
        ...mergeBookmark(bookmark, og),
        tags: { create: tagIds },
      },
    });
  }

  async updateBookmark(id: number, bookmark: UpdateBookmarkDTO) {
    await this.prisma.tags.deleteMany({ where: { bookmark_id: id } });

    const tagIds = await this.tagService.createTags(bookmark.tags);
    Reflect.deleteProperty(bookmark, 'tags');

    return await this.prisma.bookmark.update({
      where: { id },
      omit: { is_deleted: true },
      include: { tags: { select: { tag: { select: { name: true } } } } },
      data: { ...bookmark, tags: { create: tagIds } },
    });
  }

  async removeBookmark(id: number) {
    return await this.prisma.bookmark.update({
      where: { id, is_deleted: false },
      include: {
        tags: { select: { tag: { select: { name: true } } } },
      },
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
