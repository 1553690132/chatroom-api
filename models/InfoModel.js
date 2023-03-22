const mongoose = require('../db/index')
/**
 * 信息表: 用户个人详细信息
 * username 账号
 * occupation 职业
 * location 地址
 * corporation 公司
 * postbox 邮箱
 * school 学校
 */
const InfoSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    occupation: {
        type: String,
        trim: true,
        default: '-',
    },
    location: {
        type: String,
        trim: true,
        default: '-',
    },
    corporation: {
        type: String,
        trim: true,
        default: '-',
    },
    telephone: {
        type: String,
        trim: true,
        default: '-',
    },
    school: {
        type: String,
        trim: true,
        default: '-',
    },
    age: {
        type: Date,
        trim: true,
        default: new Date().toISOString()
    },
    sex: {
        type: String,
        trim: true,
        default: '男',
    }
})

module.exports = mongoose.model('Info', InfoSchema, 'ct_userinfo')