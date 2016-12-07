import setupServerSentEvents from '../setupServerSentEvents'

const http = require('http')
const EventEmitter = require('events') // tslint:disable-line:variable-name
const request = require('supertest-as-promised')

const _emitter = new EventEmitter()
let connection

const requestHandler = async (req, res, next) => {
  const options = { _emitter, watchPg: true }
  connection = req
  setupServerSentEvents(req, res, options)
}

const createServer = () => http.createServer(requestHandler)

test('will set the appropriate headers', async () => {
  const server = createServer()
  setTimeout(() => connection.emit('close'), 25)
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
  setTimeout(() => connection.emit('close'), 25)
  await (
    request(server)
    .get('/')
    .set('Accept', 'text/event-stream')
    .expect('event: open\n\n')
  )
})

test('will send event if schema changes', async () => {
  const server = createServer()
  setTimeout(() => _emitter.emit('schemas:changed'), 25)
  setTimeout(() => connection.emit('close'), 50)
  await (
    request(server)
    .get('/')
    .set('Accept', 'text/event-stream')
    .expect('event: open\n\nevent: changed\ndata: schema\n\n')
  )
})
