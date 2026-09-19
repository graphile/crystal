import type { ExecutionValue, Multistep, UnwrapMultistep } from "grafast";

import type { PgClientResult, PgNotice } from "../executor.ts";

type Selection = readonly (readonly [attributeName: string, index: number])[];

export type PgMutationWrapper<
  TQueryBuilder,
  TDependencies extends Multistep,
  TRecord extends Record<string, unknown>,
> = {
  depId: number;
  selection: Selection;
  callback: PgWrapCallback<TQueryBuilder, TDependencies, TRecord>;
};

export type PgWrapCallback<
  TQueryBuilder,
  TDependencies extends Multistep,
  TRecord extends Record<string, unknown>,
> = (
  run: RunCallback<TRecord>,
  pgClient: GraphileConfig.DataplanPgClient,
  dependencies: UnwrapMultistep<TDependencies>,
  queryBuilder: TQueryBuilder,
) => Promise<TRecord | null>;

type RunCallback<TRecord> = (
  client: GraphileConfig.DataplanPgClient,
) => Promise<{
  rows: readonly TRecord[];
  rowCount: number | null;
  notices?: readonly PgNotice[];

  /** internal */
  _raw: PgClientResult<any>;
}>;

export function makeWrappedMutationExecute<TQueryBuilder, TData extends any[]>(
  wrappers: readonly PgMutationWrapper<TQueryBuilder, any, any>[],
  values: readonly ExecutionValue[],
  batchIndex: number,
  queryBuilder: TQueryBuilder,
  innerCallback: (
    client: GraphileConfig.DataplanPgClient,
  ) => Promise<PgClientResult<TData>>,
): (client: GraphileConfig.DataplanPgClient) => Promise<PgClientResult<TData>> {
  if (wrappers.length > 0) {
    const [wrapper, ...tail] = wrappers;
    const { depId, callback, selection } = wrapper;
    return (pgClientAdaptor) => {
      const dependencies = values[depId].at(batchIndex);
      const run = async (client: GraphileConfig.DataplanPgClient) => {
        const innerRun = makeWrappedMutationExecute(
          tail,
          values,
          batchIndex,
          queryBuilder,
          innerCallback,
        );
        const result = await innerRun(client);
        const { rows } = result;
        return {
          ...result,
          rows: rowsToRecords(rows, selection),
          _raw: result,
        };
      };
      return callback(run, pgClientAdaptor, dependencies, queryBuilder);
    };
  } else {
    return innerCallback;
  }
}

function rowsToRecords(
  rows: readonly any[][],
  selection: Selection,
): readonly Record<string, unknown>[] {
  return rows.map((row) => rowToRecord(row, selection));
}

function rowToRecord(
  row: readonly any[],
  selection: Selection,
): Record<string, unknown> {
  return Object.fromEntries(
    selection.map(([attributeName, index]) => [attributeName, row[index]]),
  );
}
