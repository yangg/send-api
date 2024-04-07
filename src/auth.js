
import redis from './redis.js'
import {generateAccessToken} from "./utils.js";

function extractTokenFromHeader(request) {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' && token !== 'undefined' ? token : undefined;
}


export async function authAccess(req, res, next) {
  const token = extractTokenFromHeader(req)
  if(!token) {
    return res.status(401).json({message: 'Unauthorized, missing access token'})
  }
  const user = await redis.get(`ak:${token}`)
  if(!user) {
    return res.status(403).json({message: 'Unauthorized, invalid access token'})
  }
  req.user = JSON.parse(user)
  next()
}

export async function authUser(user) {
  const ak = generateAccessToken()
  await redis.set(`ak:${ak}`, JSON.stringify(user))
  return {
    accessToken: ak,
    expiresIn: null,
  }
}
