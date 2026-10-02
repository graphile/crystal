import { makeWrappedMutationExecute } from "../dist/steps/pgMutationWrapper.js";

const pgClient = {} as any;
const values = [{ at: () => ({ attempt: 1 }) }] as any;
const textCodec = { fromPg: (value: string) => value } as any;

test("runs nested wrappers with the supplied client and returns the raw result", async () => {
  const events: string[] = [];
  const rawResult = {
    rows: [["42", "Ada"]],
    rowCount: 1,
    notices: [],
  };
  const execute = jest.fn(async (client) => {
    expect(client).toBe(pgClient);
    events.push("mutation");
    return rawResult;
  });
  const wrapped = makeWrappedMutationExecute(
    [
      {
        depId: 0,
        selection: [["name", 1, textCodec]],
        callback: async (run, client, dependencies) => {
          expect(client).toBe(pgClient);
          expect(dependencies).toEqual({ attempt: 1 });
          events.push("outer");
          const result = await run(client);
          expect(result.rows).toEqual([{ name: "Ada" }]);
          return result;
        },
      },
      {
        depId: 0,
        selection: [["id", 0, textCodec]],
        callback: async (run, client) => {
          expect(client).toBe(pgClient);
          events.push("inner");
          const result = await run(client);
          expect(result.rows).toEqual([{ id: "42" }]);
          return result;
        },
      },
    ],
    values,
    0,
    {},
    execute,
  );

  await expect(wrapped(pgClient)).resolves.toBe(rawResult);
  expect(events).toEqual(["outer", "inner", "mutation"]);
});

test("allows a wrapper to run the mutation more than once", async () => {
  let calls = 0;
  const rawResults = [
    { rows: [["first"]], rowCount: 1 },
    { rows: [["second"]], rowCount: 1 },
  ];
  const execute = jest.fn(async () => rawResults[calls++]);
  const wrapped = makeWrappedMutationExecute(
    [
      {
        depId: 0,
        selection: [["value", 0, textCodec]],
        callback: async (run, client) => {
          await run(client);
          const result = await run(client);
          expect(result.rows).toEqual([{ value: "second" }]);
          return result;
        },
      },
    ],
    values,
    0,
    {},
    execute,
  );

  await expect(wrapped(pgClient)).resolves.toBe(rawResults[1]);
  expect(execute).toHaveBeenCalledTimes(2);
});

test("decodes selected values and preserves null", async () => {
  const wrapped = makeWrappedMutationExecute(
    [
      {
        depId: 0,
        selection: [
          ["id", 0, { fromPg: (value: string) => Number(value) } as any],
          [
            "about",
            1,
            {
              fromPg: () => {
                throw new Error("null must not be decoded");
              },
            } as any,
          ],
        ],
        callback: async (run, client) => {
          const result = await run(client);
          expect(result.rows).toEqual([{ id: 42, about: null }]);
          return result;
        },
      },
    ],
    values,
    0,
    {},
    async () => ({ rows: [["42", null]], rowCount: 1 }),
  );

  await wrapped(pgClient);
});
