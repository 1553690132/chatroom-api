// socket.io的核心配置文件
module.exports = server => {
    const io = require('socket.io')(server, {
        allowEIO3: true,
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    const registerLoginHandlers = require('./loginHandler')

    const onConnection = socket => {
        registerLoginHandlers(io, socket)
    }

    io.on('connection', onConnection)

    return io
}