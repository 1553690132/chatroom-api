const router = require('express').Router()
const notice_handler = require('../router_handler/notice_handler')

router.get('/gain', notice_handler.getNoticeList)

router.delete('/delete', notice_handler.deleteNotice)

module.exports = router