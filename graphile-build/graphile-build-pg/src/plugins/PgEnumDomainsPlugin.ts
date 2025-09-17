import type { PgCodec } from "@dataplan/pg";
import type {} from "graphile-config";

import { version } from "../version.js";

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
          for (const codec of Object.values(pgCodecs)) {
            if (codec.domainOfCodec !== TYPES.text) continue;
            // There's two types of enum domains - either name ends with
            // `_enum_domain` or it uses the `@enum` smart tag to identify the
            // table
            const enumDetails = getEnumDetails(codec);
            if (!enumDetails) continue;
            const { serviceName, schemaName, tableName, match } = enumDetails;

            // Find the table
            const tableEnumCodec = Object.values(pgCodecs).find(
              (c) =>
                c.extensions?.enumTableEnumDetails?.serviceName ===
                  serviceName &&
                c.extensions.enumTableEnumDetails.schemaName === schemaName &&
                (tableName
                  ? c.extensions.enumTableEnumDetails.tableName === tableName &&
                    c.extensions.enumTableEnumDetails.constraintType === "p"
                  : (c.extensions.enumTableEnumDetails.tableName === match &&
                      c.extensions.enumTableEnumDetails.constraintType ===
                        "p") ||
                    match ===
                      `${c.extensions.enumTableEnumDetails.tableName}_${c.extensions.enumTableEnumDetails.constraintName}`),
            );
            // Use the enum type for this domain
            if (tableEnumCodec) {
              const typeName = build.inflection.scalarCodecTypeName(
                tableEnumCodec as any,
              );
              build.setGraphQLTypeForPgCodec(
                codec,
                ["input", "output"],
                typeName,
              );
            }
          }
          return _;
        },
      },
    },
  },
};

function getEnumDetails(codec: PgCodec) {
  if (!codec.extensions?.pg) return null;
  const { schemaName, serviceName, name: domainName } = codec.extensions.pg;
  const enumTagValue = codec.extensions?.tags?.enum;
  if (enumTagValue) {
    if (typeof enumTagValue !== "string") return null;
    return { serviceName, schemaName, match: enumTagValue };
  }
  if (!domainName.endsWith(ENUM_DOMAIN_SUFFIX)) return null;
  const keepCount = domainName.length - ENUM_DOMAIN_SUFFIX.length;
  const tableName = domainName.substring(0, keepCount);
  return { serviceName, schemaName, tableName };
}
