import assert from "node:assert";

import { augmentIntrospectionData } from "./augmentIntrospection.ts";
import type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectionPolicy,
  IntrospectionRequest,
  IntrospectionRow,
  IntrospectOptions,
  Maybe,
  MultipassIntrospectOptions,
  PurposeList,
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
import {
  DESCRIBED_ENTITIES,
  UNIQUE_KEYS,
  NONZERO_COLUMNS,
} from "./introspectionConstants.ts";

type SQLVal = string | string[] | null;
type RunQuery = (text: string, values: Array<SQLVal>) => Promise<string>;

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
  const fields = UNIQUE_KEYS[entity];
  return JSON.stringify(fields.map((field) => columnValue(row, field)));
}

function rowOid<TEntity extends EntityType>(
  _entity: TEntity,
  row: IntrospectionRow<TEntity>,
): string | undefined {
  const catalogRow: IntrospectionRow = row;
  return "_id" in catalogRow
    ? catalogRow._id
    : "oid" in catalogRow
      ? catalogRow.oid
      : undefined;
}

function sqlColumnName(column: string): string {
  return column === "_id" ? "oid" : column;
}

function selectorKey(
  request: Pick<IntrospectionRequest, "entity" | "match">,
): string {
  return JSON.stringify([
    request.entity,
    Object.entries(request.match).sort(([a], [b]) => a.localeCompare(b)),
  ]);
}

/** Combine override predicates without losing earlier conditions. */
function addPredicate(
  predicatesByEntity: Partial<Record<EntityType, string>>,
  entity: EntityType,
  predicate: string,
): void {
  const previous = predicatesByEntity[entity];
  predicatesByEntity[entity] = previous
    ? `(${previous}) and (${predicate})`
    : predicate;
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
  addPredicate(overrides, "classes", namespace("relnamespace"));
  addPredicate(overrides, "procs", namespace("pronamespace"));
  addPredicate(overrides, "types", namespace("typnamespace"));
  if (ctes.has("classes")) {
    addPredicate(
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
      `exists (
        select 1
        from accessible_roles ar
        where pg_catalog.has_schema_privilege(ar.oid, ${schema}, 'USAGE')
        and (${privilege})
      )`;
    const tablePrivilege = `(
      case
        when relkind in ('r','p','v','m','f')
        then (
          pg_catalog.has_table_privilege(ar.oid, pg_class.oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
        or
          pg_catalog.has_any_column_privilege(ar.oid, pg_class.oid, 'SELECT,INSERT,UPDATE,REFERENCES')
        )
        when relkind = 'S'
        then pg_catalog.has_sequence_privilege(ar.oid, pg_class.oid, 'USAGE,SELECT,UPDATE')
        else false
      end
    )`;
    addPredicate(
      overrides,
      "classes",
      accessible("relnamespace", tablePrivilege),
    );
    addPredicate(
      overrides,
      "procs",
      accessible(
        "pronamespace",
        "pg_catalog.has_function_privilege(ar.oid, pg_proc.oid, 'EXECUTE')",
      ),
    );
    addPredicate(
      overrides,
      "types",
      accessible(
        "typnamespace",
        "pg_catalog.has_type_privilege(ar.oid, pg_type.oid, 'USAGE')",
      ),
    );
  }
  const filters = { ...options.filters };
  const entrypointFilters = multipass.entrypointFilters ?? {};
  for (const entity of Object.keys(entrypointFilters) as EntityType[]) {
    const predicate = entrypointFilters[entity];
    if (predicate == null) continue;
    addPredicate(filters, entity, predicate);
  }
  return {
    entrypointFilters,
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

function makeFetchQuery<TEntities extends EntityType>(
  context: MultipassContext<TEntities>,
  requests: readonly IntrospectionRequest[],
) {
  const groups = new Map<EntityType, IntrospectionRequest[]>();
  for (const request of requests) {
    const group = groups.get(request.entity);
    if (group) {
      group.push(request);
    } else {
      groups.set(request.entity, [request]);
    }
  }
  const sqlValues: Array<SQLVal> = [];
  const overrides: Partial<Record<EntityType, string>> = Object.create(null);
  // These catalog predicates are independent of the scope-defining CTEs in
  // ENTITY_TYPES and must also apply when an object is fetched by identity.
  const invariantFilters: Partial<Record<EntityType, string>> = {
    database: "datname = current_database()",
    attributes: "attnum > 0",
  };
  const effectiveFilters = { ...context.options.filters };
  for (const entity of groups.keys()) {
    const invariant = invariantFilters[entity];
    if (invariant == null) continue;
    addPredicate(effectiveFilters, entity, invariant);
  }
  for (const [entity, group] of groups) {
    const batches = new Map<string, SelectorBatch>();
    for (const request of group) {
      const columns = Object.keys(request.match).sort();
      const columnsKey = JSON.stringify(columns);
      const batch = batches.get(columnsKey);
      if (batch !== undefined) {
        batch.requests.push(request);
      } else {
        batches.set(columnsKey, { columns, requests: [request] });
      }
    }
    const expressions = [...batches.values()].map(({ columns, requests }) => {
      const params = columns.map((column) => {
        const placeholderNumber = sqlValues.push(
          requests.map((request) => String(columnValue(request.match, column))),
        );
        return `$${placeholderNumber}::text[]`;
      });
      const sqlColumns = columns.map(
        (column) => `${sqlColumnName(column)}::text`,
      );
      return `(${sqlColumns.join(", ")}) in (select * from unnest(${params.join(", ")}))`;
    });
    addPredicate(
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
      context.selected.has("triggers"),
    ),
    values: sqlValues,
  };
}

function isMultipassOptions<TEntities extends EntityType>(
  options: IntrospectOptions<TEntities>,
): options is MultipassIntrospectOptions<TEntities> {
  return !!options.multipass;
}

export async function introspectRaw<
  TEntities extends EntityType = DefaultEntities,
>(
  options: IntrospectOptions<TEntities>,
  runQuery: RunQuery,
): Promise<IntrospectionDataForEntities<TEntities>> {
  if (isMultipassOptions(options)) {
    const context = buildMultipassContext(options);
    return introspectRawMultipass(context, runQuery);
  } else {
    const json = await runQuery(makeIntrospectionQuery(options), []);
    const result: IntrospectionDataForEntities<TEntities> = JSON.parse(json);
    result.introspectionPasses = 1;
    return pruneIntrospectionData(options, result);
  }
}

/** Rows indexed by the values of a fixed set of selector columns. */
interface SelectorIndex {
  columns: string[];
  groups: Map<string, IntrospectionRow[]>;
}

/** Requests sharing the same selector columns for a batched query. */
interface SelectorBatch {
  columns: string[];
  requests: IntrospectionRequest[];
}

interface MultipassContext<TEntities extends EntityType> {
  /** Configuration shared by query construction and final result pruning. */
  options: MultipassIntrospectOptions<TEntities>;
  /** Limits discovery and policy execution to the requested entity types. */
  selected: Set<EntityType>;
  /** Policies grouped by entity so each row runs only applicable policies. */
  policiesByEntity: Map<EntityType, IntrospectionPolicy[]>;
  /** Lets policies translate catalogue OIDs into catalogue names. */
  catalogByOid: Record<string, string>;
  /** Rows indexed by entity and identity to deduplicate and reuse discoveries. */
  rowsByIdentity: Map<EntityType, Map<string, IntrospectionRow>>;
  /** Cached selector indexes avoid rescanning rows for each dependency request. */
  selectorIndexes: Map<EntityType, Map<string, SelectorIndex>>;
  /** Selectors with complete results, including empty results, need no refetch. */
  completedSelectors: Set<string>;
  /** Accumulated reasons for including each row, used to guide its policies. */
  purposes: Map<IntrospectionRow, Set<PgIntrospection.Purpose>>;
  /** Missing purposes that would trigger each policy to run again for a row. */
  policySubscriptions: Map<
    IntrospectionRow,
    Map<IntrospectionPolicy, Set<PgIntrospection.Purpose>>
  >;
  /** New rows or rows with added purposes awaiting policy execution. */
  frontier: Array<[EntityType, IntrospectionRow]>;
}

function buildMultipassContext<TEntities extends EntityType>(
  options: MultipassIntrospectOptions<TEntities>,
): MultipassContext<TEntities> {
  const {
    multipass: { policies = [] },
    onlyEntities = defaultEntities,
  } = options;

  const context: MultipassContext<TEntities> = {
    options,
    purposes: new Map(),
    policySubscriptions: new Map(),
    frontier: [],
    selected: new Set([...onlyEntities]),
    policiesByEntity: new Map(),
    rowsByIdentity: new Map(),
    completedSelectors: new Set(),
    catalogByOid: Object.create(null),
    selectorIndexes: new Map(),
  };

  const { selected, policiesByEntity } = context;
  const names = new Set<string>();
  for (const policy of policies) {
    if (names.has(policy.name)) {
      throw new Error(`Duplicate introspection policy name '${policy.name}'`);
    }
    names.add(policy.name);
    if (!policy.name?.trim()) {
      throw new Error(`Invalid introspection policy name '${policy.name}'`);
    }
    if (!selected.has(policy.entity)) continue;
    const list = policiesByEntity.get(policy.entity) ?? [];
    // The map groups policies by entity; dispatch supplies a row from that entity.
    list.push(policy as IntrospectionPolicy);
    policiesByEntity.set(policy.entity, list);
  }

  return context;
}

function initializeMultipassContext<TEntities extends EntityType>(
  context: MultipassContext<TEntities>,
  query: ReturnType<typeof entrypointQuery>,
  initialResult: IntrospectionDataForEntities<TEntities>,
) {
  const { entrypointFilters } = query;
  const { catalogByOid, selected, rowsByIdentity, completedSelectors } =
    context;
  Object.assign(catalogByOid, initialResult.catalog_by_oid);

  for (const entity of selected) {
    const collection = initialResult[entity];
    if (collection && !Array.isArray(collection)) {
      rowsByIdentity.set(
        entity,
        new Map([[identity(entity, collection), collection]]),
      );
      addPurposes(context, entity, collection, ["initial"]);
      continue;
    }
    if (!Array.isArray(collection)) continue;
    const index = new Map<string, IntrospectionRow>();
    rowsByIdentity.set(entity, index);
    for (const row of collection) {
      index.set(identity(entity, row), row);
      addPurposes(context, entity, row, ["initial"]);
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
    for (const row of initialResult.classes ?? []) {
      for (const [entity, column] of initialClassCollections) {
        if (selected.has(entity) && !entrypointFilters[entity]) {
          completedSelectors.add(
            selectorKey({ entity, match: { [column]: row._id } }),
          );
        }
      }
    }
  }
  if (selected.has("descriptions") && !entrypointFilters.descriptions) {
    const catalogOids = new Map(
      Object.entries(initialResult.catalog_by_oid).map(([oid, name]) => [
        name,
        oid,
      ]),
    );
    for (const entity of DESCRIBED_ENTITIES) {
      if (!selected.has(entity)) continue;
      const catalogId = catalogOids.get(ENTITY_TYPES[entity].tableName);
      if (!catalogId) continue;
      for (const row of initialResult[entity] ?? []) {
        const id = rowOid(entity, row);
        if (id != null) {
          completedSelectors.add(
            selectorKey({
              entity: "descriptions",
              match: { classoid: catalogId, objoid: id },
            }),
          );
        }
      }
    }
  }
}

function groupKey(columns: readonly string[], row: object) {
  return JSON.stringify(columns.map((column) => columnValue(row, column)));
}

function selectsUniqueRow(
  request: Pick<IntrospectionRequest, "entity" | "match">,
): boolean {
  return UNIQUE_KEYS[request.entity].every((column) =>
    Object.hasOwn(request.match, column),
  );
}

function addToGroup(index: SelectorIndex, row: IntrospectionRow): void {
  const key = groupKey(index.columns, row);
  const group = index.groups.get(key);
  if (group !== undefined) {
    group.push(row);
  } else {
    index.groups.set(key, [row]);
  }
}

function matchingRows(
  context: MultipassContext<EntityType>,
  request: Pick<IntrospectionRequest, "entity" | "match">,
): IntrospectionRow[] {
  const { rowsByIdentity, selectorIndexes } = context;
  const identityIndex = rowsByIdentity.get(request.entity);
  const columns = Object.keys(request.match).sort();
  if (selectsUniqueRow(request)) {
    const row = identityIndex?.get(
      groupKey(UNIQUE_KEYS[request.entity], request.match),
    );
    // The selector can include conditions beyond the unique key.
    return row && groupKey(columns, row) === groupKey(columns, request.match)
      ? [row]
      : [];
  }
  let indexes = selectorIndexes.get(request.entity);
  if (!indexes) {
    indexes = new Map();
    selectorIndexes.set(request.entity, indexes);
  }
  const columnsKey = JSON.stringify(columns);
  let index = indexes.get(columnsKey);
  if (!index) {
    index = { columns, groups: new Map() };
    for (const row of identityIndex?.values() ?? []) {
      addToGroup(index, row);
    }
    indexes.set(columnsKey, index);
  }
  return index.groups.get(groupKey(columns, request.match)) ?? [];
}

async function introspectRawMultipass<TEntities extends EntityType>(
  context: MultipassContext<TEntities>,
  runQuery: RunQuery,
): Promise<IntrospectionDataForEntities<TEntities>> {
  // Run the initial query, gather the metadata/etc
  const query = entrypointQuery(context.options);
  const json = await runQuery(query.text, query.values);
  /** The mutable result we merge all results into */
  const result: IntrospectionDataForEntities<TEntities> = JSON.parse(json);
  result.introspectionPasses = 1;

  // Apply our initial result to the context
  initializeMultipassContext(context, query, result);

  const { frontier, completedSelectors } = context;

  while (frontier.length > 0) {
    // Drains the frontier, calling select for applicable policies (using
    // policySubscriptions to determine which policies need to run again).
    const requests = pendingRequestsFromFrontier(context);
    assert.equal(frontier.length, 0);
    if (requests.length === 0) {
      break;
    }

    const fetch = makeFetchQuery(context, requests);
    const json = await runQuery(fetch.text, fetch.values);
    const fetched: {
      [TEntity in EntityType]?: IntrospectionData[TEntity] | null;
    } = JSON.parse(json);
    result.introspectionPasses++;

    mergeFetchedRows(context, result, fetched);
    for (const request of requests) {
      completedSelectors.add(selectorKey(request));
      for (const row of matchingRows(context, request)) {
        // Adds the purposes for which each fetched row was fetched, adding
        // impacted rows to the frontier ready for policy selection.
        addPurposes(context, request.entity, row, request.purposes);
      }
    }
  }

  return pruneIntrospectionData(context.options, result);
}

function mergeFetchedRows<TEntities extends EntityType>(
  context: MultipassContext<TEntities>,
  result: IntrospectionDataForEntities<TEntities>,
  fetched: { [TEntity in EntityType]?: IntrospectionData[TEntity] | null },
) {
  const { rowsByIdentity, selectorIndexes } = context;
  const fetchedEntities = Object.keys(fetched) as EntityType[];
  for (const entity of fetchedEntities) {
    let index = rowsByIdentity.get(entity);
    if (!index) {
      index = new Map();
      rowsByIdentity.set(entity, index);
    }
    const fetchedRows = coerceToRows(fetched[entity]);
    const collection: IntrospectionRow[] | undefined =
      entity === "database"
        ? undefined
        : (result[entity] ?? (result[entity] = []));
    for (const row of fetchedRows) {
      const id = identity(entity, row);
      if (!index.has(id)) {
        index.set(id, row);
        for (const selectorIndex of selectorIndexes.get(entity)?.values() ??
          []) {
          addToGroup(selectorIndex, row);
        }
        if (collection) {
          collection.push(row);
        } else if (entity === "database" && fetched.database != null) {
          result.database = fetched.database;
        }
      }
    }
  }
}

function coerceToRows<TEntity extends EntityType>(
  source: Maybe<IntrospectionRow<TEntity>[] | IntrospectionRow<TEntity>>,
): IntrospectionRow<TEntity>[] {
  return source == null ? [] : Array.isArray(source) ? source : [source];
}

function pendingRequestsFromFrontier<TEntity extends EntityType>(
  context: MultipassContext<TEntity>,
) {
  const pending = new Map<string, IntrospectionRequest>();
  const {
    frontier,
    purposes,
    policySubscriptions,
    policiesByEntity,
    catalogByOid,
  } = context;
  // Drain purpose propagation before querying, batching all reasons for a selector.
  while (frontier.length > 0) {
    const batch = frontier.splice(0);
    const snapshots = new Map(
      batch.map(([, row]) => [row, new Set(purposes.get(row))]),
    );
    for (const [entity, row] of batch) {
      let subscriptions = policySubscriptions.get(row);
      if (!subscriptions) {
        subscriptions = new Map();
        policySubscriptions.set(row, subscriptions);
      }
      const snapshot = snapshots.get(row)!;
      for (const policy of policiesByEntity.get(entity) ?? []) {
        const waiting = subscriptions.get(policy);
        if (waiting && waiting.isDisjointFrom(snapshot)) {
          continue;
        }
        const subscribeTo = new Set<PgIntrospection.Purpose>();
        policy.select(row, {
          catalogByOid,
          hasPurpose(purpose) {
            if (!snapshot.has(purpose)) {
              subscribeTo.add(purpose);
              return false;
            } else {
              return true;
            }
          },
          request(entity, match, purposes) {
            // The generic request API keeps these parameters correlated.
            const request = {
              entity,
              match,
              purposes,
            } as IntrospectionRequest;

            requestDependency(context, pending, policy, request);
          },
        });
        subscriptions.set(policy, subscribeTo);
      }
    }
  }
  return [...pending.values()];
}

function requestDependency<TEntity extends EntityType>(
  context: MultipassContext<TEntity>,
  pending: Map<string, IntrospectionRequest>,
  policy: IntrospectionPolicy,
  request: IntrospectionRequest,
) {
  const { selected, completedSelectors } = context;
  const { entity, purposes } = request;
  assertValidRequest(policy, request);

  if (!selected.has(entity)) {
    return;
  }
  if (canShortcutRequest(request)) {
    return;
  }
  const key = selectorKey(request);
  const matches = matchingRows(context, request);
  for (const match of matches) {
    addPurposes(context, entity, match, purposes);
  }
  if (completedSelectors.has(key)) {
    return;
  }
  if (matches.length > 0 && selectsUniqueRow(request)) {
    return;
  }
  const previous = pending.get(key);
  /** Definitely contains at least one element */
  const allPurposes = new Set([...(previous?.purposes ?? []), ...purposes]);
  const [first, ...rest] = allPurposes;
  const newPurposes: PurposeList = [first, ...rest];
  pending.set(key, { ...request, purposes: newPurposes });
}

function assertValidRequest(
  policy: IntrospectionPolicy,
  request: IntrospectionRequest,
) {
  assertEntityType(request.entity);
  if (!Array.isArray(request.purposes) || request.purposes.length === 0) {
    throw new Error(
      `Introspection policy '${policy.name}' requested '${request.entity}' without purposes`,
    );
  }
  const entries = Object.entries(request.match);
  if (
    !entries.length ||
    entries.some(
      ([field, value]) => !/^[a-z_][a-z0-9_]*$/.test(field) || value == null,
    )
  ) {
    throw new Error(
      `Invalid selector from introspection policy '${policy.name}' for '${request.entity}'`,
    );
  }
}

function canShortcutRequest({ entity, match }: IntrospectionRequest) {
  for (const [column, value] of Object.entries(match)) {
    if (value === 0 || value === "0") {
      if (sqlColumnName(column) === "oid") {
        return true;
      }
      const nonzeros = NONZERO_COLUMNS[entity] as readonly string[];
      if (nonzeros.includes(column)) {
        return true;
      }
    }
  }
  return false;
}

function addPurposes<TEntity extends EntityType>(
  { purposes, frontier }: MultipassContext<TEntity>,
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

export async function introspect<
  TEntities extends EntityType = DefaultEntities,
>(
  options: IntrospectOptions<TEntities>,
  runQuery: RunQuery,
): Promise<Introspection<TEntities>> {
  const result = await introspectRaw(options, runQuery);
  return augmentIntrospectionData<TEntities>(options, result);
}
