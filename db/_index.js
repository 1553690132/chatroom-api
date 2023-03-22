const mongoose = require('mongoose');
const {Schema} = require("mongoose");
//连接数据库
mongoose.connect('mongodb://127.0.0.1/chatroom');
// 创建模型
const UserSchema = new Schema({
    name: String,
    age: Number
})
// 创建集合
const User = mongoose.model('User', UserSchema)
// 实例化
const u = new User({name: 'lwhzzz', age: 18})

// 保存数据

// u.save().then(() => console.log('success'))

// 查询单条数据
User.findOne({name: 'lwhzzz'}).then((res) => console.log(res))

// 按照id查询
User.findById({_id: "64009b2f2558b728eb1435c8"}).then(res => console.log(res))

// 记录数查询
User.countDocuments().then(res => console.log(res))