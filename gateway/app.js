'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })

  // Make sure to call next when done
  next()
}
