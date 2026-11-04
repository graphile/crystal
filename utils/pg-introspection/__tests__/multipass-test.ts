import assert from "node:assert/strict";
import { it } from "node:test";

import type { IntrospectionRequest } from "../dist/index.js";
import { introspectRaw } from "../src/multipass.ts";

declare global {
  namespace PgIntrospection {
    interface PurposeRegistry {
      terminal: true;
      keys: true;
      all: true;
      unrelated: true;
    }
  }
}

const metadata = {
  catalog_by_oid: {},
  current_user: "test",
  pg_version: "test",
  introspection_version: 1,
};

it("expands terminal objects reached later, deduplicates requests and terminates cycles", async () => {
  let calls = 0;
  const expanded: string[] = [];
  const result = await introspectRaw(
    {
      onlyEntities: ["namespaces", "types"],
      schemas: ["app_public"],
      multipass: {
        policies: [
          {
            name: "testPolicy0",
            purposes: ["initial", "terminal"],
            entity: "types",
            select(row, details): IntrospectionRequest[] {
              if (!details.hasPurpose("initial")) {
                return [];
              }
              expanded.push(row._id);
              if (row._id === "1")
                return [
                  {
                    purposes: ["terminal"],
                    entity: "types",
                    match: { _id: 2 },
                  },
                  {
                    entity: "types",
                    match: { _id: "3" },
                    purposes: ["initial"],
                  },
                  {
                    entity: "classes",
                    match: { _id: "99" },
                    purposes: ["initial"],
                  },
                ];
              if (row._id === "3")
                return [
                  {
                    entity: "types",
                    match: { _id: "2" },
                    purposes: ["initial"],
                  },
                  {
                    entity: "types",
                    match: { _id: "4" },
                    purposes: ["initial"],
                  },
                ];
              if (row._id === "2")
                return [
                  {
                    entity: "types",
                    match: { _id: "1" },
                    purposes: ["initial"],
                  },
                  {
                    entity: "types",
                    match: { _id: "4" },
                    purposes: ["initial"],
                  },
                ];
              return [];
            },
          },
        ],
      },
    },
    async (_text, values) => {
      calls++;
      if (calls === 1) {
        assert.deepEqual(values, [["app_public"]]);
        return JSON.stringify({
          ...metadata,
          namespaces: [],
          types: [{ _id: "1" }],
        });
      }
      if (calls === 2) {
        assert.deepEqual(values, [["2", "3"]]);
        return JSON.stringify({ types: [{ _id: "2" }, { _id: "3" }] });
      }
      assert.deepEqual(values, [["4"]]);
      return JSON.stringify({ types: [] });
    },
  );
  assert.equal(calls, 3);
  assert.deepEqual(expanded, ["1", "3", "2"]);
  assert.deepEqual(
    result.types.map((row) => row._id),
    ["1", "2", "3"],
  );
  assert.equal(result.classes, undefined);
});

it("deduplicates repeated collection requests without fetching them again", async () => {
  let calls = 0;
  const expanded: string[] = [];
  await introspectRaw(
    {
      onlyEntities: ["namespaces", "classes", "attributes"],
      multipass: {
        policies: [
          {
            name: "testPolicy1",
            purposes: ["initial"],
            entity: "classes",
            select(row): IntrospectionRequest[] {
              if (row._id === "1")
                return [
                  {
                    purposes: ["initial"],
                    entity: "attributes",
                    match: { attrelid: "2" },
                  },
                  {
                    entity: "classes",
                    match: { _id: "3" },
                    purposes: ["initial"],
                  },
                ];
              if (row._id === "3")
                return [
                  {
                    entity: "attributes",
                    match: { attrelid: "2" },
                    purposes: ["initial"],
                  },
                ];
              return [];
            },
          },
          {
            name: "testPolicy2",
            purposes: ["initial"],
            entity: "attributes",
            select(row) {
              expanded.push(row.attname);
              return [];
            },
          },
        ],
      },
    },
    async () => {
      calls++;
      if (calls === 1)
        return JSON.stringify({
          ...metadata,
          namespaces: [],
          classes: [{ _id: "1" }],
          attributes: [],
        });
      return JSON.stringify({
        classes: [{ _id: "3" }],
        attributes: [{ attrelid: "2", attnum: 1, attname: "name" }],
      });
    },
  );
  assert.equal(calls, 2);
  assert.deepEqual(expanded, ["name"]);
});

it("preserves the single-pass query when multipass is disabled", async () => {
  let calls = 0;
  await introspectRaw(
    { onlyEntities: ["namespaces"], schemas: ["ignored"] },
    async (text, values) => {
      calls++;
      assert.deepEqual(values, []);
      assert.doesNotMatch(text, /any\(\$1/);
      return JSON.stringify({ ...metadata, namespaces: [] });
    },
  );
  assert.equal(calls, 1);
});

it("passes role and schemas as parameters and applies access checks to entrypoints", async () => {
  await introspectRaw(
    {
      onlyEntities: ["classes"],
      schemas: ["a' schema"],
      multipass: {
        onlyAccessible: { role: "a' role", includeNoInherit: true },
      },
    },
    async (text, values) => {
      assert.deepEqual(values, [["a' schema"], "a' role"]);
      assert.doesNotMatch(text, /a' (?:schema|role)/);
      assert.match(text, /pg_has_role/);
      assert.match(text, /pg_catalog\.quote_ident/);
      assert.match(text, /has_any_column_privilege/);
      return JSON.stringify({ ...metadata, classes: [] });
    },
  );
});

it("preserves attribute filters in follow-up queries and prunes to a fixed point", async () => {
  let calls = 0;
  let prunes = 0;
  const result = await introspectRaw(
    {
      onlyEntities: ["namespaces", "classes", "attributes"],
      multipass: {
        policies: [
          {
            name: "testPolicy3",
            purposes: ["initial"],
            entity: "classes",
            select(row) {
              return [
                {
                  entity: "attributes",
                  match: { attrelid: "2" },
                  purposes: ["initial"],
                },
              ];
            },
          },
        ],
        prune(data) {
          prunes++;
          if (data.attributes?.length) data.attributes.pop();
        },
      },
    },
    async (text) => {
      calls++;
      if (calls === 1)
        return JSON.stringify({
          ...metadata,
          namespaces: [],
          classes: [{ _id: "1" }],
          attributes: [],
        });
      assert.match(text, /attnum > 0/);
      return JSON.stringify({
        attributes: [
          { attrelid: "2", attnum: 1 },
          { attrelid: "2", attnum: 2 },
        ],
      });
    },
  );
  assert.equal(calls, 2);
  assert.equal(prunes, 3);
  assert.deepEqual(result.attributes, []);
});

it("does not refetch a complete collection from the initial query", async () => {
  let calls = 0;
  const expanded: string[] = [];
  const result = await introspectRaw(
    {
      onlyEntities: ["namespaces", "classes", "attributes"],
      multipass: {
        policies: [
          {
            name: "testPolicy4",
            purposes: ["initial"],
            entity: "classes",
            select(row) {
              return [
                {
                  entity: "attributes",
                  match: { attrelid: row._id },
                  purposes: ["initial"],
                },
              ];
            },
          },
          {
            name: "testPolicy5",
            purposes: ["initial"],
            entity: "attributes",
            select(row) {
              expanded.push(row.attname);
              return [];
            },
          },
        ],
      },
    },
    async () => {
      calls++;
      return JSON.stringify({
        ...metadata,
        namespaces: [],
        classes: [{ _id: "1" }],
        attributes: [{ attrelid: "1", attnum: 1, attname: "id" }],
      });
    },
  );
  assert.equal(calls, 1);
  assert.deepEqual(expanded, ["id"]);
  assert.equal(result.attributes.length, 1);
});

it("does not require a schema parameter when selected collections do not use it", async () => {
  await introspectRaw(
    { onlyEntities: ["descriptions"], schemas: ["app_public"], multipass: {} },
    async (text, values) => {
      assert.deepEqual(values, []);
      assert.doesNotMatch(text, /\$1/);
      return JSON.stringify({ ...metadata, descriptions: [] });
    },
  );
});

it("applies policies to singular collections", async () => {
  let calls = 0;
  const result = await introspectRaw(
    {
      onlyEntities: ["database", "roles"],
      multipass: {
        policies: [
          {
            name: "testPolicy6",
            purposes: ["initial"],
            entity: "database",
            select(row) {
              return [
                {
                  entity: "roles",
                  match: { _id: row.datdba },
                  purposes: ["initial"],
                },
              ];
            },
          },
        ],
      },
    },
    async () => {
      calls++;
      if (calls === 1)
        return JSON.stringify({
          ...metadata,
          database: { _id: "1", datdba: "2" },
          roles: [],
        });
      return JSON.stringify({ roles: [{ _id: "2", rolname: "owner" }] });
    },
  );
  assert.equal(calls, 2);
  assert.equal(result.database.datdba, "2");
  assert.equal(result.roles[0].rolname, "owner");
});

it("applies entrypoint filters only to discovery and retains global filters", async () => {
  let calls = 0;
  await introspectRaw(
    {
      onlyEntities: ["namespaces", "types"],
      multipass: {
        entrypointFilters: { types: "typname <> 'dependency'" },
        filters: { types: "typname <> 'excluded'" },
        policies: [
          {
            name: "testPolicy7",
            purposes: ["initial"],
            entity: "types",
            select: (row) =>
              row._id === "1"
                ? [
                    {
                      purposes: ["initial"],
                      entity: "types",
                      match: { _id: "2" },
                    },
                  ]
                : [],
          },
        ],
      },
    },
    async (text) => {
      calls++;
      assert.ok(text.includes("typname <> 'excluded'"));
      if (calls === 1) {
        assert.ok(text.includes("typname <> 'dependency'"));
        return JSON.stringify({
          ...metadata,
          namespaces: [],
          types: [{ _id: "1" }],
        });
      } else {
        assert.ok(!text.includes("typname <> 'dependency'"));
        return JSON.stringify({ types: [{ _id: "2" }] });
      }
    },
  );
  assert.equal(calls, 2);
});

for (const filtered of ["attributes", "descriptions"] as const) {
  it(`refetches filtered ${filtered} without refetching complete collections`, async () => {
    let calls = 0;
    const attribute = { attrelid: "1", attnum: 1, attname: "id" };
    const description = {
      classoid: "1259",
      objoid: "1",
      objsubid: 0,
      description: "Table comment",
    };
    const result = await introspectRaw(
      {
        onlyEntities: [
          "namespaces",
          "classes",
          "attributes",
          "constraints",
          "descriptions",
        ],
        multipass: {
          entrypointFilters: { [filtered]: "false" },
          policies: [
            {
              name: "testPolicy8",
              purposes: ["initial"],
              entity: "classes",
              select: (row): IntrospectionRequest[] => [
                {
                  purposes: ["initial"],
                  entity: "attributes",
                  match: { attrelid: row._id },
                },
                {
                  purposes: ["initial"],
                  entity: "constraints",
                  match: { conrelid: row._id },
                },
                {
                  purposes: ["initial"],
                  entity: "descriptions",
                  match: { classoid: "1259", objoid: row._id },
                },
              ],
            },
          ],
        },
      },
      async (_text, values) => {
        calls++;
        if (calls === 1) {
          return JSON.stringify({
            ...metadata,
            catalog_by_oid: { "1259": "pg_class" },
            namespaces: [],
            classes: [{ _id: "1" }],
            attributes: filtered === "attributes" ? [] : [attribute],
            constraints: [],
            descriptions: filtered === "descriptions" ? [] : [description],
          });
        } else {
          // Only the filtered collection should require a dependency fetch.
          assert.deepEqual(
            values,
            filtered === "attributes" ? [["1"]] : [["1259"], ["1"]],
          );
          return JSON.stringify({
            [filtered]: [filtered === "attributes" ? attribute : description],
          });
        }
      },
    );
    assert.equal(calls, 2);
    assert.deepEqual(result.attributes, [attribute]);
    assert.deepEqual(result.descriptions, [description]);
  });
}

it("propagates new purposes through satisfied group selectors and only reruns affected policies", async () => {
  const visits: string[] = [];
  let calls = 0;
  await introspectRaw(
    {
      onlyEntities: ["namespaces", "classes", "attributes"],
      multipass: {
        policies: [
          {
            name: "classKeys",
            entity: "classes",
            purposes: ["initial", "keys", "all"],
            select(row): IntrospectionRequest[] {
              return [
                {
                  entity: "attributes",
                  match: { attrelid: row._id },
                  purposes: ["keys"],
                },
              ];
            },
          },
          {
            name: "upgrade",
            entity: "attributes",
            purposes: ["keys", "all", "unrelated"],
            select(row, details): IntrospectionRequest[] {
              if (!details.hasPurpose("keys")) {
                return [];
              }
              return [
                {
                  entity: "attributes",
                  match: { attrelid: row.attrelid },
                  purposes: ["all", "unrelated"],
                },
              ];
            },
          },
          {
            name: "consumer",
            entity: "attributes",
            purposes: ["keys", "all"],
            select(row, details) {
              visits.push(
                `${row.attnum}:${details.hasPurpose("keys")}:${details.hasPurpose("all")}`,
              );
              return [];
            },
          },
          {
            name: "unconditional",
            entity: "attributes",
            purposes: [],
            select(row) {
              visits.push(`once:${row.attnum}`);
              return [];
            },
          },
        ],
      },
    },
    async () => {
      calls++;
      return JSON.stringify({
        ...metadata,
        namespaces: [],
        classes: [{ _id: "1" }],
        attributes: [
          { attrelid: "1", attnum: 1 },
          { attrelid: "1", attnum: 2 },
        ],
      });
    },
  );
  assert.equal(calls, 1);
  assert.equal(visits.filter((v) => v.startsWith("once:")).length, 2);
  assert.ok(visits.includes("1:true:true"));
  assert.ok(visits.includes("2:true:true"));
});

for (const invalid of ["read", "emit", "empty", "duplicate"] as const) {
  it(`rejects ${invalid} purpose policy misuse`, async () => {
    const policy = {
      name: "badPolicy",
      entity: "namespaces" as const,
      purposes: ["initial"] as const,
      select(
        _row: any,
        details: import("../dist/index.js").IntrospectionPolicyDetails,
      ): IntrospectionRequest[] {
        if (invalid === "read") {
          details.hasPurpose("keys");
        }
        if (invalid === "emit") {
          return [
            { entity: "namespaces", match: { _id: "2" }, purposes: ["keys"] },
          ];
        }
        if (invalid === "empty") {
          return [
            {
              entity: "namespaces",
              match: { _id: "2" },
              purposes: [] as unknown as IntrospectionRequest["purposes"],
            },
          ];
        }
        return [];
      },
    };
    await assert.rejects(
      introspectRaw(
        {
          onlyEntities: ["namespaces"],
          multipass: {
            policies: invalid === "duplicate" ? [policy, policy] : [policy],
          },
        },
        async () => JSON.stringify({ ...metadata, namespaces: [{ _id: "1" }] }),
      ),
      /badPolicy/,
    );
  });
}

it("types purpose registry augmentation and non-empty request purposes", () => {
  const purpose: PgIntrospection.Purpose = "keys";
  assert.equal(purpose, "keys");
  // @ts-expect-error Unregistered purposes must not be accepted.
  const unknown: PgIntrospection.Purpose = "notRegistered";
  // @ts-expect-error A request must explain why it is needed.
  const empty: IntrospectionRequest["purposes"] = [];
  void unknown;
  void empty;
});

it("merges overlapping requests independently of policy order", async () => {
  const run = async (reverse: boolean) => {
    let calls = 0;
    const policies: import("../dist/index.js").IntrospectionPolicy[] = [
      {
        name: "keysPath",
        entity: "classes",
        purposes: ["keys"],
        select: (row) => [
          {
            entity: "attributes",
            match: { attrelid: row._id, attnum: 1 },
            purposes: ["keys"],
          },
        ],
      },
      {
        name: "allPath",
        entity: "classes",
        purposes: ["all"],
        select: (row) => [
          {
            entity: "attributes",
            match: { attrelid: row._id },
            purposes: ["all"],
          },
        ],
      },
    ];
    const observed: Record<string, boolean[]> = {};
    await introspectRaw(
      {
        onlyEntities: ["namespaces", "classes", "attributes"],
        multipass: {
          entrypointFilters: { attributes: "false" },
          policies: [
            ...(reverse ? policies.reverse() : policies),
            {
              name: "observe",
              entity: "attributes",
              purposes: ["keys", "all"],
              select(row, details) {
                observed[row.attnum] = [
                  details.hasPurpose("keys"),
                  details.hasPurpose("all"),
                ];
                return [];
              },
            },
          ],
        },
      },
      async () => {
        calls++;
        return calls === 1
          ? JSON.stringify({
              ...metadata,
              namespaces: [],
              classes: [{ _id: "1" }],
              attributes: [],
            })
          : JSON.stringify({
              attributes: [
                { attrelid: "1", attnum: 1 },
                { attrelid: "1", attnum: 2 },
              ],
            });
      },
    );
    assert.equal(calls, 2);
    return observed;
  };
  const expected = { "1": [true, true], "2": [false, true] };
  assert.deepEqual(await run(false), expected);
  assert.deepEqual(await run(true), expected);
});
