import type {
  CrystalResultsList,
  CrystalValuesList,
  PageInfoCapableStep,
} from "dataplanner";
import {
  ConnectionStep,
  constant,
  ExecutableStep,
  first,
  last,
} from "dataplanner";

import type { PgCursorStep } from "./pgCursor.js";
import type { PgSelectParsedCursorStep, PgSelectStep } from "./pgSelect.js";
import { PgSelectSingleStep } from "./pgSelectSingle.js";

/*
 * **IMPORTANT**: see pgPageInfo.md for reasoning behind decisions made in this file
 */

// Reduce GC overhead by reusing the same empty object over and over.
const EMPTY_OBJECT = Object.freeze(Object.create(null));

/**
 * Represents the PageInfo for a Relay-style GraphQL Connection.
 *
 * Invoking PgPageInfoStep should have no direct overhead (e.g.
 * `pageInfo { __typename }` is free); cost should not be incurred until one of
 * the submethods is called.
 *
 * {@page ~@dataplan/pg/steps/pgPageInfo.md}
 */
export class PgPageInfoStep<TStep extends PgSelectStep<any, any, any, any>>
  extends ExecutableStep<any>
  implements PageInfoCapableStep
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgPageInfoStep",
  };

  isSyncAndSafe = true;

  private connectionStepId: string;

  constructor(
    connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, TStep, any>,
  ) {
    super();
    this.connectionStepId = connectionPlan.id;
  }

  /**
   * Might come in handy later?
   *
   * @internal
   */
  public getConnectionStep(): ConnectionStep<
    any,
    PgSelectParsedCursorStep,
    TStep,
    any
  > {
    const plan = this.getStep(this.connectionStepId);
    if (!(plan instanceof ConnectionStep)) {
      throw new Error(
        `Expected ${this.connectionStepId} (${plan}) to be a ConnectionStep`,
      );
    }
    return plan as ConnectionStep<any, PgSelectParsedCursorStep, TStep, any>;
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
  public hasNextPage(): ExecutableStep<boolean> {
    const $connection = this.getConnectionStep();
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
        $connection as ConnectionStep<
          any,
          PgSelectParsedCursorStep,
          PgSelectStep<any, any, any, any>,
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
  public hasPreviousPage(): ExecutableStep<boolean> {
    const $connection = this.getConnectionStep();
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
        $connection as ConnectionStep<
          PgSelectSingleStep<any, any, any, any>,
          PgSelectParsedCursorStep,
          PgSelectStep<any, any, any, any>,
          PgSelectSingleStep<any, any, any, any>
        >
      ).cloneSubplanWithPagination();
      return nodePlan.hasMore();
    } else if (
      offset &&
      !offset.evalIs(null) &&
      !offset.evalIs(undefined) &&
      !offset.evalIs(0)
    ) {
      return constant(true);
    } else {
      return constant(false);
    }
  }

  startCursor(): PgCursorStep<PgSelectSingleStep<any, any, any, any>> {
    const $connection = this.getConnectionStep() as ConnectionStep<
      PgSelectSingleStep<any, any, any, any>,
      PgSelectParsedCursorStep,
      PgSelectStep<any, any, any, any>,
      PgSelectSingleStep<any, any, any, any>
    >;
    const $rows = $connection.cloneSubplanWithPagination();
    return new PgSelectSingleStep($rows, first($rows)).cursor();
  }

  endCursor(): PgCursorStep<PgSelectSingleStep<any, any, any, any>> {
    const $connection = this.getConnectionStep() as ConnectionStep<
      PgSelectSingleStep<any, any, any, any>,
      PgSelectParsedCursorStep,
      PgSelectStep<any, any, any, any>,
      PgSelectSingleStep<any, any, any, any>
    >;
    const $rows = $connection.cloneSubplanWithPagination();
    return new PgSelectSingleStep($rows, last($rows)).cursor();
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
 * {@page ~@dataplan/pg/steps/pgPageInfo.md}
 */
export function pgPageInfo<TStep extends PgSelectStep<any, any, any, any>>(
  connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, TStep, any>,
): PgPageInfoStep<TStep> {
  return new PgPageInfoStep(connectionPlan);
}
