import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@/apis/auth/auth.controller';
import { AuthService } from '@/apis/auth/auth.service';
import { UserModule } from '@/modules/user/user.module';
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
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
