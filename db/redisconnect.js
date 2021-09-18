var redis = require("redis");
require('dotenv').config();

async function connectRedis() {
  const client = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: 6379,
      password: process.env.REDIS_AUTH
    }
  }); //auto connect to localhost:6379

  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  return client;
}

module.exports = connectRedis();