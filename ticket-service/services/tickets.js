'use strict'

const fp = require('fastify-plugin')
const MyTickets= require('@eomm/tickets')

module.exports = fp(MyTickets)
