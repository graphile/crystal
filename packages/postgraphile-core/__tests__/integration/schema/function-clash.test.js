const core = require("./core");

let consoleWarnSpy;
beforeAll(() => {
  consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
});
afterAll(() => {
  if (consoleWarnSpy) {
    consoleWarnSpy.mockRestore();
  }
});

test(
  "raises an error when a function tries to overwrite a CRUD mutation",
  core.test(
    ["a", "b", "c"],
    {},
    (pgClient) => {
      return pgClient.query(
        "create function a.create_post(t text) returns a.post as $$ select null::a.post; $$ language sql volatile;",
      );
    },
    () => {
      expect(consoleWarnSpy).toHaveBeenCalled();
    },
  ),
);
