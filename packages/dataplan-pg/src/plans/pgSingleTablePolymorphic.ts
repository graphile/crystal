import type {
  CrystalResultsList,
  CrystalValuesList,
  PolymorphicData,
  PolymorphicPlan,
} from "graphile-crystal";
import { ExecutablePlan, polymorphicWrap } from "graphile-crystal";
import type { GraphQLObjectType } from "graphql";

import type { PgSource } from "../datasource";
import type { PgSelectSinglePlan } from "./pgSelectSingle";

export class PgSingleTablePolymorphicPlan<
    TDataSource extends PgSource<any, any, any, any, any>,
  >
  extends ExecutablePlan<any>
  implements PolymorphicPlan
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSingleTablePolymorphicPlan",
  };

  private typePlanId: number;
  private rowPlanId: number;

  constructor(
    $typePlan: ExecutablePlan<string>,
    $rowPlan: PgSelectSinglePlan<TDataSource>,
  ) {
    super();
    this.typePlanId = this.addDependency($typePlan);
    this.rowPlanId = this.addDependency($rowPlan);
  }

  private rowPlan() {
    return this.getPlan(this.dependencies[this.rowPlanId]);
  }

  planForType(_type: GraphQLObjectType): ExecutablePlan {
    // TODO: need to include the `_type` information so we know what type it
    // is. Can we wrap it?
    return this.rowPlan();
  }

  async execute(
    values: CrystalValuesList<any[]>,
  ): Promise<
    CrystalResultsList<PolymorphicData<
      string,
      ReadonlyArray<TDataSource["TRow"]>
    > | null>
  > {
    return values.map((v) =>
      v[this.typePlanId]
        ? polymorphicWrap(v[this.typePlanId], v[this.rowPlanId])
        : null,
    );
  }
}

export function pgSingleTablePolymorphic<
  TDataSource extends PgSource<any, any, any, any, any>,
>(
  $typePlan: ExecutablePlan<string>,
  $rowPlan: PgSelectSinglePlan<TDataSource>,
): PgSingleTablePolymorphicPlan<TDataSource> {
  return new PgSingleTablePolymorphicPlan<TDataSource>($typePlan, $rowPlan);
}

Object.assign(pgSingleTablePolymorphic, {
  $$export: {
    moduleName: "@dataplan/pg",
    exportName: "pgSingleTablePolymorphic",
  },
});
