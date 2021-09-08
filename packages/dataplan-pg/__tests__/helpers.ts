Error.stackTraceLimit = Infinity;
import type { BaseGraphQLContext } from "graphile-crystal";
import { graphql } from "graphql";
import type { PoolClient } from "pg";
import { Pool } from "pg";
import { inspect } from "util";

import type { PgClient, PgClientQuery, WithPgClient } from "../src";
import { makeExampleSchema, schema as optimizedSchema } from "./exampleSchema";

const deoptimizedSchema = makeExampleSchema({ deoptimize: true });

let testPool: Pool | null = null;
beforeAll(() => {
  testPool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || "graphile_crystal",
  });
});

afterAll(() => {
  testPool.end();
  testPool = null;
});

type ClientAndRelease = {
  count: number;
  client: PgClient;
  release: () => void;
  rawPoolClient: PoolClient;
};
const clientMap = new Map<any, Promise<ClientAndRelease>>();
/**
 * Must **not** be an async function, otherwise we'll get race conditions
 */
function clientForSettings(
  pgSettings: { [key: string]: string },
  queries: PgClientQuery[],
): Promise<ClientAndRelease> {
  let clientAndReleasePromise = clientMap.get(pgSettings);
  if (clientAndReleasePromise) {
    clientAndReleasePromise.then(
      (clientAndRelease) => clientAndRelease.count++,
    );
    return clientAndReleasePromise;
  }

  clientAndReleasePromise = (async () => {
    const poolClient = await testPool.connect();
    poolClient.query("begin");

    // Set the claims
    const setCalls: string[] = [];
    const setValues: string[] = [];
    Object.entries(pgSettings).map(([key, value]) => {
      const i = setValues.push(key);
      const j = setValues.push(value);
      setCalls.push(`set_config($${i}, $${j}, true)`);
    });
    if (setCalls.length) {
      const query = `select ${setCalls.join(", ")}`;
      await poolClient.query(query, setValues);
    }

    const clientAndRelease: ClientAndRelease = {
      rawPoolClient: poolClient,
      count: 1,
      client: {
        query<TData>(opts: PgClientQuery) {
          queries.push(opts);
          const { text, values, arrayMode, name } = opts;

          return arrayMode
            ? poolClient.query<TData extends Array<any> ? TData : never>({
                text,
                values,
                name,
                rowMode: "array",
              })
            : poolClient.query<TData>({
                text,
                values,
                name,
              });
        },
        async startTransaction() {
          await poolClient.query("savepoint tx");
        },
        async commitTransaction() {
          await poolClient.query("release savepoint tx");
        },
        async rollbackTransaction() {
          await poolClient.query("rollback to savepoint tx");
        },
      },
      release() {
        this.count--;
        if (this.count < 0) {
          throw new Error("Released client too many times");
        }
      },
    };
    return clientAndRelease;
  })();
  clientMap.set(pgSettings, clientAndReleasePromise);
  return clientAndReleasePromise;
}

async function releaseClients() {
  for (const clientAndReleasePromise of clientMap.values()) {
    const clientAndRelease = await clientAndReleasePromise;
    await clientAndRelease.rawPoolClient.query(`rollback`);
    clientAndRelease.rawPoolClient.release();
    if (clientAndRelease.count !== 0) {
      throw new Error("Client wasn't released right number of times");
    }
  }
  clientMap.clear();
}

afterEach(releaseClients);

export async function runTestQuery(
  source: string,
  variableValues?: { [key: string]: any },
  options: { deoptimize?: boolean } = Object.create(null),
): Promise<{
  data: { [key: string]: any };
  queries: PgClientQuery[];
}> {
  // Do not allow queries to run in parallel during these tests, we need
  // reproducibility (and we don't want to mess with the transactions, see
  // releaseClients below).
  await releaseClients();

  const queries: PgClientQuery[] = [];
  const schema = options.deoptimize ? deoptimizedSchema : optimizedSchema;
  const withPgClient: WithPgClient = async (_pgSettings, callback) => {
    const o = await clientForSettings(_pgSettings, queries);
    try {
      return await callback(o.client);
    } finally {
      o.release();
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
    console.error(errors[0].originalError || errors[0]);
  }
  expect(errors).toBeFalsy();
  expect(data).toBeTruthy();
  return { data, queries };
}
