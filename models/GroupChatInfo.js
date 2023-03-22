const mongoose = require('../db/index')

/**
 * 群聊信息表：存储群聊的基本信息
 * gid:群聊id
 * groupName：群聊名
 * groupMembers：群成员
 * messages：聊天信息列表
 * mid:群员id与_id对应
 */

const GroupChatInfoSchema = new mongoose.Schema({
    gid: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        index: true
    },
    groupName: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    groupMembers: {
        type: Array,
        default: [],
        mid: {
            type: String,
        }
    },
    messages: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('GroupChatInfo', GroupChatInfoSchema, 'ct_group_chat_info')