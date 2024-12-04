import { Controller, Get } from '@nestjs/common';
import { Public } from '@/helpers/decorators';

@Controller()
export class AppController {
  @Public()
  @Get()
  healthCheck() {
    return 'Server is Heathly';
  }
}
