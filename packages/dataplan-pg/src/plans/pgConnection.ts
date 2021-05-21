import debugFactory from "debug";
import { CrystalResultsList, CrystalValuesList, Plan } from "graphile-crystal";

import { PgDataSource } from "../datasource";
import { PgClassSelectPlan } from "./pgClassSelect";

const debugPlan = debugFactory("datasource:pg:PgConnectionPlan:plan");
const debugExecute = debugFactory("datasource:pg:PgConnectionPlan:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
const debugExecuteVerbose = debugExecute.extend("verbose");

export class PgConnectionPlan<
  TDataSource extends PgDataSource<any>
> extends Plan<unknown> {
  private subplanId: number;

  private readonly dataSource: TDataSource;

  constructor(subplan: PgClassSelectPlan<TDataSource>) {
    super();
    this.dataSource = subplan.dataSource;
    this.subplanId = subplan.id;
    debugPlanVerbose(`%s (around %s) constructor`, this, subplan);
  }

  public toStringMeta(): string {
    return this.dataSource.name;
  }

  public getSubplan(): PgClassSelectPlan<TDataSource> {
    const plan = this.aether.plans[this.subplanId];
    if (!(plan instanceof PgClassSelectPlan)) {
      throw new Error(`Expected ${plan} to be a PgClassSelectPlan`);
    }
    return plan;
  }

  public nodes(): PgClassSelectPlan<TDataSource> {
    return this.getSubplan().clone();
  }

  public execute(
    values: CrystalValuesList<any[]>,
  ): CrystalResultsList<Record<string, never>> {
    debugExecuteVerbose(`%c: execute; values: %o`, this, values);
    // TODO
    return values.map(() => ({}));
  }
}
