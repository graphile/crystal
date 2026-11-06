import { augmentIntrospectionData } from "./augmentIntrospection.ts";
import type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectionPolicy,
  IntrospectionRequest,
  IntrospectionRow,
  IntrospectOptions,
} from "./interfaces.ts";
import {
  ENTITY_TYPES,
  type EntityType,
  type IntrospectionData,
} from "./introspection.ts";
import { pruneIntrospectionData } from "./pruneIntrospectionData.ts";
import {
  assertEntityType,
  buildIntrospectionQuery,
  defaultEntities,
  makeIntrospectionQuery,
} from "./query.ts";

type RunQuery = (
  text: string,
  values: Array<string | string[] | null>,
) => Promise<string>;

/** Stable identity columns for collections without the legacy _id alias. */
const keys: {
  [TEntity in EntityType]?: readonly Extract<
    keyof IntrospectionRow<TEntity>,
    string
  >[];
} = {
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
};

/**
 * These columns always identify an existing catalogue object. Other OID columns
 * can use zero as a meaningful sentinel (e.g. constraints.contypid and
 * db_role_settings.setrole), so must not be skipped indiscriminately.
 */
const nonzeroColumns: Partial<Record<EntityType, readonly string[]>> = {
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
};

// Collections whose descriptions are fetched with their initial rows.
const describedEntities = [
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

/** Preserve known column types; dynamically selected columns yield unknown. */
function columnValue<TRow extends object, TColumn extends string>(
  row: TRow,
  column: TColumn,
): TColumn extends keyof TRow ? TRow[TColumn] : unknown {
  return (
    Object.hasOwn(row, column)
      ? (row as Record<string, unknown>)[column]
      : undefined
  ) as TColumn extends keyof TRow ? TRow[TColumn] : unknown;
}

function identity<TEntity extends EntityType>(
  entity: TEntity,
  row: IntrospectionRow<TEntity>,
): string {
  const fields = keys[entity] ?? ["_id"];
  return JSON.stringify(fields.map((field) => columnValue(row, field)));
}

function selectorKey(
  request: Pick<IntrospectionRequest, "entity" | "match">,
): string {
  return JSON.stringify([
    request.entity,
    Object.entries(request.match)
      .map(([column, value]) => [column, String(value)])
      .sort(([a], [b]) => a.localeCompare(b)),
  ]);
}

/** Combine override predicates without losing earlier conditions. */
function addOverride(
  overrides: Partial<Record<EntityType, string>>,
  entity: EntityType,
  predicate: string,
) {
  const previous = overrides[entity];
  overrides[entity] = previous ? `(${previous}) and (${predicate})` : predicate;
}

function entrypointQuery<TEntities extends EntityType>(
  options: IntrospectOptions<TEntities>,
) {
  const { multipass } = options;
  if (!multipass) throw new Error("Multipass options required");
  const values: Array<string | string[] | null> = [];
  const overrides: Partial<Record<EntityType, string>> = {};
  const output = new Set<EntityType>(options.onlyEntities ?? defaultEntities);
  const ctes = new Set(output);
  // Permission-filtered constraints must belong to an accessible class.
  const implicitRequirements: Partial<Record<EntityType, EntityType[]>> = {
    ...(multipass.onlyAccessible ? { constraints: ["classes"] } : {}),
  };
  const addRequirements = (entity: EntityType) => {
    assertEntityType(entity);
    for (const required of [
      ...(ENTITY_TYPES[entity].requires ?? []),
      ...(implicitRequirements[entity] ?? []),
    ]) {
      if (!ctes.has(required)) {
        ctes.add(required);
        addRequirements(required);
      }
    }
  };
  for (const entity of output) addRequirements(entity);
  const namespace = (column: string) =>
    `${column} in (select _id from namespaces where nspname <> 'information_schema' and nspname not like 'pg\\_%')`;
  addOverride(overrides, "classes", namespace("relnamespace"));
  addOverride(overrides, "procs", namespace("pronamespace"));
  addOverride(overrides, "types", namespace("typnamespace"));
  if (ctes.has("classes")) {
    addOverride(
      overrides,
      "constraints",
      "conrelid in (select _id from classes)",
    );
  }
  let prefix = "";
  if (multipass.onlyAccessible) {
    values.push(multipass.onlyAccessible.role ?? null);
    const roleParam = `$${values.length}::text`;
    // A superuser already passes the privilege checks without expanding roles.
    prefix = `selected_role as (select pg_catalog.quote_ident(coalesce(${roleParam}, current_user))::regrole::oid as role_oid),
  accessible_roles as (${
    multipass.onlyAccessible.includeNoInherit
      ? `with recursive
    selected as (
      select r.oid, r.rolsuper from pg_catalog.pg_roles r
      where r.oid = (select role_oid from selected_role)
    ),
    database_owner_membership as (
      select d.datdba as member, r.oid as roleid
      from pg_catalog.pg_database d, pg_catalog.pg_roles r
      where d.datname = current_database() and r.rolname = 'pg_database_owner'
    ),
    memberships(oid) as (
      select oid from selected where not rolsuper
      union
      select parent.roleid
      from memberships child
      cross join lateral (
        select roleid from pg_catalog.pg_auth_members where member = child.oid
        union
        select roleid from database_owner_membership where member = child.oid
      ) parent
    )
    select oid from selected where rolsuper
    union
    select oid from memberships`
      : `select role_oid as oid from selected_role`
  })`;
    const accessible = (schema: string, privilege: string) =>
      `exists (select 1 from accessible_roles ar where pg_catalog.has_schema_privilege(ar.oid, ${schema}, 'USAGE') and (${privilege}))`;
    const tablePrivilege = `case when relkind in ('r','p','v','m','f') then (pg_catalog.has_table_privilege(ar.oid, pg_class.oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') or pg_catalog.has_any_column_privilege(ar.oid, pg_class.oid, 'SELECT,INSERT,UPDATE,REFERENCES')) when relkind = 'S' then pg_catalog.has_sequence_privilege(ar.oid, pg_class.oid, 'USAGE,SELECT,UPDATE') else false end`;
    addOverride(
      overrides,
      "classes",
      accessible("relnamespace", tablePrivilege),
    );
    addOverride(
      overrides,
      "procs",
      accessible(
        "pronamespace",
        "pg_catalog.has_function_privilege(ar.oid, pg_proc.oid, 'EXECUTE')",
      ),
    );
    addOverride(
      overrides,
      "types",
      accessible(
        "typnamespace",
        "pg_catalog.has_type_privilege(ar.oid, pg_type.oid, 'USAGE')",
      ),
    );
  }
  const filters = { ...options.filters };
  for (const entity of Object.keys(
    multipass.entrypointFilters ?? {},
  ) as EntityType[]) {
    const predicate = multipass.entrypointFilters![entity];
    filters[entity] = filters[entity]
      ? `(${filters[entity]}) and (${predicate})`
      : predicate;
  }
  return {
    text: buildIntrospectionQuery(
      { onlyEntities: [...ctes] },
      overrides,
      filters,
      prefix,
      true,
      true,
      output,
    ),
    values,
  };
}

function makeFetchQuery(
  requests: readonly IntrospectionRequest[],
  filters: Partial<Record<EntityType, string>> | undefined,
  selected: ReadonlySet<EntityType>,
) {
  const groups = new Map<EntityType, IntrospectionRequest[]>();
  for (const request of requests) {
    const group = groups.get(request.entity) ?? [];
    group.push(request);
    groups.set(request.entity, group);
  }
  const values: Array<string | string[] | null> = [];
  const overrides: Partial<Record<EntityType, string>> = {};
  // These catalog predicates are independent of the scope-defining CTEs in
  // ENTITY_TYPES and must also apply when an object is fetched by identity.
  const invariantFilters: Partial<Record<EntityType, string>> = {
    database: "datname = current_database()",
    attributes: "attnum > 0",
  };
  const effectiveFilters = { ...filters };
  for (const entity of groups.keys()) {
    const invariant = invariantFilters[entity];
    if (invariant) {
      const filter = effectiveFilters[entity];
      effectiveFilters[entity] = filter
        ? `(${invariant}) and (${filter})`
        : invariant;
    }
  }
  for (const [entity, group] of groups) {
    const shapes = new Map<
      string,
      { columns: string[]; requests: IntrospectionRequest[] }
    >();
    for (const request of group) {
      const columns = Object.keys(request.match).sort();
      const shapeKey = JSON.stringify(columns);
      const shape = shapes.get(shapeKey) ?? { columns, requests: [] };
      shape.requests.push(request);
      shapes.set(shapeKey, shape);
    }
    const expressions = [...shapes.values()].map(({ columns, requests }) => {
      const params = columns.map((column) => {
        values.push(
          requests.map((request) => String(columnValue(request.match, column))),
        );
        return `$${values.length}::text[]`;
      });
      if (columns.length === 1) {
        const column =
          columns[0] === "_id"
            ? `${ENTITY_TYPES[entity].tableName}.oid`
            : columns[0];
        return `${column}::text = any(${params[0]})`;
      }
      const names = columns.map((_, index) => `v${index}`);
      const comparisons = columns.map((column, index) => {
        const sqlColumn =
          column === "_id" ? `${ENTITY_TYPES[entity].tableName}.oid` : column;
        return `${sqlColumn}::text = selector.${names[index]}`;
      });
      return `exists (select 1 from unnest(${params.join(", ")}) as selector(${names.join(", ")}) where ${comparisons.join(" and ")})`;
    });
    addOverride(
      overrides,
      entity,
      expressions.map((expression) => `(${expression})`).join(" or "),
    );
  }
  return {
    text: buildIntrospectionQuery(
      { onlyEntities: [...groups.keys()] },
      overrides,
      effectiveFilters,
      "",
      false,
      false,
      undefined,
      selected.has("triggers"),
    ),
    values,
  };
}

export async function introspectRaw<
  TEntities extends EntityType = DefaultEntities,
>(
  options: IntrospectOptions<TEntities>,
  runQuery: RunQuery,
): Promise<IntrospectionDataForEntities<TEntities>> {
  if (!options.multipass) {
    const result: IntrospectionDataForEntities<TEntities> = JSON.parse(
      await runQuery(makeIntrospectionQuery(options), []),
    );
    result.introspectionPasses = 1;
    return pruneIntrospectionData(options, result);
  }
  const { policies = [] } = options.multipass;
  const entrypointFilters = { ...options.multipass.entrypointFilters };
  const { filters } = options;
  const selected = new Set<EntityType>(options.onlyEntities ?? defaultEntities);
  const rules = new Map<EntityType, IntrospectionPolicy[]>();
  const names = new Set<string>();
  for (const policy of policies) {
    if (!policy.name?.trim() || names.has(policy.name)) {
      throw new Error(
        `Invalid or duplicate introspection policy name '${policy.name}'`,
      );
    }
    names.add(policy.name);
    if (!selected.has(policy.entity)) continue;
    const list = rules.get(policy.entity) ?? [];
    // The map groups policies by entity; dispatch supplies a row from that entity.
    list.push(policy as IntrospectionPolicy);
    rules.set(policy.entity, list);
  }
  const query = entrypointQuery(options);
  const result: IntrospectionDataForEntities<TEntities> = JSON.parse(
    await runQuery(query.text, query.values),
  );
  result.introspectionPasses = 1;
  const rows = new Map<EntityType, Map<string, IntrospectionRow>>();
  const purposes = new WeakMap<
    IntrospectionRow,
    Set<PgIntrospection.Purpose>
  >();
  const expanded = new WeakMap<
    IntrospectionRow,
    Map<IntrospectionPolicy, Set<PgIntrospection.Purpose>>
  >();
  const catalogByOid: Record<string, string> = Object.create(null);
  Object.assign(catalogByOid, result.catalog_by_oid);
  Object.freeze(catalogByOid);
  const requested = new Set<string>();

  const frontier: Array<[EntityType, IntrospectionRow]> = [];
  function addPurposes<TEntity extends EntityType>(
    entity: TEntity,
    row: IntrospectionRow<TEntity>,
    additions: readonly PgIntrospection.Purpose[],
  ) {
    let current = purposes.get(row);
    const fresh = !current;
    if (!current) {
      current = new Set();
      purposes.set(row, current);
    }
    const before = current.size;
    for (const purpose of additions) {
      current.add(purpose);
    }
    if (fresh || current.size !== before) {
      frontier.push([entity, row]);
    }
  }
  for (const entity of selected) {
    const collection = result[entity];
    if (collection && !Array.isArray(collection)) {
      rows.set(entity, new Map([[identity(entity, collection), collection]]));
      addPurposes(entity, collection, ["initial"]);
      continue;
    }
    if (!Array.isArray(collection)) continue;
    const index = new Map<string, IntrospectionRow>();
    rows.set(entity, index);
    for (const row of collection) {
      index.set(identity(entity, row), row);
      addPurposes(entity, row, ["initial"]);
    }
  }
  // The initial CTEs already fetched these complete collections for each root
  // class. Do not query them again merely because a policy follows that edge.
  // An entrypoint filter makes only that collection incomplete for dependency
  // requests, which do not apply entrypoint filters.
  const initialClassCollections: Array<[EntityType, string]> = [
    ["attributes", "attrelid"],
    ["constraints", "conrelid"],
    ["indexes", "indrelid"],
    ["inherits", "inhrelid"],
    ["policies", "polrelid"],
  ];
  if (selected.has("classes")) {
    for (const row of result.classes ?? []) {
      for (const [entity, column] of initialClassCollections) {
        if (selected.has(entity) && !entrypointFilters[entity]) {
          requested.add(selectorKey({ entity, match: { [column]: row._id } }));
        }
      }
    }
  }
  if (selected.has("descriptions") && !entrypointFilters.descriptions) {
    const catalogOids = new Map(
      Object.entries(result.catalog_by_oid).map(([oid, name]) => [name, oid]),
    );
    for (const entity of describedEntities) {
      if (!selected.has(entity)) continue;
      const catalogId = catalogOids.get(ENTITY_TYPES[entity].tableName);
      if (!catalogId) continue;
      for (const row of result[entity] ?? []) {
        const id = "_id" in row ? row._id : "oid" in row ? row.oid : undefined;
        if (id != null) {
          requested.add(
            selectorKey({
              entity: "descriptions",
              match: { classoid: catalogId, objoid: id },
            }),
          );
        }
      }
    }
  }
  // Build each selector shape once, sharing the scan across all selector values.
  const groupIndexes = new Map<
    EntityType,
    Map<string, { columns: string[]; groups: Map<string, IntrospectionRow[]> }>
  >();
  const groupKey = (columns: string[], row: object) =>
    JSON.stringify(columns.map((column) => String(columnValue(row, column))));
  const addToGroup = (
    shape: { columns: string[]; groups: Map<string, IntrospectionRow[]> },
    row: IntrospectionRow,
  ) => {
    const key = groupKey(shape.columns, row);
    const group = shape.groups.get(key);
    if (group) {
      group.push(row);
    } else {
      shape.groups.set(key, [row]);
    }
  };
  const matchingRows = (
    request: Pick<IntrospectionRequest, "entity" | "match">,
  ) => {
    const index = rows.get(request.entity);
    const columns = Object.keys(request.match).sort();
    if (columns.length === 1 && columns[0] === "_id") {
      const row = index?.get(
        JSON.stringify([String(columnValue(request.match, "_id"))]),
      );
      return row ? [row] : [];
    }
    let shapes = groupIndexes.get(request.entity);
    if (!shapes) {
      shapes = new Map();
      groupIndexes.set(request.entity, shapes);
    }
    const shapeKey = JSON.stringify(columns);
    let shape = shapes.get(shapeKey);
    if (!shape) {
      shape = { columns, groups: new Map() };
      for (const row of index?.values() ?? []) {
        addToGroup(shape, row);
      }
      shapes.set(shapeKey, shape);
    }
    return shape.groups.get(groupKey(columns, request.match)) ?? [];
  };
  const pending = new Map<string, IntrospectionRequest>();
  while (frontier.length) {
    // Drain purpose propagation before querying, batching all reasons for a selector.
    while (frontier.length) {
      const batch = frontier.splice(0);
      const snapshots = new Map(
        batch.map(([, row]) => [row, new Set(purposes.get(row))]),
      );
      for (const [entity, row] of batch) {
        let revisions = expanded.get(row);
        if (!revisions) {
          revisions = new Map();
          expanded.set(row, revisions);
        }
        const snapshot = snapshots.get(row)!;
        for (const policy of rules.get(entity) ?? []) {
          const waiting = revisions.get(policy);
          if (waiting && ![...waiting].some((p) => snapshot.has(p))) {
            continue;
          }
          const missing = new Set<PgIntrospection.Purpose>();
          policy.select(row, {
            catalogByOid,
            hasPurpose(purpose) {
              if (!snapshot.has(purpose)) {
                missing.add(purpose);
              }
              return snapshot.has(purpose);
            },
            request(entity, match, purposes) {
              assertEntityType(entity);
              // The generic request API keeps these parameters correlated.
              const request = {
                entity,
                match,
                purposes,
              } as IntrospectionRequest;
              if (
                !Array.isArray(request.purposes) ||
                request.purposes.length === 0
              ) {
                throw new Error(
                  `Introspection policy '${policy.name}' requested '${request.entity}' without purposes`,
                );
              }
              const entries = Object.entries(request.match);
              if (
                !entries.length ||
                entries.some(
                  ([field, value]) =>
                    !/^[a-z_][a-z0-9_]*$/.test(field) || value == null,
                )
              ) {
                throw new Error(
                  `Invalid selector from introspection policy '${policy.name}' for '${request.entity}'`,
                );
              }
              if (
                entries.some(
                  ([column, value]) =>
                    (value === 0 || value === "0") &&
                    ((column === "_id" && ENTITY_TYPES[entity].oids) ||
                      nonzeroColumns[entity]?.includes(column)),
                )
              ) {
                return;
              }
              if (!selected.has(request.entity)) {
                return;
              }
              const key = selectorKey(request);
              const matches = matchingRows(request);
              for (const match of matches) {
                addPurposes(request.entity, match, request.purposes);
              }
              if (
                requested.has(key) ||
                (entries.length === 1 &&
                  entries[0][0] === "_id" &&
                  matches.length)
              ) {
                return;
              }
              const previous = pending.get(key);
              const [first, ...rest] = previous?.purposes ?? request.purposes;
              const remaining = new Set([...rest, ...request.purposes]);
              remaining.delete(first);
              pending.set(key, {
                ...request,
                purposes: [first, ...remaining],
              });
            },
          });
          revisions.set(policy, missing);
        }
      }
    }
    if (!pending.size) {
      break;
    }
    const requests = [...pending.values()];
    pending.clear();
    const fetch = makeFetchQuery(requests, filters, selected);
    const fetched: {
      [TEntity in EntityType]?: IntrospectionData[TEntity] | null;
    } = JSON.parse(await runQuery(fetch.text, fetch.values));
    result.introspectionPasses++;
    for (const entity of Object.keys(fetched) as EntityType[]) {
      let index = rows.get(entity);
      if (!index) {
        index = new Map();
        rows.set(entity, index);
      }
      const fetchedCollection = fetched[entity];
      const fetchedRows: IntrospectionRow[] = Array.isArray(fetchedCollection)
        ? fetchedCollection
        : fetchedCollection
          ? [fetchedCollection]
          : [];
      const collection: IntrospectionRow[] | undefined =
        entity === "database"
          ? undefined
          : (result[entity] ?? (result[entity] = []));
      for (const row of fetchedRows) {
        const id = identity(entity, row);
        if (!index.has(id)) {
          index.set(id, row);
          for (const shape of groupIndexes.get(entity)?.values() ?? []) {
            addToGroup(shape, row);
          }
          if (collection) {
            collection.push(row);
          } else if (entity === "database" && fetched.database) {
            result.database = fetched.database;
          }
        }
      }
    }
    for (const request of requests) {
      requested.add(selectorKey(request));
      for (const row of matchingRows(request)) {
        addPurposes(request.entity, row, request.purposes);
      }
    }
  }
  return pruneIntrospectionData(options, result);
}

export async function introspect<
  TEntities extends EntityType = DefaultEntities,
>(
  options: IntrospectOptions<TEntities>,
  runQuery: RunQuery,
): Promise<Introspection<TEntities>> {
  const result = await introspectRaw(options, runQuery);
  return augmentIntrospectionData<TEntities>(options, result);
}
