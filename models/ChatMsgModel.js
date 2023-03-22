const mongoose = require('../db/index')
/**
 * 消息表: 用于消息查询
 * sid: 聊天者
 * rid: 被聊天者
 * messages: 聊天讯息
 * message: {
 *     nickname,
 *     time,
 *     msg,
 *     chatType, 0文字 1图片
 * }
 */

const ChatMsgSchema = new mongoose.Schema({
    sid: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    rid: {
        type: String,
        trim: true,
        required: true,
    },
    chats: {
        type: Array
    },
})

module.exports = mongoose.model('ChatMsg', ChatMsgSchema, 'ct_chat_msg')