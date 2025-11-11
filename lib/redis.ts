import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));

    await redisClient.connect();
    console.log('Redis connected successfully');

    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
}

export async function cacheGet(key: string): Promise<string | null> {
  try {
    const client = await getRedisClient();
    if (!client) return null;
    return await client.get(key);
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttl: number = 300): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;
    await client.setEx(key, ttl, value);
    return true;
  } catch (error) {
    console.error('Redis SET error:', error);
    return false;
  }
}

export async function cacheDel(key: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error);
    return false;
  }
}
