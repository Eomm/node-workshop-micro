'use strict'

const HttpProxy = require('fastify-http-proxy')
const fp = require('fastify-plugin')

module.exports = fp(async function (app, opts) {
  app.register(HttpProxy, {
    upstream: 'http://localhost:3001/',
    prefix: '/tickets', // optional
    http2: false // optional
  })
})
