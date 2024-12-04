import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findAllTags() {
    const tags = await this.prisma.tags.findMany({
      select: { tag: { select: { name: true } } },
      distinct: ['tag_id'],
    });

    return tags.map((relation) => relation.tag.name);
  }

  async createTags(names: string[]) {
    const result = names.map((name) => ({ name }));

    await this.prisma.tag.createMany({
      data: result,
      skipDuplicates: true,
    });

    return this.findByNamesTags(names);
  }

  private async findByNamesTags(names: string[]) {
    const tags = await this.prisma.tag.findMany({
      where: { name: { in: names } },
    });

    return tags.map((tag) => ({ tag_id: tag.id }));
  }
}
