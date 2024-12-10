import { Injectable, UnauthorizedException } from '@nestjs/common';
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

          try {
            const key = configService.get('JWT_SECRET_OR_KEY');
            const access = jwtService.verify(accessCookie, key);
            const refresh = jwtService.verify(refreshCookie, key);
            const currentTime = Math.floor(Date.now() / 1000);

            if (access.exp > currentTime) return accessCookie;
            return refresh;
          } catch {
            throw new UnauthorizedException();
          }
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET_OR_KEY'),
    });
  }

  validate({ id }: { id: string }) {
    return { id };
  }
}
