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
const VerificationCodeModel = require('../models/VerificationCodeModel')

exports.regUser = (req, res) => {
    const userinfo = req.body
    if (!userinfo.username || !userinfo.password) {
        return res.sends('用户名或密码不能为空!')
    }
    UserModel.find({username: userinfo.username}).then(async results => {
        if (results.length > 0) {
            return res.sends('用户名被占用请重新输入!')
        }
        const result = await InfoModel.findOne({telephone: userinfo.phone})
        if (result) return res.sends('该手机号已被注册，请更换手机号后重试!')
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
            res.sends('用户已登录，若非本人操作请重置密码！')
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

exports.loginByCode = async (req, res) => {
    const {phone, code} = req.body
    const result = await VerificationCodeModel.findOne({phone, code})
    if (result) {
        const _result = await InfoModel.findOne({telephone: phone})
        if (_result) {
            const {online} = await UserModel.findOne({username: _result.username})
            if (online) return res.sends('该用户已登录，若非本人操作请立即修改密码！')
            await UserModel.updateOne({username: _result.username}, {online: true})
            const {uid} = IDComparison.findOne({username: _result.username})
            const userMsg = {username: _result.username}
            const tokenStr = jwt.sign(userMsg, config.jwtSecretKey, {expiresIn: config.expiresIn})
            res.send({
                status: 200,
                message: '登录成功!',
                uid,
                // 为方便客户端使用Token，服务端直接拼接Bearer前缀
                token: 'Bearer ' + tokenStr
            })
        } else return res.sends('手机号码未绑定用户,请先用此手机号去注册用户!')
    } else return res.sends('验证码不匹配，请重新获取!')
}

exports.resetPwd = async (req, res) => {
    const {username, phone, code, password} = {...req.body}
    const userResult = await UserModel.findOne({username})
    if (!userResult) return res.sends('用户不存在！')
    const infoResult = await InfoModel.findOne({username, telephone: phone})
    if (!infoResult) return res.sends('用户和手机号不匹配，可能该手机号已经被注册！')
    const codeResult = VerificationCodeModel.findOne({phone, code})
    if (codeResult) {
        const resetPassword = bcrypt.hashSync(password, 10)
        await UserModel.updateOne({username}, {password: resetPassword, online: false})
        return res.sends('修改成功！', 200)
    } else return res.sends('验证码错误，请速速重新获取!')
}

//新用户添加information表字段
function addNewInformation(username, phone) {
    new InfoModel({username, telephone: phone}).save().then().catch(err => {
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