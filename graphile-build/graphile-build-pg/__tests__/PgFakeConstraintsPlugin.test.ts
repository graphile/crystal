import type {} from "../dist/plugins/PgIntrospectionPlugin.js";
import { PgFakeConstraintsPlugin } from "../src/plugins/PgFakeConstraintsPlugin.ts";

const hook =
  PgFakeConstraintsPlugin.gather?.hooks?.pgIntrospection_introspection;
if (typeof hook !== "function") {
  throw new Error("PgFakeConstraintsPlugin introspection hook is not defined");
}

function makeContext(
  options: {
    schemas?: string[];
    multipass?: boolean;
    target?: boolean;
    tag?: string;
  } = {},
) {
  const localAttribute = { attname: "parent_id", attnum: 1 };
  const foreignAttribute = { attname: "id", attnum: 1 };
  const localConstraints: any[] = [];
  const foreignConstraints: any[] = [];
  const target = {
    _id: "2",
    getNamespace: () => ({ nspname: "private" }),
    getTagsAndDescription: () => ({ tags: {} }),
    getAttributes: () => [foreignAttribute],
    getConstraints: () => [
      { contype: "p", getAttributes: () => [foreignAttribute] },
    ],
    getForeignConstraints: () => foreignConstraints,
  };
  const source = {
    _id: "1",
    relnamespace: "10",
    relname: "child",
    getNamespace: () => ({ nspname: "app" }),
    getTagsAndDescription: () => ({
      tags: {
        foreignKey: options.tag ?? "(parent_id) references private.parent(id)",
      },
    }),
    getAttributes: () => [localAttribute],
    getConstraints: () => localConstraints,
    getForeignConstraints: () => [],
  };
  const introspection = {
    classes: options.target ? [source, target] : [source],
    attributes: [],
    constraints: [] as any[],
  };
  const info = {
    resolvedPreset: {
      pgServices: [{ name: "main", schemas: options.schemas ?? ["app"] }],
      gather:
        options.multipass === undefined
          ? {}
          : { pgIntrospection: { multipass: options.multipass } },
    },
    helpers: {
      pgIntrospection: {
        getClassByName: jest.fn(async () =>
          options.target ? target : undefined,
        ),
      },
    },
    lib: { sql: { escapeSqlIdentifier: (s: string) => s } },
    state: { fakeId: 0 },
    process: jest.fn(),
  };
  return { info, introspection };
}

afterEach(() => jest.restoreAllMocks());

test("ignores a missing foreign table outside the configured schemas", async () => {
  const { info, introspection } = makeContext();
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  await hook(info as never, { serviceName: "main", introspection } as never);
  expect(log).not.toHaveBeenCalled();
  expect(introspection.constraints).toHaveLength(0);
});

test("logs a missing foreign table in a configured schema", async () => {
  const { info, introspection } = makeContext({ schemas: ["app", "private"] });
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  await hook(info as never, { serviceName: "main", introspection } as never);
  expect(log).toHaveBeenCalledWith(
    expect.stringContaining(
      "private.parent' was not found in the introspection results",
    ),
  );
  expect(introspection.constraints).toHaveLength(0);
});

test("retains the missing-table error in single-pass mode", async () => {
  const { info, introspection } = makeContext({ multipass: false });
  await expect(
    hook(info as never, { serviceName: "main", introspection } as never),
  ).rejects.toThrow(/referenced non-existent table\/view 'private.parent'/);
});

test("creates the constraint when the external target was discovered", async () => {
  const { info, introspection } = makeContext({ target: true });
  await hook(info as never, { serviceName: "main", introspection } as never);
  expect(introspection.constraints).toHaveLength(1);
  expect(introspection.constraints[0].confrelid).toBe("2");
});

test("still rejects invalid smart-tag syntax", async () => {
  const { info, introspection } = makeContext({ tag: "invalid" });
  await expect(
    hook(info as never, { serviceName: "main", introspection } as never),
  ).rejects.toThrow(/Invalid @foreignKey syntax/);
});
