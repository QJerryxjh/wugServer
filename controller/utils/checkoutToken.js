const jwt = require('jsonwebtoken')
const { createToken } = require('../../utils/token')
const { TOKEN_SECRET_STR } = require('../../utils/config')
const { User } = require('../../db')
const { sendEmail } = require('../../utils/mailServer')

module.exports = {
  async checkoutToken(ctx) {
    // 每次打开网站的时候检查一下token，在有效期就换一个新的token
    try {
      const token = ctx.get('X-token')
      if (!token) {
        ctx.response.status = 401
        ctx.response.body = '还没有登录，快去登录吧！'
        return
      }

      const { str = '' } = jwt.verify(token, TOKEN_SECRET_STR)
      const res = await User.find({ user_email: str })
      if (res.length === 0) {
        ctx.response.status = 401
        ctx.response.body = '登录过期，请重新登录！'
      } else {
        const newToken = createToken(str)
        res[0].token = newToken
        res[0].save()
        ctx.body = {
          code: 200,
          msg: '登录有效期',
          user_email: res[0].user_email,
          user_name: res[0].user_name,
          user_gender: res[0].user_gender,
          user_avatar: res[0].user_avatar,
          user_age: res[0].user_age,
          token: newToken
        }
      }
    } catch (err) {
      console.log(err)
      ctx.response.status = 401
      ctx.response.body = '登录状态失效'
    }
  },
  async getEmailCode(ctx) {
    try {
      const { user_email = '' } = ctx.request.body
      const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (user_email === '') {
        ctx.body = {
          code: 401,
          msg: '邮箱为空'
        }
        return
      } else if (!reg.test(user_email)) {
        ctx.body = {
          code: 401,
          msg: '邮箱格式不正确'
        }
        return
      }

      const res = await User.find({ user_email })

      const user_emailCode = (Math.random() + '').slice(-6)
      const eamil = {
        title: 'test',
        htmlBody: '<h1>hello</h1><p>验证码为' + user_emailCode + '</p>'
      }
      const mailOption = {
        from: 'where u go 邮箱验证服务<844782417@qq.com>',
        to: user_email,
        subject: eamil.title,
        html: eamil.htmlBody
      }

      if (res.length === 0) {
        // 未注册
        const user = new User({
          user_email,
          user_emailCode,
          status: false
        })
        const saveRes = await user.save()
        console.log(saveRes)
        if (saveRes._id === null) {
          ctx.body = {
            code: 500,
            msg: '服务器异常'
          }
          return
        }
      } else {
        // 已注册，更改信息
        res[0].user_emailCode = user_emailCode
        res[0].save()
      }
      sendEmail(mailOption)
      ctx.body = {
        code: 200,
        msg: '发送成功'
      }
    } catch (err) {
      console.log(err)
    }
  }
}
