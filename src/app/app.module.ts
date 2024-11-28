import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BookmarkModule } from '../bookmark/bookmark.module';
import { TrashModule } from '../trash/trash.module';

@Module({
  imports: [BookmarkModule, TrashModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
