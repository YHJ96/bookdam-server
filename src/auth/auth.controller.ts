import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response, Request } from 'express';
import { KakaoAuthGuard } from '../helper/guard/kakao.guard';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';

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

  @Get()
  @UseGuards(KakaoAuthGuard)
  async login() {
    return 'kakao';
  }

  /* [TODO] DTO 만들어서 제공해야 함 */
  @Get('/callback')
  @UseGuards(KakaoAuthGuard)
  async callback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const { accessToken, refreshToken } = this.authService.createJwt(user.id);

    await this.userService.createUser(user);
    this.authService.regiserCookie('access', accessToken, res);
    this.authService.regiserCookie('refresh', refreshToken, res);

    return res.redirect(this.CLIENT_REDIRECT_URL);
  }
}
