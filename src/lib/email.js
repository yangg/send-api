import nodemailer from 'nodemailer'


const services = {
  'outlook.com': {
    host: "smtp-mail.outlook.com",
  }
}
services['live.cn'] = services['outlook.com'];

export function getSMTPConfig(email) {
  const domain = email.split('@')[1];
  return  {
    host: `smtp.${domain}`,
    port: 587,
    secure: false,
    ...services[domain],
  };
}

export async function sendEmail(data, config) {
  const transporter = nodemailer.createTransport({
    ...config.smtp,
    disableFileAccess: true,
    auth: {
      user: config.user,
      pass: config.pass
    },
  })
  const result = await transporter.sendMail(data)
  return result
}
