import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkService } from './../bookmark/bookmark.service';

@Injectable()
export class TrashService extends BookmarkService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async findAllTrashBookmark() {
    return await this.prisma.bookmark.findMany({
      omit: { is_deleted: true },
      where: { is_deleted: true },
    });
  }

  async redoTrashBookmark(id: number) {
    await super.findByIdBookmark(id);

    return await this.prisma.bookmark.update({
      where: { id },
      data: { is_deleted: false },
    });
  }

  async undoTrashBookmark() {}
}
