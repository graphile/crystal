import "graphile-config";

import type { GenericPgCodec, GenericPgSelectSingleStep } from "@dataplan/pg";
import { EXPORTABLE, gatherConfig } from "graphile-build";
import type { Secret, SignOptions } from "jsonwebtoken";
import { sign as signJwt } from "jsonwebtoken";

import { parseDatabaseIdentifier, parseDatabaseIdentifiers } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface SchemaOptions {
      pgJwtSecret?: Secret;
      pgJwtSignOptions?: SignOptions;
    }

    interface GatherOptions {
      /** @deprecated use pgJwtTypes instead */
      pgJwtType?: string | [string, string];
      /**
       * If you would like PostGraphile to automatically recognize certain
       * PostgreSQL types as a JWT, you should pass a list of their identifiers
       * here:
       * `pgJwtTypes: ['my_schema.my_jwt_type', 'my_schema."myOtherJwtType"']`
       *
       * Parsing is similar to PostgreSQL's parsing, so identifiers are
       * lower-cased unless they are escaped via double quotes.
       *
       * You can alternatively supply a comma-separated list if you prefer:
       * `pgJwtTypes: 'my_schema.my_jwt_type,my_schema."myOtherJwtType"'`
       */
      pgJwtTypes?: string | string[];
    }

    interface ScopeScalar {
      isPgJwtType?: boolean;
      pgCodec?: GenericPgCodec;
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

const EMPTY_OBJECT = Object.freeze({});

function getPgJwtTypeDigests(
  options: GraphileBuild.GatherOptions,
): Array<[string, string]> {
  const digests: Array<[string, string]> = [];

  if (Array.isArray(options.pgJwtType)) {
    digests.push(options.pgJwtType);
  } else if (typeof options.pgJwtType === "string") {
    const tuples = parseDatabaseIdentifiers(options.pgJwtType, 2, "public");
    digests.push(...tuples);
  }
  if (typeof options.pgJwtTypes === "string") {
    const tuples = parseDatabaseIdentifiers(options.pgJwtTypes, 2, "public");
    digests.push(...tuples);
  }
  if (Array.isArray(options.pgJwtTypes)) {
    const tuples = options.pgJwtTypes.map((type) =>
      parseDatabaseIdentifier(type, 2, "public"),
    );
    digests.push(...tuples);
  }

  return digests;
}

export const PgJWTPlugin: GraphileConfig.Plugin = {
  name: "PgJWTPlugin",
  description:
    "Converts a Postgres JWT object type into a GraphQL scalar type containing a signed JWT",
  version: version,

  before: ["PgCodecsPlugin", "PgTablesPlugin"],

  gather: gatherConfig({
    namespace: "pgJWT",
    initialCache() {
      return EMPTY_OBJECT;
    },
    initialState() {
      return EMPTY_OBJECT;
    },
    helpers: {},
    hooks: {
      pgCodecs_PgCodec(info, { pgCodec, pgType }) {
        const pgJwtTypeDigests = getPgJwtTypeDigests(info.options);
        if (
          pgJwtTypeDigests.some(
            ([nsp, typ]) =>
              typ === pgType.typname && nsp === pgType.getNamespace()!.nspname,
          )
        ) {
          // It's a JWT type!
          pgCodec.extensions ||= Object.create(null);
          pgCodec.extensions!.tags ||= Object.create(null);
          pgCodec.extensions!.tags!.behavior = ["-table", "jwt"];
        }
      },
    },
  }),

  schema: {
    hooks: {
      init(_, build) {
        const {
          options: { pgJwtSecret, pgJwtSignOptions },
        } = build;
        const jwtCodec = [...build.pgCodecMetaLookup.keys()].find((codec) =>
          build.behavior.pgCodecMatches(codec, "jwt"),
        );

        if (!jwtCodec || !pgJwtSecret) {
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
                      const $record = $in as GenericPgSelectSingleStep;
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
