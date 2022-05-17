import type { CrystalResultsList, CrystalValuesList } from "dataplanner";
import { ExecutablePlan } from "dataplanner";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgTypeColumns } from "../codecs.js";
import type {
  PgSource,
  PgSourceParameter,
  PgSourceRelation,
  PgSourceUnique,
} from "../datasource.js";
import type {
  PgClassSinglePlan,
  PgTypeCodec,
  PgTypedExecutablePlan,
} from "../interfaces.js";
import { PgDeletePlan } from "./pgDelete.js";
import { PgInsertPlan } from "./pgInsert.js";
import { PgSelectSinglePlan } from "./pgSelectSingle.js";
import { PgUpdatePlan } from "./pgUpdate.js";

// const debugPlan = debugFactory("datasource:pg:PgClassExpressionPlan:plan");
// const debugExecute = debugFactory( "datasource:pg:PgClassExpressionPlan:execute",);
// const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

/**
 * A plan for selecting a column or column-like expression. Keep in mind that
 * a column might not be a scalar (could be a list, compound type, JSON,
 * geometry, etc), so this might not be a "leaf". The result of this might be used as the input
 * of another layer of plan.
 */
export class PgClassExpressionPlan<
    TExpressionColumns extends PgTypeColumns | undefined,
    TExpressionCodec extends PgTypeCodec<TExpressionColumns, any, any, any>,
    TSourceColumns extends PgTypeColumns | undefined,
    TUniques extends ReadonlyArray<
      PgSourceUnique<Exclude<TSourceColumns, undefined>>
    >,
    TRelations extends {
      [identifier: string]: TSourceColumns extends PgTypeColumns
        ? PgSourceRelation<TSourceColumns, any>
        : never;
    },
    TParameters extends PgSourceParameter[] | undefined = undefined,
  >
  extends ExecutablePlan<any>
  implements PgTypedExecutablePlan<TExpressionCodec>
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgClassExpressionPlan",
  };

  isSyncAndSafe = true;

  // TODO: rename to 'row'?
  /**
   * The dependency id of the parent table row (from SELECT,
   * INSERT...RETURNING, etc).
   *
   * @internal
   */
  public readonly tableId: number;

  /**
   * This is the numeric index of this expression within the grandparent
   * PgSelectPlan's selection.
   */
  private attrIndex: number | null = null;

  public readonly source: PgSource<
    TSourceColumns,
    TUniques,
    TRelations,
    TParameters
  >;

  public readonly expression: SQL;

  placeholders: symbol[] = [];
  placeholderIndexes: number[] = [];

  constructor(
    table: PgClassSinglePlan<TSourceColumns, TUniques, TRelations, TParameters>,
    public readonly pgCodec: TExpressionCodec,
    strings: TemplateStringsArray,
    dependencies: ReadonlyArray<PgTypedExecutablePlan<any> | SQL> = [],
  ) {
    super();
    if (strings.length !== dependencies.length + 1) {
      throw new Error(
        `Invalid call to PgClassExpressionPlan; should have exactly one more string (found ${strings.length}) than dependency (found ${dependencies.length}). Recommend using the tagged template literal helper pgClassExpression.`,
      );
    }
    const badStringIndex = strings.findIndex((s) => typeof s !== "string");
    if (badStringIndex >= 0) {
      throw new Error(
        `Received a non-string at index ${badStringIndex} to strings argument of ${this}.`,
      );
    }
    // TODO: fix this TypeScript cast
    this.source = table.source as PgSource<
      TSourceColumns,
      TUniques,
      TRelations,
      any
    >;
    this.tableId = this.addDependency(table);

    const fragments: SQL[] = dependencies.map((plan, i) => {
      if (!plan) {
        throw new Error(`Invalid plan at index ${i}`);
      }
      if (sql.isSQL(plan)) {
        return plan;
      } else if (
        plan instanceof PgClassExpressionPlan &&
        plan.getParentPlan() === table
      ) {
        // TODO: when we defer placeholders until finalize we'll need to copy
        // deps/etc
        return plan.expression;
      } else if (table instanceof PgSelectSinglePlan) {
        // TODO: when we defer placeholders until finalize we'll need to store
        // deps/etc
        const placeholder = table.placeholder(plan);
        return placeholder;
      } else {
        throw new Error(`Cannot use placeholders when parent plan is ${table}`);
      }
    });

    // We're pretending we called `sql` directly by passing the template
    // strings array.
    this.expression = sql(strings, ...fragments);
  }

  public toStringMeta(): string {
    const expr = sql.compile(this.expression);
    if (expr.text.length > 23) {
      return (
        expr.text.slice(0, 10) + "..." + expr.text.slice(expr.text.length - 10)
      );
    } else {
      return expr.text;
    }
  }

  public get<TAttr extends keyof TExpressionColumns>(
    attributeName: TAttr,
  ): PgClassExpressionPlan<
    any,
    any,
    TSourceColumns,
    TUniques,
    TRelations,
    TParameters
  > {
    const columns = this.pgCodec.columns;
    if (!columns) {
      throw new Error(
        `Cannot call ${this}.get('${String(
          attributeName,
        )}') because this does not represent a composite type (check your pgCodec).`,
      );
    }
    const column = columns[attributeName as string];
    if (!column) {
      throw new Error(
        `Cannot call ${this}.get('${String(
          attributeName,
        )}') because this does not have that column; supported columns: '${Object.keys(
          columns,
        ).join("', '")}'.`,
      );
    }
    if (column.via) {
      throw new Error(
        `Cannot call ${this}.get('${String(
          attributeName,
        )}') because 'via' is not yet supported here - please raise an issue (or, even better, a pull request!).`,
      );
    }
    if (column.expression) {
      throw new Error(
        `Cannot call ${this}.get('${String(
          attributeName,
        )}') because 'expression' is not yet supported here - please raise an issue (or, even better, a pull request!).`,
      );
    }
    const sqlExpr = pgClassExpression(this.getParentPlan(), column.codec);
    return sqlExpr`${sql.parens(this.expression, true)}.${sql.identifier(
      attributeName as string,
    )}` as any;
  }

  public getParentPlan(): PgClassSinglePlan<
    TSourceColumns,
    TUniques,
    TRelations,
    TParameters
  > {
    const plan = this.getPlan(this.dependencies[this.tableId]);
    if (
      !(plan instanceof PgSelectSinglePlan) &&
      !(plan instanceof PgInsertPlan) &&
      !(plan instanceof PgUpdatePlan) &&
      !(plan instanceof PgDeletePlan)
    ) {
      throw new Error(
        `Expected ${plan} to be a PgSelectSinglePlan | PgInsertPlan | PgUpdatePlan | PgDeletePlan`,
      );
    }
    return plan;
  }

  public optimize(): this {
    this.attrIndex = this.getParentPlan().selectAndReturnIndex(
      this.pgCodec.castFromPg
        ? this.pgCodec.castFromPg(this.expression)
        : sql`${sql.parens(this.expression)}::text`,
    );
    return this;
  }

  public execute(
    values: Array<CrystalValuesList<any>>,
  ): CrystalResultsList<any> {
    const { attrIndex, tableId } = this;
    const pg2gql = this.pgCodec.fromPg;
    if (attrIndex != null) {
      const result = values[tableId].map((v) => {
        if (v == null) {
          return null;
        }
        const rawValue = v[attrIndex];
        if (rawValue == null) {
          return null;
        } else {
          return pg2gql(rawValue);
        }
      });
      return result;
    } else {
      throw new Error(
        "Cannot execute PgClassExpressionPlan without first optimizing it",
      );
    }
  }

  public deduplicate(
    peers: Array<PgClassExpressionPlan<any, any, any, any, any, any>>,
  ): PgClassExpressionPlan<
    TExpressionColumns,
    TExpressionCodec,
    TSourceColumns,
    TUniques,
    TRelations,
    TParameters
  > {
    const parentPlan = this.getParentPlan();
    const classPlan =
      parentPlan instanceof PgSelectSinglePlan
        ? parentPlan.getClassPlan()
        : null;
    const equivalentPeer = peers.find(
      (p) =>
        sql.isEquivalent(this.expression, p.expression, {
          symbolSubstitutes: (classPlan as any)?._symbolSubstitutes,
        }),
      // TODO: when we defer placeholders until finalize we'll need to do additional comparison here
    );
    return equivalentPeer ?? this;
  }

  public toSQL(): SQL {
    return this.expression;
  }
}

/**
 * This higher order function takes a table and codec as input and returns a
 * tagged template literal function that you can use to build an SQL expression
 * that will be selected.
 */
function pgClassExpression<
  TExpressionColumns extends PgTypeColumns | undefined,
  TExpressionCodec extends PgTypeCodec<TExpressionColumns, any, any>,
  TSourceColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<
    PgSourceUnique<Exclude<TSourceColumns, undefined>>
  >,
  TRelations extends {
    [identifier: string]: TSourceColumns extends PgTypeColumns
      ? PgSourceRelation<TSourceColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
>(
  table: PgClassSinglePlan<TSourceColumns, TUniques, TRelations, TParameters>,
  codec: TExpressionCodec,
): (
  strings: TemplateStringsArray,
  ...dependencies: ReadonlyArray<PgTypedExecutablePlan<any> | SQL>
) => PgClassExpressionPlan<
  TExpressionColumns,
  TExpressionCodec,
  TSourceColumns,
  TUniques,
  TRelations,
  TParameters
> {
  return (strings, ...dependencies) => {
    return new PgClassExpressionPlan(table, codec, strings, dependencies);
  };
}

Object.defineProperty(pgClassExpression, "$$export", {
  value: {
    moduleName: "@dataplan/pg",
    exportName: "pgClassExpression",
  },
});

export { pgClassExpression };
