
import Redis from 'ioredis';
import config from '../config/index.js'
const redis = new Redis(config.get('redis'))
export default redis
