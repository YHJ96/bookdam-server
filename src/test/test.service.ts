import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  async getAllTest() {
    return await this.prisma.test.findMany();
  }

  async createTest() {
    await this.prisma.test.create({ data: {} });
  }
}
