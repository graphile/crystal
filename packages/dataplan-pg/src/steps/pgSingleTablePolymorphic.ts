import type {
  CrystalResultsList,
  CrystalValuesList,
  PolymorphicData,
  PolymorphicStep,
} from "dataplanner";
import { ExecutableStep, polymorphicWrap } from "dataplanner";
import type { GraphQLObjectType } from "graphql";

import type { PgTypeColumns } from "../codecs.js";
import type {
  PgSourceParameter,
  PgSourceRelation,
  PgSourceRow,
  PgSourceUnique,
} from "../datasource.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";

/**
 * This polymorphic plan is to support polymorphism from a single PostgreSQL
 * table, typically these tables will have a "type" (or similar) column that
 * details the type of the data in the row. This class accepts a plan that
 * resolves to the GraphQLObjectType type name (a string), and a second plan
 * that represents a row from this table.
 */
export class PgSingleTablePolymorphicStep<
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
  extends ExecutableStep<any>
  implements PolymorphicStep
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSingleTablePolymorphicStep",
  };
  isSyncAndSafe = true;

  private typePlanId: number;
  private rowPlanId: number;

  constructor(
    $typePlan: ExecutableStep<string>,
    $rowPlan: PgSelectSingleStep<TColumns, TUniques, TRelations, TParameters>,
  ) {
    super();
    this.typePlanId = this.addDependency($typePlan);
    this.rowPlanId = this.addDependency($rowPlan);
  }

  private rowPlan() {
    return this.getPlan(this.dependencies[this.rowPlanId]);
  }

  deduplicate(
    peers: PgSingleTablePolymorphicStep<any, any, any, any>[],
  ): PgSingleTablePolymorphicStep<TColumns, TUniques, TRelations, TParameters> {
    return peers[0] ?? this;
  }

  planForType(_type: GraphQLObjectType): ExecutableStep {
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
  $typePlan: ExecutableStep<string>,
  $rowPlan: PgSelectSingleStep<TColumns, TUniques, TRelations, TParameters>,
): PgSingleTablePolymorphicStep<TColumns, TUniques, TRelations, TParameters> {
  return new PgSingleTablePolymorphicStep($typePlan, $rowPlan);
}

Object.defineProperty(pgSingleTablePolymorphic, "$$export", {
  value: {
    moduleName: "@dataplan/pg",
    exportName: "pgSingleTablePolymorphic",
  },
});
