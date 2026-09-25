import { PgExecutor } from "../dist/executor.js";

function makeExecutor() {
  return new PgExecutor({ name: "test", context: () => null as any });
}

function makeContext(query: (opts: any, clientNumber: number) => Promise<any>) {
  let clientCount = 0;
  const seen: Array<{ clientNumber: number; text: string; name?: string }> = [];
  const withPgClient = jest.fn(async (_settings, callback) => {
    const clientNumber = ++clientCount;
    const client = {
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
) {
  const method = cached ? "executeWithCache" : "executeWithoutCache";
  return executor[method]([{ context, queryValues: [] }], {
    text,
    rawSqlValues: [value],
    name: text,
    identifierIndex: null,
    executionAffinity,
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

test("splits a large identical-SQL batch into parallel client lanes", async () => {
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

  expect(withPgClient).toHaveBeenCalledTimes(2);
});

test("splits a large clone-affinity batch into parallel client lanes", async () => {
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

  expect(withPgClient).toHaveBeenCalledTimes(2);
});
