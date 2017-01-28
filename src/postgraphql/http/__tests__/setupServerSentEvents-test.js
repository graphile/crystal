import setupServerSentEvents from '../setupServerSentEvents'

const http = require('http')
const EventEmitter = require('events') // tslint:disable-line:variable-name
const request = require('supertest')

const _emitter = new EventEmitter()

let connectionPromiseResolve
let connectionPromise

beforeEach(() => {
  connectionPromise = new Promise((resolve) => { connectionPromiseResolve = resolve })
})

const requestHandler = async (req, res, next) => {
  const options = { _emitter, watchPg: true }
  connectionPromiseResolve(req)
  setupServerSentEvents(req, res, options)
}

const createServer = () => http.createServer(requestHandler)

test('will set the appropriate headers', async () => {
  const server = createServer()
  connectionPromise.then(connection => {
    setTimeout(() => connection.emit('close'), 5)
  })
  await (
    request(server)
    .get('/')
    .set('Accept', 'text/event-stream')
    .expect(200)
    .expect('Content-Type', 'text/event-stream')
    .expect('Cache-Control', 'no-cache')
    .expect('Connection', 'keep-alive')
    .expect('Transfer-Encoding', 'chunked')
  )
})

test('will receive an initial event', async () => {
  const server = createServer()
  connectionPromise.then(connection => {
    setTimeout(() => connection.emit('close'), 5)
  })
  await (
    request(server)
    .get('/')
    .set('Accept', 'text/event-stream')
    .expect('event: open\n\n')
  )
})

test('will send event if schema changes', async () => {
  const server = createServer()
  connectionPromise.then(connection => {
    setTimeout(() => _emitter.emit('schemas:changed'), 5)
    setTimeout(() => connection.emit('close'), 10)
  })
  await (
    request(server)
    .get('/')
    .set('Accept', 'text/event-stream')
    .expect('event: open\n\nevent: changed\ndata: schema\n\n')
  )
})
