import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: '',
    pass: '你的授权码'
  },
});

export function sendEmail(data) {
  return transporter.sendMail(data)
}
