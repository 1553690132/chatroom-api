const {v4: uuidv4} = require('uuid')

const GroupChatModel = require('../models/GroupChatModel')
const GroupChatInfo = require('../models/GroupChatInfo')

//获取群组信息
exports.gainGroupChat = (req, res) => {
    const username = req.user.username
    GroupChatModel.findOne({username: username}).then(async result => {
        const groupChatList = []
        for (const e of result.groupChats) {
            await GroupChatInfo.findOne({gid: e}).then(_result => {
                groupChatList.push(_result)
            })
        }
        res.sends(groupChatList, 200)
    }).catch(err => {
        res.sends(err.message)
    })
}

//发送群组信息
exports.sendGroupMsg = (req, res) => {
    const {gid, message} = {...req.body}
    GroupChatInfo.updateOne({_id: gid}, {$push: {messages: JSON.parse(message)}}).then(result => {
        res.sends('success', 200)
    }).catch(err => {
        res.sends(err.message)
    })
}

//加入群
exports.joinGroup = async (req, res) => {
    const username = req.user.username
    const {gid} = {...req.body}
    try {
        GroupChatInfo.findOne({gid}, {groupMembers: {$elemMatch: {$eq: username}}}).then(async result => {
            if (result.groupMembers.length) return res.sends('您已经在此群中，不能重复加入！')
            await GroupChatInfo.updateOne({gid}, {$push: {groupMembers: username}})
            await GroupChatModel.updateOne({username}, {$push: {groupChats: gid}})
            res.sends('添加成功!', 200)
        })
    } catch (err) {
        res.sends(err.message)
    }
}

//创建群聊
exports.createGroupChat = async (req, res) => {
    const {groupName, members} = {...req.body}
    const gid = uuidv4(), memberList = JSON.parse(members), groupMembers = [req.user.username]
    for (let e of memberList) {
        groupMembers.push(e.username)
    }
    try {
        await new GroupChatInfo({
            gid,
            groupName: groupName,
            groupMembers
        }).save()
        for (const username of groupMembers) {
            await GroupChatModel.updateOne({username}, {$push: {groupChats: gid}})
        }
        res.sends('success', 200)
    } catch (err) {
        res.sends(err.message)
    }
}

