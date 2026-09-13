// Asks one database what its views' columns are made of.
//
// Four catalog reads and one `EXPLAIN` per view. Nothing is executed: `EXPLAIN`
// without `ANALYZE` builds a plan and throws it away, and `COSTS OFF` keeps the
// answer free of the estimates that would make it depend on table statistics.

import { deriveViewConstraints } from "./derive.js";
import type {
  CatalogForeignKey,
  CatalogRelation,
  TypeCoercions,
  ViewColumn,
  ViewDerivation,
} from "./derive.js";
import { readPlanOrigins } from "./plan-origins.js";
import type { ExplainPlanNode, ViewShape } from "./plan-origins.js";

/** The one thing this module needs of a connection: run SQL, get rows. */
export type RunQuery = <Row>(
  text: string,
  values?: unknown[],
) => Promise<readonly Row[]>;

/** One view of the schemas asked about, with the columns `EXPLAIN` is asked for. */
export interface ViewRow {
  schema: string;
  view: string;
  relkind: "v" | "m";
  definition: string | null;
  columns: { name: string; type_id: number; type_mod: number }[];
}

interface ForeignKeyRow {
  schema: string;
  relation: string;
  constraint_name: string;
  columns: string[];
  foreign_schema: string;
  foreign_relation: string;
  foreign_columns: string[];
}

interface UniqueKeyRow {
  schema: string;
  relation: string;
  index_name: string;
  is_primary: boolean;
  columns: string[];
}

interface ColumnRow {
  schema: string;
  relation: string;
  column_name: string;
  type_id: number;
  type_mod: number;
  not_null: boolean;
}

// A plain view (`relkind = 'v'`) is planned through its own name: the rewriter puts
// the defining query in place of the reference and the plan carries the base
// relations. A materialized view (`relkind = 'm'`) is a physical relation — its plan
// is a scan of the stored copy and says nothing about where the copy came from — so
// its defining query is planned instead, and the plan of that query is the plan of
// its select list, in its own column order.
//
// Columns are not filtered by privilege, only plain views are: a partial select list
// is not the view's select list, and asking for one costs the answer anyway —
// PostgreSQL stops flattening the view into the outer query and prints `Subquery Scan
// on <view>`, whose `Output` names the view's own columns and no base relation at
// all. So the whole list is asked for, and a view none of whose columns this role may
// read is skipped as none of this surface's business.
//
// A materialized view is never skipped that way, because the two privileges point in
// opposite directions: the role that may read the stored copy is usually exactly the
// one that may not read what it was copied from, and it is the defining query that
// carries the answer. `pg_get_viewdef` is a catalog function and hands the text over
// without asking for any privilege on the sources, so the text is read here on the
// surface's own connection; only the `EXPLAIN` of it needs a role that may read them,
// and that is the one thing this reader takes a second connection for.
const VIEW_QUERY = `
  SELECT namespace.nspname AS schema,
         class.relname     AS view,
         class.relkind     AS relkind,
         CASE WHEN class.relkind = 'm' THEN pg_get_viewdef(class.oid, true) END AS definition,
         (SELECT json_agg(json_build_object(
                            'name', attribute.attname::text,
                            'type_id', attribute.atttypid::int,
                            'type_mod', attribute.atttypmod)
                          ORDER BY attribute.attnum)
          FROM pg_attribute attribute
          WHERE attribute.attrelid = class.oid
            AND attribute.attnum > 0
            AND NOT attribute.attisdropped) AS columns
  FROM pg_class class
           JOIN pg_namespace namespace ON namespace.oid = class.relnamespace
  WHERE class.relkind IN ('v', 'm')
    AND namespace.nspname = ANY ($1)
    AND (class.relkind = 'm'
         OR EXISTS (SELECT 1
                    FROM pg_attribute attribute
                    WHERE attribute.attrelid = class.oid
                      AND attribute.attnum > 0
                      AND NOT attribute.attisdropped
                      AND has_column_privilege(class.oid, attribute.attnum, 'SELECT')))
  ORDER BY 1, 2`;

// `convalidated` is required: a NOT VALID constraint promises nothing about the rows
// already in the table, so it cannot authorise a relation over them.
const FOREIGN_KEY_QUERY = `
  SELECT namespace.nspname         AS schema,
         class.relname             AS relation,
         constraint_.conname       AS constraint_name,
         (SELECT array_agg(attribute.attname::text ORDER BY key.ord)
          FROM unnest(constraint_.conkey) WITH ORDINALITY AS key(attnum, ord)
                   JOIN pg_attribute attribute
                        ON attribute.attrelid = constraint_.conrelid
                            AND attribute.attnum = key.attnum) AS columns,
         foreign_namespace.nspname AS foreign_schema,
         foreign_class.relname     AS foreign_relation,
         (SELECT array_agg(attribute.attname::text ORDER BY key.ord)
          FROM unnest(constraint_.confkey) WITH ORDINALITY AS key(attnum, ord)
                   JOIN pg_attribute attribute
                        ON attribute.attrelid = constraint_.confrelid
                            AND attribute.attnum = key.attnum) AS foreign_columns
  FROM pg_constraint constraint_
           JOIN pg_class class ON class.oid = constraint_.conrelid
           JOIN pg_namespace namespace ON namespace.oid = class.relnamespace
           JOIN pg_class foreign_class ON foreign_class.oid = constraint_.confrelid
           JOIN pg_namespace foreign_namespace
                ON foreign_namespace.oid = foreign_class.relnamespace
  WHERE constraint_.contype = 'f'
    AND constraint_.convalidated`;

// Unique keys come from `pg_index`, not from `pg_constraint`: a `UNIQUE` constraint
// carries its `INCLUDE` columns inside `conkey` as if they were part of the key, a
// foreign key may reference a unique index that has no constraint at all, and only
// `indnkeyatts` says where the key actually ends. A partial or expression index is
// not a key of the relation and is left out.
const UNIQUE_KEY_QUERY = `
  SELECT namespace.nspname AS schema,
         class.relname     AS relation,
         index_class.relname AS index_name,
         index.indisprimary  AS is_primary,
         (SELECT array_agg(attribute.attname::text ORDER BY key.ord)
          FROM unnest(index.indkey[0:index.indnkeyatts - 1]) WITH ORDINALITY AS key(attnum, ord)
                   JOIN pg_attribute attribute
                        ON attribute.attrelid = index.indrelid
                            AND attribute.attnum = key.attnum) AS columns
  FROM pg_index index
           JOIN pg_class class ON class.oid = index.indrelid
           JOIN pg_namespace namespace ON namespace.oid = class.relnamespace
           JOIN pg_class index_class ON index_class.oid = index.indexrelid
  WHERE index.indisunique
    AND index.indisvalid
    AND index.indislive
    AND index.indpred IS NULL
    AND index.indexprs IS NULL
    AND namespace.nspname NOT IN ('pg_catalog', 'information_schema')`;

// Column types, for the one question the plan cannot answer: whether a cast over a
// column reference leaves the value alone.
const COLUMN_QUERY = `
  SELECT namespace.nspname     AS schema,
         class.relname         AS relation,
         attribute.attname::text AS column_name,
         attribute.atttypid::int AS type_id,
         attribute.atttypmod   AS type_mod,
         attribute.attnotnull  AS not_null
  FROM pg_attribute attribute
           JOIN pg_class class ON class.oid = attribute.attrelid
           JOIN pg_namespace namespace ON namespace.oid = class.relnamespace
  WHERE attribute.attnum > 0
    AND NOT attribute.attisdropped
    AND class.relkind IN ('r', 'p', 'v', 'm', 'f')
    AND namespace.nspname NOT IN ('pg_catalog', 'information_schema')`;

// `castmethod = 'b'` is PostgreSQL's own statement that the two types share a
// representation, so the cast hands the datum on untouched. A domain is binary
// coercible to the type it is over without any `pg_cast` row saying so, which is
// what the second query is for.
// The views every view is built on, and the column order that is each one's select
// list.
//
// PostgreSQL leaves a `Subquery Scan` in the plan wherever it could not flatten a view
// into the query above it — a security-barrier view is never flattened, and one whose
// columns the query above narrows keeps a node of its own. Such a node prints its
// alias and spells its `Output` with the inner view's column names, and that is all:
// no schema, no relation name, and no map from those names to the positions of the
// select list its child prints. The catalog has that map — a view's columns in
// `attnum` order are the positions of its select list — and it is a fact about the
// schema rather than about the day's plan, which is why crossing a view boundary this
// way does not make the answer move with the planner.
//
// The alias is matched against this relation's own sources, not against every view in
// the database: two schemas here spell the same view name (`deposit` and `withdrawal`
// each have an `available_crypto_terms`), and a name that could mean either is not a
// name this reader may follow. `pg_depend` over `pg_rewrite` is where a view's sources
// are written down; the closure of it is taken because an intermediate view that is
// flattened away leaves its own source's `Subquery Scan` behind.
const VIEW_SOURCE_QUERY = `
  SELECT namespace.nspname   AS schema,
         class.relname       AS name,
         (SELECT array_agg(attribute.attname::text ORDER BY attribute.attnum)
          FROM pg_attribute attribute
          WHERE attribute.attrelid = class.oid
            AND attribute.attnum > 0
            AND NOT attribute.attisdropped) AS columns,
         (SELECT coalesce(
                   array_agg(DISTINCT source_namespace.nspname || '.' || source.relname),
                   '{}'::text[])
          FROM pg_depend dependency
                   JOIN pg_rewrite rule ON rule.oid = dependency.objid
                   JOIN pg_class source ON source.oid = dependency.refobjid
                   JOIN pg_namespace source_namespace
                        ON source_namespace.oid = source.relnamespace
          WHERE dependency.classid = 'pg_rewrite'::regclass
            AND dependency.refclassid = 'pg_class'::regclass
            AND rule.ev_class = class.oid
            AND source.oid <> class.oid
            AND source.relkind IN ('v', 'm')) AS sources
  FROM pg_class class
           JOIN pg_namespace namespace ON namespace.oid = class.relnamespace
  WHERE class.relkind IN ('v', 'm')
    AND namespace.nspname NOT IN ('pg_catalog', 'information_schema')
  ORDER BY 1, 2`;

const COERCION_QUERY = `
  SELECT castsource::int AS source, casttarget::int AS target
  FROM pg_cast
  WHERE castmethod = 'b'`;

const DOMAIN_QUERY = `
  SELECT oid::int AS domain, typbasetype::int AS base
  FROM pg_type
  WHERE typtype = 'd' AND typbasetype <> 0`;

// `attname` is of type `name`, which the pg driver hands back unparsed inside an
// array literal; `::text` keeps the array an array on the JavaScript side.
const BARE_IDENTIFIER = /^[a-z_][a-z0-9_$]*$/;

function quoteIdentifier(name: string): string {
  return BARE_IDENTIFIER.test(name) ? name : `"${name.replaceAll('"', '""')}"`;
}

export async function readCatalogRelations(
  query: RunQuery,
): Promise<Map<string, CatalogRelation>> {
  const catalog = new Map<string, CatalogRelation>();
  const relationOf = (schema: string, relation: string): CatalogRelation => {
    const key = `${schema}.${relation}`;
    let found = catalog.get(key);
    if (!found) {
      found = {
        schema,
        relation,
        foreignKeys: [],
        uniqueKeys: [],
        columns: new Map(),
      };
      catalog.set(key, found);
    }
    return found;
  };

  for (const row of await query<ColumnRow>(COLUMN_QUERY)) {
    relationOf(row.schema, row.relation).columns.set(row.column_name, {
      typeId: row.type_id,
      typeMod: row.type_mod,
      notNull: row.not_null,
    });
  }
  for (const row of await query<ForeignKeyRow>(FOREIGN_KEY_QUERY)) {
    const foreignKey: CatalogForeignKey = {
      constraintName: row.constraint_name,
      columns: row.columns,
      foreignSchema: row.foreign_schema,
      foreignRelation: row.foreign_relation,
      foreignColumns: row.foreign_columns,
    };
    relationOf(row.schema, row.relation).foreignKeys.push(foreignKey);
  }
  for (const row of await query<UniqueKeyRow>(UNIQUE_KEY_QUERY)) {
    relationOf(row.schema, row.relation).uniqueKeys.push({
      name: row.index_name,
      isPrimary: row.is_primary,
      columns: row.columns,
    });
  }
  for (const relation of catalog.values()) {
    relation.foreignKeys.sort((left, right) =>
      left.constraintName.localeCompare(right.constraintName),
    );
    relation.uniqueKeys.sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }
  return catalog;
}

/** One view of the database, with its select-list order and the views it is built on. */
export interface ViewSourceRow {
  schema: string;
  name: string;
  columns: string[];
  /** `schema.name` of every view this one is built directly on. */
  sources: string[];
}

export async function readViewSources(
  query: RunQuery,
): Promise<readonly ViewSourceRow[]> {
  return query<ViewSourceRow>(VIEW_SOURCE_QUERY);
}

/**
 * The views one relation is built on, by the name a `Subquery Scan` over one of them
 * carries — which is the relation's own name, since PostgreSQL spells such a node
 * with the range-table entry's name.
 *
 * A name two of the sources share is left out rather than picked between: the plan
 * says the name and nothing else, so a name that could mean either view means
 * neither. So is a name PostgreSQL had to disambiguate itself (`v1_1` for a second
 * reference to `v1`), which simply does not match any source.
 */
export function subqueryViewCandidates(
  views: readonly ViewSourceRow[],
  schema: string,
  name: string,
): Map<string, ViewShape> {
  const byKey = new Map(
    views.map((view) => [`${view.schema}.${view.name}`, view]),
  );
  const start = byKey.get(`${schema}.${name}`);
  if (!start) return new Map();
  const reached = new Set<string>();
  const queue = [...(start.sources ?? [])];
  while (queue.length > 0) {
    const key = queue.pop();
    if (key === undefined || reached.has(key)) continue;
    reached.add(key);
    queue.push(...(byKey.get(key)?.sources ?? []));
  }
  const candidates = new Map<string, ViewShape>();
  const ambiguous = new Set<string>();
  for (const key of [...reached].sort()) {
    const source = byKey.get(key);
    if (!source) continue;
    if (candidates.has(source.name)) ambiguous.add(source.name);
    candidates.set(source.name, {
      schema: source.schema,
      name: source.name,
      columns: source.columns ?? [],
    });
  }
  for (const name_ of ambiguous) candidates.delete(name_);
  return candidates;
}

export async function readTypeCoercions(
  query: RunQuery,
): Promise<TypeCoercions> {
  const binary = new Set<string>();
  for (const row of await query<{ source: number; target: number }>(
    COERCION_QUERY,
  )) {
    binary.add(`${row.source}>${row.target}`);
  }
  const domainBase = new Map<number, number>();
  for (const row of await query<{ domain: number; base: number }>(
    DOMAIN_QUERY,
  )) {
    domainBase.set(row.domain, row.base);
  }
  return { binary, domainBase };
}

/** The `EXPLAIN` this reader issues, exposed so a report can print what was asked. */
/**
 * The views and materialized views of `schemas` this role has business with, with
 * their columns in attribute order. Exported because the unit fixture is built by
 * asking a real database the questions this module asks, rather than by transcribing
 * them a second time.
 */
export async function readViews(
  query: RunQuery,
  schemas: string[],
): Promise<readonly ViewRow[]> {
  return query<ViewRow>(VIEW_QUERY, [schemas]);
}

export function explainStatement(view: {
  schema: string;
  view: string;
  relkind: "v" | "m";
  definition: string | null;
  columns: ViewColumn[];
}): string {
  const query =
    view.relkind === "m"
      ? (view.definition ?? "").trim().replace(/;$/, "")
      : `SELECT ${view.columns.map((column) => quoteIdentifier(column.name)).join(", ")} FROM ${quoteIdentifier(view.schema)}.${quoteIdentifier(view.view)}`;
  return `EXPLAIN (VERBOSE, COSTS OFF, FORMAT JSON) ${query}`;
}

/**
 * Why a materialized view was left unplanned when the surface's service names no
 * privileged connection. Said out loud rather than swallowed: a materialized view
 * whose defining query nobody planned has no derivation, and "no relations derived"
 * and "never looked" are not the same answer.
 */
export const NO_PRIVILEGED_CONNECTION_REASON =
  "materialized view: its defining query is planned, and this service configures " +
  "no privileged connection to plan it with (pgService superuserConnectionString)";

export interface CollectResult {
  derivations: ViewDerivation[];
  /** Views whose plan could not be obtained at all, with the database's reason. */
  failures: {
    schema: string;
    view: string;
    relkind: "v" | "m";
    error: string;
  }[];
  /** Views this reader deliberately did not plan, with the reason it did not. */
  skipped: {
    schema: string;
    view: string;
    relkind: "v" | "m";
    reason: string;
  }[];
}

/**
 * `privilegedQuery` plans a materialized view's defining query, and nothing else.
 * A plain view is planned on `query` — the surface's own connection — because it
 * needs nothing more: `EXPLAIN` over a view runs with the view owner's rights on the
 * bases, exactly as a `SELECT` from it does. Widening that to the privileged
 * connection would hand this reader a reach over the sources it has no question for.
 */
export async function collectViewConstraints(
  query: RunQuery,
  schemas: string[],
  privilegedQuery: RunQuery | null,
): Promise<CollectResult> {
  const catalog = await readCatalogRelations(query);
  const coercions = await readTypeCoercions(query);
  const viewSources = await readViewSources(query);
  const views = await readViews(query, schemas);
  const derivations: ViewDerivation[] = [];
  const failures: CollectResult["failures"] = [];
  const skipped: CollectResult["skipped"] = [];
  for (const view of views) {
    const columns: ViewColumn[] = (view.columns ?? []).map((column) => ({
      name: column.name,
      typeId: column.type_id,
      typeMod: column.type_mod,
    }));
    if (columns.length === 0) continue;
    const explain = view.relkind === "m" ? privilegedQuery : query;
    if (!explain) {
      skipped.push({
        schema: view.schema,
        view: view.view,
        relkind: view.relkind,
        reason: NO_PRIVILEGED_CONNECTION_REASON,
      });
      continue;
    }
    let plan: ExplainPlanNode;
    try {
      const rows = await explain<{ "QUERY PLAN": [{ Plan: ExplainPlanNode }] }>(
        explainStatement({ ...view, columns }),
      );
      const first = rows[0]?.["QUERY PLAN"]?.[0]?.Plan;
      if (!first) throw new Error("EXPLAIN returned no plan");
      plan = first;
    } catch (error) {
      failures.push({
        schema: view.schema,
        view: view.view,
        relkind: view.relkind,
        error: error instanceof Error ? error.message : String(error),
      });
      continue;
    }
    derivations.push(
      deriveViewConstraints(
        view.schema,
        view.view,
        view.relkind,
        columns,
        readPlanOrigins(
          plan,
          columns.length,
          subqueryViewCandidates(viewSources, view.schema, view.view),
        ),
        catalog,
        coercions,
      ),
    );
  }
  return { derivations, failures, skipped };
}
