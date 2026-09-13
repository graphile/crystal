// Where a view column comes from, read off the planner's own answer.
//
// `EXPLAIN (VERBOSE, COSTS OFF, FORMAT JSON) SELECT <columns> FROM <view>` prints,
// on every plan node, the `Output` list of the expressions that node emits, in the
// same order as the query's select list. On a relation scan node it also prints
// `Schema`, `Relation Name` and `Alias`, which is what binds the `alias.column`
// spelling in an `Output` entry to a real catalog relation.
//
// Which plan comes back is the planner's judgement of cost, and that judgement moves
// with the statistics, with how many workers it may use and with every `enable_*`
// switch. What this reader answers must not: a derivation that moved with the plan
// would publish one contract against the empty database a schema is generated from
// and another against production. So the nodes that merely hand their child's select
// list on are stepped over rather than read (`PASS_THROUGH_NODE_TYPES`), and every
// reading that would have depended on the planner being generous is refused instead —
// deterministically, on a property of the query rather than of the day's plan.
// `scripts/view-constraints-invariance.ts` is the proof.
//
// This module is the reader of that answer and nothing else: it turns one plan into
// the sources of one requested column each, or a named refusal where the plan does
// not say. It never guesses.
//
// A column is a *proxy* of a base column when its value in every row is either that
// base column's value or NULL — the criterion this reader implements. A bare
// reference is one. So is a bare reference under a cast, but only the catalog can
// say whether that cast leaves the value alone, so the types the value passed
// through are recorded here (`coerced`, `via`) and judged in `derive.ts`. A `UNION`
// branch that contributes only a NULL literal contributes no value at all, and drops
// out.
//
// The plan also answers the second half of "the base column's value or NULL": which
// of the two halves is still open. A scan standing on the nulled side of an outer
// join hands out a row of NULLs where nothing matched, and a `UNION` branch spelling
// a NULL literal writes one directly; `GROUP BY ROLLUP` and its kin add a
// superaggregate row in which the grouping columns are NULL. Where none of that
// stands over a column, the plan leaves it exactly as its base column, and
// `derive.ts` may ask `pg_attribute.attnotnull` whether that is never NULL. The plan
// is asked only about its own shape: no expression in it is examined, so a column
// made non-null by `COALESCE`, by a strict function or by an `IS NOT NULL` predicate
// reads here as nullable like any other.

/** One plan node of `EXPLAIN (FORMAT JSON)`, as much of it as this reader uses. */
export interface ExplainPlanNode {
  "Node Type": string;
  Output?: string[];
  Plans?: ExplainPlanNode[];
  Schema?: string;
  "Relation Name"?: string;
  Alias?: string;
  /** `Inner`, `Left`, `Right`, `Full`, `Semi`, `Anti` on a join node. */
  "Join Type"?: string;
  /** Which input of its parent this node is: `Outer`, `Inner`, `InitPlan`, `SubPlan`. */
  "Parent Relationship"?: string;
  /** Present on an `Aggregate` computing `GROUPING SETS` / `ROLLUP` / `CUBE`. */
  "Grouping Sets"?: unknown;
}

/**
 * A view the reader may descend through, as the catalog describes it: the column
 * names in attribute order are the positions of its select list, which is the map the
 * plan does not print and this reader needs to cross the boundary.
 */
export interface ViewShape {
  schema: string;
  name: string;
  /** Column names in `attnum` order. */
  columns: string[];
}

/**
 * Why the plan as a whole could not be read. Closed on purpose: a view that derives
 * nothing says which of these it is, so that "nothing was derived" is never confused
 * with "nothing was looked at", and so that every one of them can carry a case in
 * `test/unit/view-constraints.lab.sql`.
 */
export const PLAN_REFUSALS = {
  "unreadable-set-operation":
    "a `Recursive Union`, `SetOp` or `HashSetOp`: its input is one tagged stream and " +
    "there is no branch to read a column off",
  "set-operation-not-a-select-list":
    "a set operation stands somewhere the reader does not read its branches — under a " +
    "node that computes, or beside a second set operation — and whatever projects over " +
    "it is spelled with the Vars of one branch out of several",
  "output-not-positional":
    "the node carrying the select list prints no `Output`, or one that does not line " +
    "up one-to-one with the view’s columns",
} as const;

export type PlanRefusal = keyof typeof PLAN_REFUSALS;

/**
 * Why one column of an otherwise readable plan has no source. Closed for the same
 * reason as `PLAN_REFUSALS`, and every one of them carries a lab case.
 */
export const COLUMN_REFUSALS = {
  "not-a-column-reference":
    "the entry is an expression, an aggregate, a constant, an operator, a subplan " +
    "reference, a whole-row reference or a second cast — not a reference to a column",
  "unqualified-name-without-a-sole-relation":
    "the entry names a column with no prefix while the plan does not read exactly one " +
    "relation, so which row source it belongs to is not said",
  "no-value-from-any-branch":
    "every reading of the column is a NULL literal, so no base column contributes a " +
    "value to it",
  "through-a-materialized-with":
    "the entry is spelled with a materialized `WITH` query’s own column name, and the " +
    "map from those names to the positions of its select list is not in the plan",
  "through-an-unpinned-subquery":
    "the entry is spelled with the alias of a `Subquery Scan` the catalog does not pin " +
    "to one view this relation is built on — a set operation’s own branch " +
    "(`*SELECT* 3`), an inline `FROM (SELECT …) x`, or a view the query gave an alias " +
    "of its own — or one whose child does not print that view’s select list entry for " +
    "entry",
  "through-a-row-source-the-catalog-does-not-name":
    "the entry is spelled with an alias that is not a relation scan — a function " +
    "scan, a `VALUES` list, or a scan the plan does not carry at all because a " +
    "constant-false qualifier removed it",
  "cast-not-value-preserving":
    "the value passed through a cast that builds a new datum or narrows it, so it is " +
    "no longer the base column’s value",
} as const;

export type ColumnRefusal = keyof typeof COLUMN_REFUSALS;

/** A view column value that is a bare reference to `schema.relation.column`. */
export interface ColumnOrigin {
  schema: string;
  relation: string;
  /**
   * The plan's name for the scan instance the value was read from. Two columns of
   * one composite key must share it.
   */
  alias: string;
  column: string;
  /**
   * The reference stood under a cast. Whether the cast leaves the value alone is a
   * question for `pg_cast` and the two column types, not for the plan text.
   */
  coerced: boolean;
  /**
   * The view columns the value passed through on its way up, innermost first. Each
   * is a step whose types `derive.ts` must find value-preserving: a barrier view that
   * truncates a column and a view over it that casts the truncation back to the base
   * type would otherwise read as the base column itself.
   */
  via: { schema: string; relation: string; column: string }[];
  /**
   * The scan this value was read from stands on the nulled side of an outer join, so
   * the plan itself can hand out a NULL here whatever the base column promises.
   */
  nullExtended: boolean;
}

/**
 * What one requested column is made of.
 *
 * `null` — the plan does not say. One entry — the column proxies that base column.
 * Several — a `UNION` whose branches proxy different base columns; the column is one
 * of them per row, so only a relation every one of them authorises is true of it.
 */
export type ColumnSources = ColumnOrigin[] | null;

// A node that unions tuple streams. The rows above it come from several branches
// while the `Output` above it is spelled with the Vars of one branch only, so a
// node that projects over an `Append` reads exactly like one over a single scan. The
// shape where every branch can be read is the `Append` itself: it prints no `Output`
// of its own, and each child prints the branch's own select list, in the set
// operation's column order. Anywhere a node that projects stands over it — and for
// any second such node — the spelling above it cannot be trusted and the plan is
// refused.
const TUPLE_UNIONING_NODE_TYPES = new Set(["Append", "Merge Append"]);

// Nodes that hand their child's select list on and say nothing of their own.
//
// Which of these stands over the plan is the planner's judgement of cost, not a
// property of the view: the same `UNION ALL` plans as `Append` at the root when the
// planner costs it serially and as `Gather` over a parallel `Append` when it does
// not, as `MergeAppend` or as `Sort` over `Append` depending on which it thinks
// cheaper, and the same `select id, code::text from t` plans as a bare scan or as a
// `Gather` over one. A reader that answered differently under each would publish a
// different contract against an empty CI database than against production, so it
// reads through them to the node that really carries the select list.
//
// Every node type here builds its target list as its child's, entry for entry —
// `make_sort`, `make_limit`, `make_material`, `make_memoize` and `make_lockrows`
// assign `lefttree->targetlist` outright, and `create_gather_plan` /
// `create_gather_merge_plan` demand the exact target list from the child. So stepping
// over one changes no position and drops no column, while two things that are only
// noise are left behind: over a union, an `Output` spelled in the vocabulary of one
// branch out of several, and over anything, the extra parentheses EXPLAIN puts round
// an expression it resolves through a node — `((t.code)::text)` at a `Gather` for the
// `(t.code)::text` the scan under it prints.
//
// `Unique` copies its child's target list the same way and is deliberately NOT here.
// De-duplication has two implementations — `Unique` over a `Sort`, and a hashed
// `Aggregate` grouping by every column — and the planner picks between them by cost.
// `Aggregate` computes and so can never be stepped over; accepting `Unique` would
// make a `SELECT DISTINCT` over a `UNION` readable under one of the two and refused
// under the other. Refusing both is the answer that does not move.
const PASS_THROUGH_NODE_TYPES = new Set([
  "Gather",
  "Gather Merge",
  "Sort",
  "Incremental Sort",
  "Limit",
  "Materialize",
  "Memoize",
  "LockRows",
]);

const SUBQUERY_SCAN = "Subquery Scan";
const CTE_SCAN = "CTE Scan";

// The children of a node that are its input, as opposed to an `InitPlan` or a
// `SubPlan` computed beside it.
function inputChildren(node: ExplainPlanNode): ExplainPlanNode[] {
  return (node.Plans ?? []).filter((child) => {
    const relationship = child["Parent Relationship"] ?? "Outer";
    return relationship !== "InitPlan" && relationship !== "SubPlan";
  });
}

/**
 * The node of this plan that really carries the view's select list: the root, or
 * whatever stands under the pass-through nodes above it.
 */
function selectListNodeOf(root: ExplainPlanNode): ExplainPlanNode {
  let node = root;
  for (let step = 0; step < 16; step++) {
    if (!PASS_THROUGH_NODE_TYPES.has(node["Node Type"])) return node;
    const children = inputChildren(node);
    const only = children.length === 1 ? children[0] : undefined;
    if (!only) return node;
    node = only;
  }
  return node;
}

// Set operations other than a plain union read their input as one tagged stream and
// are refused wherever they appear: there is no branch to read a column off.
const UNREADABLE_SET_NODE_TYPES = new Set([
  "Recursive Union",
  "SetOp",
  "HashSetOp",
]);

// A node that can emit more rows than its input: a set-returning function in the
// select list. It does not make a column reference untrue, but it does break the
// one-view-row-per-base-row count a key claim needs.
const ROW_MULTIPLYING_NODE_TYPES = new Set(["ProjectSet"]);

// Which input of a join the join itself can null. `Left` keeps every row of its outer
// input and writes NULLs into the inner one where nothing matched; `Right` is the
// mirror; `Full` does both. Getting this backwards would declare a column NOT NULL on
// exactly the side the emptiness arrives from, so it is read off the plan's own
// `Join Type` and `Parent Relationship` rather than off the view's text — which is
// also what keeps the good case: the planner folds an outer join into an inner one
// when a strict qualifier makes the null-extended rows impossible, and then the plan
// says `Inner` and the column is non-null however the view spelled it.
//
// `Semi` and `Anti` emit no column of their inner input at all; that input is listed
// here so that an entry appearing in one all the same is read as nullable rather than
// trusted. A join type this map does not know nulls both sides.
const JOIN_TYPE_NULLED_SIDES = new Map<string, ReadonlySet<string>>([
  ["Inner", new Set()],
  ["Left", new Set(["Inner"])],
  ["Right", new Set(["Outer"])],
  ["Full", new Set(["Outer", "Inner"])],
  ["Semi", new Set(["Inner"])],
  ["Anti", new Set(["Inner"])],
]);
const BOTH_JOIN_SIDES: ReadonlySet<string> = new Set(["Outer", "Inner"]);

// The two `Parent Relationship` values that make a child an input of the join above
// it. A child that is an `InitPlan` or a `SubPlan` is computed beside the join, not
// joined by it, and no outer join nulls it.
const JOIN_INPUT_RELATIONSHIPS: ReadonlySet<string> = new Set([
  "Outer",
  "Inner",
]);

/**
 * Every scan instance, by alias, that stands on the nulled side of an outer join
 * somewhere between itself and the root of the plan.
 *
 * An alias reached on a nulled path anywhere is nulled everywhere it is read: two
 * scan instances the plan gave one name are not told apart here, and the side that
 * loses is the claim of non-nullness.
 */
function nullExtendedAliases(root: ExplainPlanNode): Set<string> {
  const nulled = new Set<string>();
  const visit = (node: ExplainPlanNode, underNull: boolean): void => {
    if (node.Alias !== undefined && underNull) nulled.add(node.Alias);
    const joinType = node["Join Type"];
    const nulledSides =
      joinType === undefined
        ? undefined
        : (JOIN_TYPE_NULLED_SIDES.get(joinType) ?? BOTH_JOIN_SIDES);
    for (const child of node.Plans ?? []) {
      const relationship = child["Parent Relationship"] ?? "";
      const nulledHere =
        nulledSides !== undefined &&
        JOIN_INPUT_RELATIONSHIPS.has(relationship) &&
        nulledSides.has(relationship);
      visit(child, underNull || nulledHere);
    }
  };
  visit(root, false);
  return nulled;
}

// `quote_identifier` spelling: either a bare lower-case identifier, or a
// double-quoted one in which an embedded quote is doubled.
const IDENTIFIER = String.raw`(?:[a-z_][a-z0-9_$]*|"(?:[^"]|"")*")`;
const QUALIFIED_REFERENCE = new RegExp(`^(${IDENTIFIER})\\.(${IDENTIFIER})$`);
// `(alias.column)::type` — the deparser always parenthesises the cast's argument.
const COERCED_REFERENCE = new RegExp(
  `^\\((${IDENTIFIER})\\.(${IDENTIFIER})\\)::.+$`,
);
// A query with one range table entry has nothing to disambiguate, so `EXPLAIN`
// prints its columns unqualified. That is the ordinary shape of a materialized
// view's defining query, and of nothing else this reader meets.
const UNQUALIFIED_REFERENCE = new RegExp(`^(${IDENTIFIER})$`);
const UNQUALIFIED_COERCED_REFERENCE = new RegExp(`^\\((${IDENTIFIER})\\)::.+$`);
// A branch of a `UNION` that contributes no value: the column is NULL in its rows.
const NULL_LITERAL = /^NULL(?:::.+)?$/;

function unquote(identifier: string): string {
  if (!identifier.startsWith('"')) return identifier;
  return identifier.slice(1, -1).replaceAll('""', '"');
}

/**
 * Parses one `Output` entry that must be a reference to a column, optionally under
 * one cast. Anything else — an operator, a function call, a constant, a nested cast,
 * a subplan reference, a whole-row `alias.*` — is not a column reference and yields
 * `null`.
 */
export function parseReference(
  entry: string,
): { alias: string | null; column: string; coerced: boolean } | null {
  const bare = QUALIFIED_REFERENCE.exec(entry);
  if (bare?.[1] !== undefined && bare[2] !== undefined) {
    return {
      alias: unquote(bare[1]),
      column: unquote(bare[2]),
      coerced: false,
    };
  }
  const coerced = COERCED_REFERENCE.exec(entry);
  if (coerced?.[1] !== undefined && coerced[2] !== undefined) {
    return {
      alias: unquote(coerced[1]),
      column: unquote(coerced[2]),
      coerced: true,
    };
  }
  const unqualified = UNQUALIFIED_REFERENCE.exec(entry);
  if (unqualified?.[1] !== undefined) {
    return { alias: null, column: unquote(unqualified[1]), coerced: false };
  }
  const unqualifiedCoerced = UNQUALIFIED_COERCED_REFERENCE.exec(entry);
  if (unqualifiedCoerced?.[1] !== undefined) {
    return {
      alias: null,
      column: unquote(unqualifiedCoerced[1]),
      coerced: true,
    };
  }
  return null;
}

function walk(
  node: ExplainPlanNode,
  visit: (node: ExplainPlanNode) => void,
): void {
  visit(node);
  for (const child of node.Plans ?? []) walk(child, visit);
}

function countNodes(
  root: ExplainPlanNode,
  predicate: (node: ExplainPlanNode) => boolean,
): number {
  let count = 0;
  walk(root, (node) => {
    if (predicate(node)) count += 1;
  });
  return count;
}

function collectNodes(
  root: ExplainPlanNode,
  predicate: (node: ExplainPlanNode) => boolean,
): ExplainPlanNode[] {
  const found: ExplainPlanNode[] = [];
  walk(root, (node) => {
    if (predicate(node)) found.push(node);
  });
  return found;
}

/**
 * Every relation scan in the plan, by the alias its `Output` entries are spelled
 * with. An alias bound to two different relations is dropped rather than guessed;
 * PostgreSQL renames colliding range-table entries before printing, so this is
 * insurance, not a code path we expect to take.
 */
export function scanAliases(
  root: ExplainPlanNode,
): Map<string, { schema: string; relation: string }> {
  const found = new Map<string, { schema: string; relation: string }>();
  const ambiguous = new Set<string>();
  walk(root, (node) => {
    const alias = node.Alias;
    const schema = node.Schema;
    const relation = node["Relation Name"];
    if (alias === undefined || schema === undefined || relation === undefined)
      return;
    const existing = found.get(alias);
    if (
      existing &&
      (existing.schema !== schema || existing.relation !== relation)
    ) {
      ambiguous.add(alias);
      return;
    }
    found.set(alias, { schema, relation });
  });
  for (const alias of ambiguous) found.delete(alias);
  return found;
}

/** Every alias-bearing node, by alias, so an alias that is not a relation still has a kind. */
function aliasNodeTypes(root: ExplainPlanNode): Map<string, string> {
  const kinds = new Map<string, string>();
  walk(root, (node) => {
    if (node.Alias !== undefined && !kinds.has(node.Alias))
      kinds.set(node.Alias, node["Node Type"]);
  });
  return kinds;
}

/**
 * A `Subquery Scan` this reader may descend through, and the node under it that
 * carries the crossed view's select list.
 *
 * PostgreSQL leaves a `Subquery Scan` where it could not flatten a view into the
 * query above it — which is every security-barrier view whose columns the query above
 * narrows, and therefore the shape of every layered surface projection in this
 * repository. The node prints its alias and spells its `Output` with the inner view's
 * own column names, and nothing else: no schema, no relation name, and no map from
 * those names to positions. The catalog holds that map, because a view's columns in
 * `attnum` order *are* the positions of its select list, and the plan can be checked
 * against it — the child of such a node prints the inner view's select list entry for
 * entry, the columns nobody above asked for replaced by NULL constants but never
 * dropped, so the entry count must equal the view's column count or this is not that
 * view.
 */
interface CrossableSubquery {
  view: ViewShape;
  /** The node under the `Subquery Scan` that carries the inner view's select list. */
  selectList: ExplainPlanNode;
  /** When that node is a union, its branches; each prints the whole select list. */
  branches: ExplainPlanNode[] | null;
}

/**
 * Whether everything this `Subquery Scan` says about itself agrees with the view it
 * would be pinned to. The plan offers the alias and nothing else, so the alias is
 * matched by name — and a name is only evidence while nothing contradicts it. Every
 * entry of the node's own `Output` that is a plain reference to its own alias must
 * name a column the view has; one that does not means the node is some other
 * subquery that happens to be called this, and the node is left uncrossed.
 */
function namesOnlyColumnsOf(
  node: ExplainPlanNode,
  alias: string,
  view: ViewShape,
): boolean {
  for (const entry of node.Output ?? []) {
    const reference = parseReference(entry);
    if (!reference || reference.alias !== alias) continue;
    if (!view.columns.includes(reference.column)) return false;
  }
  return true;
}

function crossableSubqueries(
  root: ExplainPlanNode,
  candidates: ReadonlyMap<string, ViewShape>,
): Map<string, CrossableSubquery> {
  const crossable = new Map<string, CrossableSubquery>();
  for (const node of collectNodes(
    root,
    (candidate) => candidate["Node Type"] === SUBQUERY_SCAN,
  )) {
    const alias = node.Alias;
    if (alias === undefined) continue;
    const view = candidates.get(alias);
    if (!view) continue;
    const children = inputChildren(node);
    const only = children.length === 1 ? children[0] : undefined;
    if (!only) continue;
    const selectList = selectListNodeOf(only);
    if (TUPLE_UNIONING_NODE_TYPES.has(selectList["Node Type"])) {
      const branches = inputChildren(selectList);
      if (branches.length === 0) continue;
      if (
        !branches.every(
          (branch) => branch.Output?.length === view.columns.length,
        )
      )
        continue;
      if (!namesOnlyColumnsOf(node, alias, view)) continue;
      crossable.set(alias, { view, selectList, branches });
      continue;
    }
    if (selectList.Output?.length !== view.columns.length) continue;
    if (!namesOnlyColumnsOf(node, alias, view)) continue;
    crossable.set(alias, { view, selectList, branches: null });
  }
  return crossable;
}

/**
 * One reading of one column: the base columns behind it, whether a NULL of the plan's
 * own reaches it, and — where there are no base columns — which refusal that is.
 */
interface Reading {
  /** `null` where the plan does not say; empty where no branch contributes a value. */
  origins: ColumnOrigin[] | null;
  /** The plan writes a NULL of its own into this column. */
  nullValue: boolean;
  reason: ColumnRefusal | null;
}

function unknown(reason: ColumnRefusal): Reading {
  return { origins: null, nullValue: true, reason };
}

/**
 * Merges the readings of one column across the branches of a union.
 *
 * A branch contributing a NULL literal contributes no value and drops out; a branch
 * the reader could not read leaves the whole column unknown, because a relation
 * derived from the branches that were read would be a claim about rows that came
 * from the one that was not.
 */
function mergeReadings(readings: Reading[]): Reading {
  const origins: (ColumnOrigin & { aliases: Set<string> })[] = [];
  let nullValue = false;
  for (const reading of readings) {
    if (reading.origins === null) {
      // A branch the reader could not read leaves the whole column unknown, and the
      // column carries that branch's own refusal: a source taken from the branches
      // that were read would be a claim about the rows of the one that was not.
      return {
        origins: null,
        nullValue: true,
        reason: reading.reason ?? "not-a-column-reference",
      };
    }
    nullValue = nullValue || reading.nullValue;
    for (const origin of reading.origins) {
      const same = origins.find(
        (seen) =>
          seen.schema === origin.schema &&
          seen.relation === origin.relation &&
          seen.column === origin.column,
      );
      if (same) {
        // One base column reached through two branches: still one column, but the two
        // branches are two row streams, so the instance is the pair of them.
        same.aliases.add(origin.alias);
        same.coerced = same.coerced || origin.coerced;
        same.nullExtended = same.nullExtended || origin.nullExtended;
        continue;
      }
      origins.push({ ...origin, aliases: new Set([origin.alias]) });
    }
  }
  // The order the branches arrive in is the planner's: a parallel `Append` lists its
  // children by the cost of running them, an ordinary one in the set operation's own
  // order. Neither is a fact about the view, so what is kept is sorted rather than
  // taken as it came, and the same goes for the names of the streams a column was
  // assembled from.
  const sorted = origins
    .map(({ aliases, ...origin }) => ({
      ...origin,
      alias: [...aliases].sort().join("∨"),
    }))
    .sort((left, right) =>
      `${left.schema}.${left.relation}.${left.column}`.localeCompare(
        `${right.schema}.${right.relation}.${right.column}`,
      ),
    );
  return { origins: sorted, nullValue, reason: null };
}

/**
 * Why a materialized `WITH` query is a wall rather than a boundary to cross, where a
 * view is a boundary.
 *
 * A `WITH` query referenced once is inlined and leaves no boundary at all; referenced
 * twice it is materialized, and then the reader above it says `live_routes.currency_id`
 * — the name of the `WITH` query's own column, not of any relation. Crossing that
 * needs the map from the `WITH` query's column names to the positions of its select
 * list, and nothing holds that map: the `CTE <name>` subplan node prints the select
 * list in order but never its names; a `CTE Scan` prints names but in the order its
 * own parent asked for, and which columns it prints at all is decided by what the
 * nodes above it happen to need — `live.id, live.cur_code, live.amount` under one
 * join method and `live.id, live.cur_code` under another, for the same view on the
 * same schema. Recovering the map from a scan that happens to print the whole list is
 * an answer that exists on the days the planner is generous, and a reader whose
 * answer depends on that is the reader this plugin exists to replace.
 *
 * A view is the case where that map does exist and is not in the plan at all: the
 * catalog holds it, in `attnum` order, and it is a fact about the schema rather than
 * about the day's plan. So a `Subquery Scan` the catalog pins to one view this
 * relation is built on is descended through, and a `CTE Scan` is not.
 */
class OriginReader {
  private readonly relations: Map<string, { schema: string; relation: string }>;
  /**
   * The one relation an unqualified column name can belong to, when there is one.
   * `EXPLAIN` prints a prefix only where the plan's flattened range table has more
   * than one entry, so an unqualified name is the planner saying there is nothing
   * else it could be — and the plan's single row source says which relation that is.
   */
  private readonly soleRelation: {
    alias: string;
    schema: string;
    relation: string;
  } | null;
  /** Scan instances an outer join above them can null. */
  private readonly nulled: ReadonlySet<string>;
  private readonly crossable: ReadonlyMap<string, CrossableSubquery>;
  private readonly aliasKinds: ReadonlyMap<string, string>;

  constructor(
    root: ExplainPlanNode,
    candidates: ReadonlyMap<string, ViewShape>,
  ) {
    this.relations = scanAliases(root);
    this.nulled = nullExtendedAliases(root);
    this.crossable = crossableSubqueries(root, candidates);
    this.aliasKinds = aliasNodeTypes(root);
    const [sole] = [...this.relations];
    const aliasNodes = countNodes(root, (node) => node.Alias !== undefined);
    this.soleRelation =
      aliasNodes === 1 && this.relations.size === 1 && sole
        ? { alias: sole[0], ...sole[1] }
        : null;
  }

  /** `Subquery Scan` nodes this reader descends through, by alias. */
  get crossed(): ReadonlyMap<string, CrossableSubquery> {
    return this.crossable;
  }

  /**
   * The base columns one `Output` entry reads. `crossing` holds the aliases of the
   * `Subquery Scan` nodes already descended through on the way here: a plan's
   * range-table names are unique, so an alias that came round twice would be a
   * cycle, which PostgreSQL does not allow between views and this reader does not
   * follow.
   */
  read(entry: string, crossing: ReadonlySet<string> = new Set()): Reading {
    if (NULL_LITERAL.test(entry))
      return { origins: [], nullValue: true, reason: null };
    const reference = parseReference(entry);
    if (!reference) return unknown("not-a-column-reference");
    if (reference.alias === null) {
      const sole = this.soleRelation;
      if (!sole) return unknown("unqualified-name-without-a-sole-relation");
      return this.origin(sole.schema, sole.relation, sole.alias, reference);
    }
    const relation = this.relations.get(reference.alias);
    if (relation) {
      return this.origin(
        relation.schema,
        relation.relation,
        reference.alias,
        reference,
      );
    }
    const crossable = this.crossable.get(reference.alias);
    if (crossable) {
      if (crossing.has(reference.alias))
        return unknown("through-an-unpinned-subquery");
      return this.cross(
        crossable,
        reference,
        new Set([...crossing, reference.alias]),
      );
    }
    const kind = this.aliasKinds.get(reference.alias);
    if (kind === CTE_SCAN) return unknown("through-a-materialized-with");
    if (kind === SUBQUERY_SCAN) return unknown("through-an-unpinned-subquery");
    return unknown("through-a-row-source-the-catalog-does-not-name");
  }

  private origin(
    schema: string,
    relation: string,
    alias: string,
    reference: { column: string; coerced: boolean },
  ): Reading {
    return {
      origins: [
        {
          schema,
          relation,
          alias,
          column: reference.column,
          coerced: reference.coerced,
          via: [],
          nullExtended: this.nulled.has(alias),
        },
      ],
      nullValue: false,
      reason: null,
    };
  }

  /**
   * Reads one column of a crossed view: the catalog says which position of its select
   * list the name stands at, and the node under the `Subquery Scan` prints that
   * select list. The crossed view's own column is recorded as a waypoint, because the
   * value is that column's value and the step out of it is a step between two types
   * `derive.ts` still has to find value-preserving.
   */
  private cross(
    crossable: CrossableSubquery,
    reference: { column: string; coerced: boolean },
    crossing: ReadonlySet<string>,
  ): Reading {
    const position = crossable.view.columns.indexOf(reference.column);
    // Every parseable reference of this node's `Output` was checked against the view's
    // columns before the node was called crossable, so a name that is not one of them
    // cannot arrive here.
    if (position < 0) return unknown("through-an-unpinned-subquery");
    const inner = crossable.branches
      ? mergeReadings(
          crossable.branches.map((branch) =>
            this.read(branch.Output?.[position] ?? "", crossing),
          ),
        )
      : this.read(crossable.selectList.Output?.[position] ?? "", crossing);
    if (inner.origins === null) return inner;
    if (inner.origins.length === 0) return inner;
    const waypoint = {
      schema: crossable.view.schema,
      relation: crossable.view.name,
      column: reference.column,
    };
    return {
      origins: inner.origins.map((origin) => ({
        ...origin,
        coerced: origin.coerced || reference.coerced,
        via: [...origin.via, waypoint],
      })),
      nullValue: inner.nullValue,
      reason: null,
    };
  }
}

export interface PlanOrigins {
  /** One entry per requested column, in the requested order. */
  columns: ColumnSources[];
  /** One entry per requested column: why it has no sources, `null` where it has. */
  refusals: (ColumnRefusal | null)[];
  /**
   * One entry per requested column: the plan puts a NULL into this column of its own
   * accord — an outer join nulling the side it is read from, a `UNION` branch
   * spelling a NULL literal, the superaggregate row of a `GROUPING SETS` — so what
   * the base column promises about its own values does not reach the view.
   */
  nullIntroduced: boolean[];
  /**
   * True when the plan reads exactly one relation, cannot emit more rows than that
   * relation has, and cannot null-extend its columns. Only then does a column
   * proxying a key of that relation still identify a row of the view.
   */
  identityPreserving: boolean;
}

function hasJoinOtherThanInner(root: ExplainPlanNode): boolean {
  return (
    countNodes(root, (node) => {
      const joinType = node["Join Type"];
      return joinType !== undefined && joinType !== "Inner";
    }) > 0
  );
}

/**
 * Reads the sources of each requested column off one plan.
 *
 * `candidates` are the views this relation is built on, by the name a `Subquery Scan`
 * over one of them would carry — the only boundaries this reader may descend through.
 *
 * Returns a `PlanRefusal` — no column of this view gets a source — where the plan
 * cannot be read positionally at all.
 */
export function readPlanOrigins(
  root: ExplainPlanNode,
  requestedColumnCount: number,
  candidates: ReadonlyMap<string, ViewShape> = new Map(),
): PlanOrigins | PlanRefusal {
  if (
    countNodes(root, (node) =>
      UNREADABLE_SET_NODE_TYPES.has(node["Node Type"]),
    ) > 0
  ) {
    return "unreadable-set-operation";
  }
  // `GROUP BY ROLLUP`, `CUBE` and `GROUPING SETS` emit a superaggregate row in which
  // the grouping columns are NULL and which stands for no base row at all. The values
  // in the ordinary rows are still the base column's, so the origins hold; what does
  // not hold is that every row of the view answers to a row of the base relation —
  // so neither a non-null column nor a row identity survives it.
  const groupingSets =
    countNodes(root, (node) => node["Grouping Sets"] !== undefined) > 0;
  const reader = new OriginReader(root, candidates);
  const selectListNode = selectListNodeOf(root);

  // A union is readable only where this reader reads its branches one by one: at the
  // select list of the plan, or at the select list of a view it descends into. A
  // union anywhere else has a node that projects over it, and that node's `Output` is
  // spelled with the Vars of one branch out of several — which reads exactly like a
  // projection over a single scan. A second union is refused for the same reason.
  const unions = collectNodes(root, (node) =>
    TUPLE_UNIONING_NODE_TYPES.has(node["Node Type"]),
  );
  const readableUnions = new Set<ExplainPlanNode>(
    [...reader.crossed.values()]
      .filter((crossable) => crossable.branches !== null)
      .map((crossable) => crossable.selectList),
  );
  if (TUPLE_UNIONING_NODE_TYPES.has(selectListNode["Node Type"]))
    readableUnions.add(selectListNode);
  if (unions.some((union) => !readableUnions.has(union)))
    return "set-operation-not-a-select-list";

  // A `Subquery Scan` this reader descends through is not a row source of its own: it
  // emits the rows of its child, filtered at most. Every other alias-bearing node is
  // one, and a key of a base relation survives only where there is exactly one.
  const rowSources =
    countNodes(root, (node) => node.Alias !== undefined) -
    countNodes(
      root,
      (node) =>
        node["Node Type"] === SUBQUERY_SCAN &&
        node.Alias !== undefined &&
        reader.crossed.has(node.Alias),
    );
  const identityPreserving =
    rowSources === 1 &&
    countNodes(root, (node) => node["Relation Name"] !== undefined) === 1 &&
    countNodes(root, (node) =>
      ROW_MULTIPLYING_NODE_TYPES.has(node["Node Type"]),
    ) === 0 &&
    !hasJoinOtherThanInner(root) &&
    !groupingSets &&
    unions.length === 0;

  const readings: Reading[] = [];
  if (TUPLE_UNIONING_NODE_TYPES.has(selectListNode["Node Type"])) {
    const branches = inputChildren(selectListNode);
    if (branches.length === 0) return "output-not-positional";
    // Each branch prints its own select list, in the set operation's column order. A
    // shorter or longer one is not that list, and nothing may be read off it
    // positionally.
    if (
      branches.some((branch) => branch.Output?.length !== requestedColumnCount)
    ) {
      return "output-not-positional";
    }
    for (let index = 0; index < requestedColumnCount; index++) {
      readings.push(
        mergeReadings(
          branches.map((branch) => reader.read(branch.Output?.[index] ?? "")),
        ),
      );
    }
  } else {
    const output = selectListNode.Output;
    if (!output || output.length !== requestedColumnCount)
      return "output-not-positional";
    for (const entry of output) readings.push(reader.read(entry));
  }

  return {
    columns: readings.map((reading) =>
      reading.origins && reading.origins.length > 0 ? reading.origins : null,
    ),
    refusals: readings.map((reading) =>
      reading.origins === null
        ? (reading.reason ?? "not-a-column-reference")
        : reading.origins.length === 0
          ? "no-value-from-any-branch"
          : null,
    ),
    nullIntroduced: readings.map(
      (reading) =>
        groupingSets ||
        reading.origins === null ||
        reading.origins.length === 0 ||
        reading.nullValue ||
        reading.origins.some((origin) => origin.nullExtended),
    ),
    identityPreserving,
  };
}
