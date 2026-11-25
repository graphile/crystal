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
  return { table, numbers };
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

function followRefPath(
  details: IntrospectionPolicyDetails,
  source: RefClass,
  schemaName: string,
  via: string,
  schemas: readonly string[],
) {
  const targets: RefClass[] = [];
  const constraints: RefConstraint[] = [];
  let current = source;
  for (const part of via.split(";")) {
    const { table, localColumns, remoteColumns } = parseRefHop(part);
    const [targetSchema, targetTable] = parseDatabaseIdentifier(
      table,
      2,
      schemaName,
    );
    if (!schemas.includes(targetSchema)) {
      return;
    }
    const target = details.peekByName(
      "classes",
      [targetSchema, targetTable],
      ["_refPath"],
    );
    if (target == null) {
      return;
    }
    const local = refEndpoint(details, current, localColumns);
    const remote = refEndpoint(details, target, remoteColumns);
    const forwards = matchingForeignKeys(details, local, remote);
    const backwards = matchingForeignKeys(details, remote, local);
    if (
      local.numbers?.includes(undefined) ||
      remote.numbers?.includes(undefined)
    ) {
      return;
    }
    if (forwards.length === 0 && backwards.length === 0) {
      return;
    }
    targets.push(target);
    constraints.push(...forwards, ...backwards);
    current = target;
  }

  // Only a complete path needs resources and relations in the registry.
  for (const target of targets) {
    details.request("classes", { _id: target._id }, ["registryRelation"]);
  }
  for (const key of constraints) {
    details.request("constraints", { _id: key._id }, ["registryRelation"]);
  }
}

export const refPathDependencies = (
  schemas: readonly string[],
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
    if (tags?.ref == null) {
      return;
    }
    const namespace = details.peek("namespaces", { _id: row.relnamespace }, [
      "_refPath",
    ])?.[0];
    if (namespace === undefined || !schemas.includes(namespace.nspname)) {
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
        followRefPath(details, row, namespace.nspname, via, schemas);
      }
    }
  },
});
