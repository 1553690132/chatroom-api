const FriendGroupModel = require('../models/FriendGroup')
const IDComparisonModel = require('../models/IDComparisonModel')
const FriendModel = require('../models/FriendModel')
const UserModel = require("../models/UserModel");

//获取分组
exports.getFriendGroup = async (req, res) => {
    const username = req.user.username
    const {uid} = req.query
    const {groupList} = await FriendGroupModel.findOne({username: username})
    const {fid} = await FriendModel.findOne({uid: uid})
    const groups = []
    groupList.forEach(e => groups.push({groupName: e, users: [], peopleNumber: 0, onlineNumber: 0}))
    for (const e of fid) {
        for (const g of groups) {
            if (e.group === g.groupName) {
                const data = await UserModel.findOne({_id: e.id})
                g.users.push(data)
                g.peopleNumber++;
                g.onlineNumber = data.online ? ++g.onlineNumber : g.onlineNumber
            }
        }
    }
    res.sends(groups, 200)
}

//新增、删除分组
exports.configFriendGroup = (req, res) => {

}

//改变好友分组
exports.changeFriendGroup = async (req, res) => {
    const {uid, groupName, friendName} = req.body
    try {
        const {uid: fid} = await IDComparisonModel.findOne({username: friendName})
        const {acknowledged} = await FriendModel.updateOne({
            uid: uid,
            "fid.id": fid
        }, {$set: {"fid.$.group": groupName}})
        if (acknowledged) return res.sends('更新成功!', 200)
        return res.sends('更新失败')
    } catch (err) {
        res.sends(err)
    }
}

//发送消息至指定人员
exports.sendMessageTo = async (req, res) => {
    const {uid, friendName} = req.body
    try {
        const {uid: fid} = await IDComparisonModel.findOne({username: friendName})
        await FriendModel.updateOne({
            uid: uid,
            "fid.id": fid
        }, {$set: {"fid.$.isShow": true, "fid.$.lastTime": new Date().getTime()}})
        return res.sends('success', 200)
    } catch (err) {
        res.sends(err)
    }
}