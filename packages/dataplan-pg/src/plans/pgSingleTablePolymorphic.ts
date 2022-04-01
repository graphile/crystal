import type {
  CrystalResultsList,
  CrystalValuesList,
  PolymorphicData,
  PolymorphicPlan,
} from "graphile-crystal";
import { ExecutablePlan, polymorphicWrap } from "graphile-crystal";
import type { GraphQLObjectType } from "graphql";

import type { PgTypeColumns } from "../codecs";
import type {
  PgSourceParameter,
  PgSourceRelation,
  PgSourceRow,
  PgSourceUnique,
} from "../datasource";
import type { PgSelectSinglePlan } from "./pgSelectSingle";

export class PgSingleTablePolymorphicPlan<
    TColumns extends PgTypeColumns | undefined,
    TUniques extends ReadonlyArray<
      PgSourceUnique<Exclude<TColumns, undefined>>
    >,
    TRelations extends {
      [identifier: string]: TColumns extends PgTypeColumns
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
  isSyncAndSafe = true;

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

  deduplicate(
    peers: PgSingleTablePolymorphicPlan<any, any, any, any>[],
  ): PgSingleTablePolymorphicPlan<TColumns, TUniques, TRelations, TParameters> {
    return peers[0] ?? this;
  }

  planForType(_type: GraphQLObjectType): ExecutablePlan {
    // TODO: need to include the `_type` information so we know what type it
    // is. Can we wrap it?
    return this.rowPlan();
  }

  execute(
    values: Array<CrystalValuesList<any>>,
  ): CrystalResultsList<PolymorphicData<
    string,
    ReadonlyArray<PgSourceRow<TColumns>>
  > | null> {
    return values[this.typePlanId].map((v) => (v ? polymorphicWrap(v) : null));
  }
}

export function pgSingleTablePolymorphic<
  TColumns extends PgTypeColumns | undefined,
  TUniques extends ReadonlyArray<PgSourceUnique<Exclude<TColumns, undefined>>>,
  TRelations extends {
    [identifier: string]: TColumns extends PgTypeColumns
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
