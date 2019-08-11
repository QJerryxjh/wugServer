const jwt = require("jsonwebtoken")
const { TOKEN_SECRET_STR } = require("./config")

module.exports = {
    create_token(str) {
        return jwt.sign({ str }, TOKEN_SECRET_STR)
    }
}