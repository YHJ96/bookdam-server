import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findAllTags(id: string) {
    const result = await this.prisma.tag.findMany({
      where: { tags: { some: { bookmark: { user_id: id } } } },
    });

    return result.map((tag) => tag.name);
  }

  async createTags(names: string[]) {
    const result = names.map((name) => ({ name }));

    await this.prisma.tag.createMany({
      data: result,
      skipDuplicates: true,
    });

    return this.findIdsByTagNames(names);
  }

  private async findIdsByTagNames(names: string[]) {
    const result = await this.prisma.tag.findMany({
      where: { name: { in: names } },
    });

    return result.map((tag) => ({ tag_id: tag.id }));
  }
}
