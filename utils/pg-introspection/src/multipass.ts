import { augmentIntrospectionData } from "./augmentIntrospection.ts";
import type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectOptions,
} from "./interfaces.ts";
import type { EntityType } from "./introspection.ts";
import { makeIntrospectionQuery } from "./query.ts";

type RunQuery = (text: string, values: any[]) => Promise<string>;

export async function introspectRaw<
  TEntities extends EntityType = DefaultEntities,
>(
  options: IntrospectOptions<TEntities>,
  runQuery: RunQuery,
): Promise<IntrospectionDataForEntities<TEntities>> {
  // incremental
  const query = makeIntrospectionQuery(options);
  // Run query
  const result: IntrospectionDataForEntities<TEntities> = JSON.parse(
    await runQuery(query, []),
  );

  // TODO: Find things we can't reach
  // TODO: Recursively run those and merge into `result`

  return result;
}
export async function introspect<
  TEntities extends EntityType = DefaultEntities,
>(
  options: IntrospectOptions<TEntities>,
  runQuery: RunQuery,
): Promise<Introspection<TEntities>> {
  const result = await introspectRaw(options, runQuery);
  return augmentIntrospectionData<TEntities>(options, result);
}
