const Redis = require('redis');
const AsyncRedis = require('async-redis');

const plugins = [
    require('./service')
];

let redisClient;

async function connect() {
    const client = await Redis.createClient({
        host: 'localhost',
        port: 6379
    });
    redisClient = AsyncRedis.decorate(client);
}
async function handle(sockets) {
    await connect();
    sockets.on('connection', function(client) {
        client.on('join', function(credentials) {
            
        });
        client.on('message', function(stringData) {
            const data = JSON.parse(stringData);
            const command = data.command;
            const handler = plugins.filter(plugin => plugin[command] !== null && typeof(plugin[command]) === 'function')
                                   .map(plugin => plugin[command])
                                   .pop();
            if(handler)
                handler(data.info, client, redisClient, sockets);
        });
    });
}

module.exports = {
    handle
};