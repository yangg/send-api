import express from 'express';
import {sendEmail} from "./email.js";

const app = express()
const port = process.env.PORT || 3211

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const user = {
  user: process.env.SEND_USER,
  pass: process.env.SEND_PASS,
  smtp: {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
  },
}

/**
 * Message configuration
 * https://www.nodemailer.com/message/
 */
app.post('/emails', async (req, res) => {
  const body = req.body
  try {
    body.from = `${JSON.stringify(body.from)} <${user.user}>`
    const data = await sendEmail(body, user)
    res.send(JSON.stringify(data))
  } catch (ex) {
    console.error(ex)
    res.status(500).send(ex.message)
  }
})

app.listen(port, () => {
  console.log(`send-api listening on port ${port}, ${process.env.SEND_USER}`)
})
