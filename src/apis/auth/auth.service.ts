import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@prisma/client';
import { encrypt } from '../../utils/crypto';

@Injectable()
export class AuthService {
  private readonly COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 14;
  private readonly ACCESS_COOKIE_NAME = 'access';
  private readonly REFRESH_COOKIE_NAME = 'refresh';
  private readonly ACCESS_EXPIRES_IN = '1h';
  private readonly REFRESH_EXPIRES_IN = '14d';

  constructor(private jwtService: JwtService) {}

  createJwt(user: User) {
    const ec = encrypt(JSON.stringify(user));

    const accessToken = this.jwtService.sign(
      { id: user.id, ec },
      { expiresIn: this.ACCESS_EXPIRES_IN },
    );

    const refreshToken = this.jwtService.sign(
      { id: user.id, ec },
      { expiresIn: this.REFRESH_EXPIRES_IN },
    );

    return { accessToken, refreshToken };
  }

  clearCookie(res: Response) {
    res.clearCookie(this.ACCESS_COOKIE_NAME);
    res.clearCookie(this.REFRESH_COOKIE_NAME);
  }

  regiserCookie(
    name: typeof this.ACCESS_COOKIE_NAME | typeof this.REFRESH_COOKIE_NAME,
    jwt: string,
    res: Response,
  ) {
    res.cookie(name, jwt, {
      maxAge: this.COOKIE_MAX_AGE,
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
  }

  refreshAccessCookie(info: { id: string; ec: string }, res: Response) {
    const accessToken = this.jwtService.sign(
      { id: info.id, ec: info.ec },
      { expiresIn: this.ACCESS_EXPIRES_IN },
    );

    res.cookie(this.ACCESS_COOKIE_NAME, accessToken, {
      maxAge: this.COOKIE_MAX_AGE,
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
  }
}
