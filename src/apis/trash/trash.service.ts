import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { bookmarksConverter, bookmarkConverter } from '../../utils';

@Injectable()
export class TrashService {
  constructor(private prisma: PrismaService) {}

  async findAllTrashBookmark(id: string) {
    const result = await this.prisma.bookmark.findMany({
      omit: { user_id: true, is_deleted: true },
      where: { user_id: id, is_deleted: true },
      orderBy: { created_at: 'asc' },
      include: { tags: { include: { tag: true } } },
    });

    return bookmarksConverter(result);
  }

  async redoTrashBookmark(userId: string, bookmarkId: number) {
    const result = await this.prisma.bookmark.update({
      omit: { user_id: true, is_deleted: true },
      where: { user_id: userId, id: bookmarkId, is_deleted: true },
      include: { tags: { include: { tag: true } } },
      data: { is_deleted: false },
    });

    return bookmarkConverter(result);
  }

  async undoTrashBookmark(userId: string, bookmarkId: number) {
    const result = await this.prisma.bookmark.delete({
      omit: { user_id: true, is_deleted: true },
      where: { user_id: userId, id: bookmarkId, is_deleted: true },
      include: { tags: { include: { tag: true } } },
    });

    return bookmarkConverter(result);
  }
}
