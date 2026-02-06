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
  async analyzeMood(@Body() body: { text: string; engine?: string }) {
    try {
      const payload = { text: body.text, engine: body.engine ?? 'gemini' };
      const res = await fetch('http://moodweave-ai:8001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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

  @Post('recommend')
  async recommend(@Body() body: { text: string; engine?: string }) {
    try {
      const engine = body.engine ?? 'gemini';
      const aiRes = await fetch('http://moodweave-ai:8001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: body.text, engine }),
      });

      if (!aiRes.ok) {
        throw new Error(`AI error: ${aiRes.status}`);
      }

      const analysis = await aiRes.json();

      // Core → music (q-based)
      const q = encodeURIComponent(analysis.spotify_query);
      const coreRes = await fetch(
        `http://moodweave-core:8000/music/?q=${q}`
      );

      if (!coreRes.ok) {
        throw new Error(`Core error: ${coreRes.status}`);
      }

      const music = await coreRes.json();

      // Single response
      return {
        analysis,
        tracks: music.tracks,
      };
    } catch (err: any) {
      throw new HttpException(
        {
          message: 'Recommendation pipeline failed',
          error: err.message,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
  

}
