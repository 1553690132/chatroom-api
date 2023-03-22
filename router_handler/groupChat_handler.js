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

function groupAddMembers(gid, username) {
    GroupChatInfo.updateOne({gid}, {$push: {groupMembers: username}}).then(res => {
        console.log(res)
    })
}


