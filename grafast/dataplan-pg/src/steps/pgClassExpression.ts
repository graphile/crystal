import type { AccessStep, UnbatchedExecutionExtra } from "grafast";
import { access, exportAs, UnbatchedStep } from "grafast";
import type { SQL } from "pg-sql2";
import sql, { $$toSQL } from "pg-sql2";

import type { PgResource } from "../datasource.js";
import type {
  GetPgCodecAttributes,
  PgClassSingleStep,
  PgCodec,
  PgTypedExecutableStep,
} from "../interfaces.js";
import { PgDeleteSingleStep } from "./pgDeleteSingle.js";
import { PgInsertSingleStep } from "./pgInsertSingle.js";
import { PgSelectSingleStep } from "./pgSelectSingle.js";
import { PgUnionAllSingleStep } from "./pgUnionAll.js";
import { PgUpdateSingleStep } from "./pgUpdateSingle.js";

// const debugPlan = debugFactory("@dataplan/pg:PgClassExpressionStep:plan");
// const debugExecute = debugFactory( "@dataplan/pg:PgClassExpressionStep:execute",);
// const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

/**
 * A plan for selecting a attribute or attribute-like expression. Keep in mind that
 * a attribute might not be a scalar (could be a list, compound type, JSON,
 * geometry, etc), so this might not be a "leaf". The result of this might be used as the input
 * of another layer of plan.
 */
export class PgClassExpressionStep<
    TExpressionCodec extends PgCodec,
    TResource extends PgResource<any, any, any, any, any>,
  >
  extends UnbatchedStep<any>
  implements PgTypedExecutableStep<TExpressionCodec>
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgClassExpressionStep",
  };

  isSyncAndSafe = true;

  /**
   * The dependency id of the parent table row (from SELECT,
   * INSERT...RETURNING, etc).
   *
   * @internal
   */
  public readonly rowDependencyId: number;

  /**
   * This is the numeric index of this expression within the grandparent
   * PgSelectStep's selection.
   */
  private attrIndex: number | null = null;

  public readonly expression: SQL;

  private needsPolymorphicUnwrap: boolean;
  private needsTupleAccess: boolean;

  constructor(
    $table: PgClassSingleStep<TResource> | PgUnionAllSingleStep,
    public readonly pgCodec: TExpressionCodec,
    strings: TemplateStringsArray,
    dependencies: ReadonlyArray<PgTypedExecutableStep<any> | SQL> = [],
    private guaranteedNotNull?: boolean,
  ) {
    super();
    this.needsPolymorphicUnwrap =
      $table instanceof PgUnionAllSingleStep &&
      $table.getClassStep().mode === "normal";
    this.needsTupleAccess =
      $table instanceof PgInsertSingleStep ||
      $table instanceof PgUpdateSingleStep ||
      $table instanceof PgDeleteSingleStep;
    const $row = this.needsTupleAccess ? access($table, "t") : $table;
    this.rowDependencyId = this.addDependency($row);
    if (strings.length !== dependencies.length + 1) {
      throw new Error(
        `Invalid call to PgClassExpressionStep; should have exactly one more string (found ${strings.length}) than dependency (found ${dependencies.length}). Recommend using the tagged template literal helper pgClassExpression.`,
      );
    }
    const badStringIndex = strings.findIndex((s) => typeof s !== "string");
    if (badStringIndex >= 0) {
      throw new Error(
        `Received a non-string at index ${badStringIndex} to strings argument of ${this}.`,
      );
    }

    const fragments: SQL[] = dependencies.map((stepOrSql, i) => {
      if (!stepOrSql) {
        throw new Error(`Invalid stepOrSql at index ${i}`);
      }
      if (sql.isSQL(stepOrSql)) {
        return stepOrSql;
      } else if (
        stepOrSql instanceof PgClassExpressionStep &&
        stepOrSql.getParentStep() === $table
      ) {
        // TODO: when we defer placeholders until finalize we'll need to copy
        // deps/etc
        return stepOrSql.expression;
      } else if ($table instanceof PgSelectSingleStep) {
        // TODO: when we defer placeholders until finalize we'll need to store
        // deps/etc
        const placeholder = $table.placeholder(stepOrSql);
        return placeholder;
      } else {
        throw new Error(
          `Cannot use placeholders when parent plan is ${$table}`,
        );
      }
    });

    // We're pretending we called `sql` directly by passing the template
    // strings array.
    this.expression = sql(strings, ...fragments);
  }

  public toStringMeta(): string {
    if (!this.expression) {
      return "???";
    }
    const expr = sql.compile(this.expression);
    if (expr.text.length > 23) {
      return (
        expr.text.slice(0, 10) + "..." + expr.text.slice(expr.text.length - 10)
      );
    } else {
      return expr.text;
    }
  }

  /* Here's the proper type of this function, but that makes using it painful.
    ```ts
    public get<
      TAttr extends TExpressionCodec extends PgCodec<
        any,
        undefined,
        infer U,
        any,
        any,
        any,
        any
      >
        ? keyof U
        : keyof GetPgCodecAttributes<TExpressionCodec>,
    >(
      attributeName: TAttr,
    ): TExpressionCodec extends PgCodec<
      any,
      undefined,
      infer U,
      any,
      any,
      any,
      any
    >
      ? AccessStep<U>
      : PgClassExpressionStep<
          GetPgCodecAttributes<TExpressionCodec>[TAttr]["codec"],
          TResource
        > {
    ```

    Instead, we'll lie and ignore the `AccessStep` case
  */
  public get<TAttr extends keyof GetPgCodecAttributes<TExpressionCodec>>(
    attributeName: TAttr,
  ): PgClassExpressionStep<
    GetPgCodecAttributes<TExpressionCodec>[TAttr]["codec"],
    TResource
  > {
    return this.cacheStep("get", attributeName, () =>
      this._getInternal(attributeName),
    );
  }
  private _getInternal<
    TAttr extends keyof GetPgCodecAttributes<TExpressionCodec>,
  >(
    attributeName: TAttr,
  ): PgClassExpressionStep<
    GetPgCodecAttributes<TExpressionCodec>[TAttr]["codec"],
    TResource
  > {
    const attributes = this.pgCodec.attributes;
    if (attributes === undefined) {
      // Fall back to access, since this could be a 'point' or similar type that doesn't have attributes in Postgres but does in JS.
      return access(this, attributeName) as any;
    }
    const attribute = attributes[attributeName as string];
    if (!attribute) {
      throw new Error(
        `Cannot call ${this}.get('${String(
          attributeName,
        )}') because this does not have that attribute; supported attributes: '${Object.keys(
          attributes,
        ).join("', '")}'.`,
      );
    }
    if (attribute.via) {
      throw new Error(
        `Cannot call ${this}.get('${String(
          attributeName,
        )}') because 'via' is not yet supported here - please raise an issue (or, even better, a pull request!).`,
      );
    }
    if (attribute.expression) {
      throw new Error(
        `Cannot call ${this}.get('${String(
          attributeName,
        )}') because 'expression' is not yet supported here - please raise an issue (or, even better, a pull request!).`,
      );
    }
    const sqlExpr = pgClassExpression(
      this.getParentStep(),
      attribute.codec,
      attribute.notNull,
    );
    return sqlExpr`${sql.parens(this.expression, true)}.${sql.identifier(
      attributeName as string,
    )}` as any;
  }

  public getParentStep(): PgClassSingleStep<TResource> | PgUnionAllSingleStep {
    const $row = this.getDep(this.rowDependencyId);
    const step = this.needsTupleAccess
      ? ($row as AccessStep<any>).getParentStep()
      : $row;
    if (
      !(step instanceof PgSelectSingleStep) &&
      !(step instanceof PgInsertSingleStep) &&
      !(step instanceof PgUpdateSingleStep) &&
      !(step instanceof PgDeleteSingleStep) &&
      !(step instanceof PgUnionAllSingleStep)
    ) {
      throw new Error(
        `Expected ${step} to be a PgSelectSingleStep | PgInsertSingleStep | PgUpdateSingleStep | PgDeleteSingleStep | PgUnionAllSingleStep`,
      );
    }
    return step;
  }
  public getMeta(key: string) {
    return this.getParentStep().getMeta(key);
  }

  public optimize(): this {
    this.attrIndex = this.getParentStep().selectAndReturnIndex(
      this.pgCodec.castFromPg
        ? this.pgCodec.castFromPg(this.expression, this.guaranteedNotNull)
        : sql`${sql.parens(this.expression)}::text`,
    );
    return this;
  }

  public unbatchedExecute(_extra: UnbatchedExecutionExtra, v: any): any {
    if (v == null) {
      return null;
    }
    const rawValue = v[this.attrIndex!];
    if (rawValue == null) {
      return null;
    } else {
      return this.pgCodec.fromPg(rawValue);
    }
  }

  public deduplicate(
    peers: Array<PgClassExpressionStep<any, any>>,
  ): PgClassExpressionStep<TExpressionCodec, TResource>[] {
    const parentPlan = this.getParentStep();
    const classPlan =
      parentPlan instanceof PgSelectSingleStep
        ? parentPlan.getClassStep()
        : null;
    const symbolSubstitutes = (classPlan as any)?._symbolSubstitutes;
    const options = symbolSubstitutes ? { symbolSubstitutes } : undefined;
    return peers.filter(
      (p) => sql.isEquivalent(this.expression, p.expression, options),
      // TODO: when we defer placeholders until finalize we'll need to do additional comparison here
    );
  }

  public [$$toSQL](): SQL {
    return this.expression;
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
  TExpressionCodec extends PgCodec,
  TResource extends PgResource<any, any, any, any, any>,
>(
  table: PgClassSingleStep<TResource> | PgUnionAllSingleStep,
  codec: TExpressionCodec,
  guaranteedNotNull?: boolean,
): (
  strings: TemplateStringsArray,
  ...dependencies: ReadonlyArray<PgTypedExecutableStep<any> | SQL>
) => PgClassExpressionStep<TExpressionCodec, TResource> {
  return (strings, ...dependencies) => {
    return new PgClassExpressionStep(
      table,
      codec,
      strings,
      dependencies,
      codec.notNull || guaranteedNotNull,
    );
  };
}

exportAs("@dataplan/pg", pgClassExpression, "pgClassExpression");

export { pgClassExpression };
