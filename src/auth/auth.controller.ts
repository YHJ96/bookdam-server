import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type { User } from '@prisma/client';
import { KakaoAuthGuard } from '../helper/guard/kakao.guard';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import { Public } from './../helper/decorators/public.decorator';
import { Jwt } from './../helper/decorators/jwt.decorator';
import { GoogleAuthGuard } from 'src/helper/guard/google.guard';

@Controller('auth')
export class AuthController {
  private CLIENT_REDIRECT_URL: string;
  constructor(
    config: ConfigService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.CLIENT_REDIRECT_URL = config.get('CLIENT_REDIRECT_URL');
  }

  @Public()
  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakao() {
    return 'kakao';
  }

  @Public()
  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@Jwt() jwt: User, @Res() res: Response) {
    const { accessToken, refreshToken } = this.authService.createJwt(jwt.id);

    await this.userService.createUser(jwt);
    this.authService.regiserCookie('access', accessToken, res);
    this.authService.regiserCookie('refresh', refreshToken, res);

    return res.redirect(this.CLIENT_REDIRECT_URL);
  }

  @Public()
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async google() {
    return 'google';
  }

  @Public()
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Jwt() jwt: User, @Res() res: Response) {
    const { accessToken, refreshToken } = this.authService.createJwt(jwt.id);

    await this.userService.createUser(jwt);
    this.authService.regiserCookie('access', accessToken, res);
    this.authService.regiserCookie('refresh', refreshToken, res);

    return res.redirect(this.CLIENT_REDIRECT_URL);
  }
}
