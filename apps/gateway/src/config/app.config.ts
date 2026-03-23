export const appConfig = () => ({
    port: parseInt(process.env.PORT || '4000'),
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5137', 
    },
    ai: {
        url: process.env.AI_URL || 'http://moodweave-ai:8001',
    },
    core: {
        url: process.env.CORE_URL || 'http://moodweave-core:8000',
    }
});