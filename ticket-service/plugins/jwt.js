'use strict'

const JWT = require('fastify-jwt')
const fp = require('fastify-plugin')

module.exports = fp(async function (app, opts) {
  app.register(JWT, Object.assign(
    {},
    { secret: process.env.JWT_SECRET },
    opts.auth
  ))
})
