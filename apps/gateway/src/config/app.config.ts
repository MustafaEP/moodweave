export const appConfig = () => ({
    port: parseInt(process.env.PORT || '4000'),
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5137', 
    },
});