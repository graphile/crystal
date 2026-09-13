// What the planner says about a view column, case by case.
//
// `view-constraints.fixture.json` is PostgreSQL 18's own answer — the plans, the
// constraints, the unique indexes, the column types and the binary-coercible casts —
// for the schema in `view-constraints.lab.sql`, read through the plugin's own catalog
// queries. Nothing here is written by hand except the expectations. To rebuild it,
// create a database, apply that file, and run the collector's `readCatalogRelations`,
// `readTypeCoercions` and `explainStatement` against it (see the file's header).
//
// The negative cases carry the weight. A relation this plugin fails to derive costs
// a smart tag someone writes by hand; a relation it derives wrongly is a join that
// silently matches nothing, and the whole point of reading the plan instead of
// trusting a tag is that the reader says "I do not know" wherever it does not.
//
// `notNull` is stricter again, and the outer-join cases are why. A wrong relation
// costs an empty related object; a wrong `notNull` puts a NULL in a non-null GraphQL
// field, and GraphQL then nulls the parent object rather than the field — the answer
// is destroyed. Every kind of outer join is here from both sides, because getting the
// direction backwards is exactly the mistake that claims non-nullness on the side the
// emptiness arrives from.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "@jest/globals";
import {
  deriveViewConstraints,
  valuePreservingCast,
} from "../src/plugins/PgViewConstraintsPlugin/derive.js";
import type {
  CatalogRelation,
  TypeCoercions,
  ViewColumn,
} from "../src/plugins/PgViewConstraintsPlugin/derive.js";
import {
  collectViewConstraints,
  NO_PRIVILEGED_CONNECTION_REASON,
  subqueryViewCandidates,
} from "../src/plugins/PgViewConstraintsPlugin/collect.js";
import type { ViewSourceRow } from "../src/plugins/PgViewConstraintsPlugin/collect.js";
import type { RunQuery } from "../src/plugins/PgViewConstraintsPlugin/collect.js";
import {
  COLUMN_REFUSALS,
  PLAN_REFUSALS,
  parseReference,
  readPlanOrigins,
} from "../src/plugins/PgViewConstraintsPlugin/plan-origins.js";
import type {
  ColumnRefusal,
  ExplainPlanNode,
  PlanOrigins,
  PlanRefusal,
  ViewShape,
} from "../src/plugins/PgViewConstraintsPlugin/plan-origins.js";

interface Fixture {
  catalog: (Omit<CatalogRelation, "columns"> & {
    columns: Record<
      string,
      { typeId: number; typeMod: number; notNull: boolean }
    >;
  })[];
  coercions: { binary: string[]; domainBase: Record<string, number> };
  /** Every lab view's select-list order and the views it is built on. */
  viewSources: ViewSourceRow[];
  views: {
    schema: string;
    view: string;
    relkind: "v" | "m";
    /** The planner regime the plan was taken under; see scripts/view-constraints-fixture.ts. */
    regime: string;
    columns: ViewColumn[];
    plan: ExplainPlanNode;
  }[];
}

const fixture: Fixture = JSON.parse(
  readFileSync(
    new URL("./PgViewConstraintsPlugin.fixture.json", import.meta.url),
    "utf8",
  ),
);

const catalog = new Map<string, CatalogRelation>(
  fixture.catalog.map((relation) => [
    `${relation.schema}.${relation.relation}`,
    { ...relation, columns: new Map(Object.entries(relation.columns)) },
  ]),
);

const coercions: TypeCoercions = {
  binary: new Set(fixture.coercions.binary),
  domainBase: new Map(
    Object.entries(fixture.coercions.domainBase).map(([domain, base]) => [
      Number(domain),
      base,
    ]),
  ),
};

/** A hand-built plan read, asserted to be readable so the case is about its columns. */
function read(
  plan: ExplainPlanNode,
  columnCount: number,
  candidates?: ReadonlyMap<string, ViewShape>,
): PlanOrigins {
  const origins = readPlanOrigins(plan, columnCount, candidates);
  assert.ok(typeof origins !== "string", `plan refused: ${String(origins)}`);
  return origins;
}

/** The regime the cases below are written against. */
const DEFAULT_REGIME = "default";

const REGIMES = [...new Set(fixture.views.map((view) => view.regime))];

/** What one lab view's derivation reduces to, in the shape the cases are written in. */
function derive(
  name: string,
  regime: string = DEFAULT_REGIME,
): {
  origins: string[] | null;
  notNull: string[];
  foreignKeys: string[];
  primaryKey: string | null;
  planRefusal: PlanRefusal | null;
  refusals: (ColumnRefusal | null)[];
  notes: string[];
} {
  const view = fixture.views.find(
    (candidate) => candidate.view === name && candidate.regime === regime,
  );
  assert.ok(view, `no fixture for lab.${name} under ${regime}`);
  const derivation = deriveViewConstraints(
    view.schema,
    view.view,
    view.relkind,
    view.columns,
    readPlanOrigins(
      view.plan,
      view.columns.length,
      subqueryViewCandidates(fixture.viewSources, view.schema, view.view),
    ),
    catalog,
    coercions,
  );
  return {
    origins:
      derivation.origins?.map((sources, index) => {
        const column = view.columns[index]?.name ?? "?";
        if (!sources) return `${column}=—`;
        return `${column}=${sources.map((origin) => `${origin.relation}.${origin.column}`).join("|")}`;
      }) ?? null,
    notNull: derivation.notNullColumns,
    foreignKeys: derivation.foreignKeys.map((foreignKey) => foreignKey.tag),
    primaryKey: derivation.primaryKey?.tag ?? null,
    planRefusal: derivation.planRefusal,
    refusals: derivation.columnRefusals,
    notes: derivation.notes,
  };
}

interface Case {
  /** The lab view, and what makes it the case it is. */
  view: string;
  about: string;
  origins: string[] | null;
  /** View columns derived NOT NULL, in attribute order. */
  notNull: string[];
  foreignKeys: string[];
  primaryKey: string | null;
}

const CASES: Case[] = [
  // ── Proxying, in every shape that still proxies ────────────────────────────────
  {
    view: "v_bare",
    about:
      "a bare reference is the plain case: every column proxies its base column",
    origins: ["id=tx.id", "cur_code=tx.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_left_join",
    about:
      "LEFT JOIN, both sides: the inner one still proxies — NULL or the base value — " +
      "and is the one the join can null, while the outer one keeps NOT NULL",
    origins: ["id=tx.id", "bank_id=bank.id", "cur_code=tx.cur_code"],
    // `bank.id` is the primary key of `bank` and NOT NULL there; it is nullable here
    // and nowhere else, because of where the join stands over it.
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(bank_id) references lab.bank (id)",
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    // Two relations, so no row identity.
    primaryKey: null,
  },
  {
    view: "v_group",
    about: "a grouping key proxies; the aggregate beside it does not",
    origins: ["cur_code=tx.cur_code", "n=—"],
    notNull: ["cur_code"],
    foreignKeys: ["(cur_code) references lab.currency (code)"],
    primaryKey: null,
  },
  {
    view: "v_window",
    about:
      "a column beside a window function proxies; the window result does not",
    origins: ["id=tx.id", "cur_code=tx.cur_code", "rn=—"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_distinct_src",
    about: "DISTINCT drops rows and changes no value",
    origins: ["id=tx.id", "cur_code=tx.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_over_view",
    about:
      "a view over a view is rewritten away and reads like the base relation",
    origins: ["id=tx.id", "cur_code=tx.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_cast_varchar_to_text",
    about:
      "varchar to text is binary-coercible: the datum is handed on untouched",
    origins: ["id=tx2.id", "cur_code=tx2.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx2 (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_cast_domain_to_base",
    about:
      "a domain to the type it is over is the same value with fewer promises",
    origins: ["id=tx3.id", "cur_code=tx3.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx3 (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_cte",
    about:
      "a WITH query referenced twice is materialized, and the wall it puts up is not " +
      "crossed: the plan holds no map from its column names to its select list",
    origins: ["id=—", "cur_code=—", "top_amount=—"],
    notNull: [],
    foreignKeys: [],
    primaryKey: null,
  },
  {
    view: "v_unique_key",
    about:
      "a unique index is as good a key of the base table as the primary key",
    origins: ["code=asset.code"],
    notNull: ["code"],
    foreignKeys: [],
    primaryKey: "code",
  },
  {
    view: "m_tx",
    about:
      "a materialized view is read through its defining query, whose single range " +
      "table entry EXPLAIN prints unqualified",
    origins: ["id=tx.id", "cur_code=tx.cur_code", "amount=tx.amount"],
    notNull: [],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },

  // ── Unions, where every branch has to be read or none of it counts ─────────────
  {
    view: "v_union_same_column",
    about: "every branch of the union proxies the same base column",
    origins: ["id=tx.id", "cur_code=tx.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: null,
  },
  {
    view: "v_union_same_target",
    about:
      "the branches proxy different base columns whose foreign keys lead to one " +
      "table: every value is a legal key there, whichever branch it came from",
    origins: ["id=tx.id|wallet.id", "cur_code=tx.cur_code|wallet.cur_code"],
    // `id` is the primary key of two different tables: nothing is true of both.
    notNull: ["id", "cur_code"],
    foreignKeys: ["(cur_code) references lab.currency (code)"],
    primaryKey: null,
  },
  {
    view: "v_union_null_branch",
    about:
      "a branch contributing a NULL literal contributes no value and drops out",
    origins: ["id=refund.id|tx.id", "bank_id=tx.bank_id"],
    notNull: ["id"],
    foreignKeys: ["(bank_id) references lab.bank (id)"],
    primaryKey: null,
  },
  {
    view: "v_union_unreadable_branch",
    about: "one branch the reader cannot read leaves the whole column unknown",
    origins: ["id=tx.id|wallet.id", "cur_code=—"],
    notNull: ["id"],
    foreignKeys: [],
    primaryKey: null,
  },

  // ── Negative: everything that looks like proxying and is not ───────────────────
  {
    view: "v_coalesce",
    about:
      "COALESCE takes the value from here or from there: it proxies neither",
    origins: ["id=tx.id", "cur_code=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: null,
  },
  {
    view: "v_constant",
    about: "a literal is nobody’s column",
    origins: ["id=tx.id", "cur_code=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: "id",
  },
  {
    view: "v_cast_truncating",
    about: "text to varchar(4) is binary-coercible and still truncates",
    origins: ["id=tx.id", "cur_code=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: "id",
  },
  {
    view: "v_cast_function",
    about:
      "bigint to numeric goes through a function: a new datum for the same number",
    origins: ["id=tx.id", "bank_id=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: "id",
  },
  {
    view: "v_distinct_over_union",
    about:
      "the trap: DISTINCT over a UNION prints a Unique whose Output names one branch " +
      "of two, so the plan is refused whole rather than read as a single scan",
    origins: null,
    notNull: [],
    foreignKeys: [],
    primaryKey: null,
  },
  {
    view: "v_self_join",
    about:
      "a table joined to itself: each column belongs to the instance its alias names, " +
      "and no key is assembled across the two",
    origins: ["a_id=tx.id", "b_cur_code=tx.cur_code"],
    notNull: ["a_id", "b_cur_code"],
    foreignKeys: [
      "(a_id) references lab.tx (id)",
      "(b_cur_code) references lab.currency (code)",
    ],
    primaryKey: null,
  },
  {
    view: "v_nullable_unique",
    about:
      "a unique index over a nullable column identifies no row and is no key",
    origins: ["tag=slot.tag"],
    notNull: [],
    foreignKeys: [],
    primaryKey: null,
  },

  // ── Non-nullness: what the shape of the plan gives, and what it takes away ─────
  {
    view: "v_collapsed_left_join",
    about:
      "the planner folds the LEFT JOIN into an inner one because the qualifier is " +
      "strict, so a column the view spells nullable is NOT NULL in fact",
    origins: ["id=tx.id", "title=bank.title"],
    notNull: ["id", "title"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: null,
  },
  {
    view: "v_right_join",
    about:
      "RIGHT JOIN, both sides: it nulls the outer one and keeps the inner one",
    origins: ["t_id=tx.id", "title=bank.title"],
    notNull: ["title"],
    foreignKeys: ["(t_id) references lab.tx (id)"],
    primaryKey: null,
  },
  {
    view: "v_full_join",
    about:
      "FULL JOIN, both sides: it nulls both, and neither column survives NOT NULL",
    origins: ["t_id=tx.id", "title=bank.title"],
    notNull: [],
    foreignKeys: ["(t_id) references lab.tx (id)"],
    primaryKey: null,
  },
  {
    view: "v_nested_outer_join",
    about:
      "the nulled scan sits two joins below the outer join — and the planner states " +
      "that outer join as a RIGHT one whose outer input is the nulled side, so the " +
      "side is read off the plan rather than off the view’s LEFT JOIN",
    origins: ["id=refund.id", "title=bank.title"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.refund (id)"],
    primaryKey: null,
  },
  {
    view: "v_union_null_over_not_null",
    about:
      "a UNION branch spelling NULL makes the column nullable however NOT NULL the other is",
    origins: ["id=refund.id|tx.id", "cur_code=tx.cur_code"],
    notNull: ["id"],
    foreignKeys: ["(cur_code) references lab.currency (code)"],
    primaryKey: null,
  },
  {
    view: "v_grouping_sets",
    about:
      "GROUP BY ROLLUP adds a superaggregate row that answers to no base row: the " +
      "grouping column is NULL in it, and it is not a row of the table either",
    origins: ["id=tx.id", "n=—"],
    notNull: [],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: null,
  },
  {
    view: "v_not_null_predicate",
    about:
      "WHERE bank_id IS NOT NULL leaves no NULL in the column and is not read: the " +
      "rule is about the shape of the plan, never about an expression in it",
    origins: ["id=tx.id", "bank_id=tx.bank_id"],
    notNull: ["id"],
    foreignKeys: [
      "(bank_id) references lab.bank (id)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_cte_nulled_scan",
    about:
      "a column read through a materialized WITH query is unknown however plainly " +
      "the query reads it; the columns beside it are read as usual",
    origins: ["id=refund.id", "a_code=—", "b_code=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.refund (id)"],
    primaryKey: null,
  },
  {
    view: "v_union_ordered",
    about:
      "the union is read through whatever the planner puts over it: a `MergeAppend`, " +
      "a `Sort` over an `Append`, or a `Gather Merge` over a parallel one",
    origins: ["id=tx.id|wallet.id", "cur_code=tx.cur_code|wallet.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: ["(cur_code) references lab.currency (code)"],
    primaryKey: null,
  },
  {
    view: "v_union_limited",
    about: "a `Limit` over the union hides it no more than a `Sort` does",
    origins: ["id=tx.id|wallet.id", "cur_code=tx.cur_code|wallet.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: ["(cur_code) references lab.currency (code)"],
    primaryKey: null,
  },
  {
    view: "v_union_distinct",
    about:
      "de-duplication over a union is refused both ways the planner implements it: " +
      "a hashed `Aggregate` computes, and a `Unique` is what the same query becomes " +
      "when hashing is off, so accepting one would answer by cost",
    origins: null,
    notNull: [],
    foreignKeys: [],
    primaryKey: null,
  },
  {
    view: "v_cte_reordered_scans",
    about:
      "two scans of one WITH query print its columns in two different orders, and " +
      "which of the two orders is the query’s own is the very thing the plan does " +
      "not say — so neither is read",
    origins: ["id=refund.id", "cur_code=—", "b_cur_code=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.refund (id)"],
    primaryKey: null,
  },

  // ── Views built on views: the boundary PostgreSQL leaves and the catalog crosses ─
  //
  // A security-barrier view is never flattened into the query above it, and a
  // `Subquery Scan` that projects fewer columns than its child is not the trivial one
  // `setrefs.c` removes. So the shape every published projection of this repository is
  // made of — a view over a barrier view, taking a subset of its columns — leaves a
  // node spelled `v_barrier.cur_code` and nothing else. The catalog says which
  // position of the inner view's select list that name stands at, and the child prints
  // that select list entry for entry.
  {
    view: "v_barrier",
    about:
      "a barrier view asked for its whole select list is a trivial Subquery Scan and " +
      "PostgreSQL removes it: the plan is the plan of the base table",
    origins: [
      "id=tx.id",
      "cur_code=tx.cur_code",
      "bank_id=tx.bank_id",
      "amount=tx.amount",
    ],
    notNull: ["id", "cur_code", "amount"],
    foreignKeys: [
      "(bank_id) references lab.bank (id)",
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_barrier_whole",
    about:
      "a view that narrows nothing lets the barrier under it dissolve as well",
    origins: [
      "id=tx.id",
      "cur_code=tx.cur_code",
      "bank_id=tx.bank_id",
      "amount=tx.amount",
    ],
    notNull: ["id", "cur_code", "amount"],
    foreignKeys: [
      "(bank_id) references lab.bank (id)",
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_over_barrier",
    about:
      "a view over a barrier view taking a subset of its columns: the boundary stays, " +
      "and is crossed by position — the key and the non-nullness survive it",
    origins: ["id=tx.id", "cur_code=tx.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_barrier_over_barrier",
    about: "a barrier over a barrier, narrowing once: one boundary in the plan",
    origins: ["id=tx.id", "cur_code=tx.cur_code", "bank_id=tx.bank_id"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(bank_id) references lab.bank (id)",
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_barrier_chain",
    about:
      "three levels, narrowing at each: two Subquery Scans one inside the other, and " +
      "the descent is the same step taken twice",
    origins: ["id=tx.id", "cur_code=tx.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_barrier_over_plain",
    about:
      "a barrier over a plain view: the plain one is flattened into it and nothing is left",
    origins: ["id=tx.id", "cur_code=tx.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_plain_over_barrier",
    about:
      "a plain view over a barrier one, which is the ordinary surface shape",
    origins: ["id=tx.id", "bank_id=tx.bank_id"],
    notNull: ["id"],
    foreignKeys: [
      "(bank_id) references lab.bank (id)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_barrier_union",
    about:
      "a UNION ALL inside a barrier view is pulled up into the query above all the " +
      "same, and reads as the union it is",
    origins: [
      "id=tx.id|wallet.id",
      "cur_code=tx.cur_code|wallet.cur_code",
      "amount=—",
    ],
    notNull: ["id", "cur_code"],
    foreignKeys: ["(cur_code) references lab.currency (code)"],
    primaryKey: null,
  },
  {
    view: "v_over_barrier_union",
    about: "and narrowing it from above does not change that",
    origins: ["id=tx.id|wallet.id", "cur_code=tx.cur_code|wallet.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: ["(cur_code) references lab.currency (code)"],
    primaryKey: null,
  },
  {
    view: "v_barrier_union_ordered",
    about:
      "an ORDER BY of its own stops the union being pulled up, so the boundary stays " +
      "and the union stays under it",
    origins: [
      "id=tx.id|wallet.id",
      "cur_code=tx.cur_code|wallet.cur_code",
      "amount=—",
    ],
    notNull: ["id", "cur_code"],
    foreignKeys: ["(cur_code) references lab.currency (code)"],
    primaryKey: null,
  },
  {
    view: "v_over_barrier_union_ordered",
    about:
      "the branches of that union are read one by one through the boundary: the " +
      "descent lands on the select list of the crossed view, whatever shape it has",
    origins: ["id=tx.id|wallet.id", "cur_code=tx.cur_code|wallet.cur_code"],
    notNull: ["id", "cur_code"],
    foreignKeys: ["(cur_code) references lab.currency (code)"],
    primaryKey: null,
  },
  {
    view: "v_barrier_computed",
    about:
      "what the inner view computes is computed whichever side of the boundary reads it",
    origins: ["id=tx.id", "cur_code=tx.cur_code", "loud=—", "amount=tx.amount"],
    notNull: ["id", "cur_code", "amount"],
    foreignKeys: [
      "(cur_code) references lab.currency (code)",
      "(id) references lab.tx (id)",
    ],
    primaryKey: "id",
  },
  {
    view: "v_over_barrier_computed",
    about:
      "and it stays computed across it: the column beside it is read as usual",
    origins: ["id=tx.id", "loud=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: "id",
  },
  {
    view: "v_barrier_narrowing",
    about:
      "the inner view truncates the value, so it is not the base column’s any more",
    origins: ["id=tx.id", "cur_code=—", "amount=tx.amount"],
    notNull: ["id", "amount"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: "id",
  },
  {
    view: "v_over_barrier_narrowing",
    about:
      "and the outer view casting it back to the base type does not undo that: each " +
      "step is binary-coercible on its own, and the chain of them is not",
    origins: ["id=tx.id", "cur_code=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: "id",
  },
  {
    view: "v_aliased_barrier",
    about:
      "the plan gives a Subquery Scan an alias and nothing else, so an aliased barrier " +
      "view is a boundary with no name to pin it to a view by, and is not crossed",
    origins: ["id=—", "cur_code=—"],
    notNull: [],
    foreignKeys: [],
    primaryKey: null,
  },

  // ── The rest of the closed list of refusals ────────────────────────────────────
  {
    view: "v_null_column",
    about:
      "a column that is a NULL literal all the way up has no base column at all",
    origins: ["id=tx.id", "cur_code=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: "id",
  },
  {
    view: "v_except",
    about:
      "EXCEPT reads its inputs as one tagged stream: there is no branch to read",
    origins: null,
    notNull: [],
    foreignKeys: [],
    primaryKey: null,
  },
  {
    view: "v_function_scan",
    about:
      "a function scan carries an alias like any other scan and names no relation",
    origins: ["id=tx.id", "val=—"],
    notNull: ["id"],
    foreignKeys: ["(id) references lab.tx (id)"],
    primaryKey: null,
  },
  {
    view: "v_values_scan",
    about: "so does a VALUES list",
    origins: ["a=—", "b=—"],
    notNull: [],
    foreignKeys: [],
    primaryKey: null,
  },
  {
    view: "v_where_false",
    about:
      "a constant-false qualifier leaves a plan with no scan in it, while the select " +
      "list still spells the relation that is not read",
    origins: ["id=—", "cur_code=—"],
    notNull: [],
    foreignKeys: [],
    primaryKey: null,
  },
];

for (const testCase of CASES) {
  test(`${testCase.view}: ${testCase.about}`, () => {
    const derived = derive(testCase.view);
    assert.deepEqual(derived.origins, testCase.origins);
    assert.deepEqual(derived.notNull, testCase.notNull);
    assert.deepEqual(derived.foreignKeys, testCase.foreignKeys);
    assert.equal(derived.primaryKey, testCase.primaryKey);
  });
}

test("every view in the fixture is a case, and every case is in the fixture", () => {
  assert.deepEqual(
    CASES.map((testCase) => testCase.view).sort(),
    [
      ...new Set(
        fixture.views
          .filter((view) => view.regime === DEFAULT_REGIME)
          .map((view) => view.view),
      ),
    ].sort(),
  );
});

// The one property that makes the derivation a contract rather than a reading of
// today's plan. Which plan the planner hands back is its judgement of cost, and the
// regimes in the fixture move that judgement: a `UNION ALL` arrives as an `Append` at
// the root, as a `Gather` over a parallel one, as a `MergeAppend`, or as a `Sort`
// over an `Append`, and `SELECT DISTINCT` arrives as a hashed `Aggregate` or as a
// `Unique` over a `Sort`. None of it may change the answer — including the cases
// where the answer is "nothing", which have to be nothing every time rather than
// nothing on the days the plan is shaped wrong.
for (const regime of REGIMES.filter((name) => name !== DEFAULT_REGIME)) {
  test(`the derivation of every lab view is the same under ${regime}`, () => {
    for (const testCase of CASES) {
      assert.deepEqual(
        derive(testCase.view, regime),
        derive(testCase.view),
        `${testCase.view} derives differently under ${regime}`,
      );
    }
  });
}

test("a reference parses; anything with structure does not", () => {
  assert.deepEqual(parseReference("b1.cur_id"), {
    alias: "b1",
    column: "cur_id",
    coerced: false,
  });
  assert.deepEqual(parseReference('"odd name"."odd column"'), {
    alias: "odd name",
    column: "odd column",
    coerced: false,
  });
  assert.deepEqual(parseReference("(b1.amount)::text"), {
    alias: "b1",
    column: "amount",
    coerced: true,
  });
  // One range table entry, so the planner drops the prefix and this is still a column.
  assert.deepEqual(parseReference("cur_id"), {
    alias: null,
    column: "cur_id",
    coerced: false,
  });
  for (const entry of [
    "7",
    "'deposit.event'::text",
    "(b1.cur_id + 0)",
    "COALESCE(b1.cur_id, 0)",
    "count(*)",
    "row_number() OVER w1",
    "(SubPlan 1)",
    "(InitPlan 1).col1",
    // A second cast is a second question, and this reader answers only the first.
    "((b1.cur_id)::character varying(4))::text",
    "b1.*",
  ]) {
    assert.equal(parseReference(entry), null, entry);
  }
});

test("an unqualified name is a column only where the plan reads exactly one relation", () => {
  const twoSources: ExplainPlanNode = {
    "Node Type": "Nested Loop",
    "Join Type": "Inner",
    Output: ["id", "code"],
    Plans: [
      {
        "Node Type": "Seq Scan",
        Schema: "lab",
        "Relation Name": "tx",
        Alias: "tx",
        Output: ["id"],
      },
      {
        "Node Type": "Seq Scan",
        Schema: "lab",
        "Relation Name": "currency",
        Alias: "currency",
        Output: ["code"],
      },
    ],
  };
  assert.deepEqual(read(twoSources, 2).columns, [null, null]);
  assert.deepEqual(read(twoSources, 2).refusals, [
    "unqualified-name-without-a-sole-relation",
    "unqualified-name-without-a-sole-relation",
  ]);
});

test("a binary-coercible cast keeps the value; a function cast and a modifier do not", () => {
  const text = { typeId: 25, typeMod: -1, notNull: true };
  const varchar8 = { typeId: 1043, typeMod: 12, notNull: true };
  const asText: ViewColumn = { name: "c", typeId: 25, typeMod: -1 };
  const asVarchar4: ViewColumn = { name: "c", typeId: 1043, typeMod: 8 };
  const asNumeric: ViewColumn = { name: "c", typeId: 1700, typeMod: -1 };
  assert.equal(valuePreservingCast(varchar8, asText, coercions), true);
  assert.equal(valuePreservingCast(text, asVarchar4, coercions), false);
  assert.equal(valuePreservingCast(text, asNumeric, coercions), false);
});

test("a join type this reader does not know nulls both of its sides", () => {
  // Every join type PostgreSQL prints today is in the map; one it does not print
  // today would otherwise be read as nulling neither side, which is the reading that
  // claims NOT NULL over emptiness.
  const exotic: ExplainPlanNode = {
    "Node Type": "Hash Sideways Join",
    "Join Type": "Sideways",
    Output: ["tx.id", "currency.code"],
    Plans: [
      {
        "Node Type": "Seq Scan",
        "Parent Relationship": "Outer",
        Schema: "lab",
        "Relation Name": "tx",
        Alias: "tx",
        Output: ["tx.id"],
      },
      {
        "Node Type": "Seq Scan",
        "Parent Relationship": "Inner",
        Schema: "lab",
        "Relation Name": "currency",
        Alias: "currency",
        Output: ["currency.code"],
      },
    ],
  };
  assert.deepEqual(read(exotic, 2).nullIntroduced, [true, true]);
});

test("an InitPlan beside a join is not an input of it, so no outer join nulls it", () => {
  // A subplan hangs off whichever node owns it, and that node can be a join. It is
  // computed beside the join, not joined by it, so the outer join over it nulls the
  // join's own inner input and nothing else.
  const beside: ExplainPlanNode = {
    "Node Type": "Nested Loop",
    "Join Type": "Left",
    Output: ["tx.id", "bank.title", "currency.code"],
    Plans: [
      {
        "Node Type": "Seq Scan",
        "Parent Relationship": "InitPlan",
        Schema: "lab",
        "Relation Name": "currency",
        Alias: "currency",
        Output: ["currency.code"],
      },
      {
        "Node Type": "Seq Scan",
        "Parent Relationship": "Outer",
        Schema: "lab",
        "Relation Name": "tx",
        Alias: "tx",
        Output: ["tx.id"],
      },
      {
        "Node Type": "Seq Scan",
        "Parent Relationship": "Inner",
        Schema: "lab",
        "Relation Name": "bank",
        Alias: "bank",
        Output: ["bank.title"],
      },
    ],
  };
  assert.deepEqual(read(beside, 3).nullIntroduced, [false, true, false]);
});

// Which connection each `EXPLAIN` is issued on. The two are not interchangeable: a
// materialized view's defining query names relations the surface's role is precisely
// the one not to be able to read, while a plain view needs nothing beyond the
// surface's own rights, and handing it the privileged connection would widen this
// reader's reach over the sources for no question it has.
function runnerRecording(
  issued: string[],
  label: string,
  answers: Record<string, unknown[]>,
): RunQuery {
  return async <Row>(text: string) => {
    issued.push(`${label}: ${text.split("\n")[0]?.trim()}`);
    for (const [needle, rows] of Object.entries(answers)) {
      if (text.includes(needle)) return rows as Row[];
    }
    return [] as Row[];
  };
}

const ONE_COLUMN_PLAN = [
  {
    "QUERY PLAN": [
      {
        Plan: {
          "Node Type": "Seq Scan",
          Schema: "lab",
          "Relation Name": "currency",
          Alias: "currency",
          Output: ["currency.code"],
        },
      },
    ],
  },
];

const TWO_VIEWS = [
  {
    schema: "lab",
    view: "plain",
    relkind: "v",
    definition: null,
    columns: [{ name: "code", type_id: 25, type_mod: -1 }],
  },
  {
    schema: "lab",
    view: "stored",
    relkind: "m",
    definition: "SELECT code FROM lab.currency;",
    columns: [{ name: "code", type_id: 25, type_mod: -1 }],
  },
];

test("a materialized view is planned on the privileged connection, a plain view is not", async () => {
  const issued: string[] = [];
  const surface = runnerRecording(issued, "surface", {
    "FROM pg_class class": TWO_VIEWS,
    EXPLAIN: ONE_COLUMN_PLAN,
  });
  const privileged = runnerRecording(issued, "privileged", {
    EXPLAIN: ONE_COLUMN_PLAN,
  });
  const collected = await collectViewConstraints(surface, ["lab"], privileged);
  assert.deepEqual(
    issued.filter((entry) => entry.includes("EXPLAIN")),
    [
      "surface: EXPLAIN (VERBOSE, COSTS OFF, FORMAT JSON) SELECT code FROM lab.plain",
      "privileged: EXPLAIN (VERBOSE, COSTS OFF, FORMAT JSON) SELECT code FROM lab.currency",
    ],
  );
  assert.deepEqual(
    collected.derivations.map(
      (derived) => `${derived.view}/${derived.relkind}`,
    ),
    ["plain/v", "stored/m"],
  );
  assert.deepEqual(collected.skipped, []);
});

test("with no privileged connection the materialized view is named, not passed over", async () => {
  const issued: string[] = [];
  const surface = runnerRecording(issued, "surface", {
    "FROM pg_class class": TWO_VIEWS,
    EXPLAIN: ONE_COLUMN_PLAN,
  });
  const collected = await collectViewConstraints(surface, ["lab"], null);
  assert.deepEqual(
    issued.filter((entry) => entry.includes("EXPLAIN")),
    [
      "surface: EXPLAIN (VERBOSE, COSTS OFF, FORMAT JSON) SELECT code FROM lab.plain",
    ],
  );
  assert.deepEqual(
    collected.derivations.map((derived) => derived.view),
    ["plain"],
  );
  assert.deepEqual(collected.skipped, [
    {
      schema: "lab",
      view: "stored",
      relkind: "m",
      reason: NO_PRIVILEGED_CONNECTION_REASON,
    },
  ]);
});

// ── The refusals are a closed list, and every one of them has a case ─────────────
//
// A view that derives nothing has to say which refusal it is, or "nothing derived"
// and "nothing looked at" become the same answer and the diff against the hand-written
// tags stops meaning anything. So the list is closed, and nothing may be added to it
// without a case that produces it.
//
// Two of them answer a plan shape no lab view produces: PostgreSQL prints an
// unqualified name only where the flattened range table has one entry, and prints an
// `Output` for every node that carries a select list. They are kept because a reader
// that had no answer for those would have to invent one, and their cases are plans
// built by hand here — the same way the join type this reader does not know is held.
const REFUSAL_CASES: Record<PlanRefusal | ColumnRefusal, string> = {
  "unreadable-set-operation": "v_except",
  "set-operation-not-a-select-list": "v_union_distinct",
  "output-not-positional": "a plan built by hand, below",
  "not-a-column-reference": "v_coalesce",
  "unqualified-name-without-a-sole-relation": "a plan built by hand, above",
  "no-value-from-any-branch": "v_null_column",
  "through-a-materialized-with": "v_cte",
  "through-an-unpinned-subquery": "v_aliased_barrier",
  "through-a-row-source-the-catalog-does-not-name": "v_function_scan",
  "cast-not-value-preserving": "v_over_barrier_narrowing",
};

test("the closed list of refusals is exactly the list with cases", () => {
  assert.deepEqual(
    Object.keys(REFUSAL_CASES).sort(),
    [...Object.keys(PLAN_REFUSALS), ...Object.keys(COLUMN_REFUSALS)].sort(),
  );
});

test("every refusal a lab view stands for is the refusal that view gives", () => {
  const labViews = new Set(CASES.map((testCase) => testCase.view));
  for (const [refusal, view] of Object.entries(REFUSAL_CASES)) {
    if (!labViews.has(view)) continue;
    const derived = derive(view);
    const given =
      derived.planRefusal ?? derived.refusals.find((entry) => entry !== null);
    assert.equal(given, refusal, `lab.${view} was to stand for ${refusal}`);
  }
});

test("every refusal of a lab view is one of the closed list", () => {
  const named = new Set([
    ...Object.keys(PLAN_REFUSALS),
    ...Object.keys(COLUMN_REFUSALS),
  ]);
  for (const testCase of CASES) {
    const derived = derive(testCase.view);
    if (derived.planRefusal)
      assert.ok(named.has(derived.planRefusal), derived.planRefusal);
    for (const refusal of derived.refusals) {
      if (refusal) assert.ok(named.has(refusal), refusal);
    }
    // And a column with no sources always says why, rather than going quiet.
    for (const [index, sources] of (derived.origins ?? []).entries()) {
      const said =
        derived.refusals[index] !== null &&
        derived.refusals[index] !== undefined;
      assert.equal(
        sources.endsWith("=—"),
        said,
        `${testCase.view} column ${index}: a column with no sources must name its refusal`,
      );
    }
  }
});

test("an Output that does not line up with the view’s columns is refused whole", () => {
  // No lab view produces this: every node that carries a select list prints an
  // `Output`, and a union's branches print the set operation's column count. A reader
  // without an answer for it would read two columns off three entries by position.
  const short: ExplainPlanNode = {
    "Node Type": "Seq Scan",
    Schema: "lab",
    "Relation Name": "tx",
    Alias: "tx",
    Output: ["tx.id"],
  };
  assert.equal(readPlanOrigins(short, 2), "output-not-positional");
  assert.equal(
    readPlanOrigins({ "Node Type": "Hash Join", "Join Type": "Inner" }, 2),
    "output-not-positional",
  );
});

test("a Subquery Scan is crossed only where the catalog pins it to one view", () => {
  // The plan offers the alias and nothing else. `v_barrier` is a view `v_over_barrier`
  // is built on; a node calling itself anything else is some other subquery, and a
  // node calling itself `v_barrier` while printing a name `v_barrier` does not have is
  // some other subquery too.
  const shape = (alias: string, column: string): ExplainPlanNode => ({
    "Node Type": "Subquery Scan",
    Alias: alias,
    Output: [`${alias}.id`, `${alias}.${column}`],
    Plans: [
      {
        "Node Type": "Seq Scan",
        "Parent Relationship": "Subquery",
        Schema: "lab",
        "Relation Name": "tx",
        Alias: "tx",
        Output: ["tx.id", "tx.cur_code", "NULL::bigint", "NULL::numeric"],
      },
    ],
  });
  const candidates = subqueryViewCandidates(
    fixture.viewSources,
    "lab",
    "v_over_barrier",
  );
  assert.deepEqual(
    read(shape("v_barrier", "cur_code"), 2, candidates).columns.map(
      (sources) =>
        sources
          ?.map((origin) => `${origin.relation}.${origin.column}`)
          .join("|") ?? "—",
    ),
    ["tx.id", "tx.cur_code"],
  );
  // A name `v_barrier` does not carry: the node is not that view.
  assert.deepEqual(
    read(shape("v_barrier", "nonesuch"), 2, candidates).refusals,
    ["through-an-unpinned-subquery", "through-an-unpinned-subquery"],
  );
  // A view this relation is not built on is not a candidate at all.
  assert.deepEqual(read(shape("v_bare", "cur_code"), 2, candidates).refusals, [
    "through-an-unpinned-subquery",
    "through-an-unpinned-subquery",
  ]);
});
