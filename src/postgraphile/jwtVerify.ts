import jwt = require('jsonwebtoken');
import { mixed } from '../interfaces';
import { JsonWebTokenError } from 'jsonwebtoken';

const undefinedIfEmpty = (
  o?: Array<string | RegExp> | string | RegExp,
): undefined | Array<string | RegExp> | string | RegExp =>
  o && (!Array.isArray(o) || o.length) ? o : undefined;

export type jwtVerifyResult = {
  role: string | undefined;
  jwtClaims: { [claimName: string]: mixed } | null;
};

export default function jwtVerify(
  jwtToken: string | undefined,
  jwtSecret: jwt.Secret | undefined,
  jwtPublicKey: jwt.Secret | jwt.GetPublicKeyOrSecret | undefined,
  jwtAudiences: string[] | undefined,
  jwtRole: string[],
  jwtVerifyOptions: jwt.VerifyOptions | undefined,
  pgDefaultRole: string | undefined,
  callback: jwt.VerifyCallback | undefined,
): jwtVerifyResult | void {
  // Setup our default role. Once we decode our token, the role may change.
  let role = pgDefaultRole;
  let jwtClaims: { [claimName: string]: mixed } = {};
  let claims;

  const rest = (claims: any): jwtVerifyResult => {
    if (jwtToken) {
      if (typeof claims === 'string') {
        throw new Error('Invalid JWT payload');
      }

      // jwt.verify returns `object | string`; but the `object` part is really a map
      jwtClaims = (claims as unknown) as typeof jwtClaims;

      const roleClaim = getPath(jwtClaims, jwtRole);

      // If there is a `role` property in the claims, use that instead of our
      // default role.
      if (typeof roleClaim !== 'undefined') {
        if (typeof roleClaim !== 'string')
          throw new Error(
            `JWT \`role\` claim must be a string. Instead found '${typeof jwtClaims['role']}'.`,
          );

        role = roleClaim;
      }
    }

    return {
      role,
      jwtClaims: jwtToken ? jwtClaims : null,
    };
  };

  // If we were provided a JWT token, let us try to verify it. If verification
  // fails we want to throw an error.
  if (jwtToken) {
    // Try to run `jwt.verify`. If it fails, capture the error and re-throw it
    // as a 403 error because the token is not trustworthy.
    const jwtVerificationSecret = jwtPublicKey || jwtSecret;
    // If a JWT token was defined, but a secret was not provided to the server or
    // secret had unsupported type, throw a 403 error.
    if (
      !Buffer.isBuffer(jwtVerificationSecret) &&
      typeof jwtVerificationSecret !== 'string' &&
      typeof jwtVerificationSecret !== 'function'
    ) {
      // tslint:disable-next-line no-console
      console.error(
        `ERROR: '${
          jwtPublicKey ? 'jwtPublicKey' : 'jwtSecret'
        }' was not set to a string or buffer - rejecting JWT-authenticated request.`,
      );
      throw new Error('Not allowed to provide a JWT token.');
    }

    if (jwtAudiences != null && jwtVerifyOptions && 'audience' in jwtVerifyOptions)
      throw new Error(`Provide either 'jwtAudiences' or 'jwtVerifyOptions.audience' but not both`);

    try {
      claims = jwt.verify(
        jwtToken,
        jwtVerificationSecret,
        {
          ...jwtVerifyOptions,
          audience:
            jwtAudiences ||
            (jwtVerifyOptions && 'audience' in (jwtVerifyOptions as object)
              ? undefinedIfEmpty(jwtVerifyOptions.audience)
              : ['postgraphile']),
        },
        callback
          ? (err, decoded) => {
              if (err) {
                callback(err, {});
              } else {
                callback((null as unknown) as JsonWebTokenError, rest(decoded));
              }
            }
          : undefined,
      );
      return callback ? undefined : rest(claims);
    } catch (error) {
      // In case this error is thrown in an HTTP context, we want to add status code
      // Note. jwt.verify will add a name key to its errors. (https://github.com/auth0/node-jsonwebtoken#errors--codes)
      error.statusCode =
        'name' in error && error.name === 'TokenExpiredError'
          ? // The correct status code for an expired ( but otherwise acceptable token is 401 )
            401
          : // All other authentication errors should get a 403 status code.
            403;

      throw error;
    }
  } else {
    return callback ? callback((null as unknown) as JsonWebTokenError, rest(claims)) : rest(claims);
  }
}

/**
 * Safely gets the value at `path` (array of keys) of `inObject`.
 *
 * @private
 */
function getPath(inObject: mixed, path: Array<string>): any {
  let object = inObject;
  // From https://github.com/lodash/lodash/blob/master/.internal/baseGet.js
  let index = 0;
  const length = path.length;

  while (object && index < length) {
    object = object[path[index++]];
  }
  return index && index === length ? object : undefined;
}
