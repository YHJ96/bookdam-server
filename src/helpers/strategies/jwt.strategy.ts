import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../../apis/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    jwtService: JwtService,
    authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const accessCookie = request.cookies?.['access'];
          const refreshCookie = request.cookies?.['refresh'];

          try {
            const access = jwtService.verify(accessCookie, {
              ignoreExpiration: true,
            });

            jwtService.verify(refreshCookie);
            const currentTime = Math.floor(Date.now() / 1000);
            if (access.exp > currentTime) return accessCookie;

            authService.refreshAccessCookie({ ...access }, request.res);

            return refreshCookie;
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
