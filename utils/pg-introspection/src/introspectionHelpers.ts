/* THIS FILE IS AUTO-GENERATED, DO NOT EDIT! */
/** Canonical logical catalog types supported by SQL and model generation. */
export const ALLOWED_TYPES: readonly string[] = [
  "text",
  "char",
  "int2",
  "int4",
  "int8",
  "float4",
  "float8",
  "oid",
  "bool",
  "xid",
  "aclitem",
  "bytea",
  "pg_node_tree",
  "timestamptz",
  "int2vector",
  "oidvector",
  "anyarray",
];

/** Deliberate output conversions and canonical spellings of SQL type aliases. */
export const TYPE_CASTS: Readonly<Record<string, string>> = Object.freeze({
  name: "text",
  regclass: "oid",
  regcollation: "oid",
  regconfig: "oid",
  regdictionary: "oid",
  regnamespace: "oid",
  regoper: "oid",
  regoperator: "oid",
  regproc: "oid",
  regprocedure: "oid",
  regrole: "oid",
  regtype: "oid",
  bigint: "int8",
  integer: "int4",
  boolean: "bool",
  "double precision": "float8",
  "timestamp with time zone": "timestamptz",
});

/** Wire encodings that must not erase the logical type seen by model callbacks. */
export const SQL_TYPE_CASTS: Readonly<Record<string, string>> = Object.freeze({
  int8: "text",
});

/** Normalize the logical type; SQL-only encodings are applied when rendering SQL. */
export function serializedType(type: string, context?: string): string {
  if (type.endsWith("[]")) {
    return `${serializedType(type.slice(0, -2), context)}[]`;
  }
  const target = Object.prototype.hasOwnProperty.call(TYPE_CASTS, type)
    ? TYPE_CASTS[type]
    : type;
  if (!ALLOWED_TYPES.includes(target)) {
    throw new Error(
      `Unsupported PostgreSQL catalog type '${type}'${
        context ? ` for ${context}` : ""
      }. ` +
        "Add an explicit policy to ALLOWED_TYPES or TYPE_CASTS in the catalog introspection helpers.",
    );
  }
  return target;
}

export type CatalogAttributes = Readonly<Record<string, string>>;

export interface CatalogProjection {
  select: string;
  fallback: string;
}

const identifier = (name: string) => `"${name.replace(/"/g, '""')}"`;

function sqlType(type: string): string {
  if (type.endsWith("[]")) return `${sqlType(type.slice(0, -2))}[]`;
  return `pg_catalog.${identifier(SQL_TYPE_CASTS[type] || type)}`;
}

/** Keep inner references unqualified so real columns shadow the enclosing nulls. */
export function catalogProjection(
  attributes: CatalogAttributes,
  oids = false,
): CatalogProjection {
  const fields = Object.entries(attributes).map(([name, type]) => [
    identifier(name),
    sqlType(serializedType(type, `attribute '${name}'`)),
  ]);
  return {
    select: fields
      .filter(([name]) => !oids || name !== identifier("oid"))
      .map(([name, type]) => `${name}::${type} as ${name}`)
      .join(",\n        "),
    fallback: fields
      .map(([name, type]) => `null::${type} as ${name}`)
      .join(",\n      "),
  };
}

/** Only the entity selection is needed by the shared predicates. */
export interface SharedIntrospectionOptions {
  onlyEntities?: readonly string[];
}

export function catalogObjectIsRelevant(
  options: SharedIntrospectionOptions,
  catalogOidColumn: string,
  objectOidColumn: string,
  objectSubIdColumn: string,
) {
  const { onlyEntities } = options;
  const has = (alias: string): boolean => {
    return onlyEntities ? onlyEntities.includes(alias) : true;
  };

  const filters = [
    has("namespaces") &&
      `${catalogOidColumn} = 'pg_catalog.pg_namespace'::regclass and ${oidFilter(
        objectOidColumn,
        "namespaces",
      )}`,
    has("classes") &&
      `${catalogOidColumn} = 'pg_catalog.pg_class'::regclass and ${oidFilter(
        objectOidColumn,
        "classes",
      )}`,
    has("classes") &&
      `${catalogOidColumn} = 'pg_catalog.pg_attribute'::regclass and ${oidFilter(
        objectOidColumn,
        "classes",
      )}` + (objectSubIdColumn ? ` and ${objectSubIdColumn} > 0` : ""),
    has("constraints") &&
      `${catalogOidColumn} = 'pg_catalog.pg_constraint'::regclass and ${oidFilter(
        objectOidColumn,
        "constraints",
      )}`,
    has("sys_procs") &&
      `${catalogOidColumn} = 'pg_catalog.pg_proc'::regclass and ${oidFilter(
        objectOidColumn,
        "sys_procs",
      )}`,
    has("procs") &&
      `${catalogOidColumn} = 'pg_catalog.pg_proc'::regclass and ${oidFilter(
        objectOidColumn,
        "procs",
      )}`,
    has("types") &&
      `${catalogOidColumn} = 'pg_catalog.pg_type'::regclass and ${oidFilter(
        objectOidColumn,
        "types",
      )}`,
    has("enums") &&
      `${catalogOidColumn} = 'pg_catalog.pg_enum'::regclass and ${oidFilter(
        objectOidColumn,
        "enums",
      )}`,
    // This catalog uses its native oid, without the legacy _id alias.
    has("event_triggers") &&
      `${catalogOidColumn} = 'pg_catalog.pg_event_trigger'::regclass and ${objectOidColumn} in (select event_triggers.oid from event_triggers)`,
    has("extensions") &&
      `${catalogOidColumn} = 'pg_catalog.pg_extension'::regclass and ${oidFilter(
        objectOidColumn,
        "extensions",
      )}`,
    has("foreign_data_wrappers") &&
      `${catalogOidColumn} = 'pg_catalog.pg_foreign_data_wrapper'::regclass and ${oidFilter(
        objectOidColumn,
        "foreign_data_wrappers",
      )}`,
    has("foreign_servers") &&
      `${catalogOidColumn} = 'pg_catalog.pg_foreign_server'::regclass and ${oidFilter(
        objectOidColumn,
        "foreign_servers",
      )}`,
    has("rewrites") &&
      `${catalogOidColumn} = 'pg_catalog.pg_rewrite'::regclass and ${oidFilter(
        objectOidColumn,
        "rewrites",
      )}`,
    has("triggers") &&
      `${catalogOidColumn} = 'pg_catalog.pg_trigger'::regclass and ${oidFilter(
        objectOidColumn,
        "triggers",
      )}`,
  ].filter(Boolean);
  if (filters.length === 0) return "false";
  return "(\n      (" + filters.join(")\n      or (") + ")\n    )";
}

export function oidFilter(
  col: string,
  collection: string,
  additionalWhere?: string,
) {
  return `${col} in (select ${collection}._id from ${collection}${
    additionalWhere ? ` where ${additionalWhere}` : ""
  })`;
}

export function dependencyWhere(options: SharedIntrospectionOptions): string {
  return `deptype IN ('a', 'e') and ${catalogObjectIsRelevant(
    options,
    "classid",
    "objid",
    "objsubid",
  )}`;
}

export function descriptionWhere(options: SharedIntrospectionOptions): string {
  return catalogObjectIsRelevant(options, "classoid", "objoid", "objsubid");
}
