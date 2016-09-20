class TokenInvalidError extends Error {
  constructor(msg, res = {}) {
    super(msg);
    this.res = res;
    this.name = 'TokenInvalidError';
  }
}

function authMiddleware(opts = {}) {
  const {
    token: tokenOrThunk,
    onTokenInvalid,
    allowEmptyToken = false,
    prefix = 'Bearer ',
  } = opts

  return next => req => {
    return new Promise((resolve, reject) => {
      const token = isFunction(tokenOrThunk) ? tokenOrThunk(req) : tokenOrThunk
      if (!token && onTokenInvalid && !allowEmptyToken) {
        reject(new TokenInvalidError('No jwt token was provided.'))
      }
      resolve(token)
    }).then(token => {
      if (token) {
        req.headers['Authorization'] = `${prefix}${token}`
      }
      return next(req)
    }).then(res => {
      if (res.status === 403 && onTokenInvalid) {
        throw new TokenInvalidError('An jwt invalid token was provided.', res)
      }
      return res
    }).catch(err => {
      if (err.name === 'TokenInvalidError') {
        return onTokenInvalid(req, err.res)
          .then(() => next(req))
      }
      throw err
    })
  }
}

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply)
}

export default authMiddleware
