const UserModel = require('../models/UserModel')

module.exports = (io, socket) => {
    //处理登录后操作
    const logins = async (uid) => {
        socket.uid = uid
        console.log('用户登录', uid)
        await UserModel.findByIdAndUpdate(uid, {online: true})
    }

    const privateChat = (data) => {
        io.sockets.sockets.forEach(iss => {
            if (iss.uid === data.rid) {
                //转发至接收方room
                io.to(iss.id).emit('upMsg', {...data, msg: JSON.parse(data.msg)})
            }
        })
    }

    const groupChat = (data) => {
        io.emit('upGroupMsg', {...data, msg: JSON.parse(data.msg)})
    }

    socket.on('logins', logins)
    socket.on('privateChat', privateChat)
    socket.on('groupChat', groupChat)
}