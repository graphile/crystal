import "graphile-config";

import type { PgCodec, PgSelectSingleStep } from "@dataplan/pg";
import { EXPORTABLE } from "graphile-export";
import { sign as signJwt } from "jsonwebtoken";

import { getBehavior } from "../behavior.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
      // TODO:
      pgJwtSecret?: any;
      pgJwtSignOptions?: any;
    }

    interface GatherOptions {
      // TODO: we may want multiple of these!
      /**
       * If you would like PostGraphile to automatically recognize a PostgreSQL
       * type as a JWT, you should pass a tuple of the
       * `["<schema name>", "<type name>"]` so we can recognize it. This is
       * case sensitive.
       */
      pgJwtType?: [string, string];
    }

    interface ScopeScalar {
      isPgJwtType?: boolean;
      pgCodec?: PgCodec;
    }
  }
}

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgJWT: Record<string, never>;
    }
  }
}

interface State {}
interface Cache {}

export const PgJWTPlugin: GraphileConfig.Plugin = {
  name: "PgJWTPlugin",
  description:
    "Converts a Postgres JWT object type into a GraphQL scalar type containing a signed JWT",
  version: version,

  before: ["PgCodecsPlugin", "PgTablesPlugin"],

  gather: {
    namespace: "pgJWT",
    helpers: {},
    hooks: {
      pgCodecs_PgCodec(info, { pgCodec, pgType }) {
        if (
          info.options.pgJwtType?.[1] === pgType.typname &&
          info.options.pgJwtType?.[0] === pgType.getNamespace()!.nspname
        ) {
          // It's a JWT type!
          pgCodec.extensions ||= Object.create(null);
          pgCodec.extensions!.tags ||= Object.create(null);
          pgCodec.extensions!.tags!.behavior = ["-table", "jwt"];
        }
      },
    },
  } as GraphileConfig.PluginGatherConfig<"pgJWT", State, Cache>,

  schema: {
    hooks: {
      init(_, build) {
        const {
          options: { pgJwtSecret, pgJwtSignOptions },
        } = build;
        const jwtCodec = [...build.pgCodecMetaLookup.keys()].find((codec) => {
          const behavior = getBehavior(codec.extensions);
          // TODO: why is b.jwt_token not found here?
          return build.behavior.matches(behavior, "jwt");
        });

        if (!jwtCodec) {
          return _;
        }
        if (!jwtCodec.attributes) {
          throw new Error(
            `JWT codec '${jwtCodec.name}' found, but it does not appear to have any attributes. Please check your configuration, the JWT type should be a composite type.`,
          );
        }

        const jwtTypeName = build.inflection.tableType(jwtCodec);
        const attributeNames = Object.keys(jwtCodec.attributes);

        build.registerScalarType(
          jwtTypeName,
          {
            isPgJwtType: true,
            pgCodec: jwtCodec,
          },
          () => ({
            description: build.wrapDescription(
              "A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) which securely represents claims between two parties.",
              "type",
            ),
            serialize: EXPORTABLE(
              (attributeNames, pgJwtSecret, pgJwtSignOptions, signJwt) =>
                function serialize(value: any) {
                  const token = attributeNames.reduce((memo, attributeName) => {
                    if (attributeName === "exp") {
                      memo[attributeName] = value[attributeName]
                        ? parseFloat(value[attributeName])
                        : undefined;
                    } else {
                      memo[attributeName] = value[attributeName];
                    }
                    return memo;
                  }, {} as any);
                  const options = Object.assign(
                    Object.create(null),
                    pgJwtSignOptions,
                    token.aud || (pgJwtSignOptions && pgJwtSignOptions.audience)
                      ? null
                      : {
                          audience: "postgraphile",
                        },
                    token.iss || (pgJwtSignOptions && pgJwtSignOptions.issuer)
                      ? null
                      : {
                          issuer: "postgraphile",
                        },
                    token.exp ||
                      (pgJwtSignOptions && pgJwtSignOptions.expiresIn)
                      ? null
                      : {
                          expiresIn: "1 day",
                        },
                  );
                  return signJwt(token, pgJwtSecret, options);
                },
              [attributeNames, pgJwtSecret, pgJwtSignOptions, signJwt],
            ),
            extensions: {
              grafast: {
                plan: EXPORTABLE(
                  () =>
                    function plan($in) {
                      const $record = $in as PgSelectSingleStep;
                      return $record.record();
                    },
                  [],
                ),
              },
            },
          }),
          "JWT scalar from PgJWTPlugin",
        );
        build.setGraphQLTypeForPgCodec(jwtCodec, "output", jwtTypeName);

        return _;
      },
    },
  },
};
