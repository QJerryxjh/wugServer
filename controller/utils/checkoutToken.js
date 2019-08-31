const jwt = require('jsonwebtoken')
const { createToken } = require('../../utils/token')
const { TOKEN_SECRET_STR } = require('../../utils/config')
const { User } = require('../../db')

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
          token: newToken
        }
      }
    } catch (err) {
      console.log(err)
      ctx.response.status = 401
      ctx.response.body = '登录状态失效'
    }
  }
}
