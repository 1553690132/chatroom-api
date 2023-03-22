//定义用户相关的验证规则
const joi = require('joi')

const username = joi.string().alphanum().min(5).max(10).required()

const password = joi.string().pattern(/^[\S]{8,12}$/).required()


exports.reg_login_schema = {
    body: {
        username,
        password,
    }
}