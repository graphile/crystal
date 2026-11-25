import type { PgCodec, PgCodecAnyScalar } from "@dataplan/pg";
import type {} from "graphile-config";
import type {
  IntrospectionPolicy,
  IntrospectionPolicyDetails,
  IntrospectionRow,
} from "pg-introspection";

import { version } from "../version.ts";
import { isEnumTag } from "./PgEnumTablesPlugin.ts";
import { isSmartEnumKey } from "./PgFakeConstraintsPlugin.ts";

const ENUM_DOMAIN_SUFFIX = "_enum_domain";

function hasEnumDomainKey(
  details: IntrospectionPolicyDetails,
  table: IntrospectionRow<"classes">,
  constraintName: string | undefined,
  fakeConstraints: boolean,
) {
  const tags = details.getTagsAndDescription("classes", table)?.tags;
  const enumTable = isEnumTag(tags?.enum);
  const keys = details.peek(
    "constraints",
    constraintName === undefined
      ? { conrelid: table._id, contype: "p" }
      : { conrelid: table._id, conname: constraintName },
    ["_enumDomain"],
  );
  // A smart primary key also registers the enum under the bare table name.
  return (
    keys?.some(
      (key) =>
        (key.contype === "p" || key.contype === "u") &&
        key.conkey?.length === 1 &&
        ((key.contype === "p" && enumTable) ||
          isEnumTag(
            details.getTagsAndDescription("constraints", key)?.tags.enum,
          )),
    ) ||
    (constraintName === undefined &&
      fakeConstraints &&
      isSmartEnumKey(tags?.primaryKey, undefined, enumTable))
  );
}

function enumDomainTables(
  fakeConstraints: boolean,
): IntrospectionPolicy<"types"> {
  return {
    name: "enumDomainTables",
    entity: "types",
    select(row, details) {
      if (
        row.typtype !== "d" ||
        row.typbasetype == null ||
        !details.hasPurpose("registryCodec")
      ) {
        return;
      }
      const tagsAndDescription = details.getTagsAndDescription("types", row);
      // Name-matched smart tags also need the domain's namespace to be known.
      const namespaces = details.peek("namespaces", { _id: row.typnamespace }, [
        "_enumDomain",
      ]);
      const identifier = enumDomainIdentifier(
        row.typname,
        tagsAndDescription?.tags.enum,
      );
      if (!identifier) {
        return;
      }
      const text = details.peekByName(
        "types",
        ["pg_catalog", "text"],
        ["_enumDomain"],
      );
      if (text !== undefined && row.typbasetype !== text?._id) {
        return;
      }
      // The suffix can guide peeks while the base type and smart tags load.
      // Only retain a match once a smart tag has had a chance to override it.
      const confirmed =
        tagsAndDescription !== undefined &&
        namespaces !== undefined &&
        text !== undefined;

      // The identifier is either the primary-key enum's table name or
      // <table>_<constraint>. Either part can itself contain underscores.
      const checkCandidate = (tableName: string, constraintName?: string) => {
        const table = details.peek(
          "classes",
          { relnamespace: row.typnamespace, relname: tableName },
          ["_enumDomain"],
        )?.[0];
        if (
          table &&
          confirmed &&
          hasEnumDomainKey(details, table, constraintName, fakeConstraints)
        ) {
          details.request("classes", { _id: table._id }, ["enumTables"]);
        }
      };
      checkCandidate(identifier);
      for (
        let split = identifier.indexOf("_", 1);
        split !== -1 && split < identifier.length - 1;
        split = identifier.indexOf("_", split + 1)
      ) {
        checkCandidate(identifier.slice(0, split), identifier.slice(split + 1));
      }
    },
  };
}

export const PgEnumDomainsPlugin: GraphileConfig.Plugin = {
  name: "PgEnumDomainsPlugin",
  description:
    "Adds support for `[table_name]_enum_domain` domain types, where `table_name` is an enum table (using `@enum` smart tag). This allows table-based enums to be used as input and output for database functions.",
  version: version,

  gather: {
    hooks: {
      pgIntrospection_options(info, { options }) {
        const { multipass } = options;
        if (multipass && info.helpers.pgEnumTables !== undefined) {
          multipass.policies.push(
            enumDomainTables(info.helpers.pgFakeConstraints !== undefined),
          );
        }
      },
    },
  },

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
  const identifier = enumDomainIdentifier(
    domainName,
    codec.extensions.tags?.enum,
  );
  return identifier ? `${identifier}|${schemaName}|${serviceName}` : null;
}

function enumDomainIdentifier(domainName: string, enumTagValue: unknown) {
  if (enumTagValue) {
    return typeof enumTagValue === "string" ? enumTagValue : null;
  }
  if (!domainName.endsWith(ENUM_DOMAIN_SUFFIX)) return null;
  return domainName.slice(0, -ENUM_DOMAIN_SUFFIX.length);
}
