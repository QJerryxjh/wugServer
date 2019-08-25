const jwt = require('jsonwebtoken')
const { TOKEN_SECRET_STR, ACCESS_URL } = require('./config')
const { User } = require('../db')

const createToken = function(str) {
  return jwt.sign({ str }, TOKEN_SECRET_STR)
}

const check_token = async function(ctx, next) {
  const url = ctx.url
  if (ctx.method !== 'GET' && !ACCESS_URL.includes(url)) {
    const token = ctx.get('X-token')
    if (token === '') {
      ctx.response.status = 401
      ctx.response.body = '还没有登录，快去登录吧！'
      return
    }
    try {
      const { str = '' } = await jwt.verify(token, TOKEN_SECRET_STR)
      const res = User.find({
        user_email: str,
        token
      })
      if (res.length === 0) {
        ctx.response.status = 401
        ctx.response.body = '登录过期，请重新登录！'
        return
      }
      // token未过期
      ctx._email = res.user_email
    } catch (e) {
      ctx.status = 401
      ctx.response.body = '登录过期，请重新登录！'
      return
    }
  }
  await next()
}

module.exports = {
  createToken,
  check_token
}
