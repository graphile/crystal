import type { BaseGraphQLContext } from "graphile-crystal";
import { graphql } from "graphql";
import type { PoolClient } from "pg";
import { Pool } from "pg";

import type { PgClient, PgClientQuery, WithPgClient } from "../src/datasource";
import { schema } from "./exampleSchema";

let testPool: Pool | null = null;
beforeAll(() => {
  testPool = new Pool({ connectionString: "graphile_crystal" });
});

afterAll(() => {
  testPool.end();
  testPool = null;
});

let queries: PgClientQuery[] = [];
beforeEach(() => {
  queries = [];
});

function pg2pgclient(client: PoolClient): PgClient {
  return {
    query<TData>(opts: PgClientQuery) {
      queries.push(opts);
      const { text, values, arrayMode, name } = opts;

      return arrayMode
        ? client.query<TData extends Array<any> ? TData : never>({
            text,
            values,
            name,
            rowMode: "array",
          })
        : client.query<TData>({
            text,
            values,
            name,
          });
    },
  };
}

export async function runTestQuery(
  source: string,
  variableValues?: { [key: string]: any },
): Promise<{
  data: { [key: string]: any };
  queries: PgClientQuery[];
}> {
  const withPgClient: WithPgClient = async (_pgSettings, callback) => {
    const client = await testPool.connect();
    try {
      // TODO: set pgSettings within a transaction
      return callback(pg2pgclient(client));
    } finally {
      client.release();
    }
  };
  const contextValue: BaseGraphQLContext = {
    pgSettings: {},
    withPgClient,
  };
  const result = await graphql({
    schema,
    source,
    variableValues,
    contextValue,
    rootValue: null,
  });

  const { data, errors } = result;
  expect(errors).toBeFalsy();
  expect(data).toBeTruthy();
  return { data, queries };
}
