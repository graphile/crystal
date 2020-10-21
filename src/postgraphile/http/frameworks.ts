import { IncomingMessage, ServerResponse } from 'http';
import { PassThrough, Stream } from 'stream';
import { Context as KoaContext } from 'koa';
import { FastifyReply, FastifyRequest } from 'fastify';

type Headers = { [header: string]: string };

/**
 * The base class for PostGraphile responses; collects headers, status code and
 * body, and then hands to the relevant adaptor at the correct time.
 */
export abstract class PostGraphileResponse {
  private _headers: Headers = {};
  private _body: Buffer | string | PassThrough | undefined;
  private _setHeaders: boolean = false;
  public statusCode: number = 200;

  private _setHeadersOnce() {
    if (!this._setHeaders) {
      this._setHeaders = true;
      this.setHeaders(this.statusCode, this._headers);
    }
  }

  public setHeader(header: string, value: string): void {
    if (this._setHeaders) {
      throw new Error(`Cannot set a header '${header}' when headers already sent`);
    }
    this._headers[header] = value;
  }

  /**
   * Use `getStream` or `end`; not both
   */
  public getStream(): PassThrough {
    if (this._body != null) {
      throw new Error("Cannot return a stream when there's already a response body");
    }
    this._setHeadersOnce();
    this._body = new PassThrough();
    this.setBody(this._body);
    return this._body;
  }

  /**
   * Use `getStream` or `end`; not both
   */
  public end(moreBody?: Buffer | string | null) {
    if (moreBody) {
      if (this._body != null) {
        if (typeof this._body === 'string') {
          if (Buffer.isBuffer(moreBody)) {
            throw new Error('Cannot mix string and buffer');
          }
          this._body = this._body + moreBody;
        } else if (Buffer.isBuffer(this._body)) {
          if (typeof moreBody === 'string') {
            throw new Error('Cannot mix buffer and string');
          }
          this._body = Buffer.concat([this._body, moreBody]);
        } else {
          throw new Error("Can't `.end(string)` when body is a stream");
        }
      } else {
        this._body = moreBody;
      }
    }

    // If possible, set Content-Length to avoid unnecessary chunked encoding
    if (typeof this._body === 'string') {
      // String length is not reliable due to multi-byte characters; calculate via Buffer
      this.setHeader('Content-Length', String(Buffer.byteLength(this._body, 'utf8')));
    } else if (Buffer.isBuffer(this._body)) {
      this.setHeader('Content-Length', String(this._body.byteLength));
    }

    this._setHeadersOnce();
    this.setBody(this._body);
  }

  /**
   * Returns the `res` object that the underlying HTTP server would have.
   */
  public abstract getNodeServerRequest(): IncomingMessage;
  public abstract getNodeServerResponse(): ServerResponse;
  public abstract setHeaders(statusCode: number, headers: Headers): void;
  public abstract setBody(body: Stream | Buffer | string | undefined): void;
}

/**
 * Suitable for Node's HTTP server, but also connect, express, restify and fastify v2.
 */
export class PostGraphileResponseNode extends PostGraphileResponse {
  private _req: IncomingMessage;
  private _res: ServerResponse;
  private _next: (e?: 'route' | Error) => void;

  constructor(req: IncomingMessage, res: ServerResponse, next: (e?: 'route' | Error) => void) {
    super();
    this._req = req;
    this._res = res;
    this._next = next;
  }

  getNodeServerRequest() {
    return this._req;
  }

  getNodeServerResponse() {
    return this._res;
  }

  setHeaders(statusCode: number, headers: Headers) {
    for (const key in headers) {
      if (Object.hasOwnProperty.call(headers, key)) {
        this._res.setHeader(key, headers[key]);
      }
    }
    this._res.statusCode = statusCode;
  }

  setBody(body: Stream | Buffer | string | undefined) {
    if (typeof body === 'string') {
      this._res.end(body);
    } else if (Buffer.isBuffer(body)) {
      this._res.end(body);
    } else if (!body) {
      this._res.end();
    } else {
      // Must be a stream

      // It'd be really nice if we could just:
      //
      //   body.pipe(this._res);
      //
      // however we need to support running within the compression middleware
      // which requires special handling for server-sent events:
      // https://github.com/expressjs/compression#server-sent-events
      //
      // Because of this, we must handle the data streaming manually so we can
      // flush:
      const writeData = (data: Buffer | string) => {
        this._res.write(data);
        // Technically we should see if `.write()` returned false, and if so we
        // should pause the stream. However, since our stream is coming from
        // watch mode, we find it unlikely that a significant amount of data
        // will be buffered (and we don't recommend watch mode in production),
        // so it doesn't feel like we need this currently. If it turns out you
        // need this, a PR would be welcome.

        if (typeof (this._res as any).flush === 'function') {
          // https://github.com/expressjs/compression#server-sent-events
          (this._res as any).flush();
        } else if (typeof (this._res as any).flushHeaders === 'function') {
          (this._res as any).flushHeaders();
        }
      };
      let clean = false;
      const cleanup = () => {
        if (clean) return;
        clean = true;
        body.removeListener('data', writeData);
        body.removeListener('end', cleanup);
        this._req.removeListener('close', cleanup);
        this._req.removeListener('end', cleanup);
        this._req.removeListener('error', cleanup);
      };
      body.on('data', writeData);
      body.on('end', () => {
        cleanup();
        this._res.end();
      });
      this._req.on('close', cleanup);
      this._req.on('end', cleanup);
      this._req.on('error', cleanup);
    }
  }
}

export type KoaNext = (error?: Error) => Promise<any>;

/**
 * Suitable for Koa.
 */
export class PostGraphileResponseKoa extends PostGraphileResponse {
  private _ctx: KoaContext;
  private _next: KoaNext;

  constructor(ctx: KoaContext, next: KoaNext) {
    super();
    this._ctx = ctx;
    this._next = next;
    const req = this.getNodeServerRequest();

    // For backwards compatibility (this is a documented interface)
    (req as any)._koaCtx = ctx;

    // Make `koa-bodyparser` trigger skipping of our `body-parser`
    if ((ctx.request as any).body) {
      (req as any)._body = true;
      (req as any).body = (ctx.request as any).body;
    }

    // In case you're using koa-mount or similar
    (req as any).originalUrl = ctx.request.originalUrl;
  }

  getNodeServerRequest() {
    return this._ctx.req;
  }

  getNodeServerResponse() {
    return this._ctx.res;
  }

  setHeaders(statusCode: number, headers: Headers) {
    this._ctx.status = statusCode;
    this._ctx.set(headers);
    // DO NOT `this._ctx.flushHeaders()` as it will interfere with the compress
    // middleware.
  }

  setBody(body: Stream | Buffer | string | undefined) {
    this._ctx.body = body || '';
    this._next();
  }
}

/**
 * Suitable for Fastify v3 (use PostGraphileResponseNode and middleware
 * approach for Fastify v2)
 */
export class PostGraphileResponseFastify3 extends PostGraphileResponse {
  private _request: FastifyRequest;
  private _reply: FastifyReply;

  constructor(request: FastifyRequest, reply: FastifyReply) {
    super();
    this._request = request;
    this._reply = reply;

    // Make Fastify's body parsing trigger skipping of our `body-parser`
    if (this._request.body) {
      const req: any = this.getNodeServerRequest();
      req._body = true;
      req.body = this._request.body;
    }
  }

  getNodeServerRequest() {
    return this._request.raw;
  }

  getNodeServerResponse() {
    return this._reply.raw;
  }

  setHeaders(statusCode: number, headers: Headers) {
    this._reply.status(statusCode);
    this._reply.headers(headers);
  }

  setBody(body: Stream | Buffer | string | undefined) {
    this._reply.send(body);
  }
}
