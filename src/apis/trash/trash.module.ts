import { Module } from '@nestjs/common';
import { TrashController, TrashService } from '@/apis/trash';

@Module({
  controllers: [TrashController],
  providers: [TrashService],
})
export class TrashModule {}
