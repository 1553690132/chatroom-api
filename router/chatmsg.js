const express = require('express')
const router = express.Router()

const chatMsgHandler = require('../router_handler/chatmsg_handler')

//获取信息
router.get('/gain', chatMsgHandler.gainMessage)

//发送信息
router.post('/send',chatMsgHandler.sendMessage)

//发送文件
router.post('/file', chatMsgHandler.sendFile)

router.put('/hide', chatMsgHandler.hideMessage)

router.post('/reading', chatMsgHandler.toggleRead)

router.delete('/delete', chatMsgHandler.deleteMessage)

module.exports = router