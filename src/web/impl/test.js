const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const mount = require("koa-mount");
const swaggerDocument = require("./swagger/swagger.json");

const app = new Koa();
const swaggerUIStaticMount = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  console.log("path: ", ctx.path);
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
});
swaggerUIStaticMount.use(serve(__dirname + "/static/swagger"));
app.use(mount("/api/", swaggerUIStaticMount));

router.get("/api/swagger.json", async ctx => {
  ctx.body = swaggerDocument;
});
app.use(router.routes());
app.use(router.allowedMethods());

app.on("error", err => {
  console.error(err);
});

app.listen("3000");
console.log("Started App on Port 3000...");
