import Router from "@koa/router";
import {getSMTPConfig} from "./utils.js";
import {sendEmail} from "./email.js";
import {authAccess, authUser} from "./auth.js";

const router = new Router();
router.get('/', (ctx) => {
  ctx.body = {
    message: 'Hello World'
  };
});
router.post('/', (ctx) => {
  const body = ctx.request.body;
  console.log({body})
  ctx.body = body;
});
router.get('/error1', () => {
  const err = new Error('Sync error');
  err.statusCode = 400;
  err.expose = true
  throw err
});

router.get('/error2', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1))
  const err = new Error('Async error');
  err.statusCode = 400;
  throw err
});

router.post('/auth', async (ctx) => {
  const authInfo = await authUser(ctx.request.body)
  ctx.body = authInfo
})

router.use(authAccess)

/**
 * Message configuration
 * https://www.nodemailer.com/message/
 */
router.post('/emails', async (ctx) => {
  const body = ctx.request.body
  const user = ctx.state.user
  user.smtp = {
    ...getSMTPConfig(user.user),
    ...user.smtp
  }
  body.from = `${JSON.stringify(body.from)} <${user.user}>`
  const data = await sendEmail(body, user)
  ctx.body = data
})

export default router;
