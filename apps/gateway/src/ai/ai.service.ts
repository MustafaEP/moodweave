import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AiService {
    constructor(private configService: ConfigService) {}

    private get aiUrl(): string {
        return this.configService.get<string>('ai.url') || 'http://moodweave-ai:8001';
    }

    async analyze(text: string, engine = 'gemini') {
        const res = await fetch(`${this.aiUrl}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, engine }),
        });

        if (!res.ok) {
            throw new Error(`AI service response status: ${res.status}`);
        }

        return res.json();
    }
}