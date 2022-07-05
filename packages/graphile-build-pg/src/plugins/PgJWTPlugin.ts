import "graphile-config";

import type { PgSelectSingleStep, PgTypeCodec } from "@dataplan/pg";
// import { object } from "dataplanner";
import { EXPORTABLE } from "graphile-export";
import { sign as signJwt } from "jsonwebtoken";

import { getBehavior } from "../behavior.js";
import { version } from "../index.js";
import { object } from "dataplanner";

declare global {
  namespace GraphileBuild {
    interface GraphileBuildSchemaOptions {
      // TODO:
      pgJwtSecret?: any;
      pgJwtSignOptions?: any;
    }

    interface GraphileBuildGatherOptions {
      pgJwtType?: [string, string];
    }

    interface ScopeScalar {
      isPgJwtType?: boolean;
      pgCodec?: PgTypeCodec<any, any, any, any>;
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
      pgCodecs_PgTypeCodec(info, { pgCodec, pgType }) {
        if (
          info.options.pgJwtType?.[1] === pgType.typname &&
          info.options.pgJwtType?.[0] === pgType.getNamespace()!.nspname
        ) {
          // It's a JWT type!
          pgCodec.extensions ||= {};
          pgCodec.extensions.tags ||= {};
          pgCodec.extensions.tags.behavior = ["-table", "jwt"];
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

        const jwtTypeName = build.inflection.tableType(jwtCodec);
        const columnNames = Object.keys(jwtCodec.columns);

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
              (columnNames, pgJwtSecret, pgJwtSignOptions, signJwt) =>
                function serialize(value: any) {
                  const token = columnNames.reduce((memo, columnName) => {
                    if (columnName === "exp") {
                      memo[columnName] = value[columnName]
                        ? parseFloat(value[columnName])
                        : undefined;
                    } else {
                      memo[columnName] = value[columnName];
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
              [columnNames, pgJwtSecret, pgJwtSignOptions, signJwt],
            ),
            extensions: {
              graphile: {
                // TODO: optimized version of this
                plan: EXPORTABLE(
                  (columnNames, object) =>
                    function plan($in) {
                      const $record = $in as PgSelectSingleStep<
                        any,
                        any,
                        any,
                        any
                      >;
                      const spec = columnNames.reduce((memo, columnName) => {
                        memo[columnName] = $record.get(columnName);
                        return memo;
                      }, {});
                      return object(spec);
                    },
                  [columnNames, object],
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
