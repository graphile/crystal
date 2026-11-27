import { hookArgs } from "grafast";
import { buildSchema, parse } from "grafast/graphql";
import { resolvePreset } from "graphile-config";

import * as adaptor from "../dist/adaptors/pg.js";
import { makePgAdaptorWithPgClient } from "../dist/adaptors/pg.js";
import { EXPORTABLE } from "../dist/datasource.js";
import {
  makeWithSharedPgClient,
  PgContextPlugin,
  PgExecutor,
} from "../dist/index.js";
import { useTestPool } from "./sharedHelpers.ts";

const getPool = useTestPool();
const executor = EXPORTABLE(
  (PgExecutor) =>
    new PgExecutor({
      name: "test",
      context: () => {
        throw new Error("No planning in this test");
      },
    }),
  [PgExecutor],
);

test.each([false, true])(
  "shares cursors and releases the transaction (settings: %s)",
  async (settings) => {
    const pool = getPool();
    const withSharedPgClient = makeWithSharedPgClient({ pool, maxClients: 1 });
    const context = {
      withPgClient: makePgAdaptorWithPgClient(pool),
      pgSettings: settings ? { application_name: "shared-client-test" } : null,
      withSharedPgClient,
    };
    const inputs = [{ context, queryValues: [] }];
    await withSharedPgClient(context, {}, async (client) => {
      expect(Object.keys(client)).toEqual(["query"]);
      const { rows: before } = await client.query<{ id: string }>({
        text: "select txid_current() as id",
      });
      const open = async () => {
        const { streams } = await executor.executeStream(inputs, {
          text: "select i from generate_series(1, 300) i",
          rawSqlValues: [],
          eventEmitter: undefined,
        });
        const iterable = await streams[0];
        return iterable[Symbol.asyncIterator]();
      };
      const first = await open();
      const second = await open();
      expect((await first.next()).value).toEqual([1]);
      const count = async () =>
        (
          await client.query<{ count: number }>({
            text: "select count(*)::int as count from pg_cursors",
          })
        ).rows[0].count;
      expect(await count()).toBe(2);
      await first.return!();
      expect(await count()).toBe(1);
      await second.return!();
      expect(await count()).toBe(0);
      // Wait for cursor callback cleanup before comparing transaction IDs.
      await new Promise<void>((resolve) => setImmediate(resolve));
      const after = await client.query<{ id: string }>({
        text: "select txid_current() as id",
      });
      expect(before[0].id === after.rows[0].id).toBe(settings);
    });
  },
);

test("buffered streaming returns its dedicated checkout before iteration", async () => {
  const pool = getPool();
  const base = makePgAdaptorWithPgClient(pool);
  // A custom provider that only implements dedicated checkouts.
  const withPgClient: typeof base = (settings, callback) =>
    base(settings, callback);
  const context = {
    withPgClient,
    pgSettings: null,
  };
  const { streams } = await executor.executeStream(
    [{ context, queryValues: [] }],
    { text: "select 42", rawSqlValues: [], eventEmitter: undefined },
  );
  expect(pool.idleCount).toBe(pool.totalCount);
  const iterable = await streams[0];
  expect((await iterable[Symbol.asyncIterator]().next()).value).toEqual([42]);
});

test("joining an ambient transaction skips its savepoint only when requested", async () => {
  const withPgClient = makePgAdaptorWithPgClient(getPool());
  await withPgClient({ application_name: "savepoint-test" }, async (client) => {
    const fail = async (inner: typeof client) => {
      await inner.query({ text: "select 1 / 0" });
    };
    await expect(client.withTransaction(fail)).rejects.toThrow(
      "division by zero",
    );
    await client.query({ text: "select 1" });
    await expect(
      client.withTransaction(fail, { savepoint: false }),
    ).rejects.toThrow("division by zero");
    await expect(client.query({ text: "select 1" })).rejects.toThrow(
      "transaction is aborted",
    );
  });
});

test("a transaction failure wakes an idle borrower and frees the shared slot", async () => {
  const pool = getPool();
  const shared = makeWithSharedPgClient({ pool, maxClients: 1 });
  const context = {
    pgSettings: null,
    withPgClient: makePgAdaptorWithPgClient(pool),
  };
  const ready = Promise.withResolvers<void>();
  const holder = shared(context, { needsTransaction: true }, async () => {
    ready.resolve();
    await new Promise<void>(() => {});
  });
  await ready.promise;
  const read = shared(context, {}, (client) =>
    client.query({ text: "select 1 / 0" }),
  );
  await Promise.all([
    expect(read).rejects.toThrow("division by zero"),
    expect(holder).rejects.toThrow("division by zero"),
  ]);
  await shared(context, {}, (client) => client.query({ text: "select 1" }));
});

describe("executor routing", () => {
  const getPool = useTestPool();
  test.each([
    { kind: "unrelated", groupCount: 20 },
    // Two of these groups must queue behind the first three.
    { kind: "affinity", groupCount: 5 },
    { kind: "name", groupCount: 2 },
    { kind: "signature", groupCount: 2 },
  ])(
    "routes 20 overlapping $kind reads to the expected PostgreSQL backends",
    async ({ kind, groupCount }) => {
      const pool = getPool();
      const base = makePgAdaptorWithPgClient(pool);
      const guard = Promise.withResolvers<void>();
      const pids = new Set<number>();
      const expectedClients = Math.min(groupCount, 3);
      let checkouts = 0;
      // Hold the first reads until every expected connection has done work.
      const withPgClient: typeof base = (settings, callback, options) => {
        checkouts++;
        return base(
          settings,
          (client) =>
            callback({
              ...client,
              async query<TData>(query: Parameters<typeof client.query>[0]) {
                const result = await client.query<TData>(query);
                pids.add((result.rows[0] as [number])[0]);
                if (pids.size === expectedClients) {
                  guard.resolve();
                }
                await guard.promise;
                return result;
              },
            }),
          options,
        );
      };
      const context = {
        pgSettings: null,
        withPgClient,
        withSharedPgClient: makeWithSharedPgClient({ pool, maxClients: 4 }),
      };
      const affinities = Array.from({ length: groupCount }, () => Symbol());
      const timer = setTimeout(
        () => guard.reject(new Error("Reads did not run concurrently")),
        3000,
      );
      try {
        const results = await Promise.all(
          Array.from({ length: 20 }, (_, i) => {
            const group = i % groupCount;
            const statement =
              kind === "signature" || kind === "name" ? group : i;
            return executor.executeShared<unknown, [number, number]>(
              [{ context, queryValues: [] }],
              {
                text: `select pg_backend_pid(), ${statement}`,
                name: kind === "name" ? `shared_pid_${group}` : undefined,
                affinity: kind === "affinity" ? affinities[group] : undefined,
                rawSqlValues: [],
                eventEmitter: undefined,
              },
            );
          }),
        );
        expect(pids.size).toBe(expectedClients);
        expect(checkouts).toBe(expectedClients);
        const backends = results.map(({ values }) => values[0][0][0]);
        if (groupCount < backends.length) {
          expect(backends).toEqual(
            backends.map((_, i) => backends[i % groupCount]),
          );
        }
      } finally {
        clearTimeout(timer);
        guard.resolve();
      }
    },
  );
});

test.each(["standalone", "configured service", "manual service"])(
  "a regular read sees the cursor in a two-key %s context",
  async (source) => {
    const pool = getPool();
    let withPgClient;
    if (source === "standalone") {
      withPgClient = makePgAdaptorWithPgClient(pool);
    } else {
      const pgService =
        source === "configured service"
          ? adaptor.makePgService({ pool, pubsub: false })
          : {
              name: "main",
              adaptor,
              adaptorSettings: { pool },
              withPgClientKey: "withPgClient" as const,
            };
      const args = await hookArgs({
        schema: buildSchema("type Query { value: Int }"),
        document: parse("{ value }"),
        resolvedPreset: resolvePreset({
          plugins: [PgContextPlugin],
          pgServices: [pgService],
        }),
      });
      withPgClient = args.contextValue.withPgClient;
    }
    const context = { withPgClient, pgSettings: null };
    const inputs = [{ context, queryValues: [] }];
    const affinity = Symbol();
    const options = { affinity, rawSqlValues: [], eventEmitter: undefined };
    const { streams } = await executor.executeStream<unknown, [number, number]>(
      inputs,
      {
        ...options,
        text: "select pg_backend_pid(), i from generate_series(1, 301) i",
      },
    );
    const rows = (await streams[0])[Symbol.asyncIterator]();
    try {
      const first = await rows.next();
      expect(first.done).toBe(false);
      const { values } = await executor.executeShared<
        unknown,
        [number, number]
      >(inputs, {
        ...options,
        text: "select pg_backend_pid(), count(*)::int from pg_cursors where name like '__cursor_%'",
      });
      expect(values[0]).toEqual([[first.value[0], 1]]);
      expect((await rows.next()).value).toEqual([first.value[0], 2]);
    } finally {
      await rows.return!();
    }
  },
);
