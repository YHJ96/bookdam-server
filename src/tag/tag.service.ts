import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findAllTags() {
    return await this.prisma.bookmarkTags.findMany({
      select: { Tags: { select: { name: true } } },
      distinct: ['tag_id'],
    });
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
    return await this.prisma.tags.findMany({ where: { name: { in: names } } });
  }
}
