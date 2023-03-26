const UserModel = require('../models/UserModel')
const InfoModel = require('../models/InfoModel')
const GroupChatInfoModel = require('../models/GroupChatInfo')

exports.searchPeople = (req, res) => {
    const {searchCondition} = req.query

    return UserModel.findOne({username: searchCondition}).then(result => {
        if (!result) {
            return UserModel.find({nickname: searchCondition}).then(async result => {
                if (!result) return res.sends('暂无数据', 200)
                const ans = []
                for (let r of result) {
                    await InfoModel.findOne({username: r.username}).then(_result => {
                        r = {...r._doc, ..._result._doc}
                        ans.push(r)
                    })
                }
                return res.sends(ans, 200)
            })
        }
        return InfoModel.findOne({username: searchCondition}).then(_result => {
            return res.sends({...result._doc, ..._result._doc}, 200)
        })
    }).catch(err => {
        return res.sends(err.message)
    })
}

exports.searchGroup = (req, res) => {
    const {searchCondition} = req.query
    GroupChatInfoModel.find({groupName: searchCondition}).then(result => {
        if (!result) return res.sends('暂无数据')
        res.sends(result, 200)
    }).catch(err => {
        res.sends(err.message)
    })
}

// exports.searchUserFriendAndGroup = (req, res) => {
//     const {content} = req.query, username = req.user.username
//
// }