const TrendsModel = require('../models/TrendsModel')
const FriendModel = require('../models/FriendModel')
const UserModel = require('../models/UserModel')
const {v4: uuidv4} = require('uuid')

const fs = require("fs");
const qiniu_utils = require('../utils/qiniu')

exports.gainTrends = async (req, res) => {
    const {uid, pageNumber, pageSize} = {...req.query}
    let {fid} = await FriendModel.findOne({uid})
    fid = fid.map(e => e.id)
    fid.push(uid)
    const trends = await
        TrendsModel.find({uid: {$in: fid}}).sort({time: -1}).skip((pageNumber - 1) * pageSize).limit(pageSize)
    let _trends = []
    for (const trend of trends) {
        const ans = await UserModel.findById(trend.uid)
        _trends.push({...trend._doc, headImg: ans.headImg})
    }
    _trends = _trends.sort((a, b) => b.time - a.time)
    res.sends(_trends, 200)
}

exports.deleteTrend = async (req, res) => {
    const {tid} = req.query
    try {
        await TrendsModel.findByIdAndDelete(tid)
        res.sends('success', 200)
    } catch (err) {
        res.sends(err.message)
    }
}


exports.uploadImage = async (req, res) => {
    const filePath = './' + req.file.path
    const temp = req.file.originalname.split('.')
    const fileType = temp[temp.length - 1]
    const lastName = '.' + fileType
    const fileName = Date.now() + lastName
    await fs.rename(filePath, fileName, async err => {
        if (err) {
            res.end(JSON.stringify({status: '102', msg: '文件写入失败！'}))
        } else {
            const localFile = './' + fileName
            const key = fileName
            await qiniu_utils.formUploader.putFile(qiniu_utils.uploadToken, key, localFile, qiniu_utils.putExtra, async (respErr, respBody, respInfo) => {
                if (respErr) {
                    throw respErr
                }
                if (respInfo.statusCode == 200) {
                    console.log(respBody)
                    const url = qiniu_utils.bucketManager.publicDownloadUrl('sa45khn4l.hb-bkt.clouddn.com', key)
                    fs.unlinkSync(localFile)
                    res.sends(url, 200)
                } else {
                    console.log(respInfo.statusCode)
                    console.log(respBody)
                    fs.unlinkSync(localFile)
                    res.sends(404)
                }
            })
        }
    })
}

exports.publishTrend = async (req, res) => {
    console.log(req.body)
    const {images, uid, text, username} = {...req.body}
    const time = new Date().getTime()
    const pics = []
    console.log(JSON.parse(images))
    for (const img of JSON.parse(images)) {
        pics.push({url: img.response.message})
    }
    await new TrendsModel({uid, time, content: {text, pics}, username}).save().then(res => {
        console.log(res)
    }).catch(err => {
        throw err
    })
    res.sends(200)
}

exports.likeTrend = async (req, res) => {
    const {tid, nickname, lid} = req.body
    try {
        const _res = await TrendsModel.findById(tid)
        if (_res.thumbs_p.findIndex(e => e.lid === lid) !== -1) {
            await TrendsModel.findByIdAndUpdate(tid, {
                $pull: {
                    thumbs_p: {
                        lid
                    }
                }
            })
            res.sends('cancel', 200)
        } else {
            await TrendsModel.findByIdAndUpdate(tid, {
                $push: {
                    thumbs_p: {
                        lid, nickname
                    }
                }
            })
            res.sends('confirm', 200)
        }
    } catch (err) {
        res.sends(err.message)
    }
}

exports.commentTrend = async (req, res) => {
    const {tid, nickname, content, cid, uid} = req.body
    try {
        await TrendsModel.findByIdAndUpdate(tid, {
            $push: {
                comments: {
                    nickname,
                    content,
                    cid,
                    uid
                }
            }
        })
        res.sends('success', 200)
    } catch (err) {
        res.sends(err.message)
    }
}

exports.deleteComment = async (req, res) => {
    const {tid, cid, uid} = req.query
    console.log(tid, cid)
    try {
        await TrendsModel.findByIdAndUpdate(tid, {
            $pull: {
                comments: {
                    cid,
                    uid
                }
            }
        })
        res.sends('success', 200)
    } catch (err) {
        res.sends(err.message)
    }
}
