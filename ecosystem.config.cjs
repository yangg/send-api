module.exports = {
  apps : [{
    name   : "send-api",
    script : "npm",
    args   : "start",
    env_production: {
      NODE_ENV: 'production'
    },
  }],
  deploy: {
    production: {
      host: ['s2'],
      ref: 'origin/main',
      repo: 'git@github.com:yangg/send-api.git',
      path: '/data/send-api',
      'post-deploy': 'pnpm install && pm2 reload ecosystem.config.cjs --env production'
    }
  }
}
