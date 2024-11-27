import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TestModule } from '../test/test.module';

@Module({
  imports: [TestModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
