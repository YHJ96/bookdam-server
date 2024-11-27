import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BookmarkModule } from '../bookmark/bookmark.module';

@Module({
  imports: [BookmarkModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
