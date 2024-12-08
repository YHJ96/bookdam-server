import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(user: User) {
    return await this.prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }
}
