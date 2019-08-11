const jwt = require('jsonwebtoken')
const { TOKEN_SECRET_STR } = require('./config')

module.exports = {
  createToken(str) {
    return jwt.sign({ str }, TOKEN_SECRET_STR)
  },
  async check_token(ctx, next) {
    console.log(ctx)
    let url = ctx.url
    await next()
  }
}
