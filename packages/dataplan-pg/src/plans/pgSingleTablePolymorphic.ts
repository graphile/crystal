import type {
  CrystalResultsList,
  CrystalValuesList,
  PolymorphicData,
  PolymorphicPlan,
} from "graphile-crystal";
import { ExecutablePlan, polymorphicWrap } from "graphile-crystal";
import type { GraphQLObjectType } from "graphql";

import type {
  PgSourceColumns,
  PgSourceParameter,
  PgSourceRelation,
  PgSourceRow,
  PgSourceUnique,
} from "../datasource";
import type { PgSelectSinglePlan } from "./pgSelectSingle";

export class PgSingleTablePolymorphicPlan<
    TColumns extends PgSourceColumns | undefined,
    TUniques extends ReadonlyArray<
      PgSourceUnique<Exclude<TColumns, undefined>>
    >,
    TRelations extends {
      [identifier: string]: TColumns extends PgSourceColumns
        ? PgSourceRelation<TColumns, any>
        : never;
    },
    TParameters extends PgSourceParameter[] | undefined = undefined,
  >
  extends ExecutablePlan<any>
  implements PolymorphicPlan
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSingleTablePolymorphicPlan",
  };
  sync = true;

  private typePlanId: number;
  private rowPlanId: number;

  constructor(
    $typePlan: ExecutablePlan<string>,
    $rowPlan: PgSelectSinglePlan<TColumns, TUniques, TRelations, TParameters>,
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

  execute(
    values: CrystalValuesList<any[]>,
  ): CrystalResultsList<PolymorphicData<
    string,
    ReadonlyArray<PgSourceRow<TColumns>>
  > | null> {
    return values.map((v) =>
      v[this.typePlanId] ? polymorphicWrap(v[this.typePlanId]) : null,
    );
  }
}

export function pgSingleTablePolymorphic<
  TColumns extends PgSourceColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgSourceColumns
      ? PgSourceRelation<TColumns, any>
      : never;
  },
  TParameters extends PgSourceParameter[] | undefined = undefined,
>(
  $typePlan: ExecutablePlan<string>,
  $rowPlan: PgSelectSinglePlan<TColumns, TUniques, TRelations, TParameters>,
): PgSingleTablePolymorphicPlan<TColumns, TUniques, TRelations, TParameters> {
  return new PgSingleTablePolymorphicPlan($typePlan, $rowPlan);
}

Object.defineProperty(pgSingleTablePolymorphic, "$$export", {
  value: {
    moduleName: "@dataplan/pg",
    exportName: "pgSingleTablePolymorphic",
  },
});
