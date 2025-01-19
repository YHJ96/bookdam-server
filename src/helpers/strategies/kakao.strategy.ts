import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('KAKAO_CLIENT_ID'),
      clientSecret: config.get('KAKAO_CLIENT_SECRET'),
      callbackURL: config.get('KAKAO_CALLBACK_URL'),
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Omit<User, 'created_at'> {
    return {
      id: profile.id.toString(),
      name: profile.displayName,
      email: profile._json.kakao_account.email,
      avatar: profile._json.properties.profile_image,
      provider: profile.provider,
    };
  }
}
