'use strict'

const HttpProxy = require('fastify-http-proxy')

module.exports = async function (app, opts) {
  app.register(HttpProxy, {
    upstream: 'http://localhost:3002/',
    http2: false // optional
  })
}

module.exports.autoPrefix = '/users'

