import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma';

@Injectable()
export class TrashService {
  constructor(private prisma: PrismaService) {}

  async findAllTrashBookmark() {
    return await this.prisma.bookmark.findMany({
      where: { is_deleted: true },
    });
  }

  async redoTrashBookmark(id: number) {
    return await this.prisma.bookmark.update({
      where: { id, is_deleted: true },
      data: { is_deleted: false },
    });
  }

  async undoTrashBookmark(id: number) {
    return await this.prisma.bookmark.delete({
      where: { id, is_deleted: true },
    });
  }
}
