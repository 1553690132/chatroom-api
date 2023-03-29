const tencentCloud = require('tencentcloud-sdk-nodejs')

const smsClient = tencentCloud.sms.v20210111.Client

const client = new smsClient({
    credential: {
        // secretId: "AKIDnQq1ygAQgqobBXfYFl4A5nIaeYGk16zi",
        // secretKey: "a4RdcNxKUQ9h2C9uY073lFVWJsDKDk6F"
    },

    region: "ap-beijing",

    profile: {
        signMethod: "HmacSHA256",
        httpProfile: {
            reqMethod: "POST",
            reqTimeout: 30,
            endpoint: "sms.tencentcloudapi.com"
        }
    }
})

module.exports = client

const params = {
    SmsSdkAppId: "1400806010",
    SignName: "编程学习记录个人网",
    TemplateId: "1745360",
    TemplateParamSet: ["1234", "5"],
    PhoneNumberSet: ["+8617703441191"],
    SessionContext: "",
    ExtendCode: "",
    SenderId: ""
}

// client.SendSms(params, (err, res) => {
//     if (err) {
//        return res.sends(err.message)
//     }
//     console.log(res)
// })