import debugFactory from "debug";
import type { CrystalResultsList, CrystalValuesList } from "graphile-crystal";
import { ExecutablePlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgDataSource } from "../datasource";
import { PgClassSelectSinglePlan } from "./pgClassSelectSingle";
import { PgColumnSelectPlan } from "./pgColumnSelect";

const debugPlan = debugFactory("datasource:pg:PgExpressionPlan:plan");
const debugExecute = debugFactory("datasource:pg:PgExpressionPlan:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
const debugExecuteVerbose = debugExecute.extend("verbose");

/**
 * A plan for selecting a column. Keep in mind that a column might not be a
 * scalar (could be a list, compound type, JSON, geometry, etc), so this might
 * not be a "leaf"; it might be used as the input of another layer of plan.
 */
export class PgExpressionPlan<
  TDataSource extends PgDataSource<any, any>,
  TResultType = any,
> extends ExecutablePlan<any> {
  public readonly tableId: number;

  /**
   * This is the numeric index of this expression within the grandparent
   * PgClassSelectPlan's selection.
   */
  private attrIndex: number | null = null;

  public readonly dataSource: TDataSource;

  /**
   * Converts the `::text` from PostgreSQL to whatever the relevant value that
   * GraphQL and other plans would expect.
   */
  private pg2gql: (pgValue: any) => any;

  public readonly expression: SQL;

  placeholders: symbol[] = [];
  placeholderIndexes: number[] = [];

  constructor(
    table: PgClassSelectSinglePlan<TDataSource>,
    dependencies: ReadonlyArray<{ plan: ExecutablePlan<any>; type: SQL }>,
    expressionGenerator: SQL | ((...planFragments: SQL[]) => SQL),
    pg2gql: (pgValue: any) => any,
  ) {
    super();
    this.dataSource = table.dataSource;
    this.tableId = this.addDependency(table);
    const classPlan = table.getClassPlan();
    this.pg2gql = pg2gql;
    if (typeof expressionGenerator === "function") {
      const fragments: SQL[] = [];
      for (let i = 0, l = dependencies.length; i < l; i++) {
        const { plan, type } = dependencies[i];
        if (!plan) {
          throw new Error(`Invalid plan at index ${i}`);
        }
        if (plan instanceof PgExpressionPlan) {
          fragments.push(plan.expression);
          this.placeholders.push(...plan.placeholders);
          plan.placeholderIndexes.forEach((id) => {
            const dep = this.aether.plans[plan.dependencies[id]];
            if (!dep) {
              throw new Error(
                `Failed to find depenency plan ${id} ${plan.dependencies[id]}`,
              );
            }
            const depId = this.addDependency(dep);
            this.placeholderIndexes.push(depId);
          });
        } else if (plan instanceof PgColumnSelectPlan) {
          fragments.push(plan.toSQL());
        } else {
          const placeholder = classPlan.placeholder(plan, type);
          fragments.push(placeholder);
        }
      }
      this.expression = expressionGenerator(...fragments);
    } else {
      if (dependencies.length !== 0) {
        throw new Error(
          `PgExpressionPlan: Must not specify dependencies if expression is static`,
        );
      }
      this.expression = expressionGenerator;
    }
  }

  public getClassSinglePlan(): PgClassSelectSinglePlan<TDataSource> {
    const plan = this.aether.plans[this.dependencies[this.tableId]];
    if (!(plan instanceof PgClassSelectSinglePlan)) {
      throw new Error(`Expected ${plan} to be a PgClassSelectSinglePlan`);
    }
    return plan;
  }

  public optimize(): this {
    this.attrIndex = this.getClassSinglePlan()
      .getClassPlan()
      .select(sql`(${this.expression})::text`);
    return this;
  }

  public execute(
    values: CrystalValuesList<any[]>,
  ): CrystalResultsList<TResultType> {
    const { attrIndex, tableId, pg2gql } = this;
    if (attrIndex != null) {
      const result = values.map((v) => {
        const rawValue = v[tableId][attrIndex];
        if (rawValue == null) {
          return null;
        } else {
          return pg2gql(rawValue);
        }
      });
      debugExecuteVerbose("%s values: %c, result: %c", this, values, result);
      return result;
    } else {
      throw new Error(
        "Cannot execute PgExpressionPlan without first optimizing it",
      );
    }
  }

  public deduplicate(
    peers: Array<PgExpressionPlan<TDataSource, TResultType>>,
  ): PgExpressionPlan<TDataSource, TResultType> {
    const equivalentPeer = peers.find(
      (p) =>
        sql.isEquivalent(this.expression, p.expression) &&
        this.placeholders.length == p.placeholders.length &&
        this.placeholders.every(
          (placeholder, i) => placeholder === p.placeholders[i],
        ),
    );
    return equivalentPeer ?? this;
  }
}

function pgExpression<
  TDataSource extends PgDataSource<any, any>,
  TResultType = any,
>(
  table: PgClassSelectSinglePlan<TDataSource>,
  dependencies: ReadonlyArray<{ plan: ExecutablePlan<any>; type: SQL }>,
  expressionGenerator: SQL | ((...planFragments: SQL[]) => SQL),
  pg2gql: (pgValue: any) => any,
): PgExpressionPlan<TDataSource, TResultType> {
  return new PgExpressionPlan<TDataSource, TResultType>(
    table,
    dependencies,
    expressionGenerator,
    pg2gql,
  );
}

export { pgExpression };
