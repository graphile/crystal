import type { BaseGraphQLContext } from "graphile-crystal";
import { graphql } from "graphql";
import type { PoolClient } from "pg";
import { Pool } from "pg";

import type { PgClient, PgClientQuery, WithPgClient } from "../src/datasource";
import { makeExampleSchema, schema as optimizedSchema } from "./exampleSchema";

const deoptimizedSchema = makeExampleSchema({ deoptimize: true });

let testPool: Pool | null = null;
beforeAll(() => {
  testPool = new Pool({ connectionString: "graphile_crystal" });
});

afterAll(() => {
  testPool.end();
  testPool = null;
});

function pg2pgclient(client: PoolClient, queries: PgClientQuery[]): PgClient {
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
  options: { deoptimize?: boolean } = {},
): Promise<{
  data: { [key: string]: any };
  queries: PgClientQuery[];
}> {
  const queries: PgClientQuery[] = [];
  const schema = options.deoptimize ? deoptimizedSchema : optimizedSchema;
  const withPgClient: WithPgClient = async (_pgSettings, callback) => {
    const client = await testPool.connect();
    try {
      // TODO: set pgSettings within a transaction
      return callback(pg2pgclient(client, queries));
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
  if (errors) {
    console.error(errors[0].originalError);
  }
  expect(errors).toBeFalsy();
  expect(data).toBeTruthy();
  return { data, queries };
}
