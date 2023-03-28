const FriendModel = require('../models/FriendModel')
const IDComparisonModel = require('../models/IDComparisonModel')
const ChatMsgModel = require('../models/ChatMsgModel')
const ReadMessageModel = require('../models/ReadMessage')
const notice_handler = require('../router_handler/notice_handler')

//添加好友(双向)
exports.increaseFriend = async (req, res) => {
    const {_id, friendName} = {...req.body}
    try {
        const {uid} = await IDComparisonModel.findOne({username: friendName})
        if (_id === uid) return res.sends('不可以添加自己为好友!')
        const {fid} = await FriendModel.findOne({uid: _id}, {fid: {$elemMatch: {id: uid}}})
        if (fid.length) return res.sends('对方已经是您的好友了!')
        await FriendModel.updateOne({uid: _id}, {
            $push: {
                fid: {
                    id: uid,
                    isShow: false,
                    lastTime: new Date().getTime(),
                    group: '我的好友',
                    lastMessage: '你们已经成为好友了,现在开始聊天吧!'
                }
            }
        })
        await FriendModel.updateOne({uid}, {
            $push: {
                fid: {
                    id: _id,
                    isShow: false,
                    lastTime: new Date().getTime(),
                    group: '我的好友',
                    lastMessage: '你们已经成为好友了,现在开始聊天吧!'
                }
            }
        })
        notice_handler.addNotice(uid, `${req.user.username}已添加您为好友!`)
        res.sends('添加成功!', 200)
    } catch (err) {
        res.sends(err.message)
    }
}

exports.deleteFriend = async (req, res) => {
    const {uid, fid} = req.query, username = req.user.username
    try {
        await FriendModel.updateOne({uid}, {$pull: {fid: {id: fid}}})
        await FriendModel.updateOne({uid: fid}, {$pull: {fid: {id: uid}}})
        await ChatMsgModel.updateOne({sid: uid, rid: fid}, {$pull: {chats: {}}})
        await ChatMsgModel.updateOne({sid: fid, rid: uid}, {$pull: {chats: {}}})
        await ReadMessageModel.updateOne({sid: uid, rid: fid}, {$set: {unread: true}})
        await ReadMessageModel.updateOne({sid: fid, rid: uid}, {$set: {unread: true}})
        notice_handler.addNotice(fid, `${username}已删除您,这将切断你们之间的联系!`)
        res.sends('delete success', 200)
    } catch (err) {
        res.sends(err.message)
    }
}