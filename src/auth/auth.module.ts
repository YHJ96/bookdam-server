import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { KakaoStrategy } from '../helper/strategies/kakao.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UserService, KakaoStrategy],
})
export class AuthModule {}
