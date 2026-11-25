import { arraysMatch } from "grafast";
import type {
  IntrospectionPolicy,
  IntrospectionPolicyDetails,
  IntrospectionRow,
} from "pg-introspection";

import {
  parseDatabaseIdentifier,
  parseDatabaseIdentifiers,
  parseSmartTagsOptsString,
} from "../utils.ts";
import {
  parseForeignKeyTarget,
  primaryKeyAttnums,
} from "./PgFakeConstraintsPlugin.ts";

export function parseRefHop(part: string) {
  const trimmed = part.trim();
  const matches = trimmed.match(/^\(([^)]+)\)->([^)]+)(?:\(([^)]+)\))?$/);
  if (matches === null) {
    return { table: trimmed, localColumns: null, remoteColumns: null };
  }
  const [, localColumns, table, remoteColumns] = matches;
  return {
    table,
    localColumns: parseDatabaseIdentifiers(localColumns, 1).map(
      ([name]) => name,
    ),
    remoteColumns:
      remoteColumns === undefined
        ? null
        : parseDatabaseIdentifiers(remoteColumns, 1).map(([name]) => name),
  };
}

type RefClass = IntrospectionRow<"classes">;
type RefConstraint = IntrospectionRow<"constraints">;

function refEndpoint(
  details: IntrospectionPolicyDetails,
  table: RefClass,
  schema: string,
  columns: readonly string[] | null,
) {
  // Table-only hops need no attribute lookup.
  const attributes =
    columns === null
      ? undefined
      : details.peek("attributes", { attrelid: table._id }, ["_refPath"]);
  const numbers = columns?.map(
    (name) => attributes?.find((attr) => attr.attname === name)?.attnum,
  );
  return { table, schema, columns, numbers };
}
type RefEndpoint = ReturnType<typeof refEndpoint>;

function matchingForeignKeys(
  details: IntrospectionPolicyDetails,
  from: RefEndpoint,
  to: RefEndpoint,
) {
  const keys = details.peek(
    "constraints",
    { contype: "f", conrelid: from.table._id, confrelid: to.table._id },
    ["_refPath"],
  );
  return (
    keys?.filter(
      (key) =>
        key.conkey != null &&
        key.confkey != null &&
        (from.numbers === undefined || arraysMatch(from.numbers, key.conkey)) &&
        (to.numbers === undefined || arraysMatch(to.numbers, key.confkey)),
    ) ?? []
  );
}

function hasMatchingForeignKeyTag(
  details: IntrospectionPolicyDetails,
  from: RefEndpoint,
  to: RefEndpoint,
) {
  const tag = details.getTagsAndDescription("classes", from.table)?.tags
    .foreignKey;
  for (const spec of Array.isArray(tag) ? tag : [tag]) {
    const foreignKey = parseForeignKeyTarget(spec, from.schema);
    if (
      foreignKey == null ||
      foreignKey.foreignSchema !== to.schema ||
      foreignKey.foreignTable !== to.table.relname ||
      (from.columns !== null &&
        !arraysMatch(foreignKey.attributes, from.columns))
    ) {
      continue;
    }
    const referencedColumns = foreignKey.foreignAttributes;
    if (referencedColumns !== null) {
      if (
        referencedColumns.length === foreignKey.attributes.length &&
        (to.columns === null || arraysMatch(referencedColumns, to.columns))
      ) {
        return true;
      }
    } else {
      const keys = details.peek(
        "constraints",
        { conrelid: to.table._id, contype: "p" },
        ["_refPath"],
      );
      const attnums = primaryKeyAttnums(details, to.table, keys);
      if (
        attnums?.length === foreignKey.attributes.length &&
        (to.numbers === undefined || arraysMatch(attnums, to.numbers))
      ) {
        return true;
      }
    }
  }
  return false;
}

function followRefPath(
  details: IntrospectionPolicyDetails,
  source: RefClass,
  schemaName: string,
  via: string,
  schemas: readonly string[],
  fakeConstraints: boolean,
) {
  const targets: RefClass[] = [];
  const constraints: RefConstraint[] = [];
  let complete = true;
  let current: RefClass | undefined = source;
  let currentSchema = schemaName;
  for (const part of via.split(";")) {
    let hop: ReturnType<typeof parseRefHop>;
    let identifier: [string, string];
    try {
      hop = parseRefHop(part);
      identifier = parseDatabaseIdentifier(hop.table, 2, schemaName);
    } catch (e) {
      // Only report a malformed hop if its prefix actually matches.
      if (!complete) return;
      throw e;
    }
    const [targetSchema, targetTable] = identifier;
    if (!schemas.includes(targetSchema)) {
      return;
    }
    const target = details.peekByName(
      "classes",
      [targetSchema, targetTable],
      ["_refPath"],
    );
    if (target === null) {
      return;
    }
    const local =
      current && refEndpoint(details, current, currentSchema, hop.localColumns);
    const remote =
      target && refEndpoint(details, target, targetSchema, hop.remoteColumns);
    current = target;
    currentSchema = targetSchema;
    if (local === undefined || remote === undefined) {
      complete = false;
      continue;
    }
    const forwards = matchingForeignKeys(details, local, remote);
    const backwards = matchingForeignKeys(details, remote, local);
    const matches =
      forwards.length > 0 ||
      backwards.length > 0 ||
      (fakeConstraints &&
        (hasMatchingForeignKeyTag(details, local, remote) ||
          hasMatchingForeignKeyTag(details, remote, local)));
    if (
      !matches ||
      local.numbers?.includes(undefined) ||
      remote.numbers?.includes(undefined)
    ) {
      complete = false;
      continue;
    }
    targets.push(remote.table);
    constraints.push(...forwards, ...backwards);
  }

  // Only a complete path needs resources and relations in the registry.
  if (!complete) return;
  for (const target of targets) {
    details.request("classes", { _id: target._id }, ["registryRelation"]);
  }
  for (const key of constraints) {
    details.request("constraints", { _id: key._id }, ["registryRelation"]);
  }
}

export const refPathDependencies = (
  schemas: readonly string[],
  fakeConstraints: boolean,
): IntrospectionPolicy<"classes"> => ({
  name: "refPathDependencies",
  entity: "classes",
  select(row, details) {
    if (
      !details.hasPurpose("initial") &&
      !details.hasPurpose("registryCodec") &&
      !details.hasPurpose("registryRelation") &&
      !details.hasPurpose("enumTables")
    ) {
      return;
    }
    const tags = details.getTagsAndDescription("classes", row)?.tags;
    const namespace = details.peek("namespaces", { _id: row.relnamespace }, [
      "_refPath",
    ])?.[0];
    if (
      tags?.ref == null ||
      namespace === undefined ||
      !schemas.includes(namespace.nspname)
    ) {
      return;
    }
    const refs = (Array.isArray(tags.ref) ? tags.ref : [tags.ref]).map((tag) =>
      parseSmartTagsOptsString<"via">(tag, 1),
    );
    const vias = refs.map((ref) => ref.params.via);
    const refVia = tags.refVia;
    for (const tag of Array.isArray(refVia) ? refVia : [refVia]) {
      if (typeof tag !== "string") {
        continue;
      }
      const { args, params } = parseSmartTagsOptsString<"via">(tag, 1);
      if (refs.some((ref) => ref.args[0] === args[0])) {
        vias.push(params.via);
      }
    }
    for (const via of vias) {
      if (via) {
        followRefPath(
          details,
          row,
          namespace.nspname,
          via,
          schemas,
          fakeConstraints,
        );
      }
    }
  },
});
