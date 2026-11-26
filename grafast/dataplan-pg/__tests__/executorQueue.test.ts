import type { ExecutionDetails } from "grafast";
import { grafast, makeGrafastSchema, Step } from "grafast";

import { EXPORTABLE } from "../dist/datasource.js";
import { PgExecutor } from "../dist/executor.js";
import {
  pgStepBatchExecutor,
  pgStepBatchOptions,
} from "../dist/steps/pgStepBatch.js";

function makeExecutor() {
  return EXPORTABLE(
    (PgExecutor) =>
      new PgExecutor({ name: "test", context: () => null as any }),
    [PgExecutor],
  );
}

function makeContext(query: (opts: any, clientNumber: number) => Promise<any>) {
  let clientCount = 0;
  const seen: Array<{ clientNumber: number; text: string; name?: string }> = [];
  const withPgClient = jest.fn(async (_settings, callback) => {
    const clientNumber = ++clientCount;
    const client = {
      tryReserveCursor: () => () => {},
      query: async (opts: any) => {
        seen.push({ clientNumber, text: opts.text, name: opts.name });
        return query(opts, clientNumber);
      },
      withTransaction: async (callback: any) => callback(client),
    };
    return callback(client);
  });
  const context = { pgSettings: { role: "test" }, withPgClient };
  return { context, seen, withPgClient };
}

function run(
  executor: PgExecutor,
  context: ReturnType<typeof makeContext>["context"],
  text: string,
  value: string,
  executionAffinity?: symbol,
  cached = true,
  store?: object,
) {
  const method = cached ? "executeWithCache" : "executeWithoutCache";
  return executor[method]([{ context, queryValues: [] }], {
    store,
    text,
    rawSqlValues: [value],
    name: text,
    identifierIndex: null,
    affinity: executionAffinity,
    eventEmitter: undefined,
  });
}

test("reuses one client and prepared statement for identical SQL", async () => {
  const executor = makeExecutor();
  const { context, seen, withPgClient } = makeContext(async (opts) => ({
    rows: [[opts.values[0]]],
    rowCount: 1,
  }));

  const results = await Promise.all(
    ["jazz", "rock", "metal"].map((genre) =>
      run(executor, context, "select $1", genre),
    ),
  );

  expect(results.map((r) => r.values)).toEqual([
    [[["jazz"]]],
    [[["rock"]]],
    [[["metal"]]],
  ]);
  expect(withPgClient).toHaveBeenCalledTimes(1);
  expect(seen.map(({ clientNumber, name }) => [clientNumber, name])).toEqual([
    [1, "select $1"],
    [1, "select $1"],
    [1, "select $1"],
  ]);
});

test("pairs cloned selects and runs unrelated SQL on another client", async () => {
  const executor = makeExecutor();
  const { context, seen, withPgClient } = makeContext(async (opts) => ({
    rows: [[opts.values[0]]],
    rowCount: 1,
  }));
  const affinity = Symbol("connection");

  await Promise.all([
    run(executor, context, "select page", "page", affinity),
    run(executor, context, "select count", "count", affinity),
    run(executor, context, "select unrelated", "other"),
  ]);

  expect(withPgClient).toHaveBeenCalledTimes(2);
  const clientFor = (text: string) =>
    seen.find((entry) => entry.text === text)!.clientNumber;
  expect(clientFor("select page")).toBe(clientFor("select count"));
  expect(clientFor("select unrelated")).not.toBe(clientFor("select page"));
});

test("does not share clients across executor context objects", async () => {
  const executor = makeExecutor();
  const first = makeContext(async () => ({ rows: [["first"]], rowCount: 1 }));
  const second = makeContext(async () => ({ rows: [["second"]], rowCount: 1 }));

  await Promise.all([
    run(executor, first.context, "select $1", "a"),
    run(executor, second.context, "select $1", "b"),
  ]);

  expect(first.withPgClient).toHaveBeenCalledTimes(1);
  expect(second.withPgClient).toHaveBeenCalledTimes(1);
});

test("a later execution can join an active queue with the same context", async () => {
  const executor = makeExecutor();
  const firstStarted = Promise.withResolvers<void>();
  const releaseFirst = Promise.withResolvers<void>();
  const { context, withPgClient } = makeContext(async (opts) => {
    if (opts.values[0] === "first") {
      firstStarted.resolve();
      await releaseFirst.promise;
    }
    return { rows: [[opts.values[0]]], rowCount: 1 };
  });

  const first = run(executor, context, "select $1", "first");
  await firstStarted.promise;
  const second = run(executor, context, "select $1", "second");
  releaseFirst.resolve();
  await Promise.all([first, second]);

  expect(withPgClient).toHaveBeenCalledTimes(1);
});

test("starts a fresh lease for queued reads after a query error", async () => {
  const executor = makeExecutor();
  let failBadQuery = true;
  const { context, seen, withPgClient } = makeContext(async (opts) => {
    if (opts.values[0] === "bad" && failBadQuery) {
      failBadQuery = false;
      throw new Error("bad query");
    }
    return { rows: [[opts.values[0]]], rowCount: 1 };
  });

  const results = await Promise.allSettled([
    run(executor, context, "select $1", "first"),
    run(executor, context, "select $1", "bad"),
    run(executor, context, "select $1", "last"),
  ]);

  expect(results.map((r) => r.status)).toEqual([
    "fulfilled",
    "rejected",
    "fulfilled",
  ]);
  expect(withPgClient).toHaveBeenCalledTimes(2);
  expect(seen.map((entry) => entry.clientNumber)).toEqual([1, 1, 2]);

  await expect(run(executor, context, "select $1", "bad")).resolves.toEqual({
    values: [[["bad"]]],
  });
  expect(withPgClient).toHaveBeenCalledTimes(3);
});

test("does not queue uncached execution", async () => {
  const executor = makeExecutor();
  const { context, withPgClient } = makeContext(async (opts) => ({
    rows: [[opts.values[0]]],
    rowCount: 1,
  }));

  await Promise.all([
    run(executor, context, "select $1", "a", undefined, false),
    run(executor, context, "select $1", "b", undefined, false),
  ]);

  expect(withPgClient).toHaveBeenCalledTimes(2);
});

test("keeps a large identical-SQL batch on one client", async () => {
  const executor = makeExecutor();
  const { context, withPgClient } = makeContext(async (opts) => ({
    rows: [[opts.values[0]]],
    rowCount: 1,
  }));

  await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      run(executor, context, "select $1", String(i)),
    ),
  );

  expect(withPgClient).toHaveBeenCalledTimes(1);
});

test("keeps a large clone-affinity batch on one client", async () => {
  const executor = makeExecutor();
  const { context, withPgClient } = makeContext(async (opts) => ({
    rows: [[opts.values[0]]],
    rowCount: 1,
  }));
  const affinity = Symbol("same select");

  await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      run(executor, context, `select ${i}`, String(i), affinity),
    ),
  );

  expect(withPgClient).toHaveBeenCalledTimes(1);
});

test("limits unrelated queues to three and groups matching pending work", async () => {
  const executor = makeExecutor();
  const firstThreeStarted = Promise.withResolvers<void>();
  const lastPendingStarted = Promise.withResolvers<void>();
  const releaseFirst = Promise.withResolvers<void>();
  const releaseOthers = Promise.withResolvers<void>();
  let started = 0;
  const executionOrder: string[] = [];
  const { context, seen, withPgClient } = makeContext(async (opts) => {
    const value = opts.values[0] as string;
    executionOrder.push(value);
    if (value === "f") lastPendingStarted.resolve();
    if (value === "a" || value === "b" || value === "c") {
      if (++started === 3) firstThreeStarted.resolve();
      await (value === "a" ? releaseFirst : releaseOthers).promise;
    }
    return { rows: [[value]], rowCount: 1 };
  });
  const affinity = Symbol("pending clone");

  const resultsPromise = Promise.all([
    run(executor, context, "select a", "a"),
    run(executor, context, "select b", "b"),
    run(executor, context, "select c", "c"),
    run(executor, context, "select d", "d1", affinity),
    run(executor, context, "select e", "e"),
    run(executor, context, "select different d", "d2", affinity),
    run(executor, context, "select d", "d3"),
    run(executor, context, "select f", "f"),
  ]);

  await firstThreeStarted.promise;
  releaseFirst.resolve();
  await lastPendingStarted.promise;
  releaseOthers.resolve();
  const results = await resultsPromise;

  expect(results.map((r) => r.values[0][0][0])).toEqual([
    "a",
    "b",
    "c",
    "d1",
    "e",
    "d2",
    "d3",
    "f",
  ]);
  expect(withPgClient).toHaveBeenCalledTimes(3);
  const dQueries = seen.filter(({ text }) => text.includes(" d"));
  expect(dQueries).toHaveLength(3);
  expect(new Set(dQueries.map(({ clientNumber }) => clientNumber)).size).toBe(
    1,
  );
  expect(
    executionOrder.filter((value) => !["a", "b", "c"].includes(value)),
  ).toEqual(["d1", "d2", "d3", "e", "f"]);
});

test("joins a matching queue even when all three client slots are occupied", async () => {
  const executor = makeExecutor();
  const { context, seen, withPgClient } = makeContext(async (opts) => ({
    rows: [[opts.values[0]]],
    rowCount: 1,
  }));

  await Promise.all([
    run(executor, context, "select a", "a1"),
    run(executor, context, "select b", "b"),
    run(executor, context, "select c", "c"),
    run(executor, context, "select d", "d"),
    run(executor, context, "select a", "a2"),
  ]);

  expect(withPgClient).toHaveBeenCalledTimes(3);
  const aQueries = seen.filter(({ text }) => text === "select a");
  expect(aQueries).toHaveLength(2);
  expect(aQueries[0].clientNumber).toBe(aQueries[1].clientNumber);
});

test("rejects pending work if the last queue cannot acquire a client", async () => {
  const executor = makeExecutor();
  const { context, withPgClient } = makeContext(async () => ({
    rows: [],
    rowCount: 0,
  }));
  withPgClient.mockRejectedValue(new Error("connection unavailable"));

  const results = await Promise.allSettled([
    run(executor, context, "select a", "a"),
    run(executor, context, "select b", "b"),
    run(executor, context, "select c", "c"),
    run(executor, context, "select d", "d"),
  ]);

  expect(results.map((r) => r.status)).toEqual([
    "rejected",
    "rejected",
    "rejected",
    "rejected",
  ]);
  expect(withPgClient).toHaveBeenCalledTimes(3);
});

test("read caches are isolated by event, executor, and context", async () => {
  const executor = makeExecutor();
  let version = 1;
  const { context, seen } = makeContext(async () => ({
    rows: [[version]],
    rowCount: 1,
  }));
  const firstEvent = {};
  const read = (
    target: PgExecutor,
    scope: object | undefined,
    ctx: ReturnType<typeof makeContext>["context"],
  ) => run(target, ctx, "select value", "x", undefined, true, scope);

  expect((await read(executor, firstEvent, context)).values).toEqual([[[1]]]);
  // Change what the (uncached) result will be
  version = 2;
  // This read is satisfied by cache, change is not reflected
  expect((await read(executor, firstEvent, context)).values).toEqual([[[1]]]);
  expect(seen).toHaveLength(1);

  // A new store means a fresh cache, change is reflected
  expect((await read(executor, {}, context)).values).toEqual([[[2]]]);
  // New PgExecutor, new cache
  version = 3;
  expect((await read(makeExecutor(), firstEvent, context)).values).toEqual([
    [[3]],
  ]);
  // New context, new cache
  version = 4;
  expect((await read(executor, firstEvent, { ...context })).values).toEqual([
    [[4]],
  ]);
  // Original values, use old cache, old result again
  expect((await read(executor, firstEvent, context)).values).toEqual([[[1]]]);
});

test.each([false, true])(
  "mutations invalidate read caches (store: %s)",
  async (scoped) => {
    const executor = makeExecutor();
    let version = 1;
    const { context } = makeContext(async () => ({
      rows: [[version]],
      rowCount: 1,
    }));
    const store = scoped ? {} : undefined;
    const read = () =>
      run(executor, context, "select value", "x", undefined, true, store);

    expect((await read()).values).toEqual([[[1]]]);
    await executor.executeMutation({ store, context }, async () => {
      version = 2;
    });
    expect((await read()).values).toEqual([[[2]]]);
  },
);

test.each([false, true])(
  "cross-step batch caches respect mutation invalidation (store: %s)",
  async (scoped) => {
    const executor = makeExecutor();
    let version = 1;
    const { context, seen } = makeContext(async () => ({
      rows: [[version]],
      rowCount: 1,
    }));
    const store = scoped ? {} : undefined;
    // This test step deliberately closes over mutable test state.
    // eslint-disable-next-line graphile-export/export-subclasses
    class ReadAroundMutationStep extends Step<string> {
      async execute(details: ExecutionDetails) {
        const read = () =>
          details.batch(
            pgStepBatchExecutor,
            [[], []],
            pgStepBatchOptions(executor, context, {
              store,
              text: "select value",
              rawSqlValues: [],
              eventEmitter: undefined,
            }),
          );
        const first = await read();
        const cached = await read();
        expect(cached[0]).toBe(first[0]);
        expect(seen).toHaveLength(1);
        await executor.executeMutation({ store, context }, async () => {
          version = 2;
        });
        const updated = await read();
        expect(updated).toEqual([[[2]], [[2]]]);
        expect(seen).toHaveLength(2);
        return ["ok"];
      }
    }
    const schema = makeGrafastSchema({
      typeDefs: "type Query { value: String }",
      objects: {
        // eslint-disable-next-line graphile-export/export-plans
        Query: { plans: { value: () => new ReadAroundMutationStep() } },
      },
    });
    expect(await grafast({ schema, source: "{ value }" })).toEqual({
      data: { value: "ok" },
    });
  },
);

test("a paused cursor fetches one batch and releases its client on cancellation", async () => {
  let fetches = 0;
  const executor = makeExecutor();
  const { context, seen, withPgClient } = makeContext(async (opts) => {
    const rows = opts.text.startsWith("fetch ")
      ? Array.from({ length: 100 }, (_, i) => [100 * fetches + i])
      : [];
    if (rows.length > 0) {
      fetches++;
    }
    return { rows, rowCount: rows.length };
  });
  const { streams } = await executor.executeStream(
    [{ context, queryValues: [] }],
    {
      text: "select generate_series(0, 1000000)",
      cursorScope: {},
      rawSqlValues: [],
      eventEmitter: undefined,
    },
  );
  const source = await streams[0];
  const cursor = source[Symbol.asyncIterator]();
  expect(withPgClient).not.toHaveBeenCalled();
  for (let i = 0; i < 100; i++) {
    expect(await cursor.next()).toEqual({ done: false, value: [i] });
  }
  expect(fetches).toBe(1);
  expect(await cursor.next()).toEqual({ done: false, value: [100] });
  await cursor.return!();
  expect(fetches).toBe(2);
  expect(seen.at(-1)?.text).toMatch(/^close /);
  expect(withPgClient).toHaveBeenCalledTimes(1);
});

test("a cursor lets an earlier queued read finish and shares its client with a later read", async () => {
  const executor = makeExecutor();
  const started = Promise.withResolvers<void>();
  const finish = Promise.withResolvers<void>();
  const { context, seen, withPgClient } = makeContext(async ({ text }) => {
    if (text === "select early") {
      started.resolve();
      await finish.promise;
    }
    return { rows: [[1]], rowCount: 1 };
  });
  const input = [{ context, queryValues: [] }];
  const common = { cursorScope: {}, rawSqlValues: [], eventEmitter: undefined };
  const { streams } = await executor.executeStream(input, {
    ...common,
    text: "select page",
  });
  const cursor = (await streams[0])[Symbol.asyncIterator]();
  const early = executor.executeWithCache(input, {
    ...common,
    text: "select early",
  });
  const prefix = cursor.next();
  const later = executor.executeWithCache(input, {
    ...common,
    text: "select later",
  });
  try {
    await started.promise;
    expect(withPgClient).toHaveBeenCalledTimes(1);
    finish.resolve();
    await Promise.all([early, prefix, later]);
    const clientFor = (text: string) =>
      seen.find((q) => q.text.startsWith(text))!.clientNumber;
    expect(clientFor("select early")).toBe(1);
    expect(clientFor("declare ")).toBe(2);
    expect(clientFor("select later")).toBe(2);
  } finally {
    finish.resolve();
    await cursor.return!();
  }
});

test("a short fetch releases the cursor before its last rows are consumed", async () => {
  const executor = makeExecutor();
  const { context, seen } = makeContext(async ({ text }) => {
    const rows = text.startsWith("fetch ") ? [[1], [2]] : [];
    return { rows, rowCount: rows.length };
  });
  const { streams } = await executor.executeStream(
    [{ context, queryValues: [] }],
    {
      text: "select page",
      cursorScope: {},
      rawSqlValues: [],
      eventEmitter: undefined,
    },
  );
  const cursor = (await streams[0])[Symbol.asyncIterator]();
  expect(await cursor.next()).toEqual({ value: [1], done: false });
  expect(seen.map((q) => q.text.split(" ")[0])).toEqual([
    "set",
    "declare",
    "fetch",
    "close",
  ]);
  expect(await cursor.next()).toEqual({ value: [2], done: false });
  expect((await cursor.next()).done).toBe(true);
});

test("cursor cleanup waits for nested reads already using its transaction", async () => {
  const executor = makeExecutor();
  const cursorScope = {};
  const reading = Promise.withResolvers<void>();
  const release = Promise.withResolvers<void>();
  const closed = Promise.withResolvers<void>();
  const { context, withPgClient } = makeContext(async ({ text }) => {
    if (text === "select nested") {
      reading.resolve();
      await release.promise;
    } else if (text.startsWith("close ")) {
      closed.resolve();
    } else if (text.startsWith("fetch ")) {
      return {
        rows: Array.from({ length: 100 }, (_, i) => [i]),
        rowCount: 100,
      };
    }
    return { rows: [[1]], rowCount: 1 };
  });
  const input = [{ context, queryValues: [] }];
  const common = { cursorScope, rawSqlValues: [], eventEmitter: undefined };
  const { streams } = await executor.executeStream(input, {
    ...common,
    text: "select parent",
  });
  const cursor = (await streams[0])[Symbol.asyncIterator]();
  await cursor.next();
  const nested = executor.executeWithoutCache(input, {
    ...common,
    text: "select nested",
  });
  await reading.promise;
  let returned = false;
  const cleanup = cursor.return!().then(() => {
    returned = true;
  });
  await closed.promise;
  await new Promise<void>((resolve) => setImmediate(resolve));
  expect(returned).toBe(false);
  release.resolve();
  await Promise.all([nested, cleanup]);
  expect(withPgClient).toHaveBeenCalledTimes(1);
});

test("a failed cursor fetch preserves the source error and ends the iterator", async () => {
  const executor = makeExecutor();
  const failure = new Error("failed fetch");
  const { context, seen } = makeContext(async ({ text }) => {
    if (text.startsWith("fetch ")) {
      throw failure;
    }
    return { rows: [], rowCount: 0 };
  });
  const { streams } = await executor.executeStream(
    [{ context, queryValues: [] }],
    {
      cursorScope: {},
      text: "select parent",
      rawSqlValues: [],
      eventEmitter: undefined,
    },
  );
  const cursor = (await streams[0])[Symbol.asyncIterator]();
  await expect(cursor.next()).rejects.toBe(failure);
  expect((await cursor.next()).done).toBe(true);
  expect(seen.map((query) => query.text.split(" ")[0])).toEqual([
    "set",
    "declare",
    "fetch",
  ]);
});
