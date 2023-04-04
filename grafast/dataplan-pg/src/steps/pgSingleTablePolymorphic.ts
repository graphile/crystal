import type {
  GrafastResultsList,
  GrafastValuesList,
  PolymorphicData,
  PolymorphicStep,
  PromiseOrDirect,
} from "grafast";
import { ExecutableStep, exportAs, polymorphicWrap } from "grafast";
import type { GraphQLObjectType } from "graphql";

import type { PgResource } from "../datasource.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";

/**
 * This polymorphic plan is to support polymorphism from a single PostgreSQL
 * table, typically these tables will have a "type" (or similar) column that
 * details the type of the data in the row. This class accepts a plan that
 * resolves to the GraphQLObjectType type name (a string), and a second plan
 * that represents a row from this table.
 */
export class PgSingleTablePolymorphicStep<
    TResource extends PgResource<any, any, any, any, any>,
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
    $row: PgSelectSingleStep<TResource>,
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
  ): PgSingleTablePolymorphicStep<TResource>[] {
    return peers;
  }

  planForType(_type: GraphQLObjectType): ExecutableStep {
    // TODO: need to include the `_type` information so we know what type it
    // is. Can we wrap it?
    return this.rowPlan();
  }

  execute(
    count: number,
    values: Array<GrafastValuesList<any>>,
  ): GrafastResultsList<PolymorphicData<
    string,
    ReadonlyArray<unknown[]>
  > | null> {
    const result: Array<
      PromiseOrDirect<PolymorphicData<string, ReadonlyArray<unknown[]>> | null>
    > = [];
    const list = values[this.typeStepId];
    for (let i = 0; i < count; i++) {
      const v = list[i];
      result[i] = v ? polymorphicWrap(v) : null;
    }
    return result;
  }
}

export function pgSingleTablePolymorphic<
  TResource extends PgResource<any, any, any, any, any>,
>(
  $typeName: ExecutableStep<string | null>,
  $row: PgSelectSingleStep<TResource>,
): PgSingleTablePolymorphicStep<TResource> {
  return new PgSingleTablePolymorphicStep($typeName, $row);
}

exportAs("@dataplan/pg", pgSingleTablePolymorphic, "pgSingleTablePolymorphic");
