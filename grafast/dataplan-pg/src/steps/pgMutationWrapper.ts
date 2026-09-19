import type {
  ExecutionDetails,
  Multistep,
  Step,
  UnwrapMultistep,
} from "grafast";

import type { PgClientResult, PgExecutorContext } from "../executor.ts";
import type { PgCodec, PgCodecWithAttributes } from "../interfaces.ts";

export type PgMutationWrapper<
  TQueryBuilder,
  TDependencies extends Multistep,
  TRecord extends Record<string, unknown>,
> = {
  depId: number;
  attributeIndexes: readonly number[];
  callback: PgWrapCallback<TQueryBuilder, TDependencies, TRecord>;
};

export type PgWrapCallback<
  TQueryBuilder,
  TDependencies extends Multistep,
  TRecord extends Record<string, unknown>,
> = (
  run: (client: GraphileConfig.DataplanPgClient) => Promise<TRecord | null>,
  pgClient: GraphileConfig.DataplanPgClient,
  dependencies: UnwrapMultistep<TDependencies>,
  queryBuilder: TQueryBuilder,
) => Promise<TRecord | null>;
