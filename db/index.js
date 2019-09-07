const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/noteTest', { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('连接数据库出错：')
    console.log(err)
  } else {
    console.log('连接数据库成功')
  }
})

const userSchema = new Schema({
  user_name: String,
  user_pwd: String,
  user_email: String,
  user_age: Number,
  user_emailCode: String,
  status: Boolean,
  user_gender: {
    type: String,
    default: 'nomale'
  },
  user_avatar: {
    type: String,
    default: 'default'
  },
  token: {
    type: String,
    default: ''
  }
})

exports.User = mongoose.model('User', userSchema)
