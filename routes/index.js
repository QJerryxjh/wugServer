const Router = require("koa-router")
const controller = require("../controller")

const router = new Router()

router.get("/", async (ctx) => {
  ctx.body = "创建一个项目"
})
  .post("/api/register", controller.register)
  .post("/api/login", controller.login)

module.exports = router