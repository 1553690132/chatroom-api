const client = require('../tencentcloud_utils/index')
const VerificationCodeModel = require('../models/VerificationCodeModel')
const {v4: uuidv4} = require('uuid')
const params = {
    SmsSdkAppId: "1400806010",
    SignName: "编程学习记录个人网",
    TemplateId: "",
    TemplateParamSet: [],
    PhoneNumberSet: [],
    SessionContext: "",
    ExtendCode: "",
    SenderId: ""
}


exports.setVerificationCode = async (req, res) => {
    const {phone, operate} = req.query
    const code = uuidv4().replace(/-/g, '').match(/\d+/g).join('').substring(0, 4)
    let _params
    if (operate === 'code') _params = {
        ...params,
        TemplateId: "1746510",
        PhoneNumberSet: [`+86${phone}`],
        TemplateParamSet: [code, 5]
    }
    else if (operate === 'forget') _params = {
        ...params,
        TemplateId: "1746511",
        PhoneNumberSet: [`+86${phone}`],
        TemplateParamSet: [code]
    }
    else _params = {...params, TemplateId: "1745360", PhoneNumberSet: [`+86${phone}`], TemplateParamSet: [code, 5]}
    try {
        const result = await VerificationCodeModel.findOne({phone})
        if (result) await VerificationCodeModel.updateOne({phone}, {code, createAt: Date.now()})
        else await new VerificationCodeModel({phone, code}).save()
        client.SendSms(_params, (err, result) => {
            if (err) return res.sends(err)
            res.sends('success', 200)
        })
    } catch (err) {
        res.sends(err.message)
    }
}