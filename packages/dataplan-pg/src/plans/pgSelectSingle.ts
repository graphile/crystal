import type {
  CrystalResultsList,
  CrystalValuesList,
  EdgeCapablePlan,
} from "dataplanner";
import { ExecutablePlan } from "dataplanner";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgTypeColumn, PgTypeColumns } from "../codecs.js";
import { TYPES } from "../codecs.js";
import type {
  PgSource,
  PgSourceParameter,
  PgSourceRelation,
  PgSourceRow,
  PgSourceUnique,
} from "../datasource.js";
import { PgSourceBuilder } from "../datasource.js";
import type { PgTypeCodec, PgTypedExecutablePlan } from "../interfaces.js";
import type { PgClassExpressionPlan } from "./pgClassExpression.js";
import { pgClassExpression } from "./pgClassExpression.js";
import { PgCursorPlan } from "./pgCursor.js";
import type { PgSelectMode } from "./pgSelect.js";
import { PgSelectPlan } from "./pgSelect.js";
// import debugFactory from "debug";

// const debugPlan = debugFactory("datasource:pg:PgSelectSinglePlan:plan");
// const debugExecute = debugFactory("datasource:pg:PgSelectSinglePlan:execute");
// const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

export interface PgSelectSinglePlanOptions {
  fromRelation?: [PgSelectSinglePlan<any, any, any, any>, string];
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
 * Represents the single result of a unique PgSelectPlan. This might be
 * retrieved explicitly by PgSelectPlan.single(), or implicitly (via
 * Graphile Crystal) by PgSelectPlan.item(). Since this is the result of a
 * fetch it does not make sense to support changing `.where` or similar;
 * however we now add methods such as `.get` and `.cursor` which can receive
 * specific properties by telling the PgSelectPlan to select the relevant
 * expressions.
 */
export class PgSelectSinglePlan<
    TColumns extends PgTypeColumns | undefined,
    TUniques extends ReadonlyArray<
      PgSourceUnique<Exclude<TColumns, undefined>>
    >,
    TRelations extends {
      [identifier: string]: TColumns extends PgTypeColumns
        ? PgSourceRelation<TColumns, any>
        : never;
    },
    TParameters extends PgSourceParameter[] | undefined = undefined,
  >
  extends ExecutablePlan<PgSourceRow<TColumns> | null>
  implements
    PgTypedExecutablePlan<PgTypeCodec<TColumns, any, any>>,
    EdgeCapablePlan<any>
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSelectSinglePlan",
  };
  isSyncAndSafe = true;

  public readonly pgCodec: PgTypeCodec<TColumns, any, any>;
  public readonly itemPlanId: number;
  public readonly mode: PgSelectMode;
  private classPlanId: string;
  private nullCheckId: number | null = null;
  public readonly source: PgSource<TColumns, TUniques, TRelations, TParameters>;
  private _coalesceToEmptyObject = false;

  constructor(
    classPlan: PgSelectPlan<TColumns, TUniques, TRelations, TParameters>,
    itemPlan: ExecutablePlan<PgSourceRow<TColumns>>,
    private options: PgSelectSinglePlanOptions = Object.create(null),
  ) {
    super();
    this.source = classPlan.source;
    this.pgCodec = this.source.codec;
    this.mode = classPlan.mode;
    this.classPlanId = classPlan.id;
    this.itemPlanId = this.addDependency(itemPlan);
  }

  public coalesceToEmptyObject(): void {
    this._coalesceToEmptyObject = true;
  }

  public toStringMeta(): string {
    return this.source.name;
  }

  public getClassPlan(): PgSelectPlan<
    TColumns,
    TUniques,
    TRelations,
    TParameters
  > {
    if (this.aether.isOptimized(this)) {
      throw new Error(`Cannot ${this}.getClassPlan() after we're optimized.`);
    }
    const plan = this.getPlan(this.classPlanId);
    if (!(plan instanceof PgSelectPlan)) {
      throw new Error(
        `Expected ${this.classPlanId} (${plan}) to be a PgSelectPlan`,
      );
    }
    return plan;
  }

  private getItemPlan(): ExecutablePlan<PgSourceRow<TColumns>> {
    const plan = this.getPlan(this.dependencies[this.itemPlanId]);
    return plan;
  }

  /**
   * Do not rely on this, we're going to refactor it to work a different way at some point.
   *
   * @internal
   */
  getSelfNamed(): PgClassExpressionPlan<
    any,
    any,
    TColumns,
    TUniques,
    TRelations,
    TParameters
  > {
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
  get<TAttr extends keyof TColumns>(
    attr: TAttr,
  ): PgClassExpressionPlan<
    any,
    any,
    TColumns,
    TUniques,
    TRelations,
    TParameters
  > {
    if (this.mode === "aggregate") {
      throw new Error("Invalid call to .get() on aggregate plan");
    }
    if (!this.source.codec.columns && attr !== "") {
      throw new Error(
        `Cannot call ${this}.get() when the source codec (${this.source.codec.name}) has no columns to get.`,
      );
    }
    const classPlan = this.getClassPlan();
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
      return this.singleRelation(relation).get(attribute) as any;
    }

    if (dataSourceColumn?.identicalVia) {
      const { relation, attribute } = this.source.resolveVia(
        dataSourceColumn.identicalVia,
        attr as string,
      );

      const $existingPlan = this.existingSingleRelation(relation);
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
        Object.entries($fromPlan.source.codec.columns) as Array<
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
        return $fromPlan.get(matchingColumn[0]);
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

    const sqlExpr = pgClassExpression(
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

  public select<
    TExpressionColumns extends PgTypeColumns | undefined,
    TExpressionCodec extends PgTypeCodec<TExpressionColumns, any, any>,
  >(
    fragment: SQL,
    codec: TExpressionCodec,
  ): PgClassExpressionPlan<
    TExpressionColumns,
    TExpressionCodec,
    TColumns,
    TUniques,
    TRelations,
    TParameters
  > {
    const sqlExpr = pgClassExpression(this, codec);
    return sqlExpr`${fragment}`;
  }

  /**
   * Advanced method; rather than returning a plan it returns an index.
   * Generally useful for PgClassExpressionPlan.
   *
   * @internal
   */
  public selectAndReturnIndex(fragment: SQL): number {
    return this.getClassPlan().selectAndReturnIndex(fragment);
  }

  public placeholder($plan: PgTypedExecutablePlan<any>): SQL;
  public placeholder(
    $plan: ExecutablePlan<any>,
    codec: PgTypeCodec<any, any, any>,
  ): SQL;
  public placeholder(
    $plan: ExecutablePlan<any> | PgTypedExecutablePlan<any>,
    overrideCodec?: PgTypeCodec<any, any, any>,
  ): SQL {
    return overrideCodec
      ? this.getClassPlan().placeholder($plan, overrideCodec)
      : this.getClassPlan().placeholder($plan as PgTypedExecutablePlan<any>);
  }

  private existingSingleRelation<TRelationName extends keyof TRelations>(
    relationIdentifier: TRelationName,
  ): PgSelectSinglePlan<
    TRelations[TRelationName]["source"]["TColumns"] extends PgTypeColumns
      ? TRelations[TRelationName]["source"]["TColumns"]
      : any,
    TRelations[TRelationName]["source"]["TUniques"],
    TRelations[TRelationName]["source"]["TRelations"],
    TRelations[TRelationName]["source"]["TParameters"]
  > | null {
    if (this.options.fromRelation) {
      const [$fromPlan, fromRelationName] = this.options.fromRelation;
      // check to see if we already came via this relationship
      const reciprocal = this.source.getReciprocal(
        $fromPlan.source,
        fromRelationName,
      );
      if (reciprocal) {
        const reciprocalRelationName = reciprocal[0] as string;
        if (reciprocalRelationName === relationIdentifier) {
          const reciprocalRelation: PgSourceRelation<any, any> = reciprocal[1];
          if (reciprocalRelation.isUnique) {
            return $fromPlan;
          }
        }
      }
    }
    return null;
  }

  public singleRelation<TRelationName extends keyof TRelations>(
    relationIdentifier: TRelationName,
  ): PgSelectSinglePlan<
    any,
    any,
    any,
    any
    // TODO: fix the return type
    /*
    TRelations[TRelationName]["source"]["TColumns"] extends PgTypeColumns
      ? TRelations[TRelationName]["source"]["TColumns"]
      : any,
    TRelations[TRelationName]["source"]["TUniques"],
    TRelations[TRelationName]["source"]["TRelations"],
    TRelations[TRelationName]["source"]["TParameters"]
  */
  > {
    const $existingPlan = this.existingSingleRelation(relationIdentifier);
    if ($existingPlan) {
      return $existingPlan;
    }
    const relation = this.source.getRelation(relationIdentifier);
    if (!relation || !relation.isUnique) {
      throw new Error(
        `${String(relationIdentifier)} is not a unique relation on ${
          this.source
        }`,
      );
    }
    const rawRelationSource = relation.source;
    const relationSource =
      rawRelationSource instanceof PgSourceBuilder
        ? rawRelationSource.get()
        : rawRelationSource;
    const remoteColumns = relation.remoteColumns;
    const localColumns = relation.localColumns;

    const options: PgSelectSinglePlanOptions = {
      fromRelation: [this, relationIdentifier as string],
    };
    return relationSource.get(
      remoteColumns.reduce((memo, remoteColumn, columnIndex) => {
        memo[remoteColumn] = this.get(
          localColumns[columnIndex] as keyof TColumns,
        );
        return memo;
      }, Object.create(null)),
      options,
    ) as PgSelectSinglePlan<any, any, any, any>;
  }

  public manyRelation<TRelationName extends keyof TRelations>(
    relationIdentifier: TRelationName,
  ): PgSelectPlan<
    TRelations[TRelationName]["source"]["TColumns"] extends PgTypeColumns
      ? TRelations[TRelationName]["source"]["TColumns"]
      : any,
    TRelations[TRelationName]["source"]["TUniques"],
    TRelations[TRelationName]["source"]["TRelations"],
    TRelations[TRelationName]["source"]["TParameters"]
  > {
    const relation = this.source.getRelation(relationIdentifier);
    if (!relation) {
      throw new Error(
        `${String(relationIdentifier)} is not a relation on ${this.source}`,
      );
    }
    const rawRelationSource = relation.source;
    const relationSource =
      rawRelationSource instanceof PgSourceBuilder
        ? rawRelationSource.get()
        : rawRelationSource;
    const remoteColumns = relation.remoteColumns;
    const localColumns = relation.localColumns;

    return relationSource.find(
      remoteColumns.reduce((memo, remoteColumn, columnIndex) => {
        memo[remoteColumn] = this.get(
          localColumns[columnIndex] as keyof TColumns,
        );
        return memo;
      }, Object.create(null)),
    );
  }

  record(): PgClassExpressionPlan<
    TColumns,
    PgTypeCodec<TColumns, any, any>,
    TColumns,
    TUniques,
    TRelations,
    TParameters
  > {
    return pgClassExpression(this, this.source.codec)`${
      this.getClassPlan().alias
    }`;
  }

  /**
   * Returns a plan representing the result of an expression.
   */
  expression<
    TExpressionColumns extends PgTypeColumns | undefined,
    TExpressionCodec extends PgTypeCodec<TExpressionColumns, any, any>,
  >(
    expression: SQL,
    codec: TExpressionCodec,
  ): PgClassExpressionPlan<
    TExpressionColumns,
    TExpressionCodec,
    TColumns,
    TUniques,
    TRelations,
    TParameters
  > {
    return pgClassExpression(this, codec)`${expression}`;
  }

  /**
   * When selecting a connection we need to be able to get the cursor. The
   * cursor is built from the values of the `ORDER BY` clause so that we can
   * find nodes before/after it.
   */
  public cursor(): PgCursorPlan<this> {
    const cursorPlan = new PgCursorPlan<this>(this);
    return cursorPlan;
  }

  /**
   * For compatibility with EdgeCapablePlan.
   */
  public node(): this {
    return this;
  }

  deduplicate(
    peers: PgSelectSinglePlan<any, any, any, any>[],
  ): PgSelectSinglePlan<TColumns, TUniques, TRelations, TParameters> {
    const identicalPeer = peers.find((peer) => {
      if (peer.source !== this.source) {
        return false;
      }
      if (peer.getClassPlan() !== this.getClassPlan()) {
        return false;
      }
      if (peer.getItemPlan() !== this.getItemPlan()) {
        return false;
      }
      return true;
    });
    if (identicalPeer) {
      // We've been careful to not store anything locally so we shouldn't
      // need to move anything across to the peer.
      return identicalPeer;
    } else {
      return this;
    }
  }

  private nonNullColumn: { column: PgTypeColumn; attr: string } | null = null;
  private nullCheckAttributeIndex: number | null = null;
  optimize() {
    const columns = this.source.codec.columns;
    if (columns && this.getClassPlan().mode === "normal") {
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
        const expression = sql`${this.getClassPlan().alias}.${sql.identifier(
          attr,
        )}`;
        this.nullCheckAttributeIndex = this.getClassPlan().selectAndReturnIndex(
          codec.castFromPg
            ? codec.castFromPg(expression)
            : sql`${sql.parens(expression)}::text`,
        );
      } else {
        this.nullCheckId = this.getClassPlan().getNullCheckIndex();
      }
    }
    return this;
  }

  execute(
    values: CrystalValuesList<[PgSourceRow<TColumns>]>,
  ): CrystalResultsList<PgSourceRow<TColumns> | null> {
    return values[this.itemPlanId].map((result) => {
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
      return result;
    });
  }
}

/**
 * Given a plan that represents a single record (via
 * PgSelectSinglePlan.record()) this turns it back into a PgSelectSinglePlan
 */
export function pgSelectSingleFromRecord<
  TColumns extends PgTypeColumns,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
>(
  source: PgSource<TColumns, TUniques, TRelations, TParameters>,
  record: PgClassExpressionPlan<
    TColumns,
    PgTypeCodec<TColumns, any, any>,
    TColumns,
    TUniques,
    TRelations,
    TParameters
  >,
): PgSelectSinglePlan<TColumns, TUniques, TRelations, TParameters> {
  // TODO: we should be able to optimise this so that `plan.record()` returns the original record again.
  return new PgSelectPlan<TColumns, TUniques, TRelations, TParameters>({
    source,
    identifiers: [],
    from: (record) => sql`(select (${record}).*)`,
    args: [{ plan: record, pgCodec: source.codec }],
    joinAsLateral: true,
  }).single() as PgSelectSinglePlan<
    TColumns,
    TUniques,
    TRelations,
    TParameters
  >;
}

Object.defineProperty(pgSelectSingleFromRecord, "$$export", {
  value: {
    moduleName: "@dataplan/pg",
    exportName: "pgSelectSingleFromRecord",
  },
});
