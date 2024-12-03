import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response, Request } from 'express';
import { KakaoAuthGuard } from '../helper/guard/kakao.guard';

@Controller('auth')
export class AuthController {
  private CLIENT_REDIRECT_URL: string;
  constructor(config: ConfigService) {
    this.CLIENT_REDIRECT_URL = config.get('CLIENT_REDIRECT_URL');
  }

  @Get()
  @UseGuards(KakaoAuthGuard)
  async login() {
    return 'kakao';
  }

  @Get('/callback')
  @UseGuards(KakaoAuthGuard)
  callback(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);
    return res.redirect(this.CLIENT_REDIRECT_URL);
  }
}
