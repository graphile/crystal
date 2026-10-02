import type { ExecutionValue, Multistep, UnwrapMultistep } from "grafast";

import type { PgClientResult, PgNotice } from "../executor.ts";
import type { PgCodec } from "../interfaces.ts";

/** @experimental */
type Selection = readonly (readonly [
  attributeName: string,
  index: number,
  codec: PgCodec,
])[];

/** @experimental */
export type PgMutationWrapper<
  TQueryBuilder,
  TDependencies extends Multistep,
  TRecord extends Record<string, unknown>,
> = {
  depId: number;
  selection: Selection;
  callback: PgWrapCallback<TQueryBuilder, TDependencies, TRecord>;
};

/** @experimental */
export type PgWrapCallback<
  TQueryBuilder,
  TDependencies extends Multistep,
  TRecord extends Record<string, unknown>,
> = (
  run: RunCallback<TRecord>,
  pgClient: GraphileConfig.DataplanPgClient,
  dependencies: UnwrapMultistep<TDependencies>,
  queryBuilder: TQueryBuilder,
) => Promise<PgWrapResult<TRecord>>;

type PgWrapResult<TRecord extends Record<string, unknown>> = {
  rows: readonly TRecord[];
  rowCount: number | null;
  notices?: readonly PgNotice[];

  /** internal */
  _raw: PgClientResult<any>;
};

type RunCallback<TRecord extends Record<string, unknown>> = (
  client: GraphileConfig.DataplanPgClient,
) => Promise<PgWrapResult<TRecord>>;

/** @experimental */
export function makeWrappedMutationExecute<TQueryBuilder, TData extends any[]>(
  wrappers: readonly PgMutationWrapper<
    TQueryBuilder,
    Multistep,
    Record<string, unknown>
  >[],
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
    return async (pgClientAdaptor) => {
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
      const result = await callback(
        run,
        pgClientAdaptor,
        dependencies,
        queryBuilder,
      );
      return result._raw;
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
    selection.map(([attributeName, index, codec]) => [
      attributeName,
      row[index] == null ? null : codec.fromPg(row[index]),
    ]),
  );
}
