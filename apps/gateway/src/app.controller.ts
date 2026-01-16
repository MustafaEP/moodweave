import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Post,
  Body,
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

  @Post('ai/analyze')
  async analyzeMood(@Body() body: { text: string }) {
    try {
      const res = await fetch('http://moodweave-ai:8001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: body.text }),
      });

      if (!res.ok) {
        throw new Error(`AI service response status: ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      throw new HttpException(
        {
          message: 'AI service unreachable',
          error: err.message,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
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
