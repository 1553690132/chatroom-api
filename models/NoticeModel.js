const mongoose = require('../db/index')

/**
 * 通知表: 用户收到的通知
 * uid 用户唯一id
 * notifications 通知列表
 */

const NoticeSchema = new mongoose.Schema({
    uid: {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    notifications: {
        type: Array
    }
})

module.exports = mongoose.model('Notice', NoticeSchema, 'ct_notice')