import type {
  GrafastResultsList,
  GrafastValuesList,
  PolymorphicData,
  PolymorphicStep,
} from "grafast";
import { ExecutableStep, polymorphicWrap } from "grafast";
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

  private typeStepId: number;
  private rowStepId: number;

  constructor(
    $typeName: ExecutableStep<string | null>,
    $row: PgSelectSingleStep<TColumns, TUniques, TRelations, TParameters>,
  ) {
    super();
    this.typeStepId = this.addDependency($typeName);
    this.rowStepId = this.addDependency($row);
  }

  private rowPlan() {
    return this.getDep(this.rowStepId);
  }

  deduplicate(
    peers: PgSingleTablePolymorphicStep<any, any, any, any>[],
  ): PgSingleTablePolymorphicStep<
    TColumns,
    TUniques,
    TRelations,
    TParameters
  >[] {
    return peers;
  }

  planForType(_type: GraphQLObjectType): ExecutableStep {
    // TODO: need to include the `_type` information so we know what type it
    // is. Can we wrap it?
    return this.rowPlan();
  }

  execute(
    values: Array<GrafastValuesList<any>>,
  ): GrafastResultsList<PolymorphicData<
    string,
    ReadonlyArray<PgSourceRow<TColumns>>
  > | null> {
    return values[this.typeStepId].map((v) => (v ? polymorphicWrap(v) : null));
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
  $typeName: ExecutableStep<string | null>,
  $row: PgSelectSingleStep<TColumns, TUniques, TRelations, TParameters>,
): PgSingleTablePolymorphicStep<TColumns, TUniques, TRelations, TParameters> {
  return new PgSingleTablePolymorphicStep($typeName, $row);
}

Object.defineProperty(pgSingleTablePolymorphic, "$$export", {
  value: {
    moduleName: "@dataplan/pg",
    exportName: "pgSingleTablePolymorphic",
  },
});
