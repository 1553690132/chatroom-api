const router = require('express').Router()
const groupChat_handler = require('../router_handler/groupChat_handler')

router.get('/gain', groupChat_handler.gainGroupChat)

router.post('/send', groupChat_handler.sendGroupMsg)

router.post('/create', groupChat_handler.createGroupChat)

router.post('/join', groupChat_handler.joinGroup)

router.get('/find', groupChat_handler.findGroupById)

router.post('/show', groupChat_handler.showGroupChat)

router.post('/invite', groupChat_handler.inviteMember)

router.put('/hide', groupChat_handler.hideGroupMessage)

router.delete('/delete', groupChat_handler.deleteGroupChat)

module.exports = router