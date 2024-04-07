import convict from 'convict'
import JSON5 from "json5";
import {existsSync} from "node:fs";

convict.addParser({extension: 'json5', parse: JSON5.parse})
const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3211,
    env: 'PORT',
    arg: 'port'
  },
  redis: {
    doc: 'redis url',
    format: '*',
    default: 'redis://s2:6376/10'
  }
});
function tryLoadFile(file) {
  if(existsSync(file)) {
    config.loadFile(file);
  }
}
tryLoadFile(`./config/${config.get('env')}.json5`);
tryLoadFile(`./config/${config.get('env')}.local.json5`);


config.validate({allowed: 'strict'});

export default config;
