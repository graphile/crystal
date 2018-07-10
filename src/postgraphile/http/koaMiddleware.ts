/* tslint:disable:no-any no-var-requires */
export const isKoaApp = (req: any, res: any) => (req.req && req.res && typeof res === 'function')

export const middleware = async (ctx: any, next: any, requestHandler: any) => {
  // Hack the req object so we can get back to ctx
  ctx.req._koaCtx = ctx

  const oldEnd = ctx.res.end
  // mock express .end() api into koa
  ctx.res.end = (body: any) => {
    // setting the ctx.status pins the Koa internal status code,
    // otherwise setting response.body changes the status implicitly
    ctx.status = ctx.res.statusCode
    ctx.response.body = (body === undefined) ? '' : body
  }

  // Execute our request handler. If an error is thrown, we don’t call
  // `next` with an error. Instead we return the promise and let `koa`
  // handle the error.
  let result
  try {
    result = await requestHandler(ctx.req, ctx.res, next)
  } finally {
    ctx.res.end = oldEnd
  }
  return result
}
