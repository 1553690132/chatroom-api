const mongoose = require('../db/index')
/**
 * 好友分组表: 用于分组展示
 * username: 登录用户
 * groupList: 分组
 * groupList: {
 *     groupName: 分组名称
 *     friendList: 分组下的好友id列表
 * }
 */

const FriendGroupSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    groupList: {
        type: Array,
        trim: true,
        default: '我的好友'
    }
})

module.exports = mongoose.model('FriendGroup', FriendGroupSchema, 'ct_friend_group')