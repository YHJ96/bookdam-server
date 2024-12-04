import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma';
import { tagConverter } from '@/utils';
import { TagsService } from '@/modules/tags/tags.service';

@Injectable()
export class TagService {
  constructor(
    private prisma: PrismaService,
    private tagsService: TagsService,
  ) {}

  async findAllTags() {
    const tags = await this.tagsService.findAllTags();

    return tagConverter(tags);
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
