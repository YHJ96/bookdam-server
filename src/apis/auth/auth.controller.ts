import {
  Controller,
  Get,
  UseGuards,
  Res,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Response } from 'express';
import type { User } from '@prisma/client';
import { AuthService } from '../../apis/auth/auth.service';
import { UserService } from '../../modules/user/user.service';
import { Jwt, Public } from '../../helpers/decorators';
import { GoogleAuthGuard, KakaoAuthGuard } from '../../helpers/guard';
import { OAuthFilter } from '../../helpers/filters/oauth.filter';

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
  @UseFilters(OAuthFilter)
  async kakaoCallback(@Jwt() jwt: User, @Res() res: Response) {
    const { accessToken, refreshToken } = this.authService.createJwt(jwt);

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
  @UseFilters(OAuthFilter)
  async googleCallback(@Jwt() jwt: User, @Res() res: Response) {
    const { accessToken, refreshToken } = this.authService.createJwt(jwt);

    await this.userService.createUser(jwt);
    this.authService.regiserCookie('access', accessToken, res);
    this.authService.regiserCookie('refresh', refreshToken, res);

    return res.redirect(this.CLIENT_REDIRECT_URL);
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.clearCookie(res);
  }
}
