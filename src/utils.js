import crypto from "node:crypto";


const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function base62Encode(buffer) {
  let value = BigInt('0x' + buffer.toString('hex'));
  const base = BigInt(BASE62.length);
  let result = '';
  while (value > 0) {
    result = BASE62[Number(value % base)] + result;
    value = value / base;
  }
  return result;
}

export function generateAccessToken(length = 32) {
  const bytesLength = Math.ceil(length * 3 / 4);
  const bytes = crypto.randomBytes(bytesLength);
  return base62Encode(bytes);
}


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
