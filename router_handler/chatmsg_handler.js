//消息获取与发布
const ChatMsgModel = require('../models/ChatMsgModel')
const FriendModel = require('../models/FriendModel')
const ReadMessageModel = require('../models/ReadMessage')
const multiparty = require('multiparty')

//获取消息
exports.gainMessage = async (req, res) => {
    const sid = req.query.sid, rid = req.query.rid
    //己->彼 消息
    const sendMsg = await ChatMsgModel.findOne({sid, rid})
    //彼->己 消息
    const recMsg = await ChatMsgModel.findOne({sid: rid, rid: sid})
    res.sends({sendMsg, recMsg}, 200)
}

//发送普通消息
exports.sendMessage = async (req, res) => {
    return await sendMsg(req, res, req.body.sid, req.body.rid, req.body.chats)
}

//更新最后聊天时间
async function addLastTime(sid, rid, lastTime) {
    await FriendModel.updateOne({"uid": sid, "fid.id": rid}, {$set: {"fid.$.lastTime": lastTime}})
}

//更新最近一次消息
async function addLastMessage(sid, rid, message) {
    await FriendModel.updateOne({uid: sid, "fid.id": rid}, {$set: {"fid.$.lastMsg": message}})
}

//发送文件
exports.sendFile = (req, res) => {
    let form = new multiparty.Form()
    return form.parse(req, async (err, fields, files) => {
        const chatFileMsg = JSON.stringify({...JSON.parse(fields.others), msg: {...files.file[0]}})
        return await sendMsg(req, res, fields.sid[0], fields.rid[0], chatFileMsg)
    })
}

//通用消息发送
async function sendMsg(req, res, sid, rid, chats) {
    const ans = await ChatMsgModel.findOne({sid, rid})
    try {
        if (ans) {
            await ChatMsgModel.updateOne({
                sid,
                rid
            }, {$push: {chats: JSON.parse(chats)}})
        } else {
            await new ChatMsgModel({
                sid,
                rid,
                chats: [JSON.parse(chats)],
            }).save()
        }
        const lastTime = JSON.parse(chats).time
        await addLastTime(sid, rid, lastTime)
        await addLastTime(rid, sid, lastTime)
        await addLastMessage(sid, rid, determineMessageType(JSON.parse(chats)))
        await addLastMessage(rid, sid, determineMessageType(JSON.parse(chats)))
        await changeStatus(sid, rid)
        await unreadChange(sid, rid)
        res.sends('success', 200)
    } catch (err) {
        return res.sends(err)
    }
}

//隐藏聊天
exports.hideMessage = (req, res) => {

}

//判断消息类型
function determineMessageType(message) {
    switch (message.chatType) {
        case 0 :
            return message.msg
        case 1 :
            if (message.extend.imgType == 1) return '表情包'
            else return '图片'
        case 2 :
            return '文件'
        case 3 :
            return '地址:' + message.msg
    }
}

//发送消息后改变对方的显示状态(即对方收到消息显示在列表中)
async function changeStatus(sid, rid) {
    await FriendModel.updateOne({uid: rid, "fid.id": sid}, {"fid.$.isShow": true})
}

//发送消息默认为未读
//eg: A->B A到B的消息为未读
async function unreadChange(sid, rid) {
    const ans = await ReadMessageModel.findOne({sid, rid})
    if (ans) {
        await ReadMessageModel.updateOne({sid, rid}, {unread: false})
    } else {
        await new ReadMessageModel({sid, rid}).save()
    }
}

exports.toggleRead = (req, res) => {
    const {sid, rid} = {...req.body}
    ReadMessageModel.updateOne({sid, rid}, {unread: true}).then(result => {
        res.sends('success', 200)
    }).catch(err => {
        res.sends(err.message)
    })
}