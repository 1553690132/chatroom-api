const express = require('express')
const router = express.Router()

const userinfoHandler = require('../router_handler/userinfo_handler')

router.get('/info', userinfoHandler.getUserInfo)

module.exports = router