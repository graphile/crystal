import type {
  ExecutionDetails,
  GrafastResultsList,
  PolymorphicData,
  PolymorphicStep,
  PromiseOrDirect,
} from "grafast";
import { ExecutableStep, exportAs, polymorphicWrap } from "grafast";
import type { GraphQLObjectType } from "grafast/graphql";

import type { PgResource } from "../datasource.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";

/**
 * This polymorphic plan is to support polymorphism from a single PostgreSQL
 * table, typically these tables will have a "type" (or similar) attribute that
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
    return this.rowPlan();
  }

  execute({
    indexMap,
    values,
  }: ExecutionDetails): GrafastResultsList<PolymorphicData<
    string,
    ReadonlyArray<unknown[]>
  > | null> {
    const valuesDep = values[this.typeStepId];
    return indexMap<
      PromiseOrDirect<PolymorphicData<string, ReadonlyArray<unknown[]>> | null>
    >((i) => {
      const v = valuesDep.at(i);
      return v ? polymorphicWrap(v) : null;
    });
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
