import { TestService } from './test.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  getAll() {
    return this.testService.getAllTest();
  }

  @Post()
  create() {
    return this.testService.createTest();
  }
}
