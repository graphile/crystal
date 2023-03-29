import type {
  GrafastResultsList,
  GrafastValuesList,
  PolymorphicData,
  PolymorphicStep,
} from "grafast";
import { ExecutableStep, exportAs, polymorphicWrap } from "grafast";
import type { GraphQLObjectType } from "graphql";

import type { PgSource } from "../datasource.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";

/**
 * This polymorphic plan is to support polymorphism from a single PostgreSQL
 * table, typically these tables will have a "type" (or similar) column that
 * details the type of the data in the row. This class accepts a plan that
 * resolves to the GraphQLObjectType type name (a string), and a second plan
 * that represents a row from this table.
 */
export class PgSingleTablePolymorphicStep<
    TSource extends PgSource<any, any, any, any, any>,
  >
  extends ExecutableStep<unknown>
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
    $row: PgSelectSingleStep<TSource>,
  ) {
    super();
    this.typeStepId = this.addDependency($typeName);
    this.rowStepId = this.addDependency($row);
  }

  private rowPlan() {
    return this.getDep(this.rowStepId);
  }

  deduplicate(
    peers: PgSingleTablePolymorphicStep<any>[],
  ): PgSingleTablePolymorphicStep<TSource>[] {
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
    ReadonlyArray<unknown[]>
  > | null> {
    return values[this.typeStepId].map((v) => (v ? polymorphicWrap(v) : null));
  }
}

export function pgSingleTablePolymorphic<
  TSource extends PgSource<any, any, any, any, any>,
>(
  $typeName: ExecutableStep<string | null>,
  $row: PgSelectSingleStep<TSource>,
): PgSingleTablePolymorphicStep<TSource> {
  return new PgSingleTablePolymorphicStep($typeName, $row);
}

exportAs("@dataplan/pg", pgSingleTablePolymorphic, "pgSingleTablePolymorphic");
