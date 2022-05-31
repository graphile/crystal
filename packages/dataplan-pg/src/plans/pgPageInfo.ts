import type {
  CrystalResultsList,
  CrystalValuesList,
  PageInfoCapablePlan,
} from "dataplanner";
import {
  ConnectionPlan,
  constant,
  ExecutablePlan,
  first,
  last,
} from "dataplanner";

import type { PgCursorPlan } from "./pgCursor.js";
import type { PgSelectParsedCursorPlan, PgSelectPlan } from "./pgSelect.js";
import { PgSelectSinglePlan } from "./pgSelectSingle.js";

/*
 * **IMPORTANT**: see pgPageInfo.md for reasoning behind decisions made in this file
 */

// Reduce GC overhead by reusing the same empty object over and over.
const EMPTY_OBJECT = Object.freeze(Object.create(null));

/**
 * Represents the PageInfo for a Relay-style GraphQL Connection.
 *
 * Invoking PgPageInfoPlan should have no direct overhead (e.g.
 * `pageInfo { __typename }` is free); cost should not be incurred until one of
 * the submethods is called.
 *
 * {@page ~@dataplan/pg/plans/pgPageInfo.md}
 */
export class PgPageInfoPlan<TPlan extends PgSelectPlan<any, any, any, any>>
  extends ExecutablePlan<any>
  implements PageInfoCapablePlan
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgPageInfoPlan",
  };

  isSyncAndSafe = true;

  private connectionPlanId: string;

  constructor(
    connectionPlan: ConnectionPlan<any, PgSelectParsedCursorPlan, TPlan, any>,
  ) {
    super();
    this.connectionPlanId = connectionPlan.id;
  }

  /**
   * Might come in handy later?
   *
   * @internal
   */
  public getConnectionPlan(): ConnectionPlan<
    any,
    PgSelectParsedCursorPlan,
    TPlan,
    any
  > {
    const plan = this.getPlan(this.connectionPlanId);
    if (!(plan instanceof ConnectionPlan)) {
      throw new Error(
        `Expected ${this.connectionPlanId} (${plan}) to be a ConnectionPlan`,
      );
    }
    return plan as ConnectionPlan<any, PgSelectParsedCursorPlan, TPlan, any>;
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
    if ((first && first.evalIs(0)) || (last && last.evalIs(0))) {
      return constant(false);
    }
    const firstExists =
      first && !first.evalIs(null) && !first.evalIs(undefined);
    const lastExists = last && !last.evalIs(null) && !last.evalIs(undefined);
    if (firstExists && !lastExists) {
      const nodePlan = (
        $connection as ConnectionPlan<
          any,
          PgSelectParsedCursorPlan,
          PgSelectPlan<any, any, any, any>,
          any
        >
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
    if ((first && first.evalIs(0)) || (last && last.evalIs(0))) {
      return constant(false);
    }
    const offset = $connection.getOffset();
    const firstExists =
      first && !first.evalIs(null) && !first.evalIs(undefined);
    const lastExists = last && !last.evalIs(null) && !last.evalIs(undefined);
    if (lastExists && !firstExists) {
      const nodePlan = (
        $connection as ConnectionPlan<
          PgSelectSinglePlan<any, any, any, any>,
          PgSelectParsedCursorPlan,
          PgSelectPlan<any, any, any, any>,
          PgSelectSinglePlan<any, any, any, any>
        >
      ).cloneSubplanWithPagination();
      return nodePlan.hasMore();
    } else if (offset && !offset.evalIs(null) && !offset.evalIs(undefined)) {
      return constant(true);
    } else {
      return constant(false);
    }
  }

  startCursor(): PgCursorPlan<PgSelectSinglePlan<any, any, any, any>> {
    const $connection = this.getConnectionPlan() as ConnectionPlan<
      PgSelectSinglePlan<any, any, any, any>,
      PgSelectParsedCursorPlan,
      PgSelectPlan<any, any, any, any>,
      PgSelectSinglePlan<any, any, any, any>
    >;
    const $rows = $connection.cloneSubplanWithPagination();
    return new PgSelectSinglePlan($rows, first($rows)).cursor();
  }

  endCursor(): PgCursorPlan<PgSelectSinglePlan<any, any, any, any>> {
    const $connection = this.getConnectionPlan() as ConnectionPlan<
      PgSelectSinglePlan<any, any, any, any>,
      PgSelectParsedCursorPlan,
      PgSelectPlan<any, any, any, any>,
      PgSelectSinglePlan<any, any, any, any>
    >;
    const $rows = $connection.cloneSubplanWithPagination();
    return new PgSelectSinglePlan($rows, last($rows)).cursor();
  }

  execute(
    values: CrystalValuesList<ReadonlyArray<any>>,
  ): CrystalResultsList<object> {
    return new Array(values[0].length).fill(EMPTY_OBJECT);
  }
}

/**
 * Represents the PageInfo for a Relay-style GraphQL Connection.
 *
 * {@page ~@dataplan/pg/plans/pgPageInfo.md}
 */
export function pgPageInfo<TPlan extends PgSelectPlan<any, any, any, any>>(
  connectionPlan: ConnectionPlan<any, PgSelectParsedCursorPlan, TPlan, any>,
): PgPageInfoPlan<TPlan> {
  return new PgPageInfoPlan(connectionPlan);
}
