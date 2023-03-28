const router = require('express').Router()

const friendGroupHandler = require('../router_handler/friendGroup_handler')

router.get('/getFriendGroup', friendGroupHandler.getFriendGroup)

router.post('/insertFriendGroup', friendGroupHandler.insertFriendGroup)

router.post('/changeFriendGroup', friendGroupHandler.changeFriendGroup)

router.post('/sendMsgTo', friendGroupHandler.sendMessageTo)



module.exports = router