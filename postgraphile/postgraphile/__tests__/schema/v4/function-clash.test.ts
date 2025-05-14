import { stripAnsi } from "grafast";

import * as core from "./core.js";

if (process.env.DEBUG) {
  console.warn(`\
🚨🚨🚨🚨🚨🚨🚨🚨

Setting the DEBUG envvar could make this test fail.

🚨🚨🚨🚨🚨🚨🚨🚨
`);
}

let consoleWarnSpy: ReturnType<typeof jest.spyOn>;
beforeAll(() => {
  consoleWarnSpy = jest.spyOn(global.console, "warn");
  consoleWarnSpy.mockReturnValue(undefined);
});
afterAll(() => {
  if (consoleWarnSpy) {
    consoleWarnSpy.mockRestore();
  }
});

test(
  "raises an error when a function tries to overwrite a CRUD mutation",
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
      ).toBeTruthy();
    },
    true,
    {
      gather: {
        muteWarnings: false,
      },
    },
  ),
);
