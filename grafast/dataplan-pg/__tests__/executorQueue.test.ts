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
  queued = true,
) {
  return executor.executeWithoutCache([{ context, queryValues: [] }], {
    queue: queued,
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

test("executeWithCache forwards uncached calls and warns only once", async () => {
  const executor = makeExecutor();
  let version = 1;
  const { context, seen } = makeContext(async () => ({
    rows: [[version]],
    rowCount: 1,
  }));
  const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  const read = () =>
    executor.executeWithCache([{ context, queryValues: [] }], {
      text: "select value",
      rawSqlValues: [],
      eventEmitter: undefined,
    });
  try {
    expect((await read()).values).toEqual([[[1]]]);
    version = 2;
    expect((await read()).values).toEqual([[[2]]]);
    expect(seen).toHaveLength(2);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("deprecated");
  } finally {
    warn.mockRestore();
  }
});

test("cross-step batch caches respect scope mutation invalidation", async () => {
  const executor = makeExecutor();
  let version = 1;
  const { context, seen } = makeContext(async () => ({
    rows: [[version]],
    rowCount: 1,
  }));
  // This test step deliberately closes over mutable test state.
  // eslint-disable-next-line graphile-export/export-subclasses
  class ReadAroundMutationStep extends Step<string> {
    async execute(details: ExecutionDetails) {
      const onMutationSuccess = details.batch.invalidate;
      const read = () =>
        details.batch(
          pgStepBatchExecutor,
          [[], []],
          pgStepBatchOptions(executor, context, {
            text: "select value",
            rawSqlValues: [],
            eventEmitter: undefined,
          }),
        );
      const first = await read();
      expect((await read())[0]).toBe(first[0]);
      expect(seen).toHaveLength(1);
      await expect(
        executor.executeMutation({ context, onMutationSuccess }, async () => {
          throw new Error("rolled back");
        }),
      ).rejects.toThrow("rolled back");
      expect((await read())[0]).toBe(first[0]);
      expect(seen).toHaveLength(1);
      await executor.executeMutation(
        { context, onMutationSuccess },
        async () => {
          version = 2;
        },
      );
      expect(await read()).toEqual([[[2]], [[2]]]);
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
});

test("side effects execute separately for identical inputs", async () => {
  const executor = makeExecutor();
  let version = 0;
  const { context, seen } = makeContext(async () => ({
    rows: [[++version]],
    rowCount: 1,
  }));
  const result = await executor.executeWithoutCache(
    [
      { context, queryValues: [] },
      { context, queryValues: [] },
    ],
    {
      text: "select side_effect()",
      rawSqlValues: [],
      useTransaction: true,
      eventEmitter: undefined,
    },
  );
  expect(result.values).toEqual([[[1]], [[2]]]);
  expect(seen).toHaveLength(2);
});

test("compiled SQL with equivalent nested parameters shares batch work across connection affinity hints", async () => {
  const executor = makeExecutor();
  const { context, seen } = makeContext(async (opts) => ({
    rows: [[JSON.stringify(opts.values[0])]],
    rowCount: 1,
  }));
  // This test step deliberately closes over the test executor and context.
  // eslint-disable-next-line graphile-export/export-subclasses
  class ReadStep extends Step<string> {
    private readonly parameter: number;

    constructor(parameter: number) {
      super();
      this.parameter = parameter;
    }

    deduplicate() {
      return [];
    }
    async execute(details: ExecutionDetails) {
      const results = await details.batch(
        pgStepBatchExecutor,
        [[]],
        pgStepBatchOptions(executor, context, {
          text: "select $1",
          rawSqlValues: [[this.parameter, 2]],
          affinity: Symbol(),
          eventEmitter: undefined,
        }),
      );
      return results.map((rows) => (Array.isArray(rows) ? rows[0][0] : rows));
    }
  }
  const schema = makeGrafastSchema({
    typeDefs: "type Query { first: String, second: String, third: String }",
    objects: {
      Query: {
        plans: {
          // eslint-disable-next-line graphile-export/export-plans
          first: () => new ReadStep(1),
          // eslint-disable-next-line graphile-export/export-plans
          second: () => new ReadStep(3),
          // eslint-disable-next-line graphile-export/export-plans
          third: () => new ReadStep(1),
        },
      },
    },
  });
  expect(await grafast({ schema, source: "{ first second third }" })).toEqual({
    data: { first: "[1,2]", second: "[3,2]", third: "[1,2]" },
  });
  expect(seen).toHaveLength(2);
});

test.each([
  { hintedFirst: false, addsKey: false },
  { hintedFirst: true, addsKey: false },
  { hintedFirst: false, addsKey: true },
  { hintedFirst: true, addsKey: true },
])(
  "merges affinity when adding keys (hinted request first: $hintedFirst, adds key: $addsKey)",
  async ({ hintedFirst, addsKey }) => {
    const executor = makeExecutor();
    const { context, seen, withPgClient } = makeContext(async (opts) => {
      const rows =
        opts.text === "select page"
          ? (JSON.parse(opts.values[0]) as string[][]).map(([key], index) => [
              key,
              index,
            ])
          : [[opts.text]];
      return { rows, rowCount: rows.length };
    });
    const affinity = Symbol("connection");
    // This test step closes over the test executor and context.
    // eslint-disable-next-line graphile-export/export-subclasses
    class ReadStep extends Step<string> {
      async execute(details: ExecutionDetails) {
        const read = (keys: readonly string[][], hint: symbol | undefined) =>
          details.batch(
            pgStepBatchExecutor,
            keys,
            pgStepBatchOptions(executor, context, {
              text: "select page",
              rawSqlValues: [],
              identifierIndex: 1,
              affinity: hint,
              eventEmitter: undefined,
            }),
          );
        const first = read([["first"]], hintedFirst ? affinity : undefined);
        const second = read(
          addsKey ? [["first"], ["second"]] : [["first"]],
          hintedFirst ? undefined : affinity,
        );
        const [firstRows, secondRows, count] = await Promise.all([
          first,
          second,
          run(executor, context, "select count", "count", affinity),
        ]);
        expect(firstRows).toEqual([[["first", 0]]]);
        expect(secondRows).toEqual(
          addsKey ? [[["first", 0]], [["second", 1]]] : firstRows,
        );
        expect(count.values).toEqual([[["select count"]]]);
        return ["ok"];
      }
    }
    const schema = makeGrafastSchema({
      typeDefs: "type Query { value: String }",
      objects: {
        // eslint-disable-next-line graphile-export/export-plans
        Query: { plans: { value: () => new ReadStep() } },
      },
    });
    expect(await grafast({ schema, source: "{ value }" })).toEqual({
      data: { value: "ok" },
    });
    expect(seen.map(({ text }) => text).sort()).toEqual([
      "select count",
      "select page",
    ]);
    expect(withPgClient).toHaveBeenCalledTimes(hintedFirst || addsKey ? 1 : 2);
  },
);

test("maps compiled identifier rows back to input order, including empty groups", async () => {
  const executor = makeExecutor();
  const { context } = makeContext(async (opts) => {
    expect(opts.values).toEqual(["fixed", '[["x"],["missing"],["x"]]']);
    return {
      rows: [
        ["last-a", 2],
        ["first", 0],
        ["last-b", 2],
      ],
      rowCount: 3,
    };
  });
  const result = await executor.executeWithoutCache(
    [
      { context, queryValues: ["x"] },
      { context, queryValues: ["missing"] },
      { context, queryValues: ["x"] },
    ],
    {
      text: "select grouped_values",
      rawSqlValues: ["fixed"],
      identifierIndex: 1,
      eventEmitter: undefined,
    },
  );
  expect(result.values).toEqual([
    [["first", 0]],
    [],
    [
      ["last-a", 2],
      ["last-b", 2],
    ],
  ]);
});
