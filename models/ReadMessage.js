const mongoose = require('../db/index')

/**
 * 消息状态表
 * sid: 发信者
 * rid：收信者
 * unread：消息读取状态
 * */

const ReadMessageSchema = new mongoose.Schema({
    sid: {
        type: String,
        index: true
    },
    rid: {
        type: String,
        index: true
    },
    unread: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('ReadMessage', ReadMessageSchema, 'ct_read_message')