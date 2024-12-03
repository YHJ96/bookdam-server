import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('KAKAO_CLIENT_ID'),
      clientSecret: config.get('KAKAO_CLIENT_SECRET'),
      callbackURL: config.get('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    /* 쿠키 발급 */
    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);

    const oAuth = {
      id: profile.id,
      name: profile.displayName,
      email: profile._json.kakao_account.email,
      avatar: profile._json.properties.profile_image,
      provider: profile.provider,
    };

    return oAuth;
  }
}
