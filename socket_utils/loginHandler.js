const UserModel = require('../models/UserModel')
const FriendModel = require('../models/FriendModel')
const fids = []

module.exports = (io, socket) => {
    //处理登录后操作
    const logins = async (uid) => {
        if (uid === undefined) return
        socket.uid = uid
        await UserModel.findByIdAndUpdate(uid, {online: true})
    }

    const privateChat = (data) => {
        io.sockets.sockets.forEach(iss => {
            if (iss.uid === data.rid) {
                //转发至接收方room
                if (data.msg === 'file') io.to(iss.id).emit('upFile')
                else io.to(iss.id).emit('upMsg', {...data, msg: JSON.parse(data.msg)})
                io.to(iss.id).emit('upList') //更新预警
            }
        })
    }

    const groupChat = (data) => {
        io.emit('upGroupMsg', {...data, msg: JSON.parse(data.msg)})
    }


    const heartbeat = async () => {
        let proxy = new Proxy(fids, {
            set(target, key, value) {
                target[key] = value;
                io.emit('friendOnline')
                return true;
            }
        })
        io.sockets.sockets.forEach(iss => {
            if (proxy.indexOf(iss.uid) === -1) {
                proxy.push(iss.uid)
            }
        })
        for (const fid of fids) {
            if (fid === undefined) {
                proxy.slice(proxy.indexOf(undefined), 1)
                continue
            }
            const {online} = await UserModel.findOne({_id: fid})
            if (!online) {
                proxy.splice(proxy.indexOf(fid), 1)
            }
        }
    }

    socket.on('logins', logins)
    socket.on('privateChat', privateChat)
    socket.on('groupChat', groupChat)
    socket.on('heartbeat', heartbeat)

    socket.on('disconnect', async () => {
        await UserModel.updateOne({_id: socket.uid}, {online: false})
    })
}