export default function setupServerSentEvents (req, res, options) {
  const { _emitter } = options

  // Making sure these options are set.
  req.socket.setTimeout(0)
  req.socket.setNoDelay(true)
  req.socket.setKeepAlive(true)

  // Set headers for Server-Sent Events.
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  const sse = str => {
    res.write(str)

    // support running within the compression middleware.
    // https://github.com/expressjs/compression#server-sent-events
    if (res.flushHeaders) res.flushHeaders()
  }

  // Notify client that connection is open.
  sse('event: open\n\n')

  // Setup listeners.
  const schemaChangedCb = () => sse('event: change\ndata: schema\n\n')

  if (options.watchPg)
    _emitter.on('schemas:changed', schemaChangedCb)

  // Clean up when connection closes.
  req.on('close', () => {
    res.end()
    _emitter.removeListener('schemas:changed', schemaChangedCb)
  })
}
