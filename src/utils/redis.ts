import IORedis from 'ioredis';

let client;

export const getRedisClient = async () => {
  client = new IORedis();
  client.on('error', err => console.log('Redis Client Error', err));
  return client;
}
