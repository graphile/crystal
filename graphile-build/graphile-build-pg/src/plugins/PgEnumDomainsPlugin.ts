import type { PgCodec, PgCodecAnyScalar } from "@dataplan/pg";
import type {} from "graphile-config";

import { version } from "../version.ts";

const ENUM_DOMAIN_SUFFIX = "_enum_domain";

export const PgEnumDomainsPlugin: GraphileConfig.Plugin = {
  name: "PgEnumDomainsPlugin",
  description:
    "Adds support for `[table_name]_enum_domain` domain types, where `table_name` is an enum table (using `@enum` smart tag). This allows table-based enums to be used as input and output for database functions.",
  version: version,

  schema: {
    hooks: {
      init: {
        before: ["PgCodecsPlugin"],
        callback(_, build) {
          const {
            pgCodecs,
            dataplanPg: { TYPES },
          } = build;

          // For performance, we're pre-calculating so we can match quickly
          const enumByFullIdentifier = Object.create(null) as Record<
            string,
            PgCodecAnyScalar
          >;
          for (const codec of Object.values(pgCodecs)) {
            if (!codec.extensions?.enumTableEnumDetails) continue;
            const {
              serviceName,
              schemaName,
              tableName,
              constraintName,
              constraintType,
            } = codec.extensions.enumTableEnumDetails;

            // Primary key always wins
            if (constraintType === "p") {
              enumByFullIdentifier[
                `${tableName}|${schemaName}|${serviceName}`
              ] = codec as PgCodecAnyScalar;
            }
            // Secondary constraints are added as available
            const key = `${tableName}_${constraintName}|${schemaName}|${serviceName}`;
            if (!enumByFullIdentifier[key]) {
              enumByFullIdentifier[key] = codec as PgCodecAnyScalar;
            }
          }

          // Now use the underlying enum GraphQL type for each of the suitable domains
          for (const codec of Object.values(pgCodecs)) {
            // We only care about `create domain ... as text;`
            if (codec.domainOfCodec !== TYPES.text) continue;

            const fullIdentifier = getFullIdentifier(codec);
            if (!fullIdentifier) continue;

            const enumCodec = enumByFullIdentifier[fullIdentifier];
            if (!enumCodec) continue;

            // Use the enum type for this domain
            const typeName = build.inflection.scalarCodecTypeName(enumCodec);
            build.setGraphQLTypeForPgCodec(
              codec,
              ["input", "output"],
              typeName,
            );
          }
          return _;
        },
      },
    },
  },
};

/**
 * There's two ways of marking a domain as an enum table domain:
 * 1. use the `@enum` smart tag (passing the identifier as the value)
 * 2. name it `{identifier}_enum_domain`
 *
 * Once we've extracted the identifier from this, there's further two forms:
 * - identifier identifies a table name exactly (impliying primary key)
 * - identifier identifies a `{tableName}_{constraintName}` combo
 */
function getFullIdentifier(codec: PgCodec) {
  if (!codec.extensions?.pg) return null;
  const { schemaName, serviceName, name: domainName } = codec.extensions.pg;
  const enumTagValue = codec.extensions?.tags?.enum;
  if (enumTagValue) {
    if (typeof enumTagValue !== "string") return null;
    return `${enumTagValue}|${schemaName}|${serviceName}`;
  }
  if (!domainName.endsWith(ENUM_DOMAIN_SUFFIX)) return null;
  const keepCount = domainName.length - ENUM_DOMAIN_SUFFIX.length;
  const identifier = domainName.substring(0, keepCount);
  return `${identifier}|${schemaName}|${serviceName}`;
}
