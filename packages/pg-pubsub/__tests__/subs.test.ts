import {
  postgraphile,
  makePluginHook,
  PostGraphileOptions,
} from "postgraphile";
import {
  introspectionQuery as INTROSPECTION_QUERY,
  buildClientSchema,
  printSchema,
} from "graphql";
import { Pool, PoolClient } from "pg";
import SupporterPlugin from "../src";
import { runQuery, TestCtx } from "./runQuery";

let ctx: TestCtx | null = null;
const CLI_DEFAULTS = {};

const printIntrospectionResults = (json: any) =>
  printSchema(buildClientSchema(json.data));

const init = async (options: PostGraphileOptions = {}) => {
  if (ctx) {
    throw new Error("CTX wasn't torn down");
  }
  const pgPool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL || "pggql_test",
  });

  // Keep track of the clients, one of them is our subscriptions client which we
  // must release manually.
  const clients: Array<PoolClient> = [];
  pgPool.on("acquire", client => {
    clients.push(client);
  });
  pgPool.on("remove", client => {
    const i = clients.indexOf(client);
    clients.splice(i, 1);
  });

  const pluginHook = makePluginHook([SupporterPlugin]);
  const middleware = postgraphile(pgPool, ["pubsub_test"], {
    pluginHook,
    ignoreRBAC: false,
    ...options,
  });
  ctx = {
    middleware,
    pgPool,
    release: async () => {
      const endPromise = pgPool.end();
      clients.forEach(c => c.release());
      await endPromise;
    },
  };
};

const teardown = async () => {
  if (ctx) {
    try {
      await ctx.release();
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(e);
    }
  }
  ctx = null;
};

describe("Middleware defaults", () => {
  beforeAll(() => init());
  afterAll(teardown);

  it("handles the introspection query", async () => {
    await runQuery(
      ctx!,
      INTROSPECTION_QUERY,
      {},
      {},
      async (json, _req, res) => {
        expect(res.statusCode).toEqual(200);
        expect(printIntrospectionResults(json)).toMatchSnapshot();
      }
    );
  });
});

describe("Subscriptions", () => {
  beforeAll(() =>
    init({
      ...CLI_DEFAULTS,
      simpleSubscriptions: true,
    }));
  afterAll(teardown);

  it("handles the introspection query", async () => {
    await runQuery(
      ctx!,
      INTROSPECTION_QUERY,
      {},
      {},
      async (json, _req, res) => {
        expect(res.statusCode).toEqual(200);
        expect(printIntrospectionResults(json)).toMatchSnapshot();
      }
    );
  });
});
