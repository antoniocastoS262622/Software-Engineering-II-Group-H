const Redis = require('redis');
const AsyncRedis = require('async-redis');

const auth = require('./auth');
const plugins = [
    require('./service')
];

let redisClient;

async function connect() {
    const client = await Redis.createClient({
        url: 'redis://h:p8d8bfb0cbfb60cc409dc7309e74de8ff1f22c97e7347d8eb9aee6ec65a69f0d0@ec2-52-209-91-196.eu-west-1.compute.amazonaws.com:26679'
    });
    redisClient = AsyncRedis.decorate(client);
}
async function handle(sockets) {
    await connect();
    sockets.on('connection', function(client) {
        client.on('join', function(data) {
            const loginResult = auth.login(data);
            if(loginResult) {
                client.auth = loginResult;
                client.emit('loginSuccessful');
            } else
                client.disconnect();
        });
        client.on('message', function(data) {
            if(!client.auth) {
                client.disconnect();
                return;
            }
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