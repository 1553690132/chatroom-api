const mongoose = require('../db/index')

/**
 * id对照表: 用于对应username和uid
 * username：用户名
 * uid: 用户id（user表的_id值）
 */

const IDComparisonSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        trim: true
    },
    uid: {
        type: String,
        trim: true
    }
})

module.exports = mongoose.model('IDComparison', IDComparisonSchema, 'ct_id_comparison')