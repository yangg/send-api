import express from 'express';
import {sendEmail} from "./email.js";

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.post('/emails', async (req, res) => {
  const body = req.body
  const data = await sendEmail(body)
  res.send(JSON.stringify(data))
})

app.listen(3000, () => {
  console.log(`Example app listening on port `)
})
