// const app = require('express')()
// const http = require('http').createServer(app)
// const io = require('socket.io')(http, {
//     allowEIO3: true,
//     cors: {
//         origin: "http://localhost:8080",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// })
//
// io.on('connection', (socket) => {
//     console.log('a user connected')
// })
//
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/test.html')
// })
//
// io.on('connection', (socket) => {
//     console.log('a user connected')
//     socket.on('send-msg', message => {
//         io.emit('receive-msg', message)
//         // socket.broadcast.emit('receive-msg', message)
//     })
//
//     socket.on('send-room-msg', (message, id) => {
//         socket.to(id).emit('receive-private-msg', message)
//     })
// })
//
// http.listen(3000, () => {
//     console.log('server on http://localhost:3000')
// })

// (function(){
//     console.log(a);
//     console.log(b);
//     var a = b = 3;
//     console.log(a);
//     console.log(b);
// })();