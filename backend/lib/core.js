const Redis = require('redis');
const AsyncRedis = require('async-redis');

const service = require('./service');

const client = await Redis.createClient({
    host: 'localhost',
    port: 6379
});
const redisClient = AsyncRedis.decorate(client);


function handle(sockets) {
    //
}

module.exports = {
    handle
};