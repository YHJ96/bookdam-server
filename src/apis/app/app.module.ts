import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@/prisma';
import { AppController } from '@/apis/app';
import { BookmarkModule } from '@/apis/bookmark';
import { TrashModule } from '@/apis/trash';
import { TagModule } from '@/apis/tag';
import { AuthModule } from '@/apis/auth';
import { UserModule } from '@/apis/user';

import { JwtAuthGuard } from '@/helpers/guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BookmarkModule,
    TrashModule,
    TagModule,
    AuthModule,
    UserModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
