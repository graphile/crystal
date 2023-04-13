import { jsonParse } from "@dataplan/json";
import { createHash } from "crypto";
import type {
  __InputStaticLeafStep,
  ConnectionCapableStep,
  ConnectionStep,
  EdgeCapableStep,
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
  InputStep,
  LambdaStep,
  PolymorphicStep,
} from "grafast";
import {
  __ItemStep,
  access,
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
import type { GraphQLObjectType } from "graphql";
import type { SQL, SQLRawValue } from "pg-sql2";
import { $$symbolToIdentifier, sql } from "pg-sql2";

import type { PgCodecAttributes } from "../codecs.js";
import { TYPES } from "../codecs.js";
import type { PgResource, PgResourceUnique } from "../datasource.js";
import type { PgExecutor } from "../executor.js";
import type { PgCodecRefPath, PgCodecRelation, PgGroupSpec } from "../index.js";
import type {
  PgCodec,
  PgOrderFragmentSpec,
  PgOrderSpec,
  PgTypedExecutableStep,
} from "../interfaces.js";
import { PgLocker } from "../pgLocker.js";
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
      codec: PgCodec;
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
  codec: PgCodec;
  symbol: symbol;
};

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
    return (this.getDep(0) as any).getDep(0);
  }

  public node() {
    return this;
  }

  /**
   * Returns a plan representing the result of an expression.
   */
  expression<TExpressionCodec extends PgCodec>(
    expression: SQL,
    codec: TExpressionCodec,
  ): PgClassExpressionStep<TExpressionCodec, any> {
    return pgClassExpression<TExpressionCodec, any>(this, codec)`${expression}`;
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
  ): PgClassExpressionStep<TExpressionCodec, any> {
    const sqlExpr = pgClassExpression<TExpressionCodec, any>(this, codec);
    return sqlExpr`${fragment}`;
  }

  execute(
    _count: number,
    values: [GrafastValuesList<any>],
  ): GrafastResultsList<any> {
    if (this.typeKey !== null) {
      const typeKey = this.typeKey;
      return values[0].map((v) => {
        const type = v[typeKey];
        return polymorphicWrap(type, v);
      });
    } else {
      return values[0];
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

/**
 * Represents a `UNION ALL` statement, which can have multiple table-like
 * resources, but must return a consistent data shape.
 */
export class PgUnionAllStep<
    TAttributes extends string = string,
    TTypeNames extends string = string,
  >
  extends ExecutableStep
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
   * Since this is effectively like a DataLoader it processes the data for many
   * different resolvers at once. This list of (hopefully scalar) plans is used
   * to represent queryValues the query will need such as identifiers for which
   * records in the result set should be returned to which GraphQL resolvers,
   * parameters for conditions or orders, etc.
   */
  private queryValues: Array<QueryValue>;

  /**
   * Values used in this plan.
   */
  private placeholders: Array<PgUnionAllPlaceholder>;
  private placeholderValues: Map<symbol, SQL>;

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

  /**
   * When finalized, we build the SQL query, queryValues, and note where to feed in
   * the relevant queryValues. This saves repeating this work at execution time.
   */
  private finalizeResults: {
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
  } | null = null;

  private limitAndOffsetSQL: SQL | null = null;
  private innerLimitSQL: SQL | null = null;

  public readonly mode: PgUnionAllMode;

  private locker: PgLocker<this> = new PgLocker(this);

  private memberDigests: MemberDigest<TTypeNames>[];

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
      this.memberDigests = cloneFrom.memberDigests;

      cloneFrom.dependencies.forEach((planId, idx) => {
        const myIdx = this.addDependency(cloneFrom.getDep(idx), true);
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
      this.queryValues = [...cloneFrom.queryValues];
      this.placeholderValues = new Map(cloneFrom.placeholderValues);
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
      this.symbol = Symbol("union"); // TODO: add variety
      this.alias = sql.identifier(this.symbol);
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

      this.selects = [];
      this.placeholders = [];
      this.queryValues = [];
      this.placeholderValues = new Map();
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
            this.getDep(this.beforeStepId) as any,
          );
        }
        if (this.afterStepId != null) {
          this.applyConditionFromCursor(
            "after",
            this.getDep(this.afterStepId) as any,
          );
        }
      });
    });
  }

  connectionClone(
    $connection: ConnectionStep<any, any, any, any>,
    mode?: PgUnionAllMode,
  ): PgUnionAllStep<TAttributes, TTypeNames> {
    return new PgUnionAllStep(this, mode);
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
        codec: this.spec.attributes[key].codec,
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
    // TODO: should this be on a clone plan? I don't currently think so since
    // PgSelectSingleStep does not allow for `.where` divergence (since it
    // does not support `.where`).
    return new PgUnionAllSingleStep(this, first(this));
  }

  single() {
    return this.singleAsRecord();
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

  public placeholder($step: PgTypedExecutableStep<any>): SQL;
  public placeholder($step: ExecutableStep, codec: PgCodec): SQL;
  public placeholder(
    $step: ExecutableStep | PgTypedExecutableStep<any>,
    overrideCodec?: PgCodec,
  ): SQL {
    if (this.locker.locked) {
      throw new Error(`${this}: cannot add placeholders once plan is locked`);
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

  private applyConditionFromCursor(
    beforeOrAfter: "before" | "after",
    $parsedCursorPlan: LambdaStep<any, any[] | null>,
  ): void {
    const digest = this.getOrderByDigest();
    const orders = this.getOrderBy();
    const orderCount = orders.length;

    // Cursor validity check; if we get inlined then this will be passed up
    // to the parent so we can trust it.
    this.addDependency(
      pgValidateParsedCursor(
        $parsedCursorPlan,
        digest,
        orderCount,
        beforeOrAfter,
      ),
    );

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

        // NOTE: this is a JSON-encoded string containing all the PK values. We
        // don't want to parse it and then re-stringify it, so we'll just feed
        // it in as text and then cast it ourself:
        // HACK: would be better to have the placeholder be 'json' type, not
        // 'text' type.
        identifierPlaceholders[i] = sql`(${this.placeholder(
          access($parsedCursorPlan, [i + 1]),
          TYPES.text,
        )})::json`;
      } else if (i === orderCount - 2) {
        // Polymorphic type
        identifierPlaceholders[i] = this.placeholder(
          toPg(access($parsedCursorPlan, [i + 1]), TYPES.text),
          TYPES.text,
        );
      } else {
        // HACK: this is bad. We're getting the codec from just one of the
        // members and assuming the type for the given attribute will match for
        // all of them. We should either validate that this is the same, change
        // the signature of `getFragmentAndCodecFromOrder` to pass all the
        // codecs (and maybe even attribute mapping), or... I dunno... fix it
        // some other way.
        const mutualCodec = this.memberDigests[0].finalResource.codec;
        const [, codec] = getFragmentAndCodecFromOrder(
          this.alias,
          order,
          mutualCodec,
        );
        identifierPlaceholders[i] = this.placeholder(
          toPg(access($parsedCursorPlan, [i + 1]), codec),
          codec as PgCodec,
        );
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
        const [orderFragment, sqlValue, direction] = (() => {
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
            ];
          } else if (i === orderCount - 2) {
            // Type
            return [
              sql.literal(digest.member.typeName),
              identifierPlaceholders[i],
              "ASC",
            ];
          } else {
            const [frag] = getFragmentAndCodecFromOrder(
              this.alias,
              order,
              digest.finalResource.codec,
            );
            return [frag, identifierPlaceholders[i], order.direction];
          }
        })();
        // FIXME: _iff_ `orderFragment` is nullable _and_ `order.nulls` is
        // non-null then we need to factor `NULLS LAST` / `NULLS FIRST` into
        // this calculation.
        const gt =
          (direction === "ASC" && beforeOrAfter === "after") ||
          (direction === "DESC" && beforeOrAfter === "before");

        let fragment = sql`${orderFragment} ${
          gt ? sql`>` : sql`<`
        } ${sqlValue}`;

        if (i < max - 1) {
          fragment = sql`(${fragment})
or (
${sql.indent`${orderFragment} = ${sqlValue}
and ${condition(i + 1)}`}
)`;
        }

        return sql.parens(sql.indent(fragment));
      };

      const finalCondition = condition();
      digest.conditions.push(finalCondition);
    }
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
    // TODO: don't eval
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

      const $lower =
        this.lowerIndexStepId != null
          ? (this.getDep(this.lowerIndexStepId) as ExecutableStep<
              number | null | undefined
            >)
          : constant(null);
      const $upper =
        this.upperIndexStepId != null
          ? (this.getDep(this.upperIndexStepId) as ExecutableStep<
              number | null | undefined
            >)
          : constant(null);

      const limitAndOffsetLambda = lambda(
        list([$lower, $upper]),
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
    if (this.ordersForCursor.length === 0) {
      return "natural";
    }
    // The security of this hash is unimportant; the main aim is to protect the
    // user from themself. If they bypass this, that's their problem (it will
    // not introduce a security issue).
    const hash = createHash("sha256");

    // HACK: this is bad. We're getting the codec from just one of the
    // members and assuming the type for the given attribute will match for
    // all of them. We should either validate that this is the same, change
    // the signature of `getFragmentAndCodecFromOrder` to pass all the
    // codecs (and maybe even attribute mapping), or... I dunno... fix it
    // some other way.
    const mutualCodec = this.memberDigests[0].finalResource.codec;

    hash.update(
      JSON.stringify(
        this.ordersForCursor.map((o) => {
          const [frag] = getFragmentAndCodecFromOrder(
            this.alias,
            o,
            mutualCodec,
          );
          return sql.compile(frag, {
            placeholderValues: this.placeholderValues,
          }).text;
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

  optimize() {
    this.planLimitAndOffset();
    return this;
  }

  finalize() {
    this.locker.lock();
    const normalMode = this.mode === "normal";
    const typeIdx = normalMode ? this.selectType() : null;
    const reverse = normalMode ? this.shouldReverseOrder() : null;

    // HACK: THIS IS UNSAFE. See "HACK: this is bad" comments.
    const mutualCodec = this.memberDigests[0].finalResource.codec;

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
                  // TODO: check that attr.codec is compatible with the s.codec (and if not, do the necessary casting?)
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

        const ascOrDesc = this.shouldReverseOrder() ? sql`desc` : sql`asc`;
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
          const codec =
            select.type === "type"
              ? TYPES.text
              : select.type === "pk"
              ? TYPES.json
              : select.type === "order"
              ? getFragmentAndCodecFromOrder(
                  this.alias,
                  this.getOrderBy()[select.orderIndex],
                  mutualCodec,
                )[1]
              : select.codec;
          return sql`${
            codec.castFromPg?.(sqlSrc) ?? sql`${sqlSrc}::text`
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

    const { text, rawSqlValues, identifierIndex } = ((): {
      text: string;
      rawSqlValues: SQLRawValue[];
      textForSingle?: string;
      identifierIndex: number | null;
    } => {
      if (this.queryValues.length > 0 || this.placeholders.length > 0) {
        const wrapperSymbol = Symbol("union_result");
        const wrapperAlias = sql.identifier(wrapperSymbol);
        const identifiersSymbol = Symbol("union_identifiers");
        const identifiersAlias = sql.identifier(identifiersSymbol);
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
          {
            placeholderValues: this.placeholderValues,
          },
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
from (select ids.ordinality - 1 as idx, ${this.queryValues
          .map(({ codec }, idx) => {
            return `(ids.value->>${idx})::${
              sql.compile(codec.sqlType).text
            } as "id${idx}"`;
          })
          .join(
            ", ",
          )} from json_array_elements($${++lastPlaceholder}::json) with ordinality as ids) as ${identifiersAliasText},
${lateralText};`;

        lastPlaceholder = rawSqlValues.length;
        /**
         * This is an optimized query to use when there's only one value to
         * feed in, PostgreSQL seems to be able to execute queries using this
         * _significantly_ faster (up to 3x or 200ms faster).
         */
        const textForSingle = `\
select ${wrapperAliasText}.*
from (select 0 as idx, ${this.queryValues
          .map(({ codec }, idx) => {
            return `$${++lastPlaceholder}::${
              sql.compile(codec.sqlType).text
            } as "id${idx}"`;
          })
          .join(", ")}) as ${identifiersAliasText},
${lateralText};`;

        return { text, textForSingle, rawSqlValues, identifierIndex };
      } else {
        const query = makeQuery();
        const { text, values: rawSqlValues } = sql.compile(query, {
          placeholderValues: this.placeholderValues,
        });
        return { text, rawSqlValues, identifierIndex: null };
      }
    })();

    const shouldReverseOrder = this.shouldReverseOrder();

    // **IMPORTANT**: if streaming we must not reverse order (`shouldReverseOrder` must be `false`)

    const textForSingle = undefined;

    this.finalizeResults = {
      text,
      textForSingle,
      rawSqlValues,
      identifierIndex,
      shouldReverseOrder,
      name: hash(text),
      nameForSingle: textForSingle ? hash(textForSingle) : undefined,
    };

    super.finalize();
  }

  // Be careful if we add streaming - ensure `shouldReverseOrder` is fine.
  async execute(
    _count: number,
    values: Array<GrafastValuesList<any>>,
    { eventEmitter }: ExecutionExtra,
  ): Promise<GrafastValuesList<any>> {
    const { text, rawSqlValues, identifierIndex, shouldReverseOrder, name } =
      this.finalizeResults!;

    const contexts = values[this.contextId];
    if (!contexts) {
      throw new Error("We have no context dependency?");
    }

    const executionResult = await this.executor.executeWithCache(
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
        // HACK: this is an ugly hack; really we should consider resolving to an
        // object that can contain metadata as well as the rows.
        Object.defineProperty(orderedRows, "hasMore", { value: hasMore });
      }
      return orderedRows;
    });
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
