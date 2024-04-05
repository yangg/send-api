import nodemailer from 'nodemailer'


const transporterMap = new Map()


export async function sendEmail(data, config) {
  const cacheKey = config.user
  let transporter = transporterMap.get(cacheKey)
  if(!transporter) {
    transporter = nodemailer.createTransport({
      ...config.smtp,
      disableFileAccess: true,
      auth: {
        user: config.user,
        pass: config.pass
      },
    })
  }
  const result = await transporter.sendMail(data)
  // cache if send success
  if(!transporterMap.has(cacheKey)) {
    transporterMap.set(cacheKey, transporter)
  }
  return result
}
