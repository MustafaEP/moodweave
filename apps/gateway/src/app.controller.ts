import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
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

  @Get('ai/health')
    async aiHealth() {
      try {
        const res = await fetch('http://moodweave-ai:8001/health');
        return await res.json();
      } catch (err) {
        throw new HttpException(
          { message: 'AI service unreachable' },
          HttpStatus.BAD_GATEWAY,
        );
      }
    }

}
