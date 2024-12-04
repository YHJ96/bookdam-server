import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@/prisma';
import { AppController } from '@/apis/app/app.controller';
import { BookmarkModule } from '@/apis/bookmark/bookmark.module';
import { TrashModule } from '@/apis/trash/trash.module';
import { TagModule } from '@/apis/tag/tag.module';
import { AuthModule } from '@/apis/auth/auth.module';
import { UserModule } from '@/apis/user/user.module';
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
