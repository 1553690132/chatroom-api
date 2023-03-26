const mongoose = require('../db/index')

/**
 * 群组表
 * username 用户账户名
 * groupChats：用户加入的群聊名
 *
 */

const GroupChatSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    groupChats: {
        type: Array,
        default: [],
        chatName: {
            type: String,
            trim: true
        },
        isShow: {
            type: Boolean,
            default: false
        }
    }
})

module.exports = mongoose.model('GroupChat', GroupChatSchema, 'ct_group_chat')