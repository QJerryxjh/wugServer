const mongoose = require("mongoose")

const Schema = mongoose.Schema

const db = mongoose.connect('mongodb://localhost/noteTest', { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log("出错了")
    console.log(err)
  } else {
    console.log("连接成功")
  }
})

const userSchema  = new Schema({
  user_name: String,
  user_pwd: String,
  user_email: String
})

exports.User = mongoose.model("User", userSchema)