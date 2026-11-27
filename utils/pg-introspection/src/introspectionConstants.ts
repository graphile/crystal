import type { IntrospectionRow } from "./interfaces.ts";
import type { EntityType } from "./introspection.ts";

/** Stable identity columns for collections. */
export const UNIQUE_KEYS = {
  attributes: ["attrelid", "attnum"],
  indexes: ["indexrelid"],
  inherits: ["inhrelid", "inhparent", "inhseqno"],
  ranges: ["rngtypid"],
  auth_members: ["roleid", "member", "grantor"],
  depends: [
    "classid",
    "objid",
    "objsubid",
    "refclassid",
    "refobjid",
    "refobjsubid",
    "deptype",
  ],
  descriptions: ["classoid", "objoid", "objsubid"],
  policies: ["polrelid", "polname"],
  foreign_tables: ["ftrelid"],
  aggregates: ["aggfnoid"],
  stat_user_tables: ["relid"],
  settings: ["name"],
  event_triggers: ["oid"],
  db_role_settings: ["setdatabase", "setrole"],
  constraints: ["_id"],
  am: ["_id"],
  attribute_defaults: ["_id"],
  classes: ["_id"],
  database: ["_id"],
  default_acls: ["_id"],
  enums: ["_id"],
  extensions: ["_id"],
  foreign_data_wrappers: ["_id"],
  foreign_servers: ["_id"],
  languages: ["_id"],
  namespaces: ["_id"],
  procs: ["_id"],
  rewrites: ["_id"],
  roles: ["_id"],
  sys_procs: ["_id"],
  triggers: ["_id"],
  types: ["_id"],
} as const satisfies {
  [TEntity in EntityType]: readonly Extract<
    keyof IntrospectionRow<TEntity>,
    string
  >[];
};

/**
 * These columns always identify an existing catalogue object. Other OID columns
 * can use zero as a meaningful sentinel (e.g. constraints.contypid and
 * db_role_settings.setrole), so must not be skipped indiscriminately.
 */
export const NONZERO_COLUMNS = {
  attributes: ["attrelid"],
  indexes: ["indexrelid", "indrelid"],
  inherits: ["inhrelid", "inhparent"],
  ranges: ["rngtypid", "rngsubtype"],
  auth_members: ["roleid", "member", "grantor"],
  depends: ["classid", "objid", "refclassid", "refobjid"],
  descriptions: ["classoid", "objoid"],
  policies: ["polrelid"],
  foreign_tables: ["ftrelid", "ftserver"],
  aggregates: ["aggfnoid"],
  stat_user_tables: ["relid"],
  enums: ["enumtypid"],
  namespaces: [],
  classes: [],
  constraints: [],
  procs: [],
  am: [],
  attribute_defaults: [],
  database: [],
  db_role_settings: [],
  default_acls: [],
  event_triggers: [],
  extensions: [],
  foreign_data_wrappers: [],
  foreign_servers: [],
  languages: [],
  rewrites: [],
  roles: [],
  settings: [],
  sys_procs: [],
  triggers: [],
  types: [],
} as const satisfies Record<EntityType, readonly string[]>;

/**
 * Collections whose descriptions are fetched with their initial rows.
 */
export const DESCRIBED_ENTITIES = [
  "namespaces",
  "classes",
  "constraints",
  "procs",
  "sys_procs",
  "types",
  "enums",
  "extensions",
  "foreign_data_wrappers",
  "foreign_servers",
  "rewrites",
  "triggers",
  "event_triggers",
] as const satisfies EntityType[];
