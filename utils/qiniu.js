const qiniu = require('qiniu')

const accessKey = 'F-_stU431sRfs2KzE0naNcC4-RordLvVXn-lNTfN'
const secretKey = 'aJntdBh1FYX2ItANDkXru_yPO4rWf9iA6UBIboh8'

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const options = {
    scope: 'lwh1',  // 必填, 七牛云控制台添加的空间名称
    expires: 7200,  // expires非必填， 在不指定上传凭证的有效时间情况下，默认有效期为1个小时。expires单位为秒
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
// returnBody非必填， 有时候我们希望能自定义这个返回的JSON格式的内容，可以通过设置returnBody参数来实现。
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();

config.zone = qiniu.zone.Zone_z1


const multer = require('multer')
const upload = multer({dest: 'upload/'})

const localFile = "./test1.png";
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();
const key = null;

// 文件上传
// formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
//                                                                       respBody, respInfo) {
//     if (respErr) {
//         throw respErr;
//     }
//
//     if (respInfo.statusCode == 200) {
//         console.log(respBody);
//     } else {
//         console.log(respInfo.statusCode);
//         console.log(respBody);
//     }
// });


const bucketManager = new qiniu.rs.BucketManager(mac, config);
const publicBucketDomain = 'sa45khn4l.hb-bkt.clouddn.com';

// 公开空间访问链接
const publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
// console.log(publicDownloadUrl);

exports.uploadToken = uploadToken
exports.formUploader = formUploader
exports.putExtra = putExtra
exports.bucketManager = bucketManager

// module.exports = formUploader
