const jwt = require('jsonwebtoken')
const { TOKEN_SECRET_STR } = require('../../utils/config')
const { User } = require('../../db')

module.exports = {
  async checkoutToken(ctx) {
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
        ctx.body = {
          code: 200,
          msg: '登录有效期'
        }
      }
    } catch (err) {
      console.log(err)
      ctx.response.status = 401
      ctx.response.body = '登录状态失效'
    }
  }
}
