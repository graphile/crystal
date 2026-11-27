import type { Pool } from "pg";

import { makePgAdaptorWithPgClient } from "../dist/adaptors/pg.js";
import { makeWithSharedPgClient, type SharedPgClient } from "../dist/index.js";

test("idle reservations expire only under pressure from another wrapper on the same pool", async () => {
  jest.useFakeTimers();
  try {
    const options = { pool: {}, maxClients: 1, idleReservationMs: 50 };
    const first = makeWithSharedPgClient(options);
    const second = makeWithSharedPgClient(options);
    const query = jest.fn(async () => ({ rows: [], rowCount: 0 }));
    const checkout = jest.fn(async (_settings, callback) =>
      callback({ query }),
    );
    const otherCheckout = jest.fn(checkout);
    const borrowed = Promise.withResolvers<SharedPgClient>();
    const result = first(
      { pgSettings: null, withPgClient: checkout },
      {},
      async (client) => {
        borrowed.resolve(client);
        await new Promise<void>(() => {});
      },
    );
    const client = await borrowed.promise;
    await jest.advanceTimersByTimeAsync(1000);
    await client.query({ text: "select 1" });
    const rejected = expect(result).rejects.toThrow("reservation reclaimed");
    const next = second(
      { pgSettings: null, withPgClient: otherCheckout },
      {},
      async () => 2,
    );
    expect(otherCheckout).not.toHaveBeenCalled();
    await jest.advanceTimersByTimeAsync(100);
    await rejected;
    expect(await next).toBe(2);
    await expect(client.query({ text: "select 2" })).rejects.toThrow(
      "released",
    );
    expect(otherCheckout).toHaveBeenCalledTimes(1);
  } finally {
    jest.useRealTimers();
  }
});

test("late physical checkout is released after the acquisition deadline", async () => {
  jest.useFakeTimers();
  try {
    const gate = Promise.withResolvers<void>();
    const released = Promise.withResolvers<void>();
    const checkout = jest.fn(async (_settings, callback) => {
      await gate.promise;
      try {
        return await callback({});
      } finally {
        released.resolve();
      }
    });
    const shared = makeWithSharedPgClient({
      pool: {},
      maxClients: 1,
      acquisitionTimeoutMs: 50,
    });
    const callback = jest.fn();
    const result = shared(
      { pgSettings: null, withPgClient: checkout },
      {},
      callback,
    );
    const rejection = expect(result).rejects.toThrow("acquisition timed out");
    await jest.advanceTimersByTimeAsync(50);
    await rejection;
    gate.resolve();
    await released.promise;
    expect(callback).not.toHaveBeenCalled();
  } finally {
    jest.useRealTimers();
  }
});

test("a pending query protects its checkout from reclamation", async () => {
  jest.useFakeTimers();
  try {
    const finishQuery = Promise.withResolvers<void>();
    const started = Promise.withResolvers<void>();
    const withPgClient = jest.fn(async (_settings, callback) =>
      callback({
        async query() {
          started.resolve();
          await finishQuery.promise;
          return { rows: [], rowCount: 0 };
        },
      }),
    );
    const shared = makeWithSharedPgClient({
      pool: {},
      maxClients: 1,
      idleReservationMs: 10,
    });
    const first = shared({ pgSettings: null, withPgClient }, {}, (client) =>
      client.query({ text: "select 1" }),
    );
    await started.promise;
    const second = shared({ pgSettings: null, withPgClient }, {}, () => 42);
    await jest.advanceTimersByTimeAsync(1000);
    expect(withPgClient).toHaveBeenCalledTimes(1);
    finishQuery.resolve();
    await first;
    expect(await second).toBe(42);
  } finally {
    jest.useRealTimers();
  }
});

test("a checkout pulls matching reads past an older unrelated waiter", async () => {
  jest.useFakeTimers();
  const release = Promise.withResolvers<void>();
  const issued: string[] = [];
  const withPgClient = jest.fn(async (_settings, callback) =>
    callback({
      async query({ text }: { text: string }) {
        issued.push(text);
        await release.promise;
        return { rows: [], rowCount: 0 };
      },
    }),
  );
  const shared = makeWithSharedPgClient({ pool: {}, maxClients: 1 });
  const context = { withPgClient, pgSettings: null };
  const affinity = Symbol();
  const run = (signature: string, hint?: symbol) =>
    shared(context, { affinity: hint, signature }, (client) =>
      client.query({ text: signature }),
    );
  const running = run("first", affinity);
  await jest.advanceTimersByTimeAsync(0);
  const unrelated = run("unrelated");
  const matching = run("related");
  // This read links the queued SQL signature to the active checkout.
  const bridge = run("related", affinity);
  try {
    await jest.advanceTimersByTimeAsync(0);
    expect(issued).toEqual(["first", "related", "related"]);
    release.resolve();
    await Promise.all([running, unrelated, matching, bridge]);
    expect(issued).toEqual(["first", "related", "related", "unrelated"]);
  } finally {
    release.resolve();
    await Promise.allSettled([running, unrelated, matching, bridge]);
    jest.useRealTimers();
  }
});

test.each([
  "pool limit",
  "context limit",
  "pool full",
  "driver waiting",
  "checkout failed",
])("an idle second client takes pending work (%s)", async (scenario) => {
  const queries: Array<[number, string]> = [];
  const busy = [Promise.withResolvers<void>(), Promise.withResolvers<void>()];
  const running = [
    Promise.withResolvers<void>(),
    Promise.withResolvers<void>(),
  ];
  const thirdConnection = Promise.withResolvers<void>();
  const signals: AbortSignal[] = [];
  const setup: number[] = [];
  const withPgClient = jest.fn(async (_settings, callback, signal) => {
    const id = signals.push(signal);
    if (id === 3) {
      if (scenario === "checkout failed") {
        throw new Error("connection unavailable");
      }
      await thirdConnection.promise;
    }
    signal.throwIfAborted();
    setup.push(id);
    return callback({
      async query({ text }: { text: string }) {
        queries.push([id, text]);
        if (text !== "C") {
          running[id - 1].resolve();
          await busy[id - 1].promise;
        }
        return { rows: [id], rowCount: 1 };
      },
    });
  });
  let poolAvailable = true;
  const shared = makeWithSharedPgClient({
    pool: {},
    maxClients: scenario === "pool limit" ? 2 : 4,
    canAcquireImmediately: () => poolAvailable,
  });
  const context = { withPgClient, pgSettings: { role: "reader" } };
  const run = (text: string) =>
    shared(
      context,
      {
        signature: text,
        maxClientQueues: scenario === "context limit" ? 2 : 3,
      },
      (client) => client.query({ text }),
    );
  const a = run("A");
  await running[0].promise;
  const b = run("B");
  await running[1].promise;
  poolAvailable = scenario !== "pool full";
  const c = run("C");
  try {
    await new Promise<void>((resolve) => setImmediate(resolve));
    const enteredDriver =
      scenario === "driver waiting" || scenario === "checkout failed";
    expect(withPgClient).toHaveBeenCalledTimes(enteredDriver ? 3 : 2);
    busy[1].resolve();
    expect((await c).rows).toEqual([2]);
    if (scenario === "driver waiting") {
      expect(signals[2].aborted).toBe(true);
    }
    poolAvailable = true;
    thirdConnection.resolve();
    await new Promise<void>((resolve) => setImmediate(resolve));
    expect(withPgClient).toHaveBeenCalledTimes(enteredDriver ? 3 : 2);
    expect(setup).toEqual([1, 2]);
    expect(queries).toEqual([
      [1, "A"],
      [2, "B"],
      [2, "C"],
    ]);
  } finally {
    for (const query of busy) {
      query.resolve();
    }
    thirdConnection.resolve();
    await Promise.allSettled([a, b, c]);
  }
});

test("a cancelled pg pool acquisition releases the connection before applying settings", async () => {
  const raw = { query: jest.fn(), release: jest.fn() };
  const connection = Promise.withResolvers<typeof raw>();
  const pool = { connect: jest.fn(() => connection.promise) };
  const withPgClient = makePgAdaptorWithPgClient(pool as unknown as Pool);
  const callback = jest.fn();
  const controller = new AbortController();
  const result = withPgClient({ role: "reader" }, callback, controller.signal);
  expect(pool.connect).toHaveBeenCalledTimes(1);
  controller.abort();
  connection.resolve(raw);
  await expect(result).rejects.toThrow();
  expect(raw.release).toHaveBeenCalledTimes(1);
  expect(raw.query).not.toHaveBeenCalled();
  expect(callback).not.toHaveBeenCalled();
});
