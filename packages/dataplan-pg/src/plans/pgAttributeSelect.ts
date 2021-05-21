import debugFactory from "debug";
import type { CrystalResultsList, CrystalValuesList } from "graphile-crystal";
import { Plan } from "graphile-crystal";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgDataSource } from "../datasource";
import { PgClassSelectSinglePlan } from "./pgClassSelectSingle";

const debugPlan = debugFactory("datasource:pg:PgAttributeSelectPlan:plan");
// const debugExecute = debugFactory("datasource:pg:PgAttributeSelectPlan:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

/**
 * A plan for selecting a column. Keep in mind that a column might not be a
 * scalar (could be a list, compound type, JSON, geometry, etc), so this might
 * not be a "leaf"; it might be used as the input of another layer of plan.
 */
export class PgAttributeSelectPlan<
  TDataSource extends PgDataSource<any>,
  TData = any
> extends Plan<TData> {
  private tableId: number;

  /**
   * This is the numeric index of this expression within the grandparent
   * PgClassSelectPlan's selection.
   */
  private attrIndex: number | null = null;

  constructor(
    parentPlan: PgClassSelectSinglePlan<TDataSource>,
    private expression: SQL | symbol,
  ) {
    super();
    this.tableId = this.addDependency(parentPlan);
    debugPlanVerbose(`%s (%c) constructor`, this, expression);
  }

  getClassSinglePlan(): PgClassSelectSinglePlan<TDataSource> {
    const plan = this.aether.plans[this.dependencies[this.tableId]];
    if (!(plan instanceof PgClassSelectSinglePlan)) {
      throw new Error(`Expected ${plan} to be a PgClassSelectSinglePlan`);
    }
    return plan;
  }

  public optimize(): this {
    this.attrIndex = this.getClassSinglePlan()
      .getClassPlan()
      .select(this.expression);
    return this;
  }

  public execute(
    values: CrystalValuesList<ReadonlyArray<any>>,
  ): CrystalResultsList<TData> {
    const { attrIndex, tableId } = this;
    if (attrIndex != null) {
      return values.map((v) => v[tableId][attrIndex]);
    } else {
      throw new Error(
        "Cannot execute PgAttributeSelectPlan without first optimizing it",
      );
    }
  }

  public toSQL(): SQL | symbol {
    return this.expression;
  }

  public deduplicate(
    peers: Array<PgAttributeSelectPlan<TDataSource, any>>,
  ): PgAttributeSelectPlan<TDataSource, TData> {
    const equivalentPeer = peers.find((p) =>
      sql.isEquivalent(this.expression, p.expression),
    );
    return equivalentPeer ?? this;
  }
}
