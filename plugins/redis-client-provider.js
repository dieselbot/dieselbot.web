const fastifyPlugin = require('fastify-plugin');
const getRedisClient = require('../efshelper.core/common/getRedisClient');

async function redisClientProvider(fastify, options) {
  const client = await getRedisClient();
  fastify.decorate('redisClient', client);
}

module.exports = fastifyPlugin(redisClientProvider);
