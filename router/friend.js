const router = require('express').Router()
const friend_handler = require('../router_handler/friend_handler')

//添加好友
router.post('/increase', friend_handler.increaseFriend)

//删除好友
router.delete('/delete', friend_handler.deleteFriend)
module.exports = router
