const UserModel = require('../models/UserModel')
const FriendModel = require('../models/FriendModel')
const ReadMessageModel = require('../models/ReadMessage')

//查找用户个人信息
exports.getUserInfo = (req, res) => {
    //express-jwt中间件自动给req挂载user属性
    UserModel.find({username: req.user.username}).then(async results => {
        if (results.length !== 1) return res.sends('获取用户信息失败')
        const {chatFriendList, friendList} = await getFriendList(results[0]._id.toString())
        return res.send({
            status: 200,
            message: '获取成功!',
            data: {
                user: results[0],
                chatFriendList,
                friendList
            }
        })
    }).catch(err => {
        return res.sends(err)
    })
}

//查找全体好友列表
const getFriendList = async (uid) => {
    return await FriendModel.findOne({uid}).then(async result => {
        const friendList = [], chatFriendList = []
        for (let i = 0; i < result.fid.length; i++) {
            let fri = await UserModel.findById(result.fid[i].id)
            fri._doc.lastTime = result.fid[i].lastTime
            fri._doc.lastMsg = result.fid[i].lastMsg
            //更新状态
            const {unread, unreadNum} = await gainChatStatus(result.fid[i].id, uid)
            result.fid[i].isread = unread
            result.fid[i].unreadNum = unreadNum
            fri._doc.isread = result.fid[i].isread
            fri._doc.unreadNum = result.fid[i].unreadNum
            if (result.fid[i].isShow) chatFriendList.push(fri) // 导出正在消息表显示的好友
            friendList.push(fri)
        }
        return {chatFriendList, friendList}
    })
}

const gainChatStatus = async (sid, rid) => {
    const ans = await ReadMessageModel.findOne({sid, rid})
    return ans ? {unread: ans.unread, unreadNum: ans.unreadNum} : {unread: true, unreadNum: 0}
}


