import config from '../config/index.js'
import express from 'express';
import {sendEmail} from "./email.js";
import {authAccess, authUser} from "./auth.js";
import {getSMTPConfig} from "./utils.js";

const app = express()
const port = config.get('port')

app.use(express.json())


app.get('/', (req, res) => {
  res.json({message: 'Hello World!'})
})

app.post('/auth', async (req, res) => {
  const authInfo = await authUser(req.body)
  res.json(authInfo)
})



app.use(authAccess)

/**
 * Message configuration
 * https://www.nodemailer.com/message/
 */
app.post('/emails', async (req, res) => {
  const body = req.body
  const user = req.user
  user.smtp = {
    ...getSMTPConfig(user.user),
    ...user.smtp
  }
  console.log(11, user)
  body.from = `${JSON.stringify(body.from)} <${user.user}>`
  const data = await sendEmail(body, user)
  res.json(data)
})

app.get('/error', (req, res, next) => {
  // 创建一个错误对象
  const err = new Error('这是一个错误');
  // 可以设置状态码
  err.statusCode = 400;
  throw err
});

app.use((err, req, res) => {
  console.error(err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    statusCode,
    message: err.message
  })
})

app.listen(port, (xx) => {
  console.log(config.toString())
  console.log(`send-api listening on port http://127.0.0.1:${port}`)
})