const FriendModel = require('../models/FriendModel')
const IDComparisonModel = require('../models/IDComparisonModel')

//添加好友(双向)
exports.increaseFriend = async (req, res) => {
    const {_id, friendName} = {...req.body}
    try {
        const {uid} = await IDComparisonModel.findOne({username: friendName})
        if (_id === uid) return res.sends('不可以添加自己为好友!')
        const {fid} = await FriendModel.findOne({uid: _id}, {fid: {$elemMatch: {id: uid}}})
        if (fid.length) return res.sends('对方已经是您的好友了!')
        await FriendModel.updateOne({uid: _id}, {
            $push: {
                fid: {
                    id: uid,
                    isShow: false,
                    lastTime: new Date().getTime(),
                    group: '我的好友',
                    lastMessage: '你们已经成为好友了,现在开始聊天吧!'
                }
            }
        })
        await FriendModel.updateOne({uid}, {
            $push: {
                fid: {
                    id: _id,
                    isShow: false,
                    lastTime: new Date().getTime(),
                    group: '我的好友',
                    lastMessage: '你们已经成为好友了,现在开始聊天吧!'
                }
            }
        })
        res.sends('添加成功!', 200)
    } catch (err) {
        res.sends(err.message)
    }
}

exports.deleteFriend = (req, res) => {

}

// async function add(_id, friendName) {
//     const {uid} = await IDComparisonModel.findOne({username: friendName})
//     await FriendModel.updateOne({uid: _id}, {
//         $push: {
//             fid: {
//                 id: uid,
//                 lastTime: new Date().getTime(),
//                 isShow: false,
//                 group: '我的好友',
//                 lastMessage: '你们已经成为好友了,现在开始聊天吧!'
//             }
//         }
//     })
// }
//
// add('6401bb45f5b8d5ed378c8d7e', 'Admin')

// function findF(uid, _fid) {
//     FriendModel.findOne({uid}, {fid: {$elemMatch: {id: _fid}}}).then(res => {
//         console.log(res)
//     }).catch(err => {
//         console.log(err)
//     })
// }
//
// findF('6401bb71b2adc61db240c630', '6401a8ca69449341446a6434')