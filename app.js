const express = require('express')
const app = express()
//socket.io需要listen进行监听
const http = require('http').createServer(app)
const io = require('./socket_utils/index')(http)

const cors = require('cors')
app.use(cors())

const dotenv = require("dotenv")
dotenv.config()

app.use(express.urlencoded({extended: false, limit: '50mb'}))

//注册全局中间件 封装所有的res下的send方法
app.use((req, res, next) => {
    // status默认400 成功200、失败400
    res.sends = (err, status = 400) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

//配置解析Token中间件
const config = require('./config')
const expressJWT = require('express-jwt')
app.use(expressJWT({secret: config.jwtSecretKey, algorithms: ['HS256']}).unless({path: [/^\/api\//, /^\/code\//]})) //指定不需要进行检验的认证

//导入用户注册登录模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

//导入用户信息列表模块
const userinfoRouter = require('./router/userinfo')
app.use('/owner', userinfoRouter)

//导入消息列表模块
const chatMsgRouter = require('./router/chatmsg')
app.use('/chat', chatMsgRouter)

//导入信息配置模块
const specificInfoRouter = require('./router/specificInfo')
app.use('/info', specificInfoRouter)

const occupationRouter = require('./router/occupation')
app.use('/occupation', occupationRouter)

//导入好友分组模块
const friendGroupRouter = require('./router/friendGroup')
app.use('/friendGroup', friendGroupRouter)

const searchRouter = require('./router/search')
app.use('/search', searchRouter)

const groupChatRouter = require('./router/groupChat')
app.use('/groupChat', groupChatRouter)

const friendRouter = require('./router/friend')
app.use('/friend', friendRouter)

const noticeRouter = require('./router/notice')
app.use('/notice', noticeRouter)

const codeRouter = require('./router/verificationCode')
app.use('/code', codeRouter)

//动态
const trendRouter = require('./router/trends')
app.use('/trends', trendRouter)

//全局错误中间件
const joi = require('joi')
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.sends(err)
    if (err.name === 'UnauthorizedError') {
        console.log(err)
        return res.sends('身份验证失败！')
    }
    res.sends(err)
})

http.listen(3007, () => {
    console.log('server on http://localhost:3007')
})
