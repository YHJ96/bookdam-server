import { Injectable, NotFoundException } from '@nestjs/common';
import ogs from 'open-graph-scraper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './bookmark.dto';
import { extractOGImage, mergeBookmark } from './bookmark.manager';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

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

  async findAllBookmark() {
    return await this.prisma.bookmark.findMany();
  }

  async updateBookmark(bookmark: UpdateBookmarkDTO) {
    const { id, ...data } = bookmark;
    const prevBookmark = await this.prisma.bookmark.findUnique({
      where: { id },
    });

    if (prevBookmark === null)
      throw new NotFoundException(
        `The bookmark with ID ${bookmark.id} does not exist.`,
      );

    return await this.prisma.bookmark.update({
      where: { id },
      data,
    });
  }

  async createBookmark(bookmark: CreateBookmarkDTO) {
    const og = await this.getOpenGraph(bookmark.url);

    return await this.prisma.bookmark.create({
      data: mergeBookmark(bookmark, og),
    });
  }
}
