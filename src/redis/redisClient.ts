// redisClient.ts
import {createClient} from 'redis';

// Create a Redis client
const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 13123
    }
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.connect().catch((err) => {
  console.error('Redis connection error:', err);
});

export default client;
