const {v4: uuidv4} = require('uuid')

const GroupChatModel = require('../models/GroupChatModel')
const GroupChatInfo = require('../models/GroupChatInfo')
const UserModel = require('../models/UserModel')

//获取群组信息
exports.gainGroupChat = (req, res) => {
    const username = req.user.username
    GroupChatModel.findOne({username: username}).then(async result => {
        const groupChatList = []
        for (const e of result.groupChats) {
            await GroupChatInfo.findOne({gid: e.gid}).then(_result => {
                groupChatList.push({..._result._doc, isShow: e.isShow})
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
            await GroupChatModel.updateOne({username}, {$push: {groupChats: {gid, isShow: false}}})
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
            await GroupChatModel.updateOne({username}, {$push: {groupChats: {gid, isShow: true}}})
        }
        res.sends('success', 200)
    } catch (err) {
        res.sends(err.message)
    }
}

//根据id查找具体群组信息
exports.findGroupById = (req, res) => {
    const {gid} = req.query
    GroupChatInfo.findOne({gid}).then(async result => {
        const avatars = []
        for (const member of result.groupMembers) {
            avatars.push(await findAvatar(member))
        }
        res.sends({result, avatars: avatars}, 200)
    }).catch(err => {
        res.sends(err.message)
    })
}

async function findAvatar(username) {
    const {headImg} = await UserModel.findOne({username})
    return headImg
}

exports.showGroupChat = (req, res) => {
    const {gid} = {...req.body}
    GroupChatModel.updateOne({
        username: req.user.username,
        "groupChats.gid": gid
    }, {$set: {"groupChats.$.isShow": true}}).then(result => {
        res.sends('success', 200)
    }).catch(err => {
        res.sends(err.message)
    })
}

exports.inviteMember = async (req, res) => {
    const {gid, members} = {...req.body}
    const groupMembers = []
    for (const groupMember of JSON.parse(members)) {
        groupMembers.push(groupMember.username)
    }
    try {
        for (const username of groupMembers) {
            await GroupChatInfo.updateOne({gid}, {$push: {groupMembers: username}})
            await GroupChatModel.updateOne({username}, {$push: {groupChats: {gid, isShow: true}}})
        }
        res.sends('success', 200)
    } catch (err) {
        res.sends(err.message)
    }
}
