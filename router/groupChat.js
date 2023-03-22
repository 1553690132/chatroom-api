const router = require('express').Router()
const groupChat_handler = require('../router_handler/groupChat_handler')

router.get('/gain', groupChat_handler.gainGroupChat)

router.post('/send', groupChat_handler.sendGroupMsg)

module.exports = router