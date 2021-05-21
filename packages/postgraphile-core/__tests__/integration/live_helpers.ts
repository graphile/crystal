import SubscriptionsLDS from "@graphile/subscriptions-lds";
import { DocumentNode, GraphQLSchema, subscribe, validate } from "graphql";
import { PoolClient } from "pg";

import { createPostGraphileSchema } from "../..";
import { withTransactionlessPgClient } from "../helpers";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const v = parseFloat(process.env.PGVERSION || "");

export const skipLDSTests = v && v < 10;

let schema: GraphQLSchema;
export async function resetDatabase() {
  await withTransactionlessPgClient((pgClient) =>
    pgClient.query("delete from live_test.users"),
  );
}

export async function createSchema() {
  await withTransactionlessPgClient(async (pgClient) => {
    schema = await createPostGraphileSchema(pgClient, "live_test", {
      live: true,
      ownerConnectionString: process.env.TEST_DATABASE_URL,
      simpleCollections: "both",
      graphileBuildOptions: {
        ldsSleepDuration: 50, // Run tighter LDS loops to reduce test time
      },
      appendPlugins: [SubscriptionsLDS],
    });
  });
}

export function releaseSchema() {
  // Release the LDS source
  if (
    schema &&
    schema["__pgLdsSource"] &&
    typeof schema["__pgLdsSource"].close === "function"
  ) {
    schema["__pgLdsSource"].close();
  }
}

function isIterator<T>(
  i: T | AsyncIterableIterator<T>,
): i is AsyncIterableIterator<T> {
  return typeof (i as any).next === "function";
}

type JSONValue =
  | null
  | boolean
  | number
  | string
  | Array<JSONValue>
  | { [key: string]: JSONValue };

type LiveTestCallback<T> = (
  client: PoolClient,
  getChanges: () => { values: any[]; ended: boolean; error: Error | null },
) => Promise<T>;
export function liveTest<T>(
  query: DocumentNode,
  cb: LiveTestCallback<T>,
): Promise<T>;
export function liveTest<T>(
  query: DocumentNode,
  variables: JSONValue,
  cb: LiveTestCallback<T>,
): Promise<T>;
export function liveTest<T>(
  query: DocumentNode,
  varsOrCb: JSONValue | LiveTestCallback<T>,
  maybeCb?: LiveTestCallback<T>,
): Promise<T> {
  const variables: JSONValue = typeof varsOrCb === "object" ? varsOrCb : null;
  const cb: LiveTestCallback<T> =
    typeof varsOrCb === "function"
      ? varsOrCb
      : typeof maybeCb === "function"
      ? maybeCb
      : (maybeCb as never);

  const errors = validate(schema, query);
  if (errors && errors.length) throw errors[0];

  return withTransactionlessPgClient<T>(async (pgClient) => {
    const iterator = await subscribe(
      schema,
      query,
      null,
      { pgClient },
      variables,
    );
    if (!isIterator(iterator)) {
      // Not actually an iterator
      throw iterator.errors![0].originalError || iterator.errors![0];
    }
    let changes: any[] = [];
    let ended = false;
    let error: Error | null = null;
    function getChanges() {
      let values = changes;
      changes = [];
      return {
        values,
        ended,
        error,
      };
    }
    (async () => {
      try {
        /*
        for await (const value of iterator) {
          changes.push(value);
        }
        */
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await iterator.next();
          if (done) {
            break;
          } else {
            if (value.errors) {
              ended = true;
              error = value.errors[0];
              iterator.throw!(value.errors[0]);
            } else {
              changes.push(value);
            }
          }
        }
      } catch (e) {
        error = e;
      }
      ended = true;
    })();
    let result: T;
    try {
      result = await cb(pgClient, getChanges);
    } finally {
      iterator.return!();
    }
    // Assert there's no more data
    while (!ended) {
      await sleep(10);
    }
    if (changes.length) {
      throw new Error(
        changes.length + " more values found after test completed!",
      );
    }
    return result;
  });
}

export async function next(getLatest: () => any, duration = 5000) {
  const start = Date.now();
  while (Date.now() - start <= duration) {
    const { values, ended, error } = getLatest();
    if (error) throw error;
    if (ended)
      throw new Error(
        "You called `next` but the iterator has already ended - maybe an error occurred",
      );
    if (values.length > 0) {
      expect(values).toHaveLength(1);
      return values[0];
    }
    await sleep(10);
  }
  throw new Error(
    `Your call to \`next\` timed out waiting for new data (timeout: ${duration}ms)`,
  );
}

export async function expectNoChange(getLatest: () => any, duration = 250) {
  const start = Date.now();
  while (Date.now() - start <= duration) {
    const { values, ended, error } = getLatest();
    if (error) throw error;
    if (ended) throw new Error("Iterator has ended");
    if (values.length) {
      throw new Error("Found an unexpected change " + JSON.stringify(values));
    }
    await sleep(10);
  }
}
