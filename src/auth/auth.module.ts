import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { KakaoStrategy } from '../helper/strategies/kakao.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { JwtStrategy } from '../helper/strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_OR_KEY'),
      }),
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, KakaoStrategy, JwtStrategy],
})
export class AuthModule {}
