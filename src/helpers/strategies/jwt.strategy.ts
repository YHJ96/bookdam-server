import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const accessCookie = request.cookies?.['access'];
          const refreshCookie = request.cookies?.['refresh'];
          const { exp } = jwtService.decode(accessCookie) as { exp: number };
          const currentTime = Math.floor(Date.now() / 1000);

          if (exp > currentTime) return accessCookie;

          return refreshCookie || null;
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
