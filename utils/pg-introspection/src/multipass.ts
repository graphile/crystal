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
  buildIntrospectionQuery,
  defaultEntities,
  makeIntrospectionQuery,
} from "./query.ts";

type RunQuery = (
  text: string,
  values: Array<string | string[] | null>,
) => Promise<string>;

/** Stable identities for catalogs which do not have an OID. */
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

// Catalogs whose objects can own descriptions and dependency records.
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

/** Read a dynamically selected catalogue column without weakening the row type. */
function columnValue(row: object, column: string): unknown {
  return (row as Record<string, unknown>)[column];
}

function identity<TEntity extends EntityType>(
  entity: TEntity,
  row: IntrospectionRow<TEntity>,
): string {
  const fields =
    keys[entity] ??
    (ENTITY_TYPES[entity].oids
      ? ["_id"]
      : "oid" in row && row.oid
        ? ["oid"]
        : undefined);
  return JSON.stringify(
    fields ? fields.map((field) => columnValue(row, field)) : row,
  );
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

function entrypointQuery<TEntities extends EntityType>(
  options: IntrospectOptions<TEntities>,
) {
  const { multipass } = options;
  if (!multipass) throw new Error("Multipass options required");
  const values: Array<string | string[] | null> = [];
  const overrides: Record<string, string> = {};
  const output = new Set<EntityType>(options.onlyEntities ?? defaultEntities);
  const ctes = new Set(output);
  // Permission-filtered constraints must belong to an accessible class.
  const implicitRequirements: Partial<Record<EntityType, EntityType[]>> = {
    ...(multipass.onlyAccessible ? { constraints: ["classes"] } : {}),
  };
  const addRequirements = (entity: EntityType) => {
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
  if (!describedEntities.some((entity) => output.has(entity))) {
    overrides.depends = "false";
    overrides.descriptions = "false";
  }
  const namespace = (column: string) =>
    `${column} in (select _id from namespaces where nspname <> 'information_schema' and nspname not like 'pg\\_%')`;
  overrides.classes = namespace("relnamespace");
  overrides.procs = namespace("pronamespace");
  overrides.types = namespace("typnamespace");
  if (ctes.has("classes")) {
    overrides.constraints = "conrelid in (select _id from classes)";
  }
  let prefix = "";
  if (multipass.onlyAccessible) {
    values.push(multipass.onlyAccessible.role ?? null);
    const roleParam = `$${values.length}::text`;
    const membership = multipass.onlyAccessible.includeNoInherit
      ? ` or pg_catalog.pg_has_role(selected.role_oid, r.oid, 'MEMBER')`
      : "";
    prefix = `selected_role as (select pg_catalog.quote_ident(coalesce(${roleParam}, current_user))::regrole::oid as role_oid),\n  accessible_roles as (select r.oid from pg_catalog.pg_roles r, selected_role selected where r.oid = selected.role_oid${membership})`;
    const accessible = (schema: string, privilege: string) =>
      `exists (select 1 from accessible_roles ar where pg_catalog.has_schema_privilege(ar.oid, ${schema}, 'USAGE') and (${privilege}))`;
    const tablePrivilege = `case when relkind in ('r','p','v','m','f') then (pg_catalog.has_table_privilege(ar.oid, pg_class.oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') or pg_catalog.has_any_column_privilege(ar.oid, pg_class.oid, 'SELECT,INSERT,UPDATE,REFERENCES')) when relkind = 'S' then pg_catalog.has_sequence_privilege(ar.oid, pg_class.oid, 'USAGE,SELECT,UPDATE') else false end`;
    overrides.classes += ` and ${accessible("relnamespace", tablePrivilege)}`;
    overrides.procs += ` and ${accessible("pronamespace", "pg_catalog.has_function_privilege(ar.oid, pg_proc.oid, 'EXECUTE')")}`;
    overrides.types += ` and ${accessible("typnamespace", "pg_catalog.has_type_privilege(ar.oid, pg_type.oid, 'USAGE')")}`;
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
  const overrides: Record<string, string> = {};
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
      effectiveFilters[entity] = filters?.[entity]
        ? `(${invariant}) and (${filters[entity]})`
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
      if (!columns.length) throw new Error(`Empty selector for '${entity}'`);
      const shapeKey = JSON.stringify(columns);
      const shape = shapes.get(shapeKey) ?? { columns, requests: [] };
      shape.requests.push(request);
      shapes.set(shapeKey, shape);
    }
    const expressions = [...shapes.values()].map(({ columns, requests }) => {
      const params = columns.map((column) => {
        if (!/^[a-z_][a-z0-9_]*$/.test(column))
          throw new Error(`Invalid catalog column '${column}'`);
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
    overrides[entity] = expressions
      .map((expression) => `(${expression})`)
      .join(" or ");
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
  const { policies = [], entrypointFilters } = options.multipass;
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
  const data = result;
  const rows = new Map<EntityType, Map<string, IntrospectionRow>>();
  const purposes = new WeakMap<
    IntrospectionRow,
    Set<PgIntrospection.Purpose>
  >();
  const expanded = new WeakMap<
    IntrospectionRow,
    Map<IntrospectionPolicy, Set<PgIntrospection.Purpose>>
  >();
  const catalogByOid = Object.freeze({ ...result.catalog_by_oid });
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
    const collection = data[entity];
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
    for (const row of data.classes ?? []) {
      for (const [entity, column] of initialClassCollections) {
        if (selected.has(entity) && !entrypointFilters?.[entity]) {
          requested.add(selectorKey({ entity, match: { [column]: row._id } }));
        }
      }
    }
  }
  if (selected.has("descriptions") && !entrypointFilters?.descriptions) {
    const catalogOids = new Map(
      Object.entries(result.catalog_by_oid).map(([oid, name]) => [name, oid]),
    );
    for (const entity of describedEntities) {
      if (!selected.has(entity)) continue;
      const catalogId = catalogOids.get(ENTITY_TYPES[entity].tableName);
      if (!catalogId) continue;
      for (const row of data[entity] ?? []) {
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
  while (frontier.length || pending.size) {
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
                (Object.keys(request.match).length === 1 &&
                  "_id" in request.match &&
                  request.match._id != null &&
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
      continue;
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
          : (data[entity] ?? (data[entity] = []));
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
            data.database = fetched.database;
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
