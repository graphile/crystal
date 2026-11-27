import { makePgAdaptorWithPgClient } from "../dist/adaptors/pg.js";
import { EXPORTABLE } from "../dist/datasource.js";
import { makeWithSharedPgClient, PgExecutor } from "../dist/index.js";
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
  const context = {
    withPgClient: makePgAdaptorWithPgClient(pool),
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
