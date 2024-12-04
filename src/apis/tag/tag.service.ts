import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findAllTags() {
    const tags = await this.prisma.bookmarkTags.findMany({
      select: { tags: { select: { name: true } } },
      distinct: ['tag_id'],
    });

    return tags.map((relation) => relation.tags.name);
  }

  async createTags(names: string[]) {
    const result = names.map((name) => ({ name }));

    await this.prisma.tags.createMany({
      data: result,
      skipDuplicates: true,
    });

    return this.findByNamesTags(names);
  }

  private async findByNamesTags(names: string[]) {
    const tags = await this.prisma.tags.findMany({
      where: { name: { in: names } },
    });

    return tags.map((tag) => ({ tag_id: tag.id }));
  }
}
