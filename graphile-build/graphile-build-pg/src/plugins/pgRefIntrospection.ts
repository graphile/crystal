import type { IntrospectionPolicy } from "pg-introspection";

import {
  parseDatabaseIdentifier,
  parseDatabaseIdentifiers,
  parseSmartTagsOptsString,
} from "../utils.ts";

function splitRefHop(part: string) {
  const trimmed = part.trim();
  const matches = trimmed.match(/^\(([^)]+)\)->([^)]+)(?:\(([^)]+)\))?$/);
  return {
    table: matches?.[2] ?? trimmed,
    localColumns: matches?.[1],
    remoteColumns: matches?.[3],
  };
}

export function parseRefHop(part: string) {
  const { table, localColumns, remoteColumns } = splitRefHop(part);
  return {
    table,
    localColumns:
      localColumns === undefined
        ? null
        : parseDatabaseIdentifiers(localColumns, 1).map(([name]) => name),
    remoteColumns:
      remoteColumns === undefined
        ? null
        : parseDatabaseIdentifiers(remoteColumns, 1).map(([name]) => name),
  };
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
    for (const tag of [tags.ref, tags.refVia].flat()) {
      if (typeof tag !== "string") continue;
      let tables: [string, string][];
      try {
        const { via } = parseSmartTagsOptsString<"via">(tag, 1).params;
        if (!via) continue;
        tables = via.split(";").map((part) => {
          const { table } = splitRefHop(part);
          return parseDatabaseIdentifier(table, 2, namespace.nspname);
        });
      } catch {
        // Gathering diagnoses malformed paths.
        continue;
      }
      if (!tables.every(([schema]) => schemas.includes(schema))) continue;

      let previousId: string | undefined = row._id;
      for (const name of tables) {
        const table = details.peekByName("classes", name, ["_refPath"]);
        if (table) {
          details.request("classes", { _id: table._id }, ["registryRelation"]);
          // A ref can follow a foreign key in either direction.
          if (previousId !== undefined) {
            details.request(
              "constraints",
              { contype: "f", conrelid: previousId, confrelid: table._id },
              ["registryRelation"],
            );
            details.request(
              "constraints",
              { contype: "f", conrelid: table._id, confrelid: previousId },
              ["registryRelation"],
            );
          }
        }
        previousId = table?._id;
      }
    }
  },
});
