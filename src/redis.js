
import config from '../config/index.js'

import { createClient, defineScript } from 'redis';

const redis = await createClient({
  url: config.get('redis'),
  scripts: {
    getChain: defineScript({
      NUMBER_OF_KEYS: 2,
      SCRIPT: `
local key = KEYS[1]
local prefix = KEYS[2]
local userId = redis.call('GET', key)
if not userId then
  return nil
end
local user = redis.call('GET', prefix .. userId)
return user
      `,
      transformArguments(key, prefix) {
        return [key, prefix];
      },
      // transformReply(reply) {
      //   return reply;
      // }
    })
  }
}).connect()

export default redis
