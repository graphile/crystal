import debugFactory from "debug";
import type { CrystalResultsList, CrystalValuesList } from "graphile-crystal";
import { ExecutablePlan } from "graphile-crystal";

import type {
  PgSource,
  PgSourceColumns,
  PgSourceRelation,
} from "../datasource";
import { PgSelectPlan } from "./pgSelect";

const debugPlan = debugFactory("datasource:pg:PgConnectionPlan:plan");
const debugExecute = debugFactory("datasource:pg:PgConnectionPlan:execute");
const debugPlanVerbose = debugPlan.extend("verbose");
const debugExecuteVerbose = debugExecute.extend("verbose");

export class PgConnectionPlan<
  TColumns extends PgSourceColumns | undefined,
  TUniques extends ReadonlyArray<ReadonlyArray<keyof TColumns>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgSourceColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends { [key: string]: any } | never = never,
> extends ExecutablePlan<unknown> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgConnectionPlan",
  };

  private subplanId: number;

  private readonly source: PgSource<
    TColumns,
    TUniques,
    TRelations,
    TParameters
  >;

  constructor(
    subplan: PgSelectPlan<TColumns, TUniques, TRelations, TParameters>,
  ) {
    super();
    this.source = subplan.source;
    this.subplanId = subplan.id;
    debugPlanVerbose(`%s (around %s) constructor`, this, subplan);
  }

  public toStringMeta(): string {
    return this.source.name;
  }

  public getSubplan(): PgSelectPlan<
    TColumns,
    TUniques,
    TRelations,
    TParameters
  > {
    const plan = this.getPlan(this.subplanId);
    if (!(plan instanceof PgSelectPlan)) {
      throw new Error(`Expected ${plan} to be a PgSelectPlan`);
    }
    return plan;
  }

  public nodes(): PgSelectPlan<TColumns, TUniques, TRelations, TParameters> {
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
