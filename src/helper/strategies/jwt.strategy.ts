import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const refreshCookie = request.cookies?.['refresh'];
          const accessCookie = request.cookies?.['access'];

          return accessCookie || refreshCookie || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_OR_KEY'),
    });
  }

  validate({ id }: { id: string }) {
    return { id };
  }
}
