import "graphile-config";

import type {} from "grafserv/node";
import { PgJWTPlugin } from "graphile-build-pg";
import type {
  GetPublicKeyOrSecret,
  JwtPayload,
  Secret,
  VerifyOptions,
} from "jsonwebtoken";
import { verify as verifyJwt } from "jsonwebtoken";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface GrafservOptions {
      pgJwtSecret?: Secret | GetPublicKeyOrSecret;
      pgJwtVerifyOptions?: VerifyOptions;
    }
  }
}

const GrafservPgJWTPlugin: GraphileConfig.Plugin = {
  name: "GrafservPgJWTPlugin",
  version,

  grafast: {
    middleware: {
      prepareArgs(next, event) {
        const { args } = event;
        const { resolvedPreset, requestContext: ctx } = args;
        const secret =
          resolvedPreset?.grafserv?.pgJwtSecret ??
          resolvedPreset?.schema?.pgJwtSecret;
        const pgJwtVerifyOptions = resolvedPreset?.grafserv?.pgJwtVerifyOptions;
        if (secret) {
          const authorization = ctx?.node?.req?.headers?.authorization;
          if (typeof authorization === "string") {
            const [bearer, token] = authorization.split(" ");
            if (bearer.toLowerCase() === "bearer") {
              return Promise.resolve()
                .then(async () => {
                  const claims = await new Promise<JwtPayload>(
                    (resolve, reject) =>
                      verifyJwt(
                        token,
                        secret,
                        {
                          algorithms: ["HS256", "HS384"],
                          audience: "postgraphile",
                          ...pgJwtVerifyOptions,
                          complete: false,
                        },
                        (err, claims) => {
                          if (err) {
                            (err as any).statusCode = 401;
                            reject(err);
                          } else if (!claims || typeof claims === "string") {
                            reject(
                              Object.assign(new Error("Invalid JWT payload"), {
                                statusCode: 401,
                              }),
                            );
                          } else {
                            resolve(claims);
                          }
                        },
                      ),
                  );
                  if (!args.contextValue.pgSettings) {
                    args.contextValue.pgSettings = Object.create(null);
                  }
                  const pgSettings = args.contextValue.pgSettings!;
                  if (claims.role) {
                    pgSettings.role = claims.role;
                  }
                  for (const [key, value] of Object.entries(claims)) {
                    if (
                      value &&
                      /^[a-z_][a-z0-9_]*$/i.test(key) &&
                      key.length <= 52
                    ) {
                      pgSettings[`jwt.claims.${key}`] = String(value);
                    }
                  }
                })
                .then(next);
            }
          }
        }
        return next();
      },
    },
  },
};

/**
 * You really ought to handle JWTs yourself in the `preset.grafast.context`
 * function; this allows you to control the settings for validation, to ensure
 * that only the values that you need are being passed through to postgres, and
 * just generally to exercise more control over authorization.
 *
 * If you can't be bothered to do that, and you use `grafserv/node` (or
 * something compatible with it) as your server adaptor, then you can use this
 * preset to do some basics for you. But if what it does isn't enough for you -
 * do it yourself!
 */
export const PgLazyJWTPreset: GraphileConfig.Preset = {
  plugins: [PgJWTPlugin, GrafservPgJWTPlugin],
};
