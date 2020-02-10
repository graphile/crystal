/* tslint:disable:no-any */
import { PassThrough } from "stream";
import { IncomingMessage, ServerResponse } from "http";
import { CreateRequestHandlerOptions } from "../../interfaces";

export default function setupServerSentEvents(
  req: IncomingMessage,
  res: ServerResponse,
  options: CreateRequestHandlerOptions,
): void {
  const { _emitter } = options;

  // Making sure these options are set.
  req.socket.setTimeout(0);
  req.socket.setNoDelay(true);
  req.socket.setKeepAlive(true);

  // Set headers for Server-Sent Events.
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  if (req.httpVersionMajor >= 2) {
    // NOOP
  } else {
    res.setHeader("Connection", "keep-alive");
  }
  const koaCtx = (req as object)["_koaCtx"];
  const isKoa = !!koaCtx;
  const stream = isKoa ? new PassThrough() : null;
  if (isKoa) {
    koaCtx.response.body = stream;
    koaCtx.compress = false;
  }

  const sse = (str: string) => {
    if (isKoa) {
      stream!.write(str);
    } else {
      res.write(str);

      // support running within the compression middleware.
      // https://github.com/expressjs/compression#server-sent-events
      if (typeof (res as any).flushHeaders === "function")
        (res as any).flushHeaders();
    }
  };

  // Notify client that connection is open.
  sse("event: open\n\n");

  // Setup listeners.
  const schemaChangedCb = () => sse("event: change\ndata: schema\n\n");

  if (options.watchPg) _emitter.on("schemas:changed", schemaChangedCb);

  // Clean up when connection closes.
  const cleanup = () => {
    if (stream) {
      stream.end();
    } else {
      res.end();
    }
    _emitter.removeListener("schemas:changed", schemaChangedCb);
  };
  req.on("close", cleanup);
  req.on("finish", cleanup);
  req.on("error", cleanup);
  _emitter.on("test:close", cleanup);
}
