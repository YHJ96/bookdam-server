import { Injectable } from '@nestjs/common';
import ogs from 'open-graph-scraper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './bookmark.dto';
import { extractOGImage, mergeBookmark } from './bookmark.manager';
import { TagService } from './../tag/tag.service';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    private tagService: TagService,
  ) {}

  async findAllBookmark() {
    return await this.prisma.bookmarks.findMany({
      omit: { is_deleted: true },
      where: { is_deleted: false },
    });
  }

  async createBookmark(bookmark: CreateBookmarkDTO) {
    const og = await this.getOpenGraph(bookmark.url);

    return await this.prisma.bookmarks.create({
      data: mergeBookmark(bookmark, og),
    });
  }

  async updateBookmark(id: number, bookmark: UpdateBookmarkDTO) {
    return await this.prisma.bookmarks.update({
      where: { id },
      data: bookmark,
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
