const {v4: uuidv4} = require('uuid')
const NoticeModel = require('../models/NoticeModel')

exports.getNoticeList = (req, res) => {
    const {uid} = req.query
    NoticeModel.findOne({uid}).then(result => {
        res.sends(result.notifications, 200)
    }).catch(err => {
        res.sends(err.message)
    })
}


exports.addNotice = (uid, content) => {
    NoticeModel.updateOne({uid}, {
        $push: {
            notifications: {
                nid: uuidv4(),
                content,
                times: new Date().getTime()
            }
        }
    }).then().catch(err => {
        throw err
    })
}

exports.deleteNotice = (req, res) => {
    const {uid, nid} = req.query
    NoticeModel.updateOne({uid}, {$pull: {notifications: {nid}}}).then(() => res.sends('success', 200)).catch(err => {
        res.sends(err.message)
    })
}

