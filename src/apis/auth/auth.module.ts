import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '@/apis/user';
import { AuthService, AuthController } from '@/apis/auth';
import {
  GoogleStrategy,
  KakaoStrategy,
  JwtStrategy,
} from '@/helpers/strategies';

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
  providers: [
    AuthService,
    UserService,
    KakaoStrategy,
    GoogleStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
