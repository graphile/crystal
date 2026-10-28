import { PgIntrospectionPlugin } from "../src/plugins/PgIntrospectionPlugin.ts";

test("looks up an index by its identifier", async () => {
  const indexes = [{ indexrelid: "1" }, { indexrelid: "2" }];
  const info = {
    helpers: {
      pgIntrospection: {
        getIntrospection: () => [
          { pgService: { name: "main" }, introspection: { indexes } },
        ],
      },
    },
  };
  const helpers = PgIntrospectionPlugin.gather?.helpers as
    | {
        getIndex: (
          info: never,
          service: string,
          id: string,
        ) => Promise<unknown>;
      }
    | undefined;
  if (!helpers) throw new Error("Introspection helpers are not defined");
  expect(await helpers.getIndex(info as never, "main", "2")).toBe(indexes[1]);
  expect(
    await helpers.getIndex(info as never, "main", "missing"),
  ).toBeUndefined();
});
