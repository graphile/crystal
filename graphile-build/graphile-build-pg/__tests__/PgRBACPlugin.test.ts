import type {} from "../dist/plugins/PgIntrospectionPlugin.js";
import { PgRBACPlugin } from "../src/plugins/PgRBACPlugin.ts";

const hook = PgRBACPlugin.gather?.hooks?.pgIntrospection_options;
if (typeof hook !== "function") {
  throw new Error("PgRBACPlugin introspection options hook is not defined");
}

test("enables role filtering for multipass introspection", async () => {
  const options: {
    multipass: { onlyAccessible?: { includeNoInherit?: boolean } };
  } = {
    multipass: {},
  };
  await hook({} as never, { serviceName: "main", options } as never);
  expect(options.multipass.onlyAccessible).toEqual({ includeNoInherit: true });
});

test("leaves single-pass introspection disabled", async () => {
  const options = { multipass: false };
  await hook({} as never, { serviceName: "main", options } as never);
  expect(options.multipass).toBe(false);
});
