'use strict';

let os = require('os');
let nodeStatic = require('node-static');
let http = require('http');
let socketIO = require('socket.io');

let fileServer = new (nodeStatic.Server)();
let app = http.createServer(function (req, res) {
    fileServer.serve(req, res);
}).listen(8080);

let io = socketIO.listen(app);
io.sockets.on('connection', function (socket) {

    // 打印日志功能
    function log() {
        let array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }

    socket.on('message', function (message) {
        log('Client said: ', message);
        // 本示例使用广播方式，真实项目中应该是指定房间号（Socket.IO适用于学习WebRTC信号，因为它内置了'房间'的概念）
        socket.broadcast.emit('message', message);
    });

    socket.on('create or join', function (room) {
        log('Received request to create or join room ' + room);

        let clientsInRoom = io.sockets.adapter.rooms[room];
        let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

        log('Room ' + room + ' now has ' + numClients + ' client(s)');

        if (numClients === 0) {
            socket.join(room);
            log('Client ID ' + socket.id + ' created room ' + room);
            socket.emit('created', room, socket.id);

        } else if (numClients === 1) {
            log('Client ID ' + socket.id + ' joined room ' + room);
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room, socket.id);
            io.sockets.in(room).emit('ready');
        } else { // 最多两个客户端
            socket.emit('full', room);
        }
    });

    socket.on('ipaddr', function () {
        let ifaces = os.networkInterfaces();
        for (let dev in ifaces) {
            ifaces[dev].forEach(function (details) {
                if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });

});

class TokenBucket {
    constructor(capacity, fillRate) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.fillRate = fillRate;
        this.lastRefillTime = Date.now();
    }
    refill() {
        const now = Date.now();
        const elapsedTime = now - this.lastRefillTime;
        const tokensToAdd = elapsedTime * (this.fillRate / 1000);

        this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
        this.lastRefillTime = now;
    }
    consume(tokens) {
        if (tokens <= this.tokens) {
            this.tokens -= tokens;
            return true;
        } else {
            return false;
        }
    }
}
const bucket = new TokenBucket(20, 10);
setInterval(() => {
    // 每秒请求一次，尝试使用 5 个令牌
    if (bucket.consume(5)) {
        console.log('Request successful');
    } else {
        console.log('Request rejected: Not enough tokens');
    }
}, 1000);
