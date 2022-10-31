import { jsonParse } from "@dataplan/json";
import { createHash } from "crypto";
import type {
  __InputStaticLeafStep,
  ConnectionCapableStep,
  ConnectionStep,
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
  InputStep,
  PolymorphicStep,
} from "grafast";
import {
  __ItemStep,
  $$data,
  access,
  constant,
  ExecutableStep,
  isPromiseLike,
  lambda,
  list,
  polymorphicWrap,
  reverseArray,
} from "grafast";
import type { GraphQLObjectType } from "graphql";
import type { SQL, SQLRawValue } from "pg-sql2";
import { sql } from "pg-sql2";

import { TYPES } from "../codecs.js";
import type { PgSource, PgSourceUnique } from "../datasource.js";
import type { PgExecutor } from "../executor.js";
import type { PgTypeCodec, PgTypedExecutableStep } from "../interfaces.js";
import type { PgPageInfoStep } from "./pgPageInfo.js";
import { pgPageInfo } from "./pgPageInfo.js";
import type { PgSelectParsedCursorStep } from "./pgSelect.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";

const castAlias = sql.identifier(Symbol("union"));

// In future we'll allow mapping columns to different attributes/types
const sourceSpecificExpressionFromAttributeName = (
  sourceSpec: PgUnionAllSourceSpec,
  name: string,
): SQL => {
  return sql.identifier(name);
};

const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([]);

const hash = (text: string): string =>
  createHash("sha256").update(text).digest("hex").slice(0, 63);

function parseCursor(cursor: string | null) {
  if (cursor == null) {
    // This throw should never happen, so we can still be isSyncAndSafe.
    // If it does throw, the entire lambda will throw, which is allowed.
    throw new Error(
      "GraphileInternalError<3b076b86-828b-46b3-885d-ed2577068b8d>: cursor is null, but we have a constraint preventing that...",
    );
  }
  try {
    if (typeof cursor !== "string") {
      throw new Error("Invalid cursor");
    }
    const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    if (!Array.isArray(decoded)) {
      throw new Error("Expected array");
    }
    return decoded;
  } catch (e) {
    throw new Error(
      "Invalid cursor, please enter a cursor from a previous request, or null.",
    );
  }
}
parseCursor.isSyncAndSafe = true; // Optimization

function add([a, b]: [a: number, b: number]): number {
  return a + b;
}
add.isSyncAndSafe = true;

type PgUnionAllStepSelect<TAttributes extends string> =
  | { type: "pk" }
  | { type: "type" }
  | {
      type: "attribute";
      attribute: TAttributes;
      codec: PgTypeCodec<any, any, any, any>;
    }
  | {
      type: "expression";
      expression: SQL;
      codec: PgTypeCodec<any, any, any, any>;
    };

interface PgUnionAllSourceSpec {
  source: PgSource<any, ReadonlyArray<PgSourceUnique<any>>, any, any>;
}

interface PgUnionAllStepConfig<TAttributes extends string> {
  executor: PgExecutor;
  attributes: {
    [attributeName in TAttributes]: {
      codec: PgTypeCodec<any, any, any>;
    };
  };
  sources: {
    [sourceName: string]: PgUnionAllSourceSpec;
  };
}

interface PgUnionAllStepCondition<TAttributes extends string> {
  attribute: TAttributes;
  callback: (fragment: SQL) => SQL;
}

interface PgUnionAllStepOrder<TAttributes extends string> {
  attribute: TAttributes;
  direction: "ASC" | "DESC";
}

interface QueryValue {
  dependencyIndex: number;
  codec: PgTypeCodec<any, any, any>;
}

/**
 * Sometimes we want to refer to something that might change later - e.g. we
 * might have SQL that specifies a list of explicit values, or it might later
 * want to be replaced with a reference to an existing table value (e.g. when a
 * query is being inlined). PgSelectPlaceholder allows for this kind of
 * flexibility. It's really important to keep in mind that the same placeholder
 * might be used in multiple different SQL queries, and in the different
 * queries it might end up with different values - this is particularly
 * relevant when using `@stream`/`@defer`, for example.
 */
type PgUnionAllPlaceholder = {
  dependencyIndex: number;
  codec: PgTypeCodec<any, any, any, any>;
  symbol: symbol;
};

class PgUnionAllSingleStep extends ExecutableStep implements PolymorphicStep {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgUnionAllSingleStep",
  };
  public isSyncAndSafe = true;
  private typeKey: number;
  private pkKey: number;
  private readonly spec: PgUnionAllStepConfig<string>;
  constructor($parent: PgUnionAllStep<any>, $item: ExecutableStep<any>) {
    super();
    this.addDependency($item);
    this.spec = $parent.spec;
    this.typeKey = $parent.selectType();
    this.pkKey = $parent.selectPk();
  }

  planForType(objectType: GraphQLObjectType<any, any>): ExecutableStep<any> {
    const sourceSpec = this.spec.sources[objectType.name];
    if (!sourceSpec) {
      // This type isn't handled; so it should never occur
      return constant(null);
    }
    const pk = sourceSpec.source.uniques?.find((u) => u.isPrimary === true);
    if (!pk) {
      throw new Error(
        `No PK found for ${objectType.name}; this should have been caught earlier?!`,
      );
    }
    const spec = {};
    const $parsed = jsonParse(access(this, [$$data, this.pkKey]));
    for (let i = 0, l = pk.columns.length; i < l; i++) {
      const col = pk.columns[i];
      spec[col] = access($parsed, [i]);
    }
    return sourceSpec.source.get(spec);
  }

  execute(values: [GrafastValuesList<any>]): GrafastResultsList<any> {
    return values[0].map((v) => {
      const type = v[this.typeKey];
      return polymorphicWrap(type, v);
    });
  }
}

interface SourceDetails {
  symbol: symbol;
  alias: SQL;
  conditions: SQL[];
  orders: SQL[];
  sqlSource: SQL;
}

/**
 * Represents a `UNION ALL` statement, which can have multiple table-like
 * sources, but must return a consistent data shape.
 */
export class PgUnionAllStep<TAttributes extends string>
  extends ExecutableStep
  implements
    ConnectionCapableStep<
      PgSelectSingleStep<any, any, any, any>,
      PgSelectParsedCursorStep
    >
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgUnionAllStep",
  };

  public isSyncAndSafe = false;

  private selects: PgUnionAllStepSelect<TAttributes>[];

  private executor!: PgExecutor;
  private contextId!: number;

  private detailsBySource: Map<string, SourceDetails>;

  /** @internal */
  public readonly spec: PgUnionAllStepConfig<TAttributes>;

  private outerOrderExpressions: SQL[];

  /**
   * Since this is effectively like a DataLoader it processes the data for many
   * different resolvers at once. This list of (hopefully scalar) plans is used
   * to represent queryValues the query will need such as identifiers for which
   * records in the result set should be returned to which GraphQL resolvers,
   * parameters for conditions or orders, etc.
   */
  private queryValues: Array<QueryValue>;

  /**
   * If this plan has queryValues, we must feed the queryValues into the placeholders to
   * feed into the SQL statement after compiling the query; we'll use this
   * symbol as the placeholder to replace.
   */
  private queryValuesSymbol: symbol;

  /**
   * Values used in this plan.
   */
  private placeholders: Array<PgUnionAllPlaceholder>;
  private placeholderValues: Map<symbol, SQL>;

  // LIMIT

  private first: number | null = null;
  private last: number | null = null;
  private fetchOneExtra = false;
  /** When using natural pagination, this index is the lower bound (and should be excluded) */
  private lowerIndexStepId: number | null = null;
  /** When using natural pagination, this index is the upper bound (and should be excluded) */
  private upperIndexStepId: number | null = null;
  /** When we calculate the limit/offset, we may be able to determine there cannot be a next page */
  private limitAndOffsetId: number | null = null;

  // OFFSET

  private offset: number | null = null;

  // CURSORS

  private beforeStepId: number | null = null;
  private afterStepId: number | null = null;

  /**
   * When finalized, we build the SQL query, queryValues, and note where to feed in
   * the relevant queryValues. This saves repeating this work at execution time.
   */
  private finalizeResults: {
    // The SQL query text
    text: string;

    // The values to feed into the query
    rawSqlValues: SQLRawValue[];

    // The `DECLARE ... CURSOR` query for @stream
    textForDeclare?: string;

    // The values to feed into the `DECLARE ... CURSOR` query
    rawSqlValuesForDeclare?: SQLRawValue[];

    // If streaming, what's the initialCount
    streamInitialCount?: number;

    // The column on the result that indicates which group the result belongs to
    identifierIndex: number | null;

    // If last but not first, reverse order.
    shouldReverseOrder: boolean;

    // For prepared queries
    name?: string;
  } | null = null;

  private limitAndOffsetSQL: SQL | null = null;
  private innerLimitSQL: SQL | null = null;

  constructor(cloneFrom: PgUnionAllStep<TAttributes>);
  constructor(spec: PgUnionAllStepConfig<TAttributes>);
  constructor(
    specOrCloneFrom:
      | PgUnionAllStepConfig<TAttributes>
      | PgUnionAllStep<TAttributes>,
  ) {
    super();
    if (specOrCloneFrom instanceof PgUnionAllStep) {
      const cloneFrom = specOrCloneFrom;
      this.spec = cloneFrom.spec;

      this.selects = [...cloneFrom.selects];
      this.placeholders = [...cloneFrom.placeholders];
      this.queryValues = [...cloneFrom.queryValues];
      this.placeholderValues = new Map(cloneFrom.placeholderValues);
      this.queryValuesSymbol = cloneFrom.queryValuesSymbol;
      this.outerOrderExpressions = [...cloneFrom.outerOrderExpressions];

      this.detailsBySource = new Map(cloneFrom.detailsBySource);
    } else {
      const spec = specOrCloneFrom;
      this.spec = spec;

      this.selects = [];
      this.placeholders = [];
      this.queryValues = [];
      this.placeholderValues = new Map();
      this.queryValuesSymbol = Symbol("union_identifier_values");
      this.outerOrderExpressions = [];

      let first = true;
      this.detailsBySource = new Map();
      for (const [identifier, sourceSpec] of Object.entries(spec.sources)) {
        if (first) {
          first = false;
          this.executor = sourceSpec.source.executor;
          this.contextId = this.addDependency(this.executor.context());
        } else {
          if (this.executor !== sourceSpec.source.executor) {
            throw new Error(
              `${this}: all sources must currently come from same executor`,
            );
          }
        }
        const sqlSource = sql.isSQL(sourceSpec.source.source)
          ? sourceSpec.source.source
          : null; // sourceSpec.source.source(/* TODO: ADD PARAMETERS! */);
        if (!sqlSource) {
          throw new Error(`${this}: parameterized sources not yet supported`);
        }
        const symbol = Symbol(identifier);
        const alias = sql.identifier(symbol);
        this.detailsBySource.set(identifier, {
          symbol,
          alias,
          conditions: [],
          orders: [],
          sqlSource,
        });
      }
    }
  }

  connectionClone(): PgUnionAllStep<TAttributes> {
    return new PgUnionAllStep(this);
  }

  select<TAttribute extends TAttributes>(key: TAttribute): number {
    if (!Object.prototype.hasOwnProperty.call(this.spec.attributes, key)) {
      throw new Error(`Attribute '${key}' unknown`);
    }
    const existingIndex = this.selects.findIndex(
      (s) => s.type === "attribute" && s.attribute === key,
    );
    if (existingIndex >= 0) {
      return existingIndex;
    }
    const index =
      this.selects.push({
        type: "attribute",
        attribute: key,
        codec: this.spec.attributes[key].codec,
      }) - 1;
    return index;
  }

  selectPk(): number {
    const existingIndex = this.selects.findIndex((s) => s.type === "pk");
    if (existingIndex >= 0) {
      return existingIndex;
    }
    const index = this.selects.push({ type: "pk" }) - 1;
    return index;
  }

  selectExpression(
    expression: SQL,
    codec: PgTypeCodec<any, any, any, any>,
  ): number {
    const index =
      this.selects.push({ type: "expression", expression, codec }) - 1;
    return index;
  }

  selectType(): number {
    const existingIndex = this.selects.findIndex((s) => s.type === "type");
    if (existingIndex >= 0) {
      return existingIndex;
    }
    const index = this.selects.push({ type: "type" }) - 1;
    return index;
  }

  listItem(itemPlan: ExecutableStep) {
    const $single = new PgUnionAllSingleStep(this, itemPlan);
    return $single as any;
  }

  public pageInfo(
    $connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, this, any>,
  ): PgPageInfoStep<this> {
    return pgPageInfo($connectionPlan);
  }

  where(whereSpec: PgUnionAllStepCondition<TAttributes>): void {
    for (const [identifier, sourceSpec] of Object.entries(this.spec.sources)) {
      const details = this.detailsBySource.get(identifier)!;
      const { alias: tableAlias } = details;
      const ident = sql`${tableAlias}.${sourceSpecificExpressionFromAttributeName(
        sourceSpec,
        whereSpec.attribute,
      )}`;
      details.conditions.push(whereSpec.callback(ident));
    }
  }

  orderBy(orderSpec: PgUnionAllStepOrder<TAttributes>): void {
    for (const [identifier, sourceSpec] of Object.entries(this.spec.sources)) {
      const details = this.detailsBySource.get(identifier)!;
      const { alias: tableAlias } = details;
      const ident = sql`${tableAlias}.${sourceSpecificExpressionFromAttributeName(
        sourceSpec,
        orderSpec.attribute,
      )}`;
      details.orders.push(
        sql`${ident} ${orderSpec.direction === "DESC" ? sql`desc` : sql`asc`}`,
      );
    }
    this.outerOrderExpressions.push(
      sql`${sql.identifier(String(this.select(orderSpec.attribute)))} ${
        orderSpec.direction === "DESC" ? sql`desc` : sql`asc`
      }`,
    );
  }

  public placeholder($step: PgTypedExecutableStep<any>): SQL;
  public placeholder(
    $step: ExecutableStep<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL;
  public placeholder(
    $step: ExecutableStep<any> | PgTypedExecutableStep<any>,
    overrideCodec?: PgTypeCodec<any, any, any>,
  ): SQL {
    if (this.isOptimized) {
      throw new Error(
        `${this}: cannot add placeholders once plan is optimized`,
      );
    }
    if (this.placeholders.length >= 100000) {
      throw new Error(
        `There's already ${this.placeholders.length} placeholders; wanting more suggests there's a bug somewhere`,
      );
    }

    const codec = overrideCodec ?? ("pgCodec" in $step ? $step.pgCodec : null);
    if (!codec) {
      throw new Error(
        `Step ${$step} does not contain pgCodec information, please wrap ` +
          `it in \`pgCast\`. E.g. \`pgCast($step, TYPES.boolean)\``,
      );
    }

    const dependencyIndex = this.addDependency($step);
    const symbol = Symbol(`step-${$step.id}`);
    const sqlPlaceholder = sql.placeholder(
      symbol,
      sql`(1/0) /* ERROR! Unhandled placeholder! */`,
    );
    const p: PgUnionAllPlaceholder = {
      dependencyIndex,
      codec,
      symbol,
    };
    this.placeholders.push(p);
    // This allows us to replace the SQL that will be compiled, for example
    // when we're inlining this into a parent query.
    return sqlPlaceholder;
  }

  // TODO: rename?
  // TODO: should this be a static method?
  parseCursor(
    $cursorPlan: __InputStaticLeafStep<string>,
  ): PgSelectParsedCursorStep | null {
    if ($cursorPlan.evalIs(null)) {
      return null;
    } else if ($cursorPlan.evalIs(undefined)) {
      return null;
    }

    const $parsedCursorPlan = lambda($cursorPlan, parseCursor);
    return $parsedCursorPlan;
  }

  setAfter($parsedCursorPlan: PgSelectParsedCursorStep): void {
    this.afterStepId = this.addDependency($parsedCursorPlan);
  }

  setBefore($parsedCursorPlan: PgSelectParsedCursorStep): void {
    this.beforeStepId = this.addDependency($parsedCursorPlan);
  }

  /**
   * If `last` is in use then we reverse the order from the database and then
   * re-reverse it in JS-land.
   */
  private shouldReverseOrder() {
    return (
      this.first == null &&
      this.last != null &&
      this.lowerIndexStepId == null &&
      this.upperIndexStepId == null
    );
  }

  public setFirst(first: InputStep): this {
    // TODO: don't eval
    this.first = first.eval() ?? null;
    return this;
  }

  public setLast(last: InputStep): this {
    this.last = last.eval() ?? null;
    return this;
  }

  public setOffset(offset: InputStep): this {
    this.offset = offset.eval() ?? null;
    if (this.offset !== null) {
      if (this.last != null) {
        throw new Error("Cannot use 'offset' with 'last'");
      }
    }
    return this;
  }

  private planLimitAndOffset() {
    if (this.lowerIndexStepId != null || this.upperIndexStepId != null) {
      /*
       * When using cursor-base pagination with 'natural' cursors, we are actually
       * applying limit/offset under the hood (presumably because we're paginating
       * something that has no explicit order, like a function).
       *
       * If you have:
       * - first: 3
       * - after: ['natural', 4]
       *
       * Then we want `limit 3 offset 4`.
       * With `fetchOneExtra` it'd be `limit 4 offset 4`.
       *
       * For:
       * - last: 2
       * - before: ['natural', 6]
       *
       * We want `limit 2 offset 4`
       * With `fetchOneExtra` it'd be `limit 3 offset 3`.
       *
       * For:
       * - last: 2
       * - before: ['natural', 3]
       *
       * We want `limit 2`
       * With `fetchOneExtra` it'd still be `limit 2`.
       *
       * For:
       * - last: 2
       * - before: ['natural', 4]
       *
       * We want `limit 2 offset 1`
       * With `fetchOneExtra` it'd be `limit 3`.
       *
       * Using `offset` with `after`/`before` is forbidden, so we do not need to consider that.
       *
       * For:
       * - after: ['natural', 2]
       * - before: ['natural', 6]
       *
       * We want `limit 4 offset 2`
       * With `fetchOneExtra` it'd be `limit 4 offset 2` still.
       *
       * For:
       * - first: 2
       * - after: ['natural', 2]
       * - before: ['natural', 6]
       *
       * We want `limit 2 offset 2`
       * With `fetchOneExtra` it'd be `limit 3 offset 2` still.
       */

      const $lower =
        this.lowerIndexStepId != null
          ? this.getDep(this.lowerIndexStepId)
          : constant(null);
      const $upper =
        this.upperIndexStepId != null
          ? this.getDep(this.upperIndexStepId)
          : constant(null);

      const limitAndOffsetLambda = lambda(
        list([$lower, $upper]),
        ([cursorLower, cursorUpper]: Array<number | null>) => {
          /** lower bound - exclusive (1-indexed) */
          let lower = 0;
          /** upper bound - exclusive (1-indexed) */
          let upper = Infinity;

          // Apply 'after', if present
          if (cursorLower != null) {
            lower = Math.max(0, cursorLower);
          }

          // Apply 'before', if present
          if (cursorUpper != null) {
            upper = cursorUpper;
          }

          // Cannot go beyond these bounds
          const maxUpper = upper;

          // Apply 'first', if present
          if (this.first != null) {
            upper = Math.min(upper, lower + this.first + 1);
          }

          // Apply 'last', if present
          if (this.last != null) {
            lower = Math.max(0, lower, upper - this.last - 1);
          }

          // Apply 'offset', if present
          if (this.offset != null && this.offset > 0) {
            lower = Math.min(lower + this.offset, maxUpper);
            upper = Math.min(upper + this.offset, maxUpper);
          }

          // If 'fetch one extra', adjust:
          if (this.fetchOneExtra) {
            if (this.first != null) {
              upper = upper + 1;
            } else if (this.last != null) {
              lower = Math.max(0, lower - 1);
            }
          }

          /** lower, but 0-indexed and inclusive */
          const lower0 = lower - 1 + 1;
          /** upper, but 0-indexed and inclusive */
          const upper0 = upper - 1 - 1;

          // Calculate the final limit/offset
          const limit = isFinite(upper0)
            ? Math.max(0, upper0 - lower0 + 1)
            : null;
          const offset = lower0;

          return [limit, offset];
        },
        true,
      );
      this.limitAndOffsetId = this.addDependency(limitAndOffsetLambda);
      const limitLambda = access<number>(limitAndOffsetLambda, [0]);
      const offsetLambda = access<number>(limitAndOffsetLambda, [1]);
      const limitPlusOffsetLambda = lambda([limitLambda, offsetLambda], add);
      this.limitAndOffsetSQL = sql`\nlimit ${this.placeholder(
        limitLambda,
        TYPES.int,
      )}\noffset ${this.placeholder(offsetLambda, TYPES.int)}`;
      this.innerLimitSQL = sql`\nlimit ${this.placeholder(
        limitPlusOffsetLambda,
        TYPES.int,
      )}`;
    } else {
      const limit =
        this.first != null
          ? sql`\nlimit ${sql.literal(
              this.first + (this.fetchOneExtra ? 1 : 0),
            )}`
          : this.last != null
          ? sql`\nlimit ${sql.literal(
              this.last + (this.fetchOneExtra ? 1 : 0),
            )}`
          : sql.blank;
      const offset =
        this.offset != null
          ? sql`\noffset ${sql.literal(this.offset)}`
          : sql.blank;
      this.limitAndOffsetSQL = sql`${limit}${offset}`;
      this.innerLimitSQL =
        this.first != null || this.last != null
          ? sql`\nlimit ${sql.literal(
              (this.first ?? this.last ?? 0) +
                (this.offset ?? 0) +
                (this.fetchOneExtra ? 1 : 0),
            )}`
          : sql.blank;
    }
  }

  optimize() {
    this.planLimitAndOffset();
    return this;
  }

  finalize() {
    const typeIdx = this.selectType();
    const rowNumberAlias = "n";
    const rowNumberIdent = sql.identifier(rowNumberAlias);

    const makeQuery = () => {
      const tables: SQL[] = [];

      for (const [identifier, sourceSpec] of Object.entries(
        this.spec.sources,
      )) {
        const details = this.detailsBySource.get(identifier)!;
        const { sqlSource, alias: tableAlias, conditions, orders } = details;

        const pk = sourceSpec.source.uniques?.find((u) => u.isPrimary === true);
        const midSelects: SQL[] = [];
        const innerSelects = this.selects.map((s, selectIndex) => {
          const [frag, codec] = ((): [SQL, PgTypeCodec<any, any, any, any>] => {
            switch (s.type) {
              case "attribute": {
                const attr = this.spec.attributes[s.attribute];
                return [
                  sql`${tableAlias}.${sourceSpecificExpressionFromAttributeName(
                    sourceSpec,
                    s.attribute,
                  )}`,
                  attr.codec,
                ];
              }
              case "type": {
                return [sql.literal(identifier), TYPES.text];
              }
              case "pk": {
                if (!pk) {
                  throw new Error(`No PK for ${identifier} source in ${this}`);
                }
                return [
                  sql`json_build_array(${sql.join(
                    pk.columns.map(
                      (c) => sql`(${tableAlias}.${sql.identifier(c)})::text`,
                    ),
                    ",",
                  )})`,
                  TYPES.json,
                ];
              }
              case "expression": {
                return [s.expression, s.codec];
              }
              default: {
                const never: never = s;
                throw new Error(`Couldn't match ${(never as any).type}`);
              }
            }
          })();
          const alias = String(selectIndex);
          const ident = sql.identifier(alias);
          const fullIdent = sql`${tableAlias}.${ident}`;
          midSelects.push(fullIdent);
          return sql`${frag} as ${ident}`;
        });
        midSelects.push(rowNumberIdent);
        innerSelects.push(
          sql`row_number() over (partition by 1) as ${rowNumberIdent}`,
        );

        // Can't order individual selects in a `union all` so we're using
        // subqueries to do so.
        const innerQuery = sql.indent`
select
${sql.indent(sql.join(innerSelects, ",\n"))}
from ${sqlSource} as ${tableAlias}
${
  conditions.length > 0
    ? sql`where ${sql.join(conditions, `\nand `)}\n`
    : sql.blank
}\
${orders.length > 0 ? sql`order by ${sql.join(orders, `,\n`)}\n` : sql.blank}\
${this.innerLimitSQL!}
`;

        // Relies on Postgres maintaining the order of the subquery
        const query = sql.indent`\
select
${sql.indent(sql.join(midSelects, ",\n"))}
from (${innerQuery}) as ${tableAlias}\
`;
        tables.push(query);
      }

      const outerSelects = this.selects.map((select, i) => {
        const sqlSrc = sql`${castAlias}.${sql.identifier(String(i))}`;
        const codec =
          select.type === "type"
            ? TYPES.text
            : select.type === "pk"
            ? TYPES.json
            : select.codec;
        return codec.castFromPg?.(sqlSrc) ?? sql`${sqlSrc}::text`;
      });

      // Union must be ordered _before_ applying `::text`/etc transforms to
      // select, so we wrap this with another select.
      const unionQuery = sql.indent`
${sql.join(
  tables,
  `
union all
`,
)}
order by${sql.indent`
${
  this.outerOrderExpressions.length
    ? sql`${sql.join(this.outerOrderExpressions, ",\n")},\n`
    : sql.blank
}\
${rowNumberIdent} asc,
${sql.identifier(String(typeIdx))} asc\
`}
${this.limitAndOffsetSQL!}
`;

      // Adds all the `::text`/etc casting
      const innerQuery = sql`\
select
${sql.indent(sql.join(outerSelects, ",\n"))}
from (${unionQuery}) ${castAlias}
`;
      return innerQuery;
    };

    const { query: finalQuery, identifierIndex } = (() => {
      if (this.queryValues.length > 0 || this.placeholders.length > 0) {
        const wrapperAlias = sql.identifier(Symbol("union_result"));
        const identifiersAlias = sql.identifier(Symbol("union_identifiers"));
        this.placeholders.forEach((placeholder) => {
          // NOTE: we're NOT adding to `this.identifierMatches`.

          // Fine a existing match for this dependency of this type
          const existingIndex = this.queryValues.findIndex((v) => {
            return (
              v.dependencyIndex === placeholder.dependencyIndex &&
              v.codec === placeholder.codec
            );
          });

          // If none exists, add one to our query values
          const idx =
            existingIndex >= 0
              ? existingIndex
              : this.queryValues.push({
                  dependencyIndex: placeholder.dependencyIndex,
                  codec: placeholder.codec,
                }) - 1;

          // Finally alias this symbol to a reference to this placeholder
          this.placeholderValues.set(
            placeholder.symbol,
            sql`${identifiersAlias}.${sql.identifier(`id${idx}`)}`,
          );
        });

        const identifierIndex = this.selectExpression(
          sql`${identifiersAlias}.idx`,
          TYPES.int, // TODO: validate
        );

        // IMPORTANT: this must come after the `selectExpression` call above.
        const innerQuery = makeQuery();

        /*
         * IMPORTANT: this wrapper query is necessary so that queries that
         * have a limit/offset get the limit/offset applied _per identifier
         * group_; that's why this cannot just be another "from" clause.
         */
        const query = sql`select ${wrapperAlias}.*
from (${sql.indent(sql`\
select\n${sql.indent(sql`\
ids.ordinality - 1 as idx,
${sql.join(
  this.queryValues.map(({ codec }, idx) => {
    return sql`(ids.value->>${sql.literal(idx)})::${
      codec.sqlType
    } as ${sql.identifier(`id${idx}`)}`;
  }),
  ",\n",
)}`)}
from json_array_elements(${sql.value(
          // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
          // a value before executing the query.
          this.queryValuesSymbol as any,
        )}::json) with ordinality as ids`)}) as ${identifiersAlias},
lateral (${sql.indent(innerQuery)}) as ${wrapperAlias};`;
        return { query, identifierIndex };
      } else {
        const query = makeQuery();
        return { query, identifierIndex: null };
      }
    })();

    const { text, values: rawSqlValues } = sql.compile(finalQuery, {
      placeholderValues: this.placeholderValues,
    });
    console.log(text);
    this.finalizeResults = {
      text,
      rawSqlValues,
      identifierIndex,
      // TODO: when streaming we must not set this to true
      shouldReverseOrder: this.shouldReverseOrder(),
      name: hash(text),
    };

    super.finalize();
  }

  async execute(
    values: Array<GrafastValuesList<any>>,
    { eventEmitter }: ExecutionExtra,
  ): Promise<GrafastValuesList<any>> {
    const { text, rawSqlValues, identifierIndex, shouldReverseOrder, name } =
      this.finalizeResults!;

    const contexts = values[this.contextId];
    if (!contexts) {
      throw new Error("No contexts");
    }

    const executionResult = await this.spec.executor.executeWithCache(
      contexts.map((context, i) => {
        return {
          // The context is how we'd handle different connections with different claims
          context,
          queryValues:
            identifierIndex != null
              ? this.queryValues.map(({ dependencyIndex, codec }) => {
                  const val = values[dependencyIndex][i];
                  return val == null ? null : codec.toPg(val);
                })
              : EMPTY_ARRAY,
        };
      }),
      {
        text,
        rawSqlValues,
        identifierIndex,
        queryValuesSymbol: this.queryValuesSymbol,
        name,
        eventEmitter,
        useTransaction: false,
      },
    );
    // debugExecute("%s; result: %c", this, executionResult);

    return executionResult.values.map((allVals) => {
      if (allVals == null || isPromiseLike(allVals)) {
        return allVals;
      }
      const limit = this.first ?? this.last;
      const firstAndLast =
        this.first != null && this.last != null && this.last < this.first;
      const hasMore =
        this.fetchOneExtra && limit != null && allVals.length > limit;
      const trimFromStart =
        !shouldReverseOrder && this.last != null && this.first == null;
      const limitedRows = hasMore
        ? trimFromStart
          ? allVals.slice(Math.max(0, allVals.length - limit!))
          : allVals.slice(0, limit!)
        : allVals;
      const slicedRows =
        firstAndLast && this.last != null
          ? limitedRows.slice(-this.last)
          : limitedRows;
      const orderedRows = shouldReverseOrder
        ? reverseArray(slicedRows)
        : slicedRows;
      if (this.fetchOneExtra) {
        // TODO: this is an ugly hack; really we should consider resolving to an
        // object that can contain metadata as well as the rows.
        Object.defineProperty(orderedRows, "hasMore", { value: hasMore });
      }
      return orderedRows;
    });
  }
}

export function pgUnionAll<TAttributes extends string>(
  spec: PgUnionAllStepConfig<TAttributes>,
): PgUnionAllStep<TAttributes> {
  return new PgUnionAllStep(spec);
}
