import { Controller, Post, Body, HttpException, HttpStatus } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller('api/ai')
export class AiController {
    constructor(private aiService: AiService) {}

    @Post('analyze')
    async analyze(@Body() body: { text: string, engine?: string }) {
        try {
            return await this.aiService.analyze(body.text, body.engine);
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Ai service unreachable',
                    error: err.message,
                },
                HttpStatus.BAD_GATEWAY,    
            );
        }
    }
}