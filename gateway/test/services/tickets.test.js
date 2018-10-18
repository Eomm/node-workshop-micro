'use strict'

const { test } = require('tap')
const {
  build,
  testWithLogin,
  createUser
} = require('../helper')

test('cannot create a ticket without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'A support ticket',
      body: 'this is a long body'
    }
  })

  t.equal(res.statusCode, 401)
})

test('cannot get all tickets without a login', async (t) => {
  const app = build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/tickets'
  })

  t.equal(res.statusCode, 401)
})

testWithLogin('create and get ticket', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'A support ticket',
      body: 'this is a long body'
    }
  })

  t.equal(res1.statusCode, 201) // Created
  const body1 = JSON.parse(res1.body)

  t.ok(body1._id)
  const url = `${body1._id}`
  t.equal(res1.headers.location, url)

  const res2 = await inject({
    method: 'GET',
    url
  })

  t.equal(res2.statusCode, 200)

  t.deepEqual(JSON.parse(res2.body), {
    _id: body1._id,
    title: 'A support ticket',
    body: 'this is a long body'
  })
})

test('tickets are user specific', async (t) => {
  const app = build(t)

  const token1 = await createUser(t, app, {
    username: 'manuel',
    password: 'manuel'
  })

  const token2 = await createUser(t, app, {
    username: 'collina',
    password: 'collina'
  })

  const post1 = await app.inject({
    method: 'POST',
    url: '/tickets',
    headers: {
      authorization: `Bearer ${token1}`
    },
    body: {
      title: 'AAA',
      body: 'BBB'
    }
  })

  // we are asking to access the created ticket
  // with the other user
  const get1 = await app.inject({
    method: 'GET',
    url: post1.headers.location,
    headers: {
      authorization: `Bearer ${token2}`
    }
  })

  t.equal(get1.statusCode, 404)
})

testWithLogin('create and get all', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'A support ticket',
      body: 'this is a long body'
    }
  })

  const res2 = await inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'Another support ticket',
      body: 'this is a long body'
    }
  })

  const body1 = JSON.parse(res1.body)
  const body2 = JSON.parse(res2.body)

  const resAll = await inject({
    method: 'GET',
    url: '/tickets'
  })

  t.equal(resAll.statusCode, 200)

  t.deepEqual(JSON.parse(resAll.body), {
    tickets: [{
      _id: body2._id,
      title: 'Another support ticket',
      body: 'this is a long body'
    }, {
      _id: body1._id,
      title: 'A support ticket',
      body: 'this is a long body'
    }]
  })
})

testWithLogin('do not create a ticket without a title', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/tickets',
    body: {
      body: 'this is a long body'
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'title\'')
})

testWithLogin('do not create a ticket without a body', async (t, inject) => {
  const res1 = await inject({
    method: 'POST',
    url: '/tickets',
    body: {
      title: 'A support ticket'
    }
  })

  t.equal(res1.statusCode, 400)
  t.equal(JSON.parse(res1.body).message, 'body should have required property \'body\'')
})
