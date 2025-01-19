import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

/**
 * @summary
 * Bookmark 테이블과 Tag 테이블의 N:M 관계를 위한 중간 테이블
 */
@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async deleteManyTags(id: number) {
    return this.prisma.tags.deleteMany({ where: { bookmark_id: id } });
  }
}
