import debugFactory from "debug";
import type { CrystalResultsList, CrystalValuesList } from "graphile-crystal";
import { ExecutablePlan } from "graphile-crystal";

import type { PgSource } from "../datasource";
import { PgSelectPlan } from "./pgSelect";

const debugPlan = debugFactory("datasource:pg:PgConnectionPlan:plan");
const debugExecute = debugFactory("datasource:pg:PgConnectionPlan:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
const debugExecuteVerbose = debugExecute.extend("verbose");

export class PgConnectionPlan<
  TDataSource extends PgSource<any, any, any, any>,
> extends ExecutablePlan<unknown> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgConnectionPlan",
  };

  private subplanId: number;

  private readonly source: TDataSource;

  constructor(subplan: PgSelectPlan<TDataSource>) {
    super();
    this.source = subplan.source;
    this.subplanId = subplan.id;
    debugPlanVerbose(`%s (around %s) constructor`, this, subplan);
  }

  public toStringMeta(): string {
    return this.source.name;
  }

  public getSubplan(): PgSelectPlan<TDataSource> {
    const plan = this.getPlan(this.subplanId);
    if (!(plan instanceof PgSelectPlan)) {
      throw new Error(`Expected ${plan} to be a PgSelectPlan`);
    }
    return plan;
  }

  public nodes(): PgSelectPlan<TDataSource> {
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
