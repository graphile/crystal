import type { EntityType, Introspection, Options } from "./introspection";
import { makeIntrospectionQuery } from "./query";

type RunQuery = (text: string, values: any[]) => Promise<string>;

type FixedIntrospectionKeys =
  | "catalog_by_oid"
  | "current_user"
  | "pg_version"
  | "introspection_version";

export async function introspect<TEntities extends EntityType>(
  options: Options<TEntities>,
  runQuery: RunQuery,
): Promise<Pick<Introspection, TEntities | FixedIntrospectionKeys>> {
  // incremental
  const query = makeIntrospectionQuery(options);
  // Run query
  const result: Pick<Introspection, TEntities | FixedIntrospectionKeys> =
    JSON.parse(await runQuery(query, []));

  // TODO: Find things we can't reach
  // TODO: Recursively run those and merge into `result`

  return result;
}
