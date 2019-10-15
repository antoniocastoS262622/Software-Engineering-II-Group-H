const http = require('http');
const socket = require('socket.io');

const Core = require('./lib/core');

const server = http.createServer(function(req, res) {
    res.statusCode = 200; 
    res.setHeader('Content-Type', 'text/plain'); 
    res.end('Hello, World!\n'); 
});

const io = socket.listen(server);
server.listen(8080, function() {
    console.log('Server ready');
});

Core.handle(io.sockets);