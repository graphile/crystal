import type {
  IntrospectionPruneDetails,
  PrunableIntrospectionData,
} from "./interfaces.ts";

/**
 * Hide extension-owned functions and relations, retaining their dependency data.
 * Standalone extension types are unaffected; relation row types follow relations.
 */
export function pruneExtensionResources(
  data: PrunableIntrospectionData,
  { hide }: IntrospectionPruneDetails,
) {
  const oidByCatalog = new Map(
    Object.entries(data.catalog_by_oid ?? {}).map(([oid, catalog]) => [
      catalog,
      oid,
    ]),
  );
  const extensionProcOids = new Set<string>();
  const extensionClassOids = new Set<string>();
  for (const dependency of data.depends ?? []) {
    if (
      dependency.refclassid === oidByCatalog.get("pg_extension") &&
      dependency.deptype === "e"
    ) {
      if (dependency.classid === oidByCatalog.get("pg_proc")) {
        extensionProcOids.add(dependency.objid);
      } else if (dependency.classid === oidByCatalog.get("pg_class")) {
        extensionClassOids.add(dependency.objid);
      }
    }
  }
  hide("procs", (row) => extensionProcOids.has(row._id));
  hide("classes", (row) => extensionClassOids.has(row._id));
  hide("attributes", (row) => extensionClassOids.has(row.attrelid));
  hide(
    "constraints",
    (row) =>
      extensionClassOids.has(row.conrelid) ||
      extensionClassOids.has(row.confrelid),
  );
  hide(
    "types",
    (row) => row.typrelid != null && extensionClassOids.has(row.typrelid),
  );
}
