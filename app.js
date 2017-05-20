const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const cors = require('koa-cors');
const onerror = require('koa-onerror');
// const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const session = require('koa-session')
const convert = require('koa-convert');
const db=require('./db/db');
const admin = require('./routes/admin');
const users = require('./routes/users');
let koaBody=require('koa-body');
app.use(koaBody({formidable:{uploadDir: __dirname+"/public/images/goods"},multipart:true}));

app.keys=['123456789'];
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
}
// error handler
onerror(app);
app.use(convert(session(app)));
// middlewares
// app.use(bodyparser);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));
app.use(cors());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(admin.routes(), admin.allowedMethods());
app.use(users.routes(), users.allowedMethods());

module.exports = app;
