/* tslint:disable:no-any */
import { IncomingMessage } from 'http';
import { CreateRequestHandlerOptions } from '../../interfaces';
import { PostGraphileResponse } from './frameworks';

export default function setupServerSentEvents(
  req: IncomingMessage,
  res: PostGraphileResponse,
  options: CreateRequestHandlerOptions,
): void {
  const { _emitter } = options;

  // Making sure these options are set.
  req.socket.setTimeout(0);
  req.socket.setNoDelay(true);
  req.socket.setKeepAlive(true);

  // Set headers for Server-Sent Events.
  res.statusCode = 200;
  // Don't buffer EventStream in nginx
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  if (req.httpVersionMajor >= 2) {
    // NOOP
  } else {
    res.setHeader('Connection', 'keep-alive');
  }
  const stream = res.getStream();

  // Notify client that connection is open.
  stream.write('event: open\n\n');

  // Setup listeners.
  const schemaChangedCb = () => stream.write('event: change\ndata: schema\n\n');

  if (options.watchPg) _emitter.on('schemas:changed', schemaChangedCb);

  // Clean up when connection closes.
  const cleanup = () => {
    req.removeListener('close', cleanup);
    req.removeListener('finish', cleanup);
    req.removeListener('error', cleanup);
    _emitter.removeListener('test:close', cleanup);
    _emitter.removeListener('schemas:changed', schemaChangedCb);
    stream.end();
  };
  req.on('close', cleanup);
  req.on('finish', cleanup);
  req.on('error', cleanup);
  _emitter.on('test:close', cleanup);
}
