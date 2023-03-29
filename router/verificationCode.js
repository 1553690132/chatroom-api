const router = require('express').Router()
const verification_handler = require('../router_handler/verificationCode_handler')

const expressJoi = require('@escook/express-joi')

router.get('/gain', verification_handler.setVerificationCode)

module.exports = router