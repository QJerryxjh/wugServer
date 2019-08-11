const Koa = require('koa');
const onerror = require('koa-onerror');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser')
const cors = require("koa2-cors")


const app = new Koa();
const route = require('./routes')

onerror(app)
app.use(bodyparser({
  enableTypes: ["json", "form", "text"]
}))
app.use(json())
app.use(cors())

app.use(route.routes(), route.allowedMethods())

app.on("error", (err, ctx) => {
  console.log("serve error", err, ctx)
})

app.listen(3000);