
import redis from './redis.js'
import {generateAccessToken} from "./utils.js";

function extractTokenFromHeader(request) {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' && token !== 'undefined' ? token : undefined;
}


export async function authAccess(ctx, next) {
  const token = extractTokenFromHeader(ctx.request)
  ctx.assert(token, 401, 'Unauthorized, missing access token')
  const user = await redis.get(`ak:${token}`)
  ctx.assert(user, 403, 'Unauthorized, invalid access token', { token })
  ctx.state.user = JSON.parse(user)
  await next()
}

export async function authUser(user) {
  const ak = generateAccessToken()
  await redis.set(`ak:${ak}`, JSON.stringify(user))
  return {
    accessToken: ak,
    expiresIn: null,
  }
}
