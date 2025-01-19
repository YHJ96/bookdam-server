import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { PrismaTransactionClient } from '../../types';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findAllTags(id: string) {
    const result = await this.prisma.tag.findMany({
      where: {
        tags: { some: { bookmark: { user_id: id, is_deleted: false } } },
      },
    });

    return result.map((tag) => tag.name);
  }

  async createTags(names: string[], transaction?: PrismaTransactionClient) {
    const prisma = transaction ?? this.prisma;
    const result = names.map((name) => ({ name }));

    await prisma.tag.createMany({
      data: result,
      skipDuplicates: true,
    });

    return this.findIdsByTagNames(names, prisma);
  }

  private async findIdsByTagNames(
    names: string[],
    transaction?: PrismaTransactionClient,
  ) {
    const prisma = transaction ?? this.prisma;
    const result = await prisma.tag.findMany({
      where: { name: { in: names } },
    });

    return result.map((tag) => ({ tag_id: tag.id }));
  }
}
