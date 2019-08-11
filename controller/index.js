const User = require('../db').User
const sha1 = require("sha1")
const xss = require("xss")
const { create_token } = require("../utils/token")

module.exports = {
  async register(ctx, next) {
    try {
      const { user_name = "", user_email = "", user_pwd = "" } = ctx.request.body
      let res = await User.find({ user_email })
      let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (user_email === "") {
        ctx.body = {
          code: 401,
          msg: "邮箱为空"
        }
        return
      } else if (!reg.test(user_email)) {
        ctx.body = {
          code: 401,
          msg: "邮箱格式不正确"
        }
        return
      }
      if (user_name === "") {
        ctx.body = {
          code: 401,
          msg: "名称为空"
        }
        return
      }
      if (user_pwd.length < 5) {
        ctx.body = {
          code: 401,
          msg: "密码位数小于5"
        }
        return
      }

      if (res.length > 0) {
        ctx.body = {
          code: 409,
          msg: "该邮箱已被注册"
        }
        return
      }

      const user_pwd_sha = sha1(sha1(user_pwd))
      const user_name_xss = xss(user_name)
      let user = new User({
        user_name: user_name_xss,
        user_email,
        user_pwd: user_pwd_sha
      })
      res = await user.save()
      if (res._id !== null) {
        ctx.body = {
          code: 200,
          msg: "注册成功"
        }
      } else {
        ctx.body = {
          code: 500,
          msg: "注册失败，服务器异常"
        }
      }

    } catch (err) {
      console.log(err)
      ctx.body = {
        code: 500,
        msg: "注册失败，服务器异常"
      }
    }
  },
  async login(ctx) {
    try {
      const { user_email = "", user_pwd = "" } = ctx.request.body
      let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (user_email === "") {
        ctx.body = {
          code: 401,
          msg: "邮箱为空"
        }
        return
      } else if (!reg.test(user_email)) {
        ctx.body = {
          code: 401,
          msg: "请输入正确的邮箱"
        }
        return
      }

      const user_pwd_sha = sha1(sha1(user_pwd))
      let res = await User.find({ user_email, user_pwd: user_pwd_sha })

      if (res.length <= 0) {
        ctx.body = {
          code: 401,
          msg: "登录失败，用户名或密码错误"
        }
      } else {
        let token = create_token(user_email)
        res[0].token = token
        res[0].save()
        ctx.body = {
          code: 200,
          msg: "登录成功",
          data: {
            token,
            user_email
          }
        }
      }
    } catch (err) {
      console.log(err)
      ctx.body = {
        code: 500,
        msg: "注册失败，服务器异常"
      }
    }
  }
}