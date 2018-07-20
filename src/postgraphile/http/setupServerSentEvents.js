import { PassThrough } from 'stream'

export default function setupServerSentEvents(req, res, options) {
  const { _emitter } = options

  // Making sure these options are set.
  req.socket.setTimeout(0)
  req.socket.setNoDelay(true)
  req.socket.setKeepAlive(true)

  // Set headers for Server-Sent Events.
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  const isKoa = !!req._koaCtx
  const stream = isKoa ? new PassThrough() : null
  if (isKoa) {
    req._koaCtx.response.body = stream
    req._koaCtx.compress = false
  }

  const sse = str => {
    if (isKoa) {
      stream.write(str)
    } else {
      res.write(str)

      // support running within the compression middleware.
      // https://github.com/expressjs/compression#server-sent-events
      if (res.flushHeaders) res.flushHeaders()
    }
  }

  // Notify client that connection is open.
  sse('event: open\n\n')

  // Setup listeners.
  const schemaChangedCb = () => sse('event: change\ndata: schema\n\n')

  if (options.watchPg) _emitter.on('schemas:changed', schemaChangedCb)

  // Clean up when connection closes.
  const cleanup = () => {
    if (stream) {
      stream.end()
    } else {
      res.end()
    }
    _emitter.removeListener('schemas:changed', schemaChangedCb)
  }
  req.on('close', cleanup)
  req.on('finish', cleanup)
  req.on('error', cleanup)
}
