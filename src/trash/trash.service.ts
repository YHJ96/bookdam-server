import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrashService {
  constructor(private prisma: PrismaService) {}

  async findAllTrashBookmark() {
    return await this.prisma.bookmark.findMany({
      omit: { is_deleted: true },
      where: { is_deleted: true },
    });
  }

  async redoTrashBookmark() {}

  async undoTrashBookmark() {}
}
