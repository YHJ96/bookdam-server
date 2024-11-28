import { Injectable, NotFoundException } from '@nestjs/common';
import ogs from 'open-graph-scraper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './bookmark.dto';
import { extractOGImage, mergeBookmark } from './bookmark.manager';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async findAllBookmark() {
    return await this.prisma.bookmark.findMany();
  }

  async createBookmark(bookmark: CreateBookmarkDTO) {
    const og = await this.getOpenGraph(bookmark.url);

    return await this.prisma.bookmark.create({
      data: mergeBookmark(bookmark, og),
    });
  }

  async updateBookmark(id: number, bookmark: UpdateBookmarkDTO) {
    await this.findByIdBookmark(id);

    return await this.prisma.bookmark.update({
      where: { id },
      data: bookmark,
    });
  }

  async removeBookmark(id: number) {
    await this.findByIdBookmark(id);

    return await this.prisma.bookmark.update({
      where: { id },
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

  private async findByIdBookmark(id: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id },
    });

    if (bookmark === null)
      throw new NotFoundException(`The bookmark with ID ${id} does not exist.`);

    return bookmark;
  }
}
