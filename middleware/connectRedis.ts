import Valkey from "ioredis";

const redisConfig: any = {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD || '',
    connectTimeout: 10000, 
    retryStrategy(times: number) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
};

if (process.env.REDIS_TLS === 'true') {
    redisConfig.tls = {
        rejectUnauthorized: false 
    };
}

// singleton instance
let redisInstance: Valkey | null = null;

const setConnectionRedis = () => {
    // return existing instance if already created
    if (redisInstance && redisInstance.status === 'ready') {
        return redisInstance;
    }
    
    // create new instance
    if (!redisInstance) {
        redisInstance = new Valkey(redisConfig);
        
        redisInstance.on('error', (err) => {
            console.error('Redis connection error:', err.message);
        });
        
        redisInstance.on('connect', () => {
            console.log('Redis connected successfully');
        });
        
        redisInstance.on('close', () => {
            console.log('Redis connection closed');
            redisInstance = null;
        });
    }
    
    return redisInstance;
}

export default setConnectionRedis;