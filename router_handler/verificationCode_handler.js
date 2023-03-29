const client = require('../tencentcloud_utils/index')
const VerificationCodeModel = require('../models/VerificationCodeModel')
const {v4: uuidv4} = require('uuid')


exports.setVerificationCode = async (req, res) => {
    const {phone} = req.query
    const code = uuidv4().replace(/-/g, '').match(/\d+/g).join('').substring(0, 4)
    const params = {
        SmsSdkAppId: "1400806010",
        SignName: "编程学习记录个人网",
        TemplateId: "1745360",
        TemplateParamSet: [code, "5"],
        PhoneNumberSet: [`+86${phone}`],
        SessionContext: "",
        ExtendCode: "",
        SenderId: ""
    }
    try {
        const result = await VerificationCodeModel.findOne({phone})
        if (result) await VerificationCodeModel.updateOne({phone}, {code, createAt: Date.now()})
        else await new VerificationCodeModel({phone, code}).save()
        client.SendSms(params, (err, result) => {
            if (err) return res.sends(err)
            res.sends('success', 200)
        })
    } catch
        (err) {
        res.sends(err.message)
    }
}

// async function xxx(phone, code) {
//     const result = await VerificationCodeModel.findOne({phone})
//     if (result) await VerificationCodeModel.updateOne({phone}, {code, createAt: Date.now()})
//     else await new VerificationCodeModel({phone, code}).save()
// }
//
// xxx("17703441191", "5234")