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
