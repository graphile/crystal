/* tslint:disable:no-any */
import { IncomingMessage, ServerResponse } from 'http';
import { Context as KoaContext } from 'koa';

export const isKoaApp = (a: any, b: any) => a.req && a.res && typeof b === 'function';

export const middleware = async (
  ctx: KoaContext,
  next: (err?: Error) => Promise<void>,
  requestHandler: (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: Error) => Promise<any>,
  ) => Promise<any>,
) => {
  // Hack the req object so we can get back to ctx
  (ctx.req as object)['_koaCtx'] = ctx;

  // Hack the end function to instead write the response body.
  // (This shouldn't be called by any PostGraphile code.)
  const oldEnd = ctx.res.end;
  (ctx.res as object)['end'] = (body: any, cb: () => void) => {
    // Setting ctx.response.body changes koa's status implicitly, unless it
    // already has one set:
    ctx.status = ctx.res.statusCode;
    ctx.response.body = body === undefined ? '' : body;
    if (typeof cb === 'function') {
      cb();
    }
  };

  // In case you're using koa-mount or similar
  ctx.req['originalUrl'] = ctx.request.originalUrl;

  // Execute our request handler. If an error is thrown, we don’t call
  // `next` with an error. Instead we return the promise and let `koa`
  // handle the error.
  let result;
  try {
    result = await requestHandler(ctx.req, ctx.res, next);
  } finally {
    (ctx.res as object)['end'] = oldEnd;
    if (ctx.res.statusCode && ctx.res.statusCode !== 200) {
      // eslint-disable-next-line require-atomic-updates
      ctx.response.status = ctx.res.statusCode;
    }
  }
  return result;
};
