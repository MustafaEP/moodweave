import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Controller('api') 
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'gateway',
    };
  }

  @Get('core/health')
  async coreHealth() {
    const res = await fetch('http://moodweave-core:8000/health/');
    return res.json();
  }

  @Get('core/music')
  async musicByMood(@Query('mood') mood: string) {
    try {
      const url = `http://moodweave-core:8000/music/?mood=${mood || 'neutral'}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Core response status: ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new HttpException(
        {
          message: 'Core music service unreachable',
          error: err.message,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
