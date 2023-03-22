const mongoose = require('../db/index')

/**
 * 好友表: 用于搜索好友
 * uid 用户id 与 user表_id关联
 * fid 好友id 存储好友 _id的数组
 */
const FriendSchema = new mongoose.Schema({
    uid: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    fid: {
        type: Array,
        id: {
            type: String,
            require: true
        },
        lastTime: {
            type: Number,
        },
        isShow: {
            type: Boolean,
        },
        group: {
            type: String,
            require: true
        },
        lastMessage: {
            type: String,
        },
        unread: {
            type: Boolean
        }
    }
})

module.exports = mongoose.model('Friend', FriendSchema, 'ct_friend')