import { jsonParse } from "@dataplan/json";
import { createHash } from "crypto";
import type {
  __InputStaticLeafStep,
  ConnectionCapableStep,
  ConnectionStep,
  EdgeCapableStep,
  ExecutionDetails,
  GrafastResultsList,
  GrafastValuesList,
  InputStep,
  LambdaStep,
  Maybe,
  PolymorphicStep,
} from "grafast";
import {
  __ItemStep,
  access,
  arrayOfLength,
  constant,
  ExecutableStep,
  exportAs,
  first,
  isPromiseLike,
  lambda,
  list,
  polymorphicWrap,
  reverseArray,
  SafeError,
} from "grafast";
import type { GraphQLObjectType } from "grafast/graphql";
import type { SQL, SQLRawValue } from "pg-sql2";
import { $$symbolToIdentifier, $$toSQL, sql } from "pg-sql2";

import type { PgCodecAttributes } from "../codecs.js";
import { TYPES } from "../codecs.js";
import type { PgResource, PgResourceUnique } from "../datasource.js";
import type { PgExecutor, PgExecutorInput } from "../executor.js";
import type { PgCodecRefPath, PgCodecRelation, PgGroupSpec } from "../index.js";
import type {
  PgCodec,
  PgOrderFragmentSpec,
  PgOrderSpec,
  PgTypedExecutableStep,
} from "../interfaces.js";
import { PgLocker } from "../pgLocker.js";
import { makeScopedSQL } from "../utils.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import { pgClassExpression } from "./pgClassExpression.js";
import type {
  PgHavingConditionSpec,
  PgWhereConditionSpec,
} from "./pgCondition.js";
import { PgConditionStep } from "./pgCondition.js";
import { PgCursorStep } from "./pgCursor.js";
import type { PgPageInfoStep } from "./pgPageInfo.js";
import { pgPageInfo } from "./pgPageInfo.js";
import type { PgSelectParsedCursorStep } from "./pgSelect.js";
import { getFragmentAndCodecFromOrder } from "./pgSelect.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";
import type { PgStmtDeferredPlaceholder, PgStmtDeferredSQL } from "./pgStmt.js";
import { PgStmtBaseStep } from "./pgStmt.js";
import { pgValidateParsedCursor } from "./pgValidateParsedCursor.js";
import { toPg } from "./toPg.js";

function isNotNullish<T>(v: T | null | undefined): v is T {
  return v != null;
}

const rowNumberAlias = "n";
const rowNumberIdent = sql.identifier(rowNumberAlias);

// In future we'll allow mapping columns to different attributes/types
const digestSpecificExpressionFromAttributeName = (
  digest: MemberDigest<any>,
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
      "GrafastInternalError<3b076b86-828b-46b3-885d-ed2577068b8d>: cursor is null, but we have a constraint preventing that...",
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
    throw new SafeError(
      "Invalid cursor, please enter a cursor from a previous request, or null.",
    );
  }
}
parseCursor.isSyncAndSafe = true; // Optimization

function add([a, b]: readonly [a: number, b: number]): number {
  return a + b;
}
add.isSyncAndSafe = true;

type PgUnionAllStepSelect<TAttributes extends string> =
  | { type: "pk" }
  | { type: "type" }
  | { type: "order"; orderIndex: number }
  | {
      type: "attribute";
      attribute: TAttributes;
    }
  | {
      type: "expression";
      expression: SQL;
      codec: PgCodec;
    }
  | {
      type: "outerExpression";
      expression: SQL;
    };

export type PgUnionAllStepConfigAttributes<TAttributes extends string> = {
  [attributeName in TAttributes]: {
    codec: PgCodec;
    notNull?: boolean;
  };
};

export interface PgUnionAllStepMember<TTypeNames extends string> {
  typeName: TTypeNames;
  resource: PgResource<
    any,
    any,
    ReadonlyArray<PgResourceUnique<any>>,
    any,
    any
  >;
  match?: {
    [resourceAttributeName: string]:
      | {
          step: PgTypedExecutableStep<any>;
          codec?: never;
        }
      | {
          step: ExecutableStep;
          codec: PgCodec;
        };
  };
  path?: PgCodecRefPath;
}

export interface PgUnionAllStepConfig<
  TAttributes extends string,
  TTypeNames extends string,
> {
  resourceByTypeName: {
    [typeName in TTypeNames]: PgResource<any, any, any, any, any>;
  };
  attributes?: PgUnionAllStepConfigAttributes<TAttributes>;
  members?: PgUnionAllStepMember<TTypeNames>[];
  mode?: PgUnionAllMode;
  name?: string;
}

export interface PgUnionAllStepCondition<TAttributes extends string> {
  attribute: TAttributes;
  callback: (fragment: SQL) => SQL;
}

export interface PgUnionAllStepOrder<TAttributes extends string> {
  attribute: TAttributes;
  direction: "ASC" | "DESC";
}

interface QueryValue {
  dependencyIndex: number;
  codec: PgCodec;
  alreadyEncoded: boolean;
}

export class PgUnionAllSingleStep
  extends ExecutableStep
  implements PolymorphicStep, EdgeCapableStep<any>
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgUnionAllSingleStep",
  };
  public isSyncAndSafe = true;
  private typeKey: number | null;
  private pkKey: number | null;
  private readonly spec: PgUnionAllStepConfig<string, string>;
  constructor($parent: PgUnionAllStep<any, any>, $item: ExecutableStep) {
    super();
    this.addDependency($item);
    this.spec = $parent.spec;
    if ($parent.mode === "normal") {
      this.typeKey = $parent.selectType();
      this.pkKey = $parent.selectPk();
    } else {
      this.typeKey = null;
      this.pkKey = null;
    }
  }

  planForType(objectType: GraphQLObjectType<any, any>): ExecutableStep {
    if (this.pkKey === null || this.typeKey === null) {
      throw new Error(
        `${this} not polymorphic because parent isn't in normal mode`,
      );
    }
    const resource = this.spec.resourceByTypeName[objectType.name];
    if (!resource) {
      // This type isn't handled; so it should never occur
      return constant(null);
    }
    const pk = (resource.uniques as PgResourceUnique[] | undefined)?.find(
      (u) => u.isPrimary === true,
    );
    if (!pk) {
      throw new Error(
        `No PK found for ${objectType.name}; this should have been caught earlier?!`,
      );
    }
    const spec = Object.create(null);
    const $parsed = jsonParse(access(this, [this.pkKey]));
    for (let i = 0, l = pk.attributes.length; i < l; i++) {
      const col = pk.attributes[i];
      spec[col] = access($parsed, [i]);
    }
    return resource.get(spec);
  }

  /**
   * @internal
   * For use by PgCursorStep
   */
  public getCursorDigestAndStep(): [string, ExecutableStep] {
    if (this.typeKey === null) {
      throw new Error("Forbidden since parent isn't in normal mode");
    }
    const classPlan = this.getClassStep();
    const digest = classPlan.getOrderByDigest();
    const orders = classPlan.getOrderByWithoutType().map((o, i) => {
      return access(this, [classPlan.selectOrderValue(i)]);
    });
    // Add the type to the cursor
    orders.push(access(this, [classPlan.selectType()]));
    // Add the pk to the cursor
    orders.push(access(this, [classPlan.selectPk()]));
    const step = list(orders);
    return [digest, step];
  }

  /**
   * When selecting a connection we need to be able to get the cursor. The
   * cursor is built from the values of the `ORDER BY` clause so that we can
   * find nodes before/after it.
   */
  public cursor(): PgCursorStep<this> {
    const cursorPlan = new PgCursorStep<this>(this);
    return cursorPlan;
  }

  public getClassStep(): PgUnionAllStep<string, string> {
    return this.getDep<any>(0).getDep(0);
  }

  public node() {
    return this;
  }

  public scopedSQL = makeScopedSQL(this);

  public placeholder($step: PgTypedExecutableStep<any>): SQL;
  public placeholder($step: ExecutableStep, codec: PgCodec): SQL;
  public placeholder(
    $step: ExecutableStep | PgTypedExecutableStep<any>,
    overrideCodec?: PgCodec,
  ): SQL {
    return overrideCodec
      ? this.getClassStep().placeholder($step, overrideCodec)
      : this.getClassStep().placeholder($step as PgTypedExecutableStep<any>);
  }

  /**
   * Returns a plan representing the result of an expression.
   */
  expression<TExpressionCodec extends PgCodec>(
    expression: SQL,
    codec: TExpressionCodec,
    guaranteedNotNull?: boolean,
  ): PgClassExpressionStep<TExpressionCodec, any> {
    return this.select(expression, codec, guaranteedNotNull);
  }

  /**
   * Advanced method; rather than returning a plan it returns an index.
   * Generally useful for PgClassExpressionStep.
   *
   * @internal
   */
  public selectAndReturnIndex(fragment: SQL): number {
    return this.getClassStep().selectAndReturnIndex(fragment);
  }

  public select<TExpressionCodec extends PgCodec>(
    fragment: SQL,
    codec: TExpressionCodec,
    guaranteedNotNull?: boolean,
  ): PgClassExpressionStep<TExpressionCodec, any> {
    const sqlExpr = pgClassExpression<TExpressionCodec, any>(
      this,
      codec,
      codec.notNull || guaranteedNotNull,
    );
    return sqlExpr`${fragment}`;
  }

  execute({
    count,
    values: [values0],
  }: ExecutionDetails): GrafastResultsList<any> {
    if (this.typeKey !== null) {
      const typeKey = this.typeKey;
      return values0.isBatch
        ? values0.entries.map((v) => {
            if (v == null) return null;
            const type = v[typeKey];
            return polymorphicWrap(type, v);
          })
        : arrayOfLength(
            count,
            values0.value == null
              ? null
              : polymorphicWrap(values0.value[typeKey], values0.value),
          );
    } else {
      return values0.isBatch
        ? values0.entries
        : arrayOfLength(count, values0.value);
    }
  }
}

interface MemberDigest<TTypeNames extends string> {
  member: PgUnionAllStepMember<TTypeNames>;
  finalResource: PgResource<
    any,
    any,
    ReadonlyArray<PgResourceUnique<any>>,
    any,
    any
  >;
  sqlSource: SQL;
  symbol: symbol;
  alias: SQL;
  conditions: SQL[];
  orders: PgOrderSpec[];
}

export type PgUnionAllMode = "normal" | "aggregate";

function cloneDigest<TTypeNames extends string = string>(
  digest: MemberDigest<TTypeNames>,
): MemberDigest<TTypeNames> {
  return {
    member: digest.member,
    finalResource: digest.finalResource,
    sqlSource: digest.sqlSource,
    symbol: digest.symbol,
    alias: digest.alias,
    conditions: [...digest.conditions],
    orders: [...digest.orders],
  };
}

function cloneDigests<TTypeNames extends string = string>(
  digests: ReadonlyArray<MemberDigest<TTypeNames>>,
): Array<MemberDigest<TTypeNames>> {
  return digests.map(cloneDigest);
}

/**
 * When finalized, we build the SQL query, queryValues, and note where to feed in
 * the relevant queryValues. This saves repeating this work at execution time.
 */
interface QueryBuildResult {
  // The SQL query text
  text: string;
  textForSingle?: string;

  // The values to feed into the query
  rawSqlValues: SQLRawValue[];

  // The `DECLARE ... CURSOR` query for @stream
  textForDeclare?: string;

  // The values to feed into the `DECLARE ... CURSOR` query
  rawSqlValuesForDeclare?: SQLRawValue[];

  // If streaming, what's the initialCount
  streamInitialCount?: number;

  // The attribute on the result that indicates which group the result belongs to
  identifierIndex: number | null;

  // If last but not first, reverse order.
  shouldReverseOrder: boolean;

  // For prepared queries
  name?: string;
  nameForSingle?: string;

  queryValues: Array<QueryValue>;
}

/**
 * Represents a `UNION ALL` statement, which can have multiple table-like
 * resources, but must return a consistent data shape.
 */
export class PgUnionAllStep<
    TAttributes extends string = string,
    TTypeNames extends string = string,
  >
  extends PgStmtBaseStep<unknown>
  implements
    ConnectionCapableStep<PgSelectSingleStep<any>, PgSelectParsedCursorStep>
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgUnionAllStep",
  };

  public isSyncAndSafe = false;

  public symbol: symbol;
  public alias: SQL;

  private selects: PgUnionAllStepSelect<TAttributes>[];

  private executor!: PgExecutor;
  private contextId!: number;

  /** @internal */
  public readonly spec: PgUnionAllStepConfig<TAttributes, TTypeNames>;

  /** @internal */
  public orders: Array<PgOrderFragmentSpec>;
  /** The select index used to store the order value for the given order */
  private orderSelectIndex: Array<number>;
  /**
   * `ordersForCursor` is the same as `orders`, but then with the type and
   * primary key added. This ensures unique ordering, as required by cursor
   * pagination.
   *
   * When the non-type, non-pk orders have the same values, then the entries
   * will be in `type` and then `pk` order; so if we want the results "after" a
   * particular `type`/`pk` then all identical types "before" (alphabetically)
   * this type can be excluded; for exactly this `type` we should only include
   * entries with `pk` higher than the given `pk`, and for all other `type`s we
   * can include all records.
   */
  private ordersForCursor: Array<PgOrderFragmentSpec>;

  /**
   * Values used in this plan.
   */
  protected placeholders: Array<PgStmtDeferredPlaceholder>;
  protected deferreds: Array<PgStmtDeferredSQL>;

  // GROUP BY

  private groups: Array<PgGroupSpec>;

  // HAVING

  private havingConditions: SQL[];

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

  // Connection
  private connectionDepId: number | null = null;

  private limitAndOffsetSQL: SQL | null = null;
  private innerLimitSQL: SQL | null = null;

  public readonly mode: PgUnionAllMode;

  protected locker: PgLocker<this> = new PgLocker(this);

  private memberDigests: MemberDigest<TTypeNames>[];
  private _limitToTypes: string[] | undefined;

  constructor(
    cloneFrom: PgUnionAllStep<TAttributes, TTypeNames>,
    mode?: PgUnionAllMode,
  );
  constructor(spec: PgUnionAllStepConfig<TAttributes, TTypeNames>);
  constructor(
    specOrCloneFrom:
      | PgUnionAllStepConfig<TAttributes, TTypeNames>
      | PgUnionAllStep<TAttributes, TTypeNames>,
    overrideMode?: PgUnionAllMode,
  ) {
    super();
    if (specOrCloneFrom instanceof PgUnionAllStep) {
      const cloneFrom = specOrCloneFrom;
      this.symbol = cloneFrom.symbol;
      this.alias = cloneFrom.alias;
      this.mode = overrideMode ?? cloneFrom.mode ?? "normal";
      const cloneFromMatchingMode =
        cloneFrom.mode === this.mode ? cloneFrom : null;
      this.spec = cloneFrom.spec;
      this.memberDigests = cloneDigests(cloneFrom.memberDigests);
      this._limitToTypes = cloneFrom._limitToTypes
        ? [...cloneFrom._limitToTypes]
        : undefined;

      cloneFrom.dependencies.forEach((planId, idx) => {
        const myIdx = this.addDependency({
          ...cloneFrom.getDepOptions(idx),
          skipDeduplication: true,
        });
        if (myIdx !== idx) {
          throw new Error(
            `Failed to clone ${cloneFrom}; dependency indexes did not match: ${myIdx} !== ${idx}`,
          );
        }
      });

      this.selects = cloneFromMatchingMode
        ? [...cloneFromMatchingMode.selects]
        : [];
      this.placeholders = [...cloneFrom.placeholders];
      this.deferreds = [...cloneFrom.deferreds];
      this.groups = cloneFromMatchingMode
        ? [...cloneFromMatchingMode.groups]
        : [];
      this.havingConditions = cloneFromMatchingMode
        ? [...cloneFromMatchingMode.havingConditions]
        : [];
      this.orders = cloneFromMatchingMode
        ? [...cloneFromMatchingMode.orders]
        : [];
      this.orderSelectIndex = [...cloneFrom.orderSelectIndex];
      this.ordersForCursor = [...cloneFrom.ordersForCursor];

      this.executor = cloneFrom.executor;
      this.contextId = cloneFrom.contextId;

      this.isSyncAndSafe = cloneFrom.isSyncAndSafe;
      this.alias = cloneFrom.alias;

      this.first = cloneFromMatchingMode ? cloneFromMatchingMode.first : null;
      this.last = cloneFromMatchingMode ? cloneFromMatchingMode.last : null;
      this.fetchOneExtra = cloneFromMatchingMode
        ? cloneFromMatchingMode.fetchOneExtra
        : false;
      this.offset = cloneFromMatchingMode ? cloneFromMatchingMode.offset : null;
      this.limitAndOffsetSQL = cloneFromMatchingMode
        ? cloneFromMatchingMode.limitAndOffsetSQL
        : null;
      this.innerLimitSQL = cloneFromMatchingMode
        ? cloneFromMatchingMode.innerLimitSQL
        : null;
      this.beforeStepId =
        cloneFromMatchingMode && cloneFromMatchingMode.beforeStepId != null
          ? cloneFromMatchingMode.beforeStepId
          : null;
      this.afterStepId =
        cloneFromMatchingMode && cloneFromMatchingMode.afterStepId != null
          ? cloneFromMatchingMode.afterStepId
          : null;
      this.lowerIndexStepId =
        cloneFromMatchingMode && cloneFromMatchingMode.lowerIndexStepId != null
          ? cloneFromMatchingMode.lowerIndexStepId
          : null;
      this.upperIndexStepId =
        cloneFromMatchingMode && cloneFromMatchingMode.upperIndexStepId != null
          ? cloneFromMatchingMode.upperIndexStepId
          : null;
      this.limitAndOffsetId =
        cloneFromMatchingMode && cloneFromMatchingMode.limitAndOffsetId != null
          ? cloneFromMatchingMode.limitAndOffsetId
          : null;
    } else {
      const spec = specOrCloneFrom;
      this.mode = overrideMode ?? spec.mode ?? "normal";
      if (this.mode === "aggregate") {
        this.locker.beforeLock("orderBy", () =>
          this.locker.lockParameter("groupBy"),
        );
      }
      this.spec = spec;
      // If the user doesn't specify members, we'll just build membership based
      // on the provided resources.
      const members =
        spec.members ??
        (
          Object.entries(spec.resourceByTypeName) as Array<
            [
              typeName: TTypeNames,
              resource: PgResource<any, any, any, any, any>,
            ]
          >
        ).map(
          ([typeName, resource]): PgUnionAllStepMember<TTypeNames> => ({
            typeName,
            resource,
          }),
        );
      this.symbol = Symbol(spec.name ?? "union");
      this.alias = sql.identifier(this.symbol);

      this.selects = [];
      this.placeholders = [];
      this.deferreds = [];
      this.groups = [];
      this.havingConditions = [];
      this.orders = [];
      this.orderSelectIndex = [];
      this.ordersForCursor = [];

      this.memberDigests = [];
      for (const member of members) {
        if (!this.executor) {
          this.executor = member.resource.executor;
          this.contextId = this.addDependency(this.executor.context());
        }
        const { path = [] } = member;
        const conditions: SQL[] = [];

        let currentResource = member.resource;
        let currentSymbol = Symbol(currentResource.name);
        let currentAlias = sql.identifier(currentSymbol);
        if (this.executor !== currentResource.executor) {
          throw new Error(
            `${this}: all resources must currently come from same executor`,
          );
        }
        if (!sql.isSQL(currentResource.from)) {
          throw new Error(`${this}: parameterized resources not yet supported`);
        }

        if (member.match) {
          for (const [attributeName, match] of Object.entries(member.match)) {
            conditions.push(
              sql`${currentAlias}.${sql.identifier(attributeName)} = ${
                match.codec
                  ? this.placeholder(match.step, match.codec)
                  : this.placeholder(match.step)
              }`,
            );
          }
        }

        let sqlSource = sql`${currentResource.from} as ${currentAlias}`;

        for (const pathEntry of path) {
          const relation = currentResource.getRelation(
            pathEntry.relationName,
          ) as PgCodecRelation;
          const nextResource = relation.remoteResource;
          const nextSymbol = Symbol(nextResource.name);
          const nextAlias = sql.identifier(nextSymbol);

          if (this.executor !== nextResource.executor) {
            throw new Error(
              `${this}: all resources must currently come from same executor`,
            );
          }
          if (!sql.isSQL(nextResource.from)) {
            throw new Error(
              `${this}: parameterized resources not yet supported`,
            );
          }

          const nextSqlFrom: SQL = nextResource.from;
          sqlSource = sql`${sqlSource}
inner join ${nextSqlFrom} as ${nextAlias}
on (${sql.indent(
            sql.join(
              relation.localAttributes.map(
                (localAttribute, i) =>
                  sql`${nextAlias}.${sql.identifier(
                    String(relation.remoteAttributes[i]),
                  )} = ${currentAlias}.${sql.identifier(
                    String(localAttribute),
                  )}`,
              ),
              "\nand ",
            ),
          )})`;

          currentResource = nextResource;
          currentSymbol = nextSymbol;
          currentAlias = nextAlias;
        }

        this.memberDigests.push({
          member,
          finalResource: currentResource,
          symbol: currentSymbol,
          alias: currentAlias,
          conditions,
          orders: [],
          sqlSource,
        });
      }
    }

    this.locker.afterLock("orderBy", () => {
      this.withMyLayerPlan(() => {
        this.ordersForCursor = [
          ...this.orders,
          {
            fragment: sql`${this.alias}.${sql.identifier(
              String(this.selectType()),
            )}`,
            codec: TYPES.text,
            direction: "ASC",
          },
          {
            fragment: sql`${this.alias}.${sql.identifier(
              String(this.selectPk()),
            )}`,
            codec: TYPES.json,
            direction: "ASC",
          },
        ];

        if (this.beforeStepId != null) {
          this.applyConditionFromCursor(
            "before",
            this.getDep<any>(this.beforeStepId),
          );
        }
        if (this.afterStepId != null) {
          this.applyConditionFromCursor(
            "after",
            this.getDep<any>(this.afterStepId),
          );
        }
      });
    });
  }

  connectionClone(
    $connection: ConnectionStep<any, any, any, any>,
    mode?: PgUnionAllMode,
  ): PgUnionAllStep<TAttributes, TTypeNames> {
    const $plan = new PgUnionAllStep(this, mode);
    // In case any errors are raised
    $plan.connectionDepId = $plan.addDependency($connection);
    return $plan;
  }

  select<TAttribute extends TAttributes>(key: TAttribute): number {
    if (
      !this.spec.attributes ||
      !Object.prototype.hasOwnProperty.call(this.spec.attributes, key)
    ) {
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
      }) - 1;
    return index;
  }

  selectAndReturnIndex(fragment: SQL): number {
    const existingIndex = this.selects.findIndex(
      (s) =>
        s.type === "outerExpression" &&
        sql.isEquivalent(s.expression, fragment),
    );
    if (existingIndex >= 0) {
      return existingIndex;
    }
    const index =
      this.selects.push({
        type: "outerExpression",
        expression: fragment,
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

  selectExpression(expression: SQL, codec: PgCodec): number {
    const existingIndex = this.selects.findIndex(
      (s) =>
        s.type === "expression" && sql.isEquivalent(s.expression, expression),
    );
    if (existingIndex >= 0) {
      return existingIndex;
    }
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

  selectOrderValue(orderIndex: number): number {
    const orders = this.getOrderByWithoutType();
    const order = orders[orderIndex];
    if (!order) {
      throw new Error("OOB!");
    }
    // Order is already selected
    return this.orderSelectIndex[orderIndex];
  }

  /**
   * If this plan may only return one record, you can use `.singleAsRecord()`
   * to return a plan that resolves to that record (rather than a list of
   * records as it does currently).
   *
   * Beware: if you call this and the database might actually return more than
   * one record then you're potentially in for a Bad Time.
   */
  singleAsRecord(): PgUnionAllSingleStep {
    // this.setUnique(true);
    return new PgUnionAllSingleStep(this, first(this));
  }

  single() {
    return this.singleAsRecord();
  }

  row($row: ExecutableStep) {
    return new PgUnionAllSingleStep(this, $row);
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

  where(whereSpec: PgWhereConditionSpec<TAttributes>): void {
    if (this.locker.locked) {
      throw new Error(
        `${this}: cannot add conditions once plan is locked ('where')`,
      );
    }
    for (const digest of this.memberDigests) {
      const { alias: tableAlias, symbol } = digest;
      if (sql.isSQL(whereSpec)) {
        // Merge the global where into this sub-where.
        digest.conditions.push(
          sql.replaceSymbol(whereSpec, this.symbol, symbol),
        );
      } else {
        const ident = sql`${tableAlias}.${digestSpecificExpressionFromAttributeName(
          digest,
          whereSpec.attribute,
        )}`;
        digest.conditions.push(whereSpec.callback(ident));
      }
    }
  }

  wherePlan(): PgConditionStep<this> {
    if (this.locker.locked) {
      throw new Error(
        `${this}: cannot add conditions once plan is locked ('wherePlan')`,
      );
    }
    return new PgConditionStep(this);
  }

  groupBy(group: PgGroupSpec): void {
    this.locker.assertParameterUnlocked("groupBy");
    if (this.mode !== "aggregate") {
      throw new SafeError(`Cannot add groupBy to a non-aggregate query`);
    }
    this.groups.push(group);
  }

  havingPlan(): PgConditionStep<this> {
    if (this.locker.locked) {
      throw new Error(
        `${this}: cannot add having conditions once plan is locked ('havingPlan')`,
      );
    }
    if (this.mode !== "aggregate") {
      throw new SafeError(`Cannot add having to a non-aggregate query`);
    }
    return new PgConditionStep(this, true);
  }

  having(condition: PgHavingConditionSpec<string>): void {
    if (this.locker.locked) {
      throw new Error(
        `${this}: cannot add having conditions once plan is locked ('having')`,
      );
    }
    if (this.mode !== "aggregate") {
      throw new SafeError(`Cannot add having to a non-aggregate query`);
    }
    if (sql.isSQL(condition)) {
      this.havingConditions.push(condition);
    } else {
      const never: never = condition;
      console.error("Unsupported condition: ", never);
      throw new Error(`Unsupported condition`);
    }
  }

  orderBy(orderSpec: PgUnionAllStepOrder<TAttributes>): void {
    if (this.mode === "aggregate") {
      throw new Error(`${this}: orderBy forbidden in aggregate mode`);
    }
    if (!this.spec.attributes) {
      throw new Error(
        `${this}: cannot order when there's no shared attributes`,
      );
    }
    this.locker.assertParameterUnlocked("orderBy");
    for (const digest of this.memberDigests) {
      const { alias: tableAlias } = digest;
      const ident = sql`${tableAlias}.${digestSpecificExpressionFromAttributeName(
        digest,
        orderSpec.attribute,
      )}`;
      digest.orders.push({
        fragment: ident,
        direction: orderSpec.direction,
        codec: this.spec.attributes[orderSpec.attribute].codec,
      });
    }
    const selectedIndex = this.select(orderSpec.attribute);
    const orderIndex =
      this.orders.push({
        fragment: sql.identifier(String(selectedIndex)),
        direction: orderSpec.direction,
        codec: this.spec.attributes[orderSpec.attribute].codec,
      }) - 1;
    this.orderSelectIndex[orderIndex] = selectedIndex;
  }

  setOrderIsUnique() {
    // TODO: should we do something here to match pgSelect?
  }

  private assertCursorPaginationAllowed(): void {
    if (this.mode === "aggregate") {
      throw new Error(
        "Cannot use cursor pagination on an aggregate PgSelectStep",
      );
    }
  }

  /**
   * Someone (probably pageInfo) wants to know if there's more records. To
   * determine this we fetch one extra record and then throw it away.
   */
  public hasMore(): ExecutableStep<boolean> {
    this.fetchOneExtra = true;
    return access(this, "hasMore", false);
  }

  private applyConditionFromCursor(
    beforeOrAfter: "before" | "after",
    $parsedCursorPlan: LambdaStep<any, any[] | null>,
  ): void {
    const digest = this.getOrderByDigest();
    const orders = this.getOrderBy();
    const orderCount = orders.length;

    // Cursor validity check; if we get inlined then this will be passed up
    // to the parent so we can trust it.
    if (this.connectionDepId === null) {
      this.addDependency(
        pgValidateParsedCursor(
          $parsedCursorPlan,
          digest,
          orderCount,
          beforeOrAfter,
        ),
      );
    } else {
      // To make the error be thrown in the right place, we should also add this error to our parent connection
      const $connection = this.getDep<ConnectionStep<any, any, any>>(
        this.connectionDepId,
      );
      $connection.addValidation(() => {
        return pgValidateParsedCursor(
          $parsedCursorPlan,
          digest,
          orderCount,
          beforeOrAfter,
        );
      });
    }

    if (orderCount === 0) {
      // Natural pagination `['natural', N]`
      const $n = access($parsedCursorPlan, [1]);
      if (beforeOrAfter === "before") {
        this.upperIndexStepId = this.addDependency($n);
      } else {
        this.lowerIndexStepId = this.addDependency($n);
      }
      return;
    }

    const identifierPlaceholders: SQL[] = [];
    for (let i = 0; i < orderCount; i++) {
      const order = this.orders[i];
      if (i === orderCount - 1) {
        // PK (within that polymorphic type)

        identifierPlaceholders[i] = this.placeholder(
          access($parsedCursorPlan, [i + 1]),
          TYPES.json,
          // NOTE: this is a JSON-encoded string containing all the PK values. We
          // don't want to parse it and then re-stringify it, so we'll just feed
          // it in as text and tell the system it has already been encoded:
          true,
        );
      } else if (i === orderCount - 2) {
        // Polymorphic type
        identifierPlaceholders[i] = this.placeholder(
          toPg(access($parsedCursorPlan, [i + 1]), TYPES.text),
          TYPES.text,
        );
      } else if (this.memberDigests.length > 0) {
        const memberCodecs = this.memberDigests.map(
          (d) => d.finalResource.codec,
        );
        const [, codec] = getFragmentAndCodecFromOrder(
          this.alias,
          order,
          memberCodecs,
        );
        identifierPlaceholders[i] = this.placeholder(
          toPg(access($parsedCursorPlan, [i + 1]), codec),
          codec as PgCodec,
        );
      } else {
        // No implementations?!
      }
    }

    for (const digest of this.memberDigests) {
      const { finalResource } = digest;
      const pk = finalResource.uniques?.find((u) => u.isPrimary === true);
      if (!pk) {
        throw new Error("No primary key; this should have been caught earlier");
      }
      const max = orderCount - 1 + pk.attributes.length;
      const pkPlaceholder = identifierPlaceholders[orderCount - 1];
      const pkAttributes = finalResource.codec.attributes as PgCodecAttributes;
      const condition = (i = 0): SQL => {
        const order = digest.orders[i];
        const [
          orderFragment,
          sqlValue,
          direction,
          nullable = false,
          nulls = null,
        ] = (() => {
          if (i >= orderCount - 1) {
            // PK
            const pkIndex = i - (orderCount - 1);
            const pkCol = pk.attributes[pkIndex];
            return [
              sql`${digest.alias}.${sql.identifier(pkCol)}`,
              sql`(${pkPlaceholder}->>${sql.literal(pkIndex)})::${
                pkAttributes[pkCol].codec.sqlType
              }`,
              "ASC",
              false,
            ];
          } else if (i === orderCount - 2) {
            // Type
            return [
              sql.literal(digest.member.typeName),
              identifierPlaceholders[i],
              "ASC",
              false,
            ];
          } else {
            const [frag, _codec, isNullable] = getFragmentAndCodecFromOrder(
              this.alias,
              order,
              digest.finalResource.codec,
            );
            return [
              frag,
              identifierPlaceholders[i],
              order.direction,
              isNullable,
              order.nulls,
            ];
          }
        })();

        // For the truth-table of this code, have a look at this spreadsheet:
        // https://docs.google.com/spreadsheets/d/1m5H-4IRAjhx_Z8v7nd2wMTbmx1dOBof9IroW3WUYE7s/edit?usp=sharing

        const gt =
          (direction === "ASC" && beforeOrAfter === "after") ||
          (direction === "DESC" && beforeOrAfter === "before");

        const nullsFirst =
          nulls === "FIRST"
            ? true
            : nulls === "LAST"
            ? false
            : // NOTE: PostgreSQL states that by default DESC = NULLS FIRST,
              // ASC = NULLS LAST
              direction === "DESC";

        // Simple less than or greater than
        let fragment = sql`${orderFragment} ${
          gt ? sql`>` : sql`<`
        } ${sqlValue}`;

        // Nullable, so now handle if one is null but the other isn't
        if (nullable) {
          const useAIsNullAndBIsNotNull =
            (nullsFirst && beforeOrAfter === "after") ||
            (!nullsFirst && beforeOrAfter === "before");
          const oneIsNull = useAIsNullAndBIsNotNull
            ? sql`${orderFragment} is null and ${sqlValue} is not null`
            : sql`${orderFragment} is not null and ${sqlValue} is null`;
          fragment = sql`((${fragment}) or (${oneIsNull}))`;
        }

        // Finally handle if they're equal - recurse
        if (i < max - 1) {
          const equals = nullable ? sql`is not distinct from` : sql`=`;
          const aEqualsB = sql`${orderFragment} ${equals} ${sqlValue}`;
          fragment = sql`(${fragment})
or (
${sql.indent`${aEqualsB}
and ${condition(i + 1)}`}
)`;
        }

        return sql.parens(sql.indent(fragment));
      };

      const finalCondition = condition();
      digest.conditions.push(finalCondition);
    }
  }

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
    this.locker.lockParameter("first");
    this.locker.lockParameter("last");
    return (
      this.first == null &&
      this.last != null &&
      this.lowerIndexStepId == null &&
      this.upperIndexStepId == null
    );
  }

  public setFirst(first: InputStep | number): this {
    this.locker.assertParameterUnlocked("first");
    // PERF: don't eval
    this.first = typeof first === "number" ? first : first.eval() ?? null;
    this.locker.lockParameter("first");
    return this;
  }

  public setLast(last: InputStep | number): this {
    this.assertCursorPaginationAllowed();
    this.locker.assertParameterUnlocked("orderBy");
    this.locker.assertParameterUnlocked("last");
    this.last = typeof last === "number" ? last : last.eval() ?? null;
    this.locker.lockParameter("last");
    return this;
  }

  public setOffset(offset: InputStep | number): this {
    this.locker.assertParameterUnlocked("offset");
    this.offset = typeof offset === "number" ? offset : offset.eval() ?? null;
    if (this.offset !== null) {
      this.locker.lockParameter("last");
      if (this.last != null) {
        throw new SafeError("Cannot use 'offset' with 'last'");
      }
    }
    this.locker.lockParameter("offset");
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

      const $lower = this.getDepOrConstant<Maybe<number>>(
        this.lowerIndexStepId,
        null,
      );
      const $upper = this.getDepOrConstant<Maybe<number>>(
        this.upperIndexStepId,
        null,
      );

      const limitAndOffsetLambda = lambda(
        [$lower, $upper],
        ([cursorLower, cursorUpper]) => {
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
      const $limitLambda = access<number>(limitAndOffsetLambda, [0]);
      const $offsetLambda = access<number>(limitAndOffsetLambda, [1]);
      const limitPlusOffsetLambda = lambda([$limitLambda, $offsetLambda], add);
      this.limitAndOffsetSQL = sql`\nlimit ${this.placeholder(
        $limitLambda,
        TYPES.int,
      )}\noffset ${this.placeholder($offsetLambda, TYPES.int)}`;
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

  /**
   * So we can quickly detect if cursors are invalid we use this digest,
   * passing this check does not mean that the cursor is valid but it at least
   * catches common user errors.
   */
  public getOrderByDigest() {
    this.locker.lockParameter("orderBy");
    if (this.ordersForCursor.length === 0 || this.memberDigests.length === 0) {
      return "natural";
    }
    // The security of this hash is unimportant; the main aim is to protect the
    // user from themself. If they bypass this, that's their problem (it will
    // not introduce a security issue).
    const hash = createHash("sha256");
    const memberCodecs = this.memberDigests.map(
      (digest) => digest.finalResource.codec,
    );
    hash.update(
      JSON.stringify(
        this.ordersForCursor.map((o) => {
          const [frag] = getFragmentAndCodecFromOrder(
            this.alias,
            o,
            memberCodecs,
          );
          const placeholderValues = new Map<symbol, SQL>();
          for (let i = 0; i < this.placeholders.length; i++) {
            const { symbol } = this.placeholders[i];
            placeholderValues.set(symbol, sql.identifier(`PLACEHOLDER_${i}`));
          }
          return sql.compile(frag, { placeholderValues }).text;
        }),
      ),
    );
    const digest = hash.digest("hex").slice(0, 10);
    return digest;
  }

  public getOrderBy(): ReadonlyArray<PgOrderFragmentSpec> {
    this.locker.lockParameter("orderBy");
    return this.ordersForCursor;
  }
  public getOrderByWithoutType(): ReadonlyArray<PgOrderFragmentSpec> {
    this.locker.lockParameter("orderBy");
    return this.orders;
  }

  /** @experimental */
  limitToTypes(types: readonly string[]): void {
    if (!this._limitToTypes) {
      this._limitToTypes = [...types];
    } else {
      this._limitToTypes = this._limitToTypes.filter((t) => types.includes(t));
    }
  }

  optimize() {
    if (this._limitToTypes) {
      this.memberDigests = this.memberDigests.filter((d) =>
        this._limitToTypes!.includes(d.member.typeName),
      );
    }
    if (this.memberDigests.length === 0) {
      // We have no implementations, we'll never return anything
      return constant([], false);
    }

    this.planLimitAndOffset();

    // We must lock here otherwise we might try and create cursor validation
    // plans during `finalize`
    this.locker.lock();

    return this;
  }

  private typeIdx: number | null = null;
  private reverse: boolean | null = null;
  finalize() {
    this.locker.lock();

    const normalMode = this.mode === "normal";
    this.typeIdx = normalMode ? this.selectType() : null;
    this.reverse = normalMode ? this.shouldReverseOrder() : null;

    super.finalize();
  }

  private buildTheQuery(executionDetails: ExecutionDetails): QueryBuildResult {
    const {
      indexMap,
      count,
      values,
      extra: { eventEmitter },
    } = executionDetails;
    const { typeIdx, reverse } = this;

    const memberCodecs = this.memberDigests.map(
      (digest) => digest.finalResource.codec,
    );
    const makeQuery = () => {
      const tables: SQL[] = [];

      for (const digest of this.memberDigests) {
        const {
          sqlSource,
          alias: tableAlias,
          conditions,
          orders,
          finalResource,
        } = digest;

        const pk = finalResource.uniques?.find((u) => u.isPrimary === true);
        if (!pk) {
          throw new Error(
            `No PK for ${digest.member.typeName} resource in ${this}`,
          );
        }
        const midSelects: SQL[] = [];
        const innerSelects = this.selects
          .map((s, selectIndex) => {
            const r = ((): [SQL, PgCodec] | null => {
              switch (s.type) {
                case "attribute": {
                  if (!this.spec.attributes) {
                    throw new Error(
                      `${this}: cannot select an attribute when there's no shared attributes`,
                    );
                  }
                  const attr = this.spec.attributes[s.attribute];
                  return [
                    sql`${tableAlias}.${digestSpecificExpressionFromAttributeName(
                      digest,
                      s.attribute,
                    )}`,
                    attr.codec,
                  ];
                }
                case "type": {
                  return [sql.literal(digest.member.typeName), TYPES.text];
                }
                case "pk": {
                  return [
                    sql`json_build_array(${sql.join(
                      pk.attributes.map(
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
                case "outerExpression": {
                  // Only applies on outside
                  return null;
                }
                case "order": {
                  const orders = this.getOrderByWithoutType();
                  const orderSpec = orders[s.orderIndex];
                  const [frag, codec] = getFragmentAndCodecFromOrder(
                    this.alias,
                    orderSpec,
                    digest.finalResource.codec,
                  );
                  return [frag, codec];
                }
                default: {
                  const never: never = s;
                  throw new Error(`Couldn't match ${(never as any).type}`);
                }
              }
            })();
            if (!r) {
              return r;
            }
            const [frag, _codec] = r;
            const alias = String(selectIndex);
            const ident = sql.identifier(alias);
            const fullIdent = sql`${tableAlias}.${ident}`;
            midSelects.push(fullIdent);
            return sql`${frag} as ${ident}`;
          })
          .filter(isNotNullish);
        midSelects.push(rowNumberIdent);

        const ascOrDesc = reverse ? sql`desc` : sql`asc`;
        const pkOrder = sql.join(
          pk.attributes.map(
            (c) => sql`${tableAlias}.${sql.identifier(c)} ${ascOrDesc}`,
          ),
          ",\n",
        );
        const orderBy = sql`order by
${sql.indent`${
  orders.length > 0
    ? sql`${sql.join(
        orders.map((orderSpec) => {
          const [frag] = getFragmentAndCodecFromOrder(
            tableAlias,
            orderSpec,
            finalResource.codec,
          );
          return sql`${frag} ${
            Number(orderSpec.direction === "DESC") ^ Number(reverse)
              ? sql`desc`
              : sql`asc`
          }`;
        }),
        `,\n`,
      )},\n`
    : sql.blank
}${pkOrder}`}`;

        innerSelects.push(
          sql`row_number() over (${sql.indent(orderBy)}) as ${rowNumberIdent}`,
        );

        // Can't order individual selects in a `union all` so we're using
        // subqueries to do so.
        const innerQuery = sql.indent`
select
${sql.indent(sql.join(innerSelects, ",\n"))}
from ${sqlSource}
${
  conditions.length > 0
    ? sql`where ${sql.join(conditions, `\nand `)}\n`
    : sql.blank
}\
${orderBy}\
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
        if (select.type === "outerExpression") {
          return sql`${select.expression} as ${sql.identifier(String(i))}`;
        } else if (this.mode === "normal") {
          const sqlSrc = sql`${this.alias}.${sql.identifier(String(i))}`;
          let codec: PgCodec;
          let guaranteedNotNull: boolean | undefined;
          switch (select.type) {
            case "type": {
              codec = TYPES.text;
              break;
            }
            case "pk": {
              codec = TYPES.json;
              guaranteedNotNull = true;
              break;
            }
            case "order": {
              const order = this.getOrderBy()[select.orderIndex];
              codec = getFragmentAndCodecFromOrder(
                this.alias,
                order,
                memberCodecs,
              )[1];
              guaranteedNotNull = order.nullable === false;
              break;
            }
            case "attribute": {
              const attr = this.spec.attributes![select.attribute];
              codec = attr.codec;
              guaranteedNotNull = attr.notNull;
              break;
            }
            default: {
              codec = select.codec;
            }
          }
          return sql`${
            codec.castFromPg?.(sqlSrc, guaranteedNotNull || codec.notNull) ??
            sql`${sqlSrc}::text`
          } as ${sql.identifier(String(i))}`;
        } else {
          // PERF: eradicate this (aggregate mode) without breaking arrayMode
          // tuple numbering
          return sql`null as ${sql.identifier(String(i))}`;
        }
      });

      const unionGroupBy =
        this.mode === "aggregate" && this.groups.length > 0
          ? sql`group by
${sql.indent(
  sql.join(
    this.groups.map((g) => g.fragment),
    ",\n",
  ),
)}
`
          : sql.blank;

      const unionHaving =
        this.mode === "aggregate" && this.havingConditions.length > 0
          ? sql`having
${sql.indent(sql.join(this.havingConditions, ",\n"))}
`
          : sql.blank;

      const unionOrderBy =
        this.mode === "aggregate"
          ? sql.blank
          : sql`\
order by${sql.indent`
${
  this.orders.length
    ? sql`${sql.join(
        this.orders.map((o) => {
          return sql`${o.fragment} ${
            Number(o.direction === "DESC") ^ Number(reverse)
              ? sql`desc`
              : sql`asc`
          }`;
        }),
        ",\n",
      )},\n`
    : sql.blank
}\
${sql.identifier(String(typeIdx))} ${reverse ? sql`desc` : sql`asc`},
${rowNumberIdent} asc\
`}
`;

      // Union must be ordered _before_ applying `::text`/etc transforms to
      // select, so we wrap this with another select.
      const unionQuery = sql.indent`
${sql.join(
  tables,
  `
union all
`,
)}
${unionOrderBy}\
${this.limitAndOffsetSQL!}
`;

      // Adds all the `::text`/etc casting
      const innerQuery = sql`\
select
${sql.indent(sql.join(outerSelects, ",\n"))}
from (${unionQuery}) ${this.alias}
${unionGroupBy}\
${unionHaving}\
`;
      return innerQuery;
    };

    const queryValues: Array<QueryValue> = [];
    const placeholderValues = new Map<symbol, SQL>();

    const { text, rawSqlValues, identifierIndex } = ((): {
      text: string;
      rawSqlValues: SQLRawValue[];
      textForSingle?: string;
      identifierIndex: number | null;
    } => {
      if (this.placeholders.length > 0) {
        const wrapperSymbol = Symbol("union_result");
        const wrapperAlias = sql.identifier(wrapperSymbol);
        const identifiersSymbol = Symbol("union_identifiers");
        const identifiersAlias = sql.identifier(identifiersSymbol);
        this.placeholders.forEach((placeholder) => {
          const { symbol, dependencyIndex, codec, alreadyEncoded } =
            placeholder;
          const ev = values[dependencyIndex];
          if (!ev.isBatch || count == 1) {
            const value = ev.at(0);
            placeholderValues.set(
              symbol,
              sql`${sql.value(
                value == null
                  ? null
                  : alreadyEncoded
                  ? value
                  : codec.toPg(value),
              )}::${codec.sqlType}`,
            );
          } else {
            // Fine a existing match for this dependency of this type
            const existingIndex = queryValues.findIndex((v) => {
              return (
                v.dependencyIndex === placeholder.dependencyIndex &&
                v.codec === placeholder.codec
              );
            });

            // If none exists, add one to our query values
            const idx =
              existingIndex >= 0
                ? existingIndex
                : queryValues.push({
                    dependencyIndex: placeholder.dependencyIndex,
                    codec: placeholder.codec,
                    alreadyEncoded: placeholder.alreadyEncoded,
                  }) - 1;

            // Finally alias this symbol to a reference to this placeholder
            placeholderValues.set(
              placeholder.symbol,
              sql`${identifiersAlias}.${sql.identifier(`id${idx}`)}`,
            );
          }
        });

        const identifierIndex = this.selectAndReturnIndex(
          sql`${identifiersAlias}.idx`,
        );

        // IMPORTANT: this must come after the `selectExpression` call above.
        const innerQuery = makeQuery();

        const {
          text: lateralText,
          values: rawSqlValues,
          [$$symbolToIdentifier]: symbolToIdentifier,
        } = sql.compile(
          sql`lateral (${sql.indent(innerQuery)}) as ${wrapperAlias}`,
          { placeholderValues },
        );
        const identifiersAliasText = symbolToIdentifier.get(identifiersSymbol);
        const wrapperAliasText = symbolToIdentifier.get(wrapperSymbol);

        let lastPlaceholder = rawSqlValues.length;
        /*
         * IMPORTANT: these wrapper queries are necessary so that queries
         * that have a limit/offset get the limit/offset applied _per
         * identifier group_; that's why this cannot just be another "from"
         * clause.
         */
        const text = `\
select ${wrapperAliasText}.*
from (select ids.ordinality - 1 as idx${
          queryValues.length > 0
            ? `, ${queryValues
                .map(({ codec }, idx) => {
                  return `(ids.value->>${idx})::${
                    sql.compile(codec.sqlType).text
                  } as "id${idx}"`;
                })
                .join(", ")}`
            : ""
        } from json_array_elements($${++lastPlaceholder}::json) with ordinality as ids) as ${identifiersAliasText},
${lateralText};`;

        lastPlaceholder = rawSqlValues.length;
        /**
         * This is an optimized query to use when there's only one value to
         * feed in, PostgreSQL seems to be able to execute queries using this
         * _significantly_ faster (up to 3x or 200ms faster).
         */
        const textForSingle = `\
select ${wrapperAliasText}.*
from (select 0 as idx${
          queryValues.length > 0
            ? `, ${queryValues
                .map(({ codec }, idx) => {
                  return `$${++lastPlaceholder}::${
                    sql.compile(codec.sqlType).text
                  } as "id${idx}"`;
                })
                .join(", ")}`
            : ""
        }) as ${identifiersAliasText},
${lateralText};`;

        return { text, textForSingle, rawSqlValues, identifierIndex };
      } else {
        const query = makeQuery();
        const { text, values: rawSqlValues } = sql.compile(query, {
          placeholderValues,
        });
        return { text, rawSqlValues, identifierIndex: null };
      }
    })();

    const shouldReverseOrder = this.shouldReverseOrder();

    // **IMPORTANT**: if streaming we must not reverse order (`shouldReverseOrder` must be `false`)

    const textForSingle = undefined;

    return {
      text,
      textForSingle,
      rawSqlValues,
      identifierIndex,
      shouldReverseOrder,
      name: hash(text),
      nameForSingle: textForSingle ? hash(textForSingle) : undefined,
      queryValues,
    };
  }

  // Be careful if we add streaming - ensure `shouldReverseOrder` is fine.
  async execute(
    executionDetails: ExecutionDetails,
  ): Promise<GrafastValuesList<any>> {
    const {
      indexMap,
      values,
      extra: { eventEmitter },
    } = executionDetails;
    const {
      text,
      rawSqlValues,
      identifierIndex,
      shouldReverseOrder,
      name,
      queryValues,
    } = this.buildTheQuery(executionDetails)!;

    const contextDep = values[this.contextId];
    if (contextDep === undefined) {
      throw new Error("We have no context dependency?");
    }

    const specs = indexMap<PgExecutorInput<any>>((i) => {
      const context = contextDep.at(i);
      return {
        // The context is how we'd handle different connections with different claims
        context,
        queryValues:
          identifierIndex != null
            ? queryValues.map(({ dependencyIndex, codec, alreadyEncoded }) => {
                const val = values[dependencyIndex].at(i);
                return val == null
                  ? null
                  : alreadyEncoded
                  ? val
                  : codec.toPg(val);
              })
            : EMPTY_ARRAY,
      };
    });
    const executeMethod =
      this.operationPlan.operation.operation === "query"
        ? "executeWithCache"
        : "executeWithoutCache";
    const executionResult = await this.executor[executeMethod](specs, {
      text,
      rawSqlValues,
      identifierIndex,
      name,
      eventEmitter,
      useTransaction: false,
    });
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
      if (hasMore) {
        (orderedRows as any).hasMore = true;
      }
      return orderedRows;
    });
  }

  [$$toSQL]() {
    return this.alias;
  }
}

export function pgUnionAll<
  TAttributes extends string,
  TTypeNames extends string,
>(
  spec: PgUnionAllStepConfig<TAttributes, TTypeNames>,
): PgUnionAllStep<TAttributes, TTypeNames> {
  return new PgUnionAllStep(spec);
}
exportAs("@dataplan/pg", pgUnionAll, "pgUnionAll");
