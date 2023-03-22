const InfoModel = require('../models/InfoModel')
const UserModel = require('../models/UserModel')
const multiparty = require("multiparty");


exports.gainInfo = (req, res) => {
    const username = req.query.username
    InfoModel.findOne({username}).then(result => {
        res.sends(result, 200)
    }).catch(err => {
        res.sends(err.message)
    })
}

exports.configInfo = async (req, res) => {
    const newInfo = req.body
    const userInfo = {nickname: newInfo.nickname, detail: newInfo.detail}
    try {
        await UserModel.updateOne({username: req.user.username}, userInfo)
        await InfoModel.updateOne({username: req.user.username}, newInfo)
        res.sends('success', 200)
    } catch (err) {
        res.sends(err.message)
    }
}

exports.updateAvatar = (req, res) => {
    let form = new multiparty.Form()
    return form.parse(req, (err, fields, files) => {
        const newAvatar = fields.avatar_url
        UserModel.updateOne({username: req.user.username}, {headImg: newAvatar[0]}).then(result => {
            res.sends('更新头像成功!', 200)
        }).catch(err => {
            res.send(err.message)
        })
    })
}