import type {
  CrystalResultsList,
  CrystalValuesList,
  PageInfoCapablePlan,
} from "graphile-crystal";
import { ConnectionPlan, constant, ExecutablePlan } from "graphile-crystal";

import type { PgSelectPlan } from "./pgSelect";

// PLEASE SEE pgPageInfo.md!

/**
 * Invoking PgPageInfoPlan should have no direct overhead (e.g.
 * `pageInfo { __typename }` is free); cost should not be incurred until one of
 * the submethods is called.
 */
export class PgPageInfoPlan<TPlan extends PgSelectPlan<any, any, any, any>>
  extends ExecutablePlan<any>
  implements PageInfoCapablePlan
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgPageInfoPlan",
  };

  private connectionPlanId: number;

  constructor(connectionPlan: ConnectionPlan<TPlan>) {
    super();
    this.connectionPlanId = connectionPlan.id;
  }

  /**
   * Might come in handy later?
   *
   * @internal
   */
  public getConnectionPlan(): ConnectionPlan<TPlan> {
    const plan = this.getPlan(this.connectionPlanId);
    if (!(plan instanceof ConnectionPlan)) {
      throw new Error(
        `Expected ${this.connectionPlanId} (${plan}) to be a ConnectionPlan`,
      );
    }
    return plan as ConnectionPlan<TPlan>;
  }

  /**
   * Returns true if the following hold:
   *
   * - first is set
   * - last is not set
   * - if first had been one larger, another record would have been returned.
   *
   * In all other cases, false is returned.
   *
   * @see {@link https://relay.dev/graphql/connections.htm#HasNextPage()}
   */
  public hasNextPage(): ExecutablePlan<boolean> {
    const $connection = this.getConnectionPlan();
    const first = $connection.getFirst();
    const last = $connection.getLast();
    if (first && !last) {
      const nodePlan = (
        $connection as ConnectionPlan<PgSelectPlan<any, any, any, any>>
      ).cloneSubplanWithPagination();
      return nodePlan.hasMore();
    } else {
      return constant(false);
    }
  }

  /**
   * Returns true if the following hold:
   *
   * - last is set
   * - first is not set
   * - if last had been one larger, another record would have been returned.
   *
   * In all other cases, false is returned.
   *
   * @see {@link https://relay.dev/graphql/connections.htm#HasPreviousPage()}
   */
  public hasPreviousPage(): ExecutablePlan<boolean> {
    const $connection = this.getConnectionPlan();
    const first = $connection.getFirst();
    const last = $connection.getLast();
    if (last && !first) {
      const nodePlan = (
        $connection as ConnectionPlan<PgSelectPlan<any, any, any, any>>
      ).cloneSubplanWithPagination();
      return nodePlan.hasMore();
    } else {
      return constant(false);
    }
  }

  execute(
    values: CrystalValuesList<ReadonlyArray<any>>,
  ): CrystalResultsList<object> {
    return values.map((_value) => ({}));
  }
}

export function pgPageInfo<TPlan extends PgSelectPlan<any, any, any, any>>(
  connectionPlan: ConnectionPlan<TPlan>,
): PgPageInfoPlan<TPlan> {
  return new PgPageInfoPlan(connectionPlan);
}
