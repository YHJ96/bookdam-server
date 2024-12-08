import { Module } from '@nestjs/common';
import { TrashController } from '../../apis/trash/trash.controller';
import { TrashService } from '../../apis/trash/trash.service';

@Module({
  controllers: [TrashController],
  providers: [TrashService],
})
export class TrashModule {}
