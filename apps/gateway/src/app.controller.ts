import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'gateway',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('core/health')
  async coreHealth() {
    const res = await fetch('http://moodweave-core:8000/health/');
    return res.json();
  }
}
