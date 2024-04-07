import Koa from 'koa'
import {bodyParser} from "@koa/bodyparser";

import config from '../config/index.js'
import router from "./router.js";
const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('xx', err)
    ctx.status = err.status || 500;
    ctx.body = {
      statusCode: ctx.status,
      message: err.message
    };
    ctx.app.emit('error', err, ctx);
  }
})

app.use(bodyParser({
  enableTypes: ['json'],
  strict: true,
  onError: function (err, ctx) {
    ctx.throw(422, 'Body parser error');
  }
}))

app
  .use(router.routes())
  .use(router.allowedMethods());

process.on("unhandledRejection", (reason) => {
  console.error('unhandledRejection', reason)
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err)
});

app.on('error', (err, ctx) => {
  console.error('app error', err)
})

app.listen(config.get('port'));
