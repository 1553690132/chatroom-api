const router = require('express').Router()

const specificInfoHandler = require('../router_handler/specificInfo_handler')

router.get('/gainInfo', specificInfoHandler.gainInfo)

router.post('/configInfo', specificInfoHandler.configInfo)

router.post('/updateAvatar', specificInfoHandler.updateAvatar)

module.exports = router