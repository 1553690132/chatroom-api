const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/chatroom')

module.exports = mongoose