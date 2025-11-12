import Valkey from "ioredis";

const setConnectionRedis = () => {
    const redisHost = process.env.REDIS_HOST;
    const redisPassword = process.env.REDIS_PASSWORD;
    
    if (!redisHost) {
        throw new Error('REDIS_HOST environment variable is required');
    }
    
    if (!redisPassword) {
        throw new Error('REDIS_PASSWORD environment variable is required');
    }
    
    const redisConfig = {
        host: redisHost,
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
        username: process.env.REDIS_USERNAME || 'default',
        password: redisPassword,
        tls: {} 
    };

    const result = new Valkey(redisConfig);
    return result;
}

export default setConnectionRedis;