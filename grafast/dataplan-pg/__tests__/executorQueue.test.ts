import { EXPORTABLE } from "../dist/datasource.js";
import { PgExecutor } from "../dist/executor.js";
import { batchInMeta } from "../../grafast/dist/batch.js";

function executeOwnerLookupBatch(
  [executor, context]: readonly [PgExecutor, any],
  keysets: readonly (readonly unknown[])[],
) {
  return executor
    .executeWithCache(
      keysets.map((queryValues) => ({ context, queryValues })),
      {
        text: "select owner by identifiers",
        rawSqlValues: [],
        identifierIndex: 0,
        eventEmitter: undefined,
      },
    )
    .then(({ values }) => values);
}

function makeExecutor() {
  return EXPORTABLE(
    (PgExecutor) =>
      new PgExecutor({ name: "test", context: () => null as any }),
    [PgExecutor],
  );
}

function makeContext(query: (opts: any, clientNumber: number) => Promise<any>) {
  let clientCount = 0;
  const seen: Array<{
    clientNumber: number;
    text: string;
    name?: string;
    values: readonly unknown[];
  }> = [];
  const withPgClient = jest.fn(async (_settings, callback) => {
    const clientNumber = ++clientCount;
    const client = {
      query: async (opts: any) => {
        seen.push({
          clientNumber,
          text: opts.text,
          name: opts.name,
          values: opts.values,
        });
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
) {
  const method = cached ? "executeWithCache" : "executeWithoutCache";
  return executor[method]([{ context, queryValues: [] }], {
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

test.each([
  ["AWS", "GCP"],
  ["GCP", "AWS"],
])(
  "batches equivalent branch lookups when %s completes first",
  async (...readyOrder) => {
    const executor = makeExecutor();
    const { context, seen } = makeContext(async (opts) => {
      const ids = JSON.parse(opts.values[0]);
      return {
        rows: ids.map((queryValues: number[], index: number) => [
          index,
          queryValues[0],
        ]),
        rowCount: ids.length,
      };
    });
    const meta = {};
    const branches = {
      AWS: [1, 2, 4],
      GCP: [1, 2, 3],
    };
    const gates = {
      AWS: Promise.withResolvers<void>(),
      GCP: Promise.withResolvers<void>(),
    };
    const results = Object.fromEntries(
      Object.entries(branches).map(([name, ids]) => [
        name,
        gates[name as keyof typeof gates].promise.then(() =>
          batchInMeta(
            meta,
            executeOwnerLookupBatch,
            [executor, context] as const,
            ids.map((id) => [id]),
            "tuple",
          ),
        ),
      ]),
    ) as Record<
      keyof typeof branches,
      Promise<ReadonlyArray<ReadonlyArray<any>>>
    >;

    for (const name of readyOrder) gates[name as keyof typeof gates].resolve();
    const [aws, gcp] = await Promise.all([results.AWS, results.GCP]);

    expect(seen).toHaveLength(1);
    expect(JSON.parse(seen[0].values[0] as string)).toEqual(
      readyOrder[0] === "AWS" ? [[1], [2], [4], [3]] : [[1], [2], [3], [4]],
    );
    expect(aws.map((rows) => rows[0][1])).toEqual(branches.AWS);
    expect(gcp.map((rows) => rows[0][1])).toEqual(branches.GCP);
  },
);

test("shares a batched query failure with every branch", async () => {
  const executor = makeExecutor();
  const { context } = makeContext(async () => {
    throw new Error("owner lookup failed");
  });
  const meta = {};
  const runBranch = (id: number) =>
    batchInMeta(
      meta,
      executeOwnerLookupBatch,
      [executor, context] as const,
      [[id]],
      "tuple",
    );

  const results = await Promise.allSettled([runBranch(1), runBranch(2)]);

  expect(results.map((result) => result.status)).toEqual([
    "rejected",
    "rejected",
  ]);
  expect(
    results.map((result) => (result as PromiseRejectedResult).reason.message),
  ).toEqual(["owner lookup failed", "owner lookup failed"]);
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
