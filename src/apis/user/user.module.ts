import { Module } from '@nestjs/common';
import { UserService, UserController } from '@/apis/user';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
