/* tslint:disable:no-any no-var-requires */
export const isKoaApp = (req: any, res: any) => (req.req && res.res && typeof res === 'function')

export const middleware = (ctx: any, next: any, requestHandler: any) => {
  // Hack the req object so we can get back to ctx
  ctx.req._koaCtx = ctx

  const oldEnd = ctx.res.end
  ctx.res.end = (body: any) => {
    ctx.response.body = body
  }

  // Execute our request handler. If an error is thrown, we don’t call
  // `next` with an error. Instead we return the promise and let `koa`
  // handle the error.
  return (async () => {
    let result
    try {
      result = await requestHandler(ctx.req, ctx.res, next)
    } finally {
      ctx.res.end = oldEnd
      if (ctx.res.statusCode && ctx.res.statusCode !== 200) {
        ctx.response.status = ctx.res.statusCode
      }
    }
    return result
  })()
}
