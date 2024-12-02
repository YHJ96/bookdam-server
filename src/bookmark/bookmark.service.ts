import { Injectable } from '@nestjs/common';
import ogs from 'open-graph-scraper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './bookmark.dto';
import { extractOGImage, mergeBookmark } from './bookmark.manager';
import { TagService } from './../tag/tag.service';
import { flatArrayObject } from '../helper/utils';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    private tagService: TagService,
  ) {}

  async findAllBookmark() {
    const bookmarks = await this.prisma.bookmarks.findMany({
      omit: { is_deleted: true },
      where: { is_deleted: false },
      include: {
        BookmarkTags: { select: { Tags: { select: { name: true } } } },
      },
    });

    return bookmarks.map(({ BookmarkTags, ...rest }) => ({
      ...rest,
      tags: flatArrayObject(BookmarkTags),
    }));
  }

  async createBookmark(bookmark: CreateBookmarkDTO) {
    const og = await this.getOpenGraph(bookmark.url);

    const tags = await this.tagService.createTags(bookmark.tags);
    const tagIds = tags.map((tag) => ({ tag_id: tag.id }));

    const { BookmarkTags, ...rest } = await this.prisma.bookmarks.create({
      data: {
        ...mergeBookmark(bookmark, og),
        BookmarkTags: {
          create: tagIds,
        },
      },
      include: {
        BookmarkTags: { select: { Tags: { select: { name: true } } } },
      },
    });

    return { ...rest, tags: flatArrayObject(BookmarkTags) };
  }

  async updateBookmark(id: number, bookmark: UpdateBookmarkDTO) {
    await this.prisma.bookmarkTags.deleteMany({ where: { bookmark_id: id } });

    const tags = await this.tagService.createTags(bookmark.tags);
    const tagIds = tags.map((tag) => ({ tag_id: tag.id }));
    Reflect.deleteProperty(bookmark, 'tags');

    return await this.prisma.bookmarks.update({
      where: { id },
      data: { ...bookmark, BookmarkTags: { create: tagIds } },
    });
  }

  async removeBookmark(id: number) {
    return await this.prisma.bookmarks.update({
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
      image: extractOGImage(ogImage),
      url: requestUrl,
    };
  }
}
