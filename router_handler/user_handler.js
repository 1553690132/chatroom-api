//用户相关的路由处理函数
const UserModel = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
const InfoModel = require('../models/InfoModel')
const IDComparison = require("../models/IDComparisonModel");
const FriendGroupModel = require("../models/FriendGroup");
const FriendModel = require('../models/FriendModel')
const NoticeModel = require('../models/NoticeModel')
const GroupChatModel = require('../models/GroupChatModel')

exports.regUser = (req, res) => {
    const userinfo = req.body
    if (!userinfo.username || !userinfo.password) {
        return res.sends('用户名或密码不能为空!')
    }

    UserModel.find({username: userinfo.username}).then(results => {
        if (results.length > 0) {
            return res.sends('用户名被占用请重新输入!')
        }
        //加密用户密码
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        UserModel({...userinfo}).save().then(async () => {
            const {_id: uid} = await UserModel.findOne({username: userinfo.username})
            addNewInformation(userinfo.username)
            addIDComparison(userinfo.username, uid)
            addFriendGroup(userinfo.username)
            addFriend(uid)
            addNotice(uid)
            addGroupChat(userinfo.username)
            return res.sends('注册成功!', 200)
        }).catch(err => {
            return res.sends(err)
        })
    }).catch(err => {
        return res.sends(err)
    })
}

exports.login = (req, res) => {
    const userinfo = req.body
    UserModel.find({username: userinfo.username}).then(async results => {
        if (results.length !== 1) {
            return res.sends('登录失败!')
        } else if (!bcrypt.compareSync(userinfo.password, results[0].password)) {
            //bcrypt包下的compareSync方法比较加密前后密码是否一致
            res.sends('账号与密码不匹配!')
        } else if (results[0].online) {
            res.sends('用户已登录！')
        } else {
            await UserModel.updateOne({username: req.body.username}, {online: true})
            const userMsg = {username: results[0].username, nickname: results[0].nickname}
            const tokenStr = jwt.sign(userMsg, config.jwtSecretKey, {expiresIn: config.expiresIn})
            res.send({
                status: 200,
                message: '登录成功!',
                uid: results[0]._id,
                // 为方便客户端使用Token，服务端直接拼接Bearer前缀
                token: 'Bearer ' + tokenStr
            })
        }
    }).catch(err => {
        return res.sends(err)
    })
}

exports.breakage = async (req, res) => {
    const username = Object.keys({...req.body})[0].substring(13, Object.keys({...req.body})[0].indexOf('}') - 1)
    await UserModel.updateOne({username}, {online: false})
    res.sends('success', 200)
}

//新用户添加information表字段
function addNewInformation(username) {
    new InfoModel({username}).save().then().catch(err => {
        throw err
    })
}

//新用户添加ID对照字段
function addIDComparison(username, uid) {
    new IDComparison({username, uid}).save().then().catch(err => {
        throw err
    })
}

//新用户添加列表字段
function addFriendGroup(username) {
    new FriendGroupModel({username}).save().then(res => {
        console.log(res)
    }).catch(err => {
        throw err
    })
}

//新用户添加好友字段
function addFriend(uid) {
    new FriendModel({uid}).save().then().catch(err => {
        throw err
    })
}

//新用户添加提醒字段
function addNotice(uid) {
    new NoticeModel({uid}).save().then().catch(err => {
        throw err
    })
}

//新用户添加群聊字段
function addGroupChat(username) {
    new GroupChatModel({username}).save().then().catch(err => {
        throw err
    })
}