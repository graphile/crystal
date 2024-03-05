import type {
  ExecutableStep,
  ExecutionDetails,
  GrafastResultsList,
  PageInfoCapableStep,
} from "grafast";
import {
  ConnectionStep,
  constant,
  first,
  last,
  UnbatchedExecutableStep,
} from "grafast";

import type { PgCursorStep } from "./pgCursor.js";
import type { PgSelectParsedCursorStep, PgSelectStep } from "./pgSelect.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";
import type { PgUnionAllSingleStep, PgUnionAllStep } from "./pgUnionAll.js";

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
export class PgPageInfoStep<
    TStep extends PgSelectStep<any> | PgUnionAllStep<any, any>,
  >
  extends UnbatchedExecutableStep<any>
  implements PageInfoCapableStep
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgPageInfoStep",
  };

  isSyncAndSafe = true;

  private connectionStepId: number;

  constructor(
    connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, TStep, any>,
  ) {
    super();
    this.connectionStepId = this.addDependency(connectionPlan);
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
    const plan = this.getDep(this.connectionStepId);
    if (!(plan instanceof ConnectionStep)) {
      throw new Error(`Expected ${plan} to be a ConnectionStep`);
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
      const nodePlan = $connection.cloneSubplanWithPagination();
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
      const nodePlan = $connection.cloneSubplanWithPagination();
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

  startCursor(): PgCursorStep<PgSelectSingleStep<any> | PgUnionAllSingleStep> {
    const $connection = this.getConnectionStep();
    const $rows = $connection.cloneSubplanWithPagination();
    return $rows.row(first($rows)).cursor();
  }

  endCursor(): PgCursorStep<PgSelectSingleStep<any> | PgUnionAllSingleStep> {
    const $connection = this.getConnectionStep();
    const $rows = $connection.cloneSubplanWithPagination();
    return $rows.row(last($rows)).cursor();
  }

  execute({ count }: ExecutionDetails): GrafastResultsList<object> {
    return new Array(count).fill(EMPTY_OBJECT);
  }

  unbatchedExecute() {
    return EMPTY_OBJECT;
  }
}

/**
 * Represents the PageInfo for a Relay-style GraphQL Connection.
 *
 * {@page ~@dataplan/pg/steps/pgPageInfo.md}
 */
export function pgPageInfo<
  TStep extends PgSelectStep<any> | PgUnionAllStep<any, any>,
>(
  connectionPlan: ConnectionStep<any, PgSelectParsedCursorStep, TStep, any>,
): PgPageInfoStep<TStep> {
  return new PgPageInfoStep(connectionPlan);
}
