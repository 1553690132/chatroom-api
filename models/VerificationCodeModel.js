const mongoose = require('../db/index')

const VerificationCodeSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
        index: {expires: 300}
    }
})

module.exports = mongoose.model('VerificationCode', VerificationCodeSchema, 'ct-verificationCode')