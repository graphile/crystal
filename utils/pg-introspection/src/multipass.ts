import { augmentIntrospectionData } from "./augmentIntrospection.ts";
import type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectionPolicy,
  IntrospectionRequest,
  IntrospectOptions,
} from "./interfaces.ts";
import { ENTITY_TYPES, type EntityType } from "./introspection.ts";
import {
  buildIntrospectionQuery,
  defaultEntities,
  makeIntrospectionQuery,
} from "./query.ts";

type RunQuery = (text: string, values: any[]) => Promise<string>;
type Row = Record<string, any>;

/** Stable identities for catalogs which do not have an OID. */
const keys: Partial<Record<EntityType, string[]>> = {
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

// Catalogs whose objects can own descriptions and dependency records.
const describedEntities: EntityType[] = [
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
];

function identity(entity: EntityType, row: Row): string {
  const fields =
    keys[entity] ?? (ENTITY_TYPES[entity].oids ? ["_id"] : undefined);
  return JSON.stringify(fields ? fields.map((field) => row[field]) : row);
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
  const { schemas, multipass } = options;
  if (!multipass) throw new Error("Multipass options required");
  const values: any[] = [];
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
  if (schemas && ctes.has("namespaces")) {
    values.push(schemas);
    overrides.namespaces = `nspname = any($${values.length}::text[])`;
  }
  const namespace = (column: string) =>
    schemas
      ? `${column} in (select _id from namespaces)`
      : `${column} in (select _id from namespaces where nspname <> 'information_schema' and nspname not like 'pg\\_%')`;
  overrides.classes = namespace("relnamespace");
  overrides.procs = namespace("pronamespace");
  overrides.types = namespace("typnamespace");
  if (ctes.has("classes")) {
    overrides.constraints = "conrelid in (select _id from classes)";
  }
  let prefix = "";
  if (multipass.onlyAccessible) {
    values.push(multipass.onlyAccessible.role ?? null);
    const roleParam = `$${values.length}`;
    const membership = multipass.onlyAccessible.includeNoInherit
      ? ` or pg_catalog.pg_has_role(selected.role_oid, r.oid, 'MEMBER')`
      : "";
    prefix = `selected_role as (select pg_catalog.quote_ident(coalesce(${roleParam}::text, current_user))::regrole::oid as role_oid),\n  accessible_roles as (select r.oid from pg_catalog.pg_roles r, selected_role selected where r.oid = selected.role_oid${membership})`;
    const accessible = (schema: string, privilege: string) =>
      `exists (select 1 from accessible_roles ar where pg_catalog.has_schema_privilege(ar.oid, ${schema}, 'USAGE') and (${privilege}))`;
    const tablePrivilege = `case when relkind in ('r','p','v','m','f') then (pg_catalog.has_table_privilege(ar.oid, pg_class.oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') or pg_catalog.has_any_column_privilege(ar.oid, pg_class.oid, 'SELECT,INSERT,UPDATE,REFERENCES')) when relkind = 'S' then pg_catalog.has_sequence_privilege(ar.oid, pg_class.oid, 'USAGE,SELECT,UPDATE') else false end`;
    overrides.classes += ` and ${accessible("relnamespace", tablePrivilege)}`;
    overrides.procs += ` and ${accessible("pronamespace", "pg_catalog.has_function_privilege(ar.oid, pg_proc.oid, 'EXECUTE')")}`;
    overrides.types += ` and ${accessible("typnamespace", "pg_catalog.has_type_privilege(ar.oid, pg_type.oid, 'USAGE')")}`;
  }
  const filters = { ...multipass.filters };
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
  const values: any[] = [];
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
        values.push(requests.map((request) => String(request.match[column])));
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
    return JSON.parse(await runQuery(makeIntrospectionQuery(options), []));
  }
  const {
    policies = [],
    filters,
    entrypointFilters,
    prune,
  } = options.multipass;
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
    if (
      !Array.isArray(policy.purposes) ||
      policy.purposes.some((p) => typeof p !== "string" || !p.trim())
    ) {
      throw new Error(
        `Invalid purposes for introspection policy '${policy.name}'`,
      );
    }
    if (!selected.has(policy.entity)) continue;
    const list = rules.get(policy.entity) ?? [];
    list.push(policy);
    rules.set(policy.entity, list);
  }
  const query = entrypointQuery(options);
  const result: IntrospectionDataForEntities<TEntities> = JSON.parse(
    await runQuery(query.text, query.values),
  );
  const data = result as Record<string, any>;
  const rows = new Map<EntityType, Map<string, Row>>();
  const purposes = new WeakMap<Row, Set<PgIntrospection.Purpose>>();
  const expanded = new WeakMap<Row, Map<IntrospectionPolicy, string>>();
  const catalogByOid = Object.freeze({ ...result.catalog_by_oid });
  const requested = new Set<string>();

  const frontier: Array<[EntityType, Row]> = [];
  const addPurposes = (
    entity: EntityType,
    row: Row,
    additions: readonly PgIntrospection.Purpose[],
  ) => {
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
  };
  for (const entity of selected) {
    const collection = data[entity];
    if (ENTITY_TYPES[entity].singular && collection) {
      rows.set(entity, new Map([[identity(entity, collection), collection]]));
      addPurposes(entity, collection, ["initial"]);
      continue;
    }
    if (!Array.isArray(collection)) continue;
    const index = new Map<string, Row>();
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
        if (row._id != null) {
          requested.add(
            selectorKey({
              entity: "descriptions",
              match: { classoid: catalogId, objoid: row._id },
            }),
          );
        }
      }
    }
  }
  const groupMatches = new Map<string, { size: number; rows: Row[] }>();
  const matchingRows = (
    request: Pick<IntrospectionRequest, "entity" | "match">,
  ) => {
    const index = rows.get(request.entity);
    const entries = Object.entries(request.match);
    if (entries.length === 1 && entries[0][0] === "_id") {
      const row = index?.get(JSON.stringify([String(entries[0][1])]));
      return row ? [row] : [];
    }
    const key = selectorKey(request);
    const cached = groupMatches.get(key);
    if (cached && cached.size === (index?.size ?? 0)) {
      return cached.rows;
    }
    const matches = [...(index?.values() ?? [])].filter((row) =>
      entries.every(([field, value]) => String(row[field]) === String(value)),
    );
    groupMatches.set(key, { size: index?.size ?? 0, rows: matches });
    return matches;
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
          const declared = new Set(policy.purposes);
          const revision = JSON.stringify(
            [...declared].filter((p) => snapshot.has(p)),
          );
          if (revisions.get(policy) === revision) {
            continue;
          }
          const requests =
            policy.select(row, {
              catalogByOid,
              hasPurpose(purpose) {
                if (!declared.has(purpose)) {
                  throw new Error(
                    `Introspection policy '${policy.name}' on '${entity}' read undeclared purpose '${purpose}'`,
                  );
                }
                return snapshot.has(purpose);
              },
            }) ?? [];
          for (const request of requests) {
            if (
              !Array.isArray(request.purposes) ||
              request.purposes.length === 0
            ) {
              throw new Error(
                `Introspection policy '${policy.name}' requested '${request.entity}' without purposes`,
              );
            }
            for (const purpose of request.purposes) {
              if (!declared.has(purpose)) {
                throw new Error(
                  `Introspection policy '${policy.name}' requested '${request.entity}' with undeclared purpose '${purpose}'`,
                );
              }
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
          }
          revisions.set(policy, revision);
          for (const request of requests) {
            if (!selected.has(request.entity)) {
              continue;
            }
            const key = selectorKey(request);
            const matches = matchingRows(request);
            for (const match of matches) {
              addPurposes(request.entity, match, request.purposes);
            }
            if (
              requested.has(key) ||
              (Object.keys(request.match).length === 1 &&
                request.match._id != null &&
                matches.length)
            ) {
              continue;
            }
            const previous = pending.get(key);
            pending.set(key, {
              ...request,
              purposes: [
                ...new Set([
                  ...(previous?.purposes ?? []),
                  ...request.purposes,
                ]),
              ] as unknown as IntrospectionRequest["purposes"],
            });
          }
        }
      }
    }
    if (!pending.size) {
      continue;
    }
    const requests = [...pending.values()];
    pending.clear();
    const fetch = makeFetchQuery(requests, filters, selected);
    const fetched: Record<string, Row[] | Row | null> = JSON.parse(
      await runQuery(fetch.text, fetch.values),
    );
    for (const entity of Object.keys(fetched) as EntityType[]) {
      let index = rows.get(entity);
      if (!index) {
        index = new Map();
        rows.set(entity, index);
      }
      const collection: Row[] | undefined = ENTITY_TYPES[entity].singular
        ? undefined
        : (data[entity] ?? (data[entity] = []));
      const fetchedRows = fetched[entity];
      for (const row of Array.isArray(fetchedRows)
        ? fetchedRows
        : fetchedRows
          ? [fetchedRows]
          : []) {
        const id = identity(entity, row);
        if (!index.has(id)) {
          index.set(id, row);
          if (collection) {
            collection.push(row);
          } else {
            data[entity] = row;
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
  if (prune) {
    const countRows = () =>
      [...selected].reduce(
        (count, entity) =>
          count +
          (Array.isArray(data[entity])
            ? data[entity].length
            : ENTITY_TYPES[entity].singular && data[entity]
              ? 1
              : 0),
        0,
      );
    let before: number;
    let after = countRows();
    do {
      before = after;
      prune(result);
      after = countRows();
      if (after > before)
        throw new Error("Multipass pruning must not add entities");
    } while (after < before);
  }
  return result;
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
