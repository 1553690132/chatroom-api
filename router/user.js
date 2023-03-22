const express = require('express')
const router = express.Router()

const userHandler = require('../router_handler/user_handler')

const expressJoi = require('@escook/express-joi')
const {reg_login_schema} = require('../schema/user')

//局部中间件，对请求携带参数进行检验，通过后继续流转，错误后抛出异常给全局异常中间件处理
router.post('/reg', expressJoi(reg_login_schema), userHandler.regUser)

router.post('/login', expressJoi(reg_login_schema), userHandler.login)

router.post('/breakage', userHandler.breakage)

module.exports = router