import { Controller, Get } from '@nestjs/common';
import { Public } from '../helper/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  healthCheck() {
    return 'Server is Heathly';
  }
}
