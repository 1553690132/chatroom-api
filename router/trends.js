const express = require('express')
const router = express.Router()

const TrendsHandler = require('../router_handler/trends_handler')

const multer = require('multer')
const upload = multer({dest: 'upload/'})

//上传朋友圈图片
router.post('/image', upload.single('file'), TrendsHandler.uploadImage)

//获取动态列表
router.get('/gain', TrendsHandler.gainTrends)

//发布新动态
router.post('/publish', TrendsHandler.publishTrend)

//删除动态
router.delete('/delete', TrendsHandler.deleteTrend)

//点赞动态
router.put('/like', TrendsHandler.likeTrend)

//评论动态
router.put('/comment', TrendsHandler.commentTrend)

//删除评论
router.delete('/delComment', TrendsHandler.deleteComment)
module.exports = router