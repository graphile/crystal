import { stripAnsi } from "grafast";
import { makePgSmartTagsPlugin } from "graphile-utils";
import type { PgClass } from "graphile-build-pg/pg-introspection";

import * as core from "./core.js";

let consoleWarnSpy: ReturnType<typeof jest.spyOn>;
beforeAll(() => {
  consoleWarnSpy = jest.spyOn(global.console, "warn");
});
afterAll(() => {
  if (consoleWarnSpy) {
    consoleWarnSpy.mockRestore();
  }
});

test(
  "doesn't raise an error when a function tries to overwrite a CRUD mutation if the CRUD mutation is omitted",
  core.test(
    __filename,
    ["a", "b", "c"],
    {},
    (pgClient) => {
      return pgClient.query(
        "create function a.create_post(t text) returns a.post as $$ select null::a.post; $$ language sql volatile;",
      );
    },
    () => {
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(
        consoleWarnSpy.mock.calls.some(
          (args: [string]) =>
            /Recoverable/.test(args[0]) &&
            /same type 'CreatePostInput'/.test(stripAnsi(args[0])),
        ),
      ).toBeFalsy();
    },
    true,
    {
      plugins: [
        makePgSmartTagsPlugin({
          kind: "class",
          match(entity) {
            const klass = entity as PgClass;
            return (
              klass.relname === "post" && klass.getNamespace()!.nspname === "a"
            );
          },
          tags: {
            omit: "create",
          },
        }),
      ],
    },
  ),
);
