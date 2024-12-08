import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class TrashService {
  constructor(private prisma: PrismaService) {}

  async findAllTrashBookmark(id: string) {
    return await this.prisma.bookmark.findMany({
      omit: { user_id: true },
      where: { user_id: id, is_deleted: true },
    });
  }

  async redoTrashBookmark(userId: string, bookmarkId: number) {
    return await this.prisma.bookmark.update({
      omit: { user_id: true },
      where: { user_id: userId, id: bookmarkId, is_deleted: true },
      data: { is_deleted: false },
    });
  }

  async undoTrashBookmark(userId: string, bookmarkId: number) {
    return await this.prisma.bookmark.delete({
      omit: { user_id: true },
      where: { user_id: userId, id: bookmarkId, is_deleted: true },
    });
  }
}
