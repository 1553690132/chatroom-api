const mongoose = require('../db/index')
/**
 * 动态表
 * sid: 发布人
 * time: 时间
 * thumbs_p: 点赞人
 * comments: {
 *     nickname,
 *     msg
 * }
 * content: {
 *     text,
 *     pics
 * }
 */

const TrendsSchema = new mongoose.Schema({
    uid: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    username: {
        type: String,
        trim: true,
    },
    time: {
        type: Number,
        required: true
    },
    content: {
        type: Object,
        text: {
            type: String
        },
        pics: {
            type: Array,
            url: String
        }
    },
    thumbs_p: {
        type: Array
    },
    comments: {
        type: Array,
        nickname: {
            type: String
        },
        msg: {
            type: String
        }
    },
})

module.exports = mongoose.model('Trends', TrendsSchema, 'ct_trends')