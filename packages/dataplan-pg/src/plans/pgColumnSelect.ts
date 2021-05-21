import debugFactory from "debug";
import type { CrystalResultsList, CrystalValuesList } from "graphile-crystal";
import { Plan } from "graphile-crystal";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgDataSource } from "../datasource";
import { PgClassSelectSinglePlan } from "./pgClassSelectSingle";

const debugPlan = debugFactory("datasource:pg:PgColumnSelectPlan:plan");
const debugExecute = debugFactory("datasource:pg:PgColumnSelectPlan:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
const debugExecuteVerbose = debugExecute.extend("verbose");

/**
 * A plan for selecting a column. Keep in mind that a column might not be a
 * scalar (could be a list, compound type, JSON, geometry, etc), so this might
 * not be a "leaf"; it might be used as the input of another layer of plan.
 */
export class PgColumnSelectPlan<
  TDataSource extends PgDataSource<any>,
  TColumn extends keyof TDataSource["TRow"],
> extends Plan<TDataSource["TRow"][TColumn]> {
  public readonly tableId: number;

  /**
   * This is the numeric index of this expression within the grandparent
   * PgClassSelectPlan's selection.
   */
  private attrIndex: number | null = null;

  public readonly dataSource: TDataSource;

  constructor(
    table: PgClassSelectSinglePlan<TDataSource>,
    private attr: TColumn,
    private expression: SQL,
  ) {
    super();
    this.dataSource = table.dataSource;
    this.tableId = this.addDependency(table);
    debugPlanVerbose(`%s.%s constructor`, this, this.attr);
  }

  public toStringMeta(): string {
    return (
      `${this.dataSource.name}.${this.attr}` +
      (this.attrIndex != null ? `[${this.attrIndex}]` : "")
    );
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
      .select(sql`${this.expression}::text`);
    return this;
  }

  public execute(
    values: CrystalValuesList<any[]>,
  ): CrystalResultsList<TDataSource["TRow"][TColumn]> {
    const { attrIndex, tableId } = this;
    if (attrIndex != null) {
      const result = values.map((v) => v[tableId][attrIndex]);
      debugExecuteVerbose("%s values: %c, result: %c", this, values, result);
      return result;
    } else {
      throw new Error(
        "Cannot execute PgColumnSelectPlan without first optimizing it",
      );
    }
  }

  public toSQL(): SQL {
    return this.expression;
  }

  public deduplicate(
    peers: Array<PgColumnSelectPlan<TDataSource, any>>,
  ): PgColumnSelectPlan<TDataSource, TColumn> {
    const equivalentPeer = peers.find((p) =>
      sql.isEquivalent(this.expression, p.expression),
    );
    return equivalentPeer ?? this;
  }
}
