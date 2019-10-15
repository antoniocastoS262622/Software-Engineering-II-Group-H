const Http = require('http');
const SocketIO = require('socket.io');

const core = require('./lib/core');

const server = Http.createServer(function(req, res) {
    res.statusCode = 200; 
    res.setHeader('Content-Type', 'text/plain'); 
    res.end('Hello, World!\n'); 
});

const io = SocketIO.listen(server);
server.listen(8080, function() {
    console.log('Server ready');
});

core.handle(io.sockets);