import type { EdgeCapableStep, ExecutableStep, ExecutionExtra } from "grafast";
import {
  exportAs,
  list,
  polymorphicWrap,
  UnbatchedExecutableStep,
} from "grafast";
import type { GraphQLObjectType } from "graphql";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { ObjectFromPgTypeColumns, PgTypeColumn } from "../codecs.js";
import { TYPES } from "../codecs.js";
import type { PgResource } from "../datasource.js";
import type {
  GetPgResourceCodec,
  GetPgResourceColumns,
  PgCodecRelation,
  PgRegistryAny,
  PgResourceAny,
  PgCodec,
  PgCodecAny,
  PgTypedExecutableStep,
} from "../interfaces.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import { pgClassExpression } from "./pgClassExpression.js";
import { PgCursorStep } from "./pgCursor.js";
import type { PgSelectMode } from "./pgSelect.js";
import { getFragmentAndCodecFromOrder, PgSelectStep } from "./pgSelect.js";
// import debugFactory from "debug";

// const debugPlan = debugFactory("datasource:pg:PgSelectSingleStep:plan");
// const debugExecute = debugFactory("datasource:pg:PgSelectSingleStep:execute");
// const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

export interface PgSelectSinglePlanOptions {
  fromRelation?: [PgSelectSingleStep<PgResourceAny>, string];
}

// Types that only take a few bytes so adding them to the selection would be
// cheap to do.
const CHEAP_COLUMN_TYPES = new Set([
  TYPES.int2,
  TYPES.int,
  TYPES.bigint,
  TYPES.float,
  TYPES.float4,
  TYPES.uuid,
  TYPES.boolean,
  TYPES.date,
  TYPES.timestamp,
  TYPES.timestamptz,
]);

/**
 * Represents the single result of a unique PgSelectStep. This might be
 * retrieved explicitly by PgSelectStep.single(), or implicitly (via Grafast)
 * by PgSelectStep.item(). Since this is the result of a fetch it does not make
 * sense to support changing `.where` or similar; however we now add methods
 * such as `.get` and `.cursor` which can receive specific properties by
 * telling the PgSelectStep to select the relevant expressions.
 */
export class PgSelectSingleStep<
    TSource extends PgResource<any, any, any, any, any>,
  >
  extends UnbatchedExecutableStep<
    unknown[] /* What we return will be a tuple based on the values selected */
  >
  implements
    PgTypedExecutableStep<
      TSource extends PgResource<any, infer UCodec, any, any, any>
        ? UCodec
        : never
    >,
    EdgeCapableStep<any>
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSelectSingleStep",
  };
  isSyncAndSafe = true;

  public readonly pgCodec: GetPgResourceCodec<TSource>;
  public readonly itemStepId: number;
  public readonly mode: PgSelectMode;
  private classStepId: number;
  private nullCheckId: number | null = null;
  public readonly source: TSource;
  private _coalesceToEmptyObject = false;
  private typeStepIndexList: number[] | null = null;

  constructor(
    $class: PgSelectStep<TSource>,
    $item: ExecutableStep<unknown[]>,
    private options: PgSelectSinglePlanOptions = Object.create(null),
  ) {
    super();
    this.itemStepId = this.addDependency($item);
    this.source = $class.source;
    this.pgCodec = this.source.codec as GetPgResourceCodec<TSource>;
    this.mode = $class.mode;
    this.classStepId = $class.id;
  }

  public coalesceToEmptyObject(): void {
    this._coalesceToEmptyObject = true;
  }

  public toStringMeta(): string {
    return this.source.name;
  }

  public getClassStep(): PgSelectStep<TSource> {
    if (this.isOptimized) {
      throw new Error(`Cannot ${this}.getClassStep() after we're optimized.`);
    }
    const plan = this.getStep(this.classStepId);
    if (!(plan instanceof PgSelectStep)) {
      throw new Error(
        `Expected ${this.classStepId} (${plan}) to be a PgSelectStep`,
      );
    }
    return plan;
  }

  private getItemStep(): ExecutableStep<unknown[]> {
    const plan = this.getDep(this.itemStepId);
    return plan;
  }

  /**
   * Do not rely on this, we're going to refactor it to work a different way at some point.
   *
   * @internal
   */
  getSelfNamed(): PgClassExpressionStep<GetPgResourceCodec<TSource>, TSource> {
    if (this.mode === "aggregate") {
      throw new Error("Invalid call to getSelfNamed on aggregate plan");
    }
    // Hack because I don't want to duplicate the code.
    return this.get("" as any) as any;
  }

  /**
   * Returns a plan representing a named attribute (e.g. column) from the class
   * (e.g. table).
   */
  get<TAttr extends keyof GetPgResourceColumns<TSource>>(
    attr: TAttr,
  ): PgClassExpressionStep<
    GetPgResourceColumns<TSource>[TAttr] extends PgTypeColumn<infer UCodec, any>
      ? UCodec
      : never,
    TSource
  > {
    if (this.mode === "aggregate") {
      throw new Error("Invalid call to .get() on aggregate plan");
    }
    if (!this.source.codec.columns && attr !== "") {
      throw new Error(
        `Cannot call ${this}.get() when the source codec (${this.source.codec.name}) has no columns to get.`,
      );
    }
    const classPlan = this.getClassStep();
    // TODO: where do we do the SQL conversion, e.g. to_json for dates to
    // enforce ISO8601? Perhaps this should be the datasource itself, and
    // `attr` should be an SQL expression? This would allow for computed
    // fields/etc too (admittedly those without arguments).
    const dataSourceColumn: PgTypeColumn | undefined =
      this.source.codec.columns?.[attr as string];
    if (!dataSourceColumn && attr !== "") {
      throw new Error(
        `${this.source} does not define an attribute named '${String(attr)}'`,
      );
    }

    if (dataSourceColumn?.via) {
      const { relation, attribute } = this.source.resolveVia(
        dataSourceColumn.via,
        attr as string,
      );
      return this.singleRelation(relation as any).get(attribute) as any;
    }

    if (dataSourceColumn?.identicalVia) {
      const { relation, attribute } = this.source.resolveVia(
        dataSourceColumn.identicalVia,
        attr as string,
      );

      const $existingPlan = this.existingSingleRelation(relation as any);
      if ($existingPlan) {
        // Relation exists already; load it from there for efficiency
        return $existingPlan.get(attribute) as any;
      } else {
        // Load it from ourself instead
      }
    }

    if (this.options.fromRelation) {
      const [$fromPlan, fromRelationName] = this.options.fromRelation;
      const matchingColumn = (
        Object.entries($fromPlan.source.codec.columns!) as Array<
          [string, PgTypeColumn]
        >
      ).find(([name, col]) => {
        if (col.identicalVia) {
          const { relation, attribute } = $fromPlan.source.resolveVia(
            col.identicalVia,
            name,
          );
          if (attribute === attr && relation === fromRelationName) {
            return true;
          }
        }
        return false;
      });
      if (matchingColumn) {
        return $fromPlan.get(matchingColumn[0]) as any;
      }
    }

    /*
     * Only cast to `::text` during select; we want to use it uncasted in
     * conditions/etc. The reasons we cast to ::text include:
     *
     * - to make return values consistent whether they're direct or in nested
     *   arrays
     * - to make sure that that various PostgreSQL clients we support do not
     *   mangle the data in unexpected ways - we take responsibility for
     *   decoding these string values.
     */

    const sqlExpr = pgClassExpression<any, TSource>(
      this,
      attr === ""
        ? this.source.codec
        : this.source.codec.columns![attr as string].codec,
    );
    const colPlan = dataSourceColumn
      ? dataSourceColumn.expression
        ? sqlExpr`${sql.parens(dataSourceColumn.expression(classPlan.alias))}`
        : sqlExpr`${classPlan.alias}.${sql.identifier(String(attr))}`
      : sqlExpr`${classPlan.alias}.v`; /* single column */

    if (
      this.nonNullColumn == null &&
      typeof attr === "string" &&
      attr.length > 0 &&
      dataSourceColumn &&
      !dataSourceColumn.expression &&
      dataSourceColumn.notNull
    ) {
      // We know the row is null iff this attribute is null
      this.nonNullColumn = { column: dataSourceColumn, attr };
    }

    return colPlan as any;
  }

  public select<TExpressionCodec extends PgCodecAny>(
    fragment: SQL,
    codec: TExpressionCodec,
  ): PgClassExpressionStep<TExpressionCodec, TSource> {
    const sqlExpr = pgClassExpression<TExpressionCodec, TSource>(this, codec);
    return sqlExpr`${fragment}`;
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

  public placeholder($step: PgTypedExecutableStep<any>): SQL;
  public placeholder(
    $step: ExecutableStep<any>,
    codec: PgCodec<any, any, any>,
  ): SQL;
  public placeholder(
    $step: ExecutableStep<any> | PgTypedExecutableStep<any>,
    overrideCodec?: PgCodec<any, any, any>,
  ): SQL {
    return overrideCodec
      ? this.getClassStep().placeholder($step, overrideCodec)
      : this.getClassStep().placeholder($step as PgTypedExecutableStep<any>);
  }

  private existingSingleRelation<
    TRelationName extends TSource extends PgResource<
      any,
      PgCodec<infer UCodecName, any, any, any, any, any, any>,
      any,
      any,
      infer URegistry
    >
      ? keyof URegistry["pgRelations"][UCodecName]
      : never,
  >(
    relationIdentifier: TRelationName,
  ): PgSelectSingleStep<
    TSource extends PgResource<
      any,
      PgCodec<infer UCodecName, any, any, any, any, any, any>,
      any,
      any,
      infer URegistry
    >
      ? URegistry["pgRelations"][UCodecName][TRelationName]["remoteSource"]
      : never
  > | null {
    if (this.options.fromRelation) {
      const [$fromPlan, fromRelationName] = this.options.fromRelation;
      // check to see if we already came via this relationship
      const reciprocal = this.source.getReciprocal(
        $fromPlan.source.codec,
        fromRelationName,
      );
      if (reciprocal) {
        const reciprocalRelationName = reciprocal[0];
        if (reciprocalRelationName === relationIdentifier) {
          const reciprocalRelation = reciprocal[1];
          if (reciprocalRelation.isUnique) {
            return $fromPlan as PgSelectSingleStep<any>;
          }
        }
      }
    }
    return null;
  }

  public singleRelation<
    TRelationName extends TSource extends PgResource<
      any,
      PgCodec<infer UCodecName, any, any, any, any, any, any>,
      any,
      any,
      infer URegistry
    >
      ? keyof URegistry["pgRelations"][UCodecName]
      : never,
  >(
    relationIdentifier: TRelationName,
  ): PgSelectSingleStep<
    TSource extends PgResource<
      any,
      PgCodec<infer UCodecName, any, any, any, any, any, any>,
      any,
      any,
      infer URegistry
    >
      ? URegistry["pgRelations"][UCodecName][TRelationName]["remoteSource"]
      : never
  > {
    const $existingPlan = this.existingSingleRelation(relationIdentifier);
    if ($existingPlan) {
      return $existingPlan;
    }
    const relation: PgCodecRelation<any, any> = this.source.getRelation(
      relationIdentifier as string,
    );
    if (!relation || !relation.isUnique) {
      throw new Error(
        `${String(relationIdentifier)} is not a unique relation on ${
          this.source
        }`,
      );
    }
    const { remoteSource, remoteColumns, localColumns } = relation;

    const options: PgSelectSinglePlanOptions = {
      fromRelation: [
        this as PgSelectSingleStep<any>,
        relationIdentifier as string,
      ],
    };
    return remoteSource.get(
      remoteColumns.reduce((memo, remoteColumn, columnIndex) => {
        memo[remoteColumn] = this.get(localColumns[columnIndex]);
        return memo;
      }, Object.create(null)),
      options,
    ) as PgSelectSingleStep<any>;
  }

  public manyRelation<
    TRelationName extends keyof TSource["registry"]["pgRelations"][TSource["codec"]["name"]],
  >(
    relationIdentifier: TRelationName,
  ): TSource["registry"]["pgRelations"][TSource["codec"]["name"]][TRelationName] {
    const relation: PgCodecRelation<any, any> =
      this.source.getRelation(relationIdentifier);
    if (!relation) {
      throw new Error(
        `${String(relationIdentifier)} is not a relation on ${this.source}`,
      );
    }
    const { remoteSource, remoteColumns, localColumns } = relation;

    return remoteSource.find(
      remoteColumns.reduce((memo, remoteColumn, columnIndex) => {
        memo[remoteColumn] = this.get(localColumns[columnIndex]);
        return memo;
      }, Object.create(null)),
    ) as any;
  }

  public record(): PgClassExpressionStep<GetPgResourceCodec<TSource>, TSource> {
    return pgClassExpression<GetPgResourceCodec<TSource>, TSource>(
      this,
      this.source.codec as GetPgResourceCodec<TSource>,
    )`${this.getClassStep().alias}`;
  }

  /**
   * Returns a plan representing the result of an expression.
   */
  expression<TExpressionCodec extends PgCodecAny>(
    expression: SQL,
    codec: TExpressionCodec,
  ): PgClassExpressionStep<TExpressionCodec, TSource> {
    return pgClassExpression<TExpressionCodec, TSource>(
      this,
      codec,
    )`${expression}`;
  }

  /**
   * @internal
   * For use by PgCursorStep
   */
  public getCursorDigestAndStep(): [string, ExecutableStep] {
    const classPlan = this.getClassStep();
    const digest = classPlan.getOrderByDigest();
    const orders = classPlan.getOrderBy();
    const step = list(
      orders.length > 0
        ? orders.map((o) => {
            const [frag, codec] = getFragmentAndCodecFromOrder(
              this.getClassStep().alias,
              o,
              this.getClassStep().source.codec,
            );
            return this.expression(frag, codec);
          })
        : // No ordering; so use row number
          [this.expression(sql`row_number() over (partition by 1)`, TYPES.int)],
    );
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

  /**
   * For compatibility with EdgeCapableStep.
   */
  public node(): this {
    return this;
  }

  deduplicate(peers: PgSelectSingleStep<any>[]): PgSelectSingleStep<TSource>[] {
    // We've been careful to not store anything locally so we shouldn't
    // need to move anything across to the peer.
    return peers.filter((peer) => {
      if (peer.source !== this.source) {
        return false;
      }
      if (peer.getClassStep() !== this.getClassStep()) {
        return false;
      }
      if (peer.getItemStep() !== this.getItemStep()) {
        return false;
      }
      return true;
    });
  }

  planForType(type: GraphQLObjectType): ExecutableStep {
    const poly = (this.source.codec as PgCodecAny).polymorphism;
    if (poly?.mode === "single") {
      return this;
    } else if (poly?.mode === "relational") {
      for (const spec of Object.values(poly.types)) {
        if (spec.name === type.name) {
          return this.singleRelation(spec.relationName as any);
        }
      }
      throw new Error(
        `${this} Could not find matching name for relational polymorphic '${type.name}'`,
      );
    } else {
      throw new Error(
        `${this}: Don't know how to plan this as polymorphic for ${type}`,
      );
    }
  }

  private nonNullColumn: { column: PgTypeColumn; attr: string } | null = null;
  private nullCheckAttributeIndex: number | null = null;
  optimize() {
    const poly = (this.source.codec as PgCodecAny).polymorphism;
    if (poly?.mode === "single" || poly?.mode === "relational") {
      const $class = this.getClassStep();
      this.typeStepIndexList = poly.typeColumns.map((col) => {
        const attr = this.source.codec.columns![col];
        const expr = sql`${$class.alias}.${sql.identifier(String(col))}`;

        return $class.selectAndReturnIndex(
          attr.codec.castFromPg
            ? attr.codec.castFromPg(expr)
            : sql`${expr}::text`,
        );
      });
    } else {
      this.typeStepIndexList = null;
    }

    const columns = this.source.codec.columns;
    if (columns && this.getClassStep().mode !== "aggregate") {
      // We need to see if this row is null. The cheapest way is to select a
      // non-null column, but failing that we invoke the codec's
      // nonNullExpression (indirectly).
      const getSuitableColumn = () => {
        // We want to find a _cheap_ not-null column to select to prove that
        // the row is not null. Critically this must be a column that we can
        // always select (i.e.  is not prevented by any column-level select
        // privileges).
        for (const attr of Object.keys(columns)) {
          const column = columns[attr];
          if (
            column.notNull &&
            CHEAP_COLUMN_TYPES.has(column.codec) &&
            !column.restrictedAccess
          ) {
            return {
              column,
              attr,
            };
          }
        }
        return null;
      };
      const nonNullColumn = this.nonNullColumn ?? getSuitableColumn();
      if (nonNullColumn != null) {
        const {
          column: { codec },
          attr,
        } = nonNullColumn;
        const expression = sql`${this.getClassStep().alias}.${sql.identifier(
          attr,
        )}`;
        this.nullCheckAttributeIndex = this.getClassStep().selectAndReturnIndex(
          codec.castFromPg
            ? codec.castFromPg(expression)
            : sql`${sql.parens(expression)}::text`,
        );
      } else {
        this.nullCheckId = this.getClassStep().getNullCheckIndex();
      }
    }
    return this;
  }

  finalize() {
    const poly = this.source.codec.polymorphism;
    if (poly?.mode === "single" || poly?.mode === "relational") {
      this.handlePolymorphism = (val) => {
        if (val == null) return val;
        const typeList = this.typeStepIndexList!.map((i) => val[i]);
        const key = String(typeList);
        const entry = poly.types[key];
        if (entry) {
          return polymorphicWrap(entry.name, val);
        }
        return null;
      };
    }
    return super.finalize();
  }

  handlePolymorphism?: (result: any) => any;

  unbatchedExecute(
    extra: ExecutionExtra,
    result: ObjectFromPgTypeColumns<GetPgResourceColumns<TSource>>,
  ): unknown[] {
    if (result == null) {
      return this._coalesceToEmptyObject ? Object.create(null) : null;
    } else if (this.nullCheckAttributeIndex != null) {
      const nullIfAttributeNull = result[this.nullCheckAttributeIndex];
      if (nullIfAttributeNull == null) {
        return this._coalesceToEmptyObject ? Object.create(null) : null;
      }
    } else if (this.nullCheckId != null) {
      const nullIfExpressionNotTrue = result[this.nullCheckId];
      if (
        nullIfExpressionNotTrue == null ||
        TYPES.boolean.fromPg(nullIfExpressionNotTrue) != true
      ) {
        return this._coalesceToEmptyObject ? Object.create(null) : null;
      }
    }
    return this.handlePolymorphism ? this.handlePolymorphism(result) : result;
  }
}

/**
 * Given a plan that represents a single record (via
 * PgSelectSingleStep.record()) this turns it back into a PgSelectSingleStep
 */
export function pgSelectFromRecord<
  TSource extends PgResource<
    any,
    PgCodec<any, any, any, any, any, any, any>,
    any,
    any,
    PgRegistryAny
  >,
>(
  source: TSource,
  $record: PgClassExpressionStep<GetPgResourceCodec<TSource>, TSource>,
): PgSelectStep<TSource> {
  return new PgSelectStep<TSource>({
    source,
    identifiers: [],
    from: (record) => sql`(select (${record.placeholder}).*)`,
    args: [{ step: $record, pgCodec: source.codec }],
    joinAsLateral: true,
  });
}

/**
 * Given a plan that represents a single record (via
 * PgSelectSingleStep.record()) this turns it back into a PgSelectSingleStep
 */
export function pgSelectSingleFromRecord<TSource extends PgResourceAny>(
  source: TSource,
  $record: PgClassExpressionStep<GetPgResourceCodec<TSource>, TSource>,
): PgSelectSingleStep<TSource> {
  // OPTIMIZE: we should be able to optimise this so that `plan.record()` returns the original record again.
  return pgSelectFromRecord(
    source,
    $record,
  ).single() as PgSelectSingleStep<TSource>;
}

exportAs("@dataplan/pg", pgSelectFromRecord, "pgSelectFromRecord");
exportAs("@dataplan/pg", pgSelectSingleFromRecord, "pgSelectSingleFromRecord");
