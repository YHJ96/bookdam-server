import { Module } from '@nestjs/common';
import { UserController } from '@/apis/user/user.controller';
import { UserService } from '@/apis/user/user.service';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
