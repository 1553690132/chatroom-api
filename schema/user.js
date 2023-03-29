//定义用户相关的验证规则
const joi = require('joi')

const username = joi.string().alphanum().min(5).max(10).required()

const password = joi.string().pattern(/^[\S]{8,12}$/).required()

const phone = joi.string().pattern(/^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/).required()

const code = joi.string().length(4).required()

exports.reg_login_schema = {
    body: {
        username,
        password,
        code,
        phone
    }
}

exports.login_pwd_schema = {
    body: {
        username,
        password
    }
}

exports.login_code_schema = {
    body: {
        phone,
        code
    }
}