import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BookmarkModule } from '../bookmark/bookmark.module';
import { TrashModule } from '../trash/trash.module';
import { TagModule } from '../tag/tag.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BookmarkModule,
    TrashModule,
    TagModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
