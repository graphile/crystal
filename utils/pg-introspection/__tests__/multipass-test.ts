import assert from "node:assert/strict";
import { it } from "node:test";

import {
  augmentIntrospectionData,
  defineIntrospectionPolicy,
  type IntrospectionPolicy,
  type IntrospectionPolicyDetails,
  type IntrospectionRequest,
  type IntrospectionRow,
  type IntrospectOptions,
  type MultipassOptions,
} from "../dist/index.js";
import { introspectRaw } from "../dist/multipass.js";
import { rawIntrospectionResults } from "./rawIntrospectionResults.mts";

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

for (const multipass of [undefined, false, {}]) {
  it(`caches hidden dependencies while discarding pruned rows (multipass: ${JSON.stringify(multipass)})`, async () => {
    const options: IntrospectOptions<"namespaces" | "classes"> = {
      onlyEntities: ["namespaces", "classes"],
      multipass,
      prune(data, { hide }) {
        hide("classes", (row) => row._id === "hidden");
        data.classes = data.classes?.filter((row) => row._id !== "discarded");
      },
    };
    const raw = await introspectRaw(options, async () =>
      JSON.stringify({
        ...metadata,
        catalog_by_oid: rawIntrospectionResults.catalog_by_oid,
        namespaces: [],
        classes: [
          { _id: "visible", relname: "visible" },
          { _id: "hidden", relname: "hidden" },
          { _id: "discarded", relname: "discarded" },
        ],
      }),
    );
    assert.deepEqual(
      raw.classes.map((row) => row._id),
      ["visible"],
    );
    assert.deepEqual(
      raw.hidden?.classes?.map((row) => row._id),
      ["hidden"],
    );
    const serialized = JSON.stringify(raw);
    assert.doesNotMatch(serialized, /discarded/);
    for (const cached of [structuredClone(raw), JSON.parse(serialized)]) {
      const result = augmentIntrospectionData(options, cached);
      assert.deepEqual(
        result.classes.map((row) => row._id),
        ["visible"],
      );
      assert.equal(result.getClass({ id: "hidden" })?.relname, "hidden");
      assert.equal(result.getClass({ id: "hidden" })?._type, "PgClass");
      assert.equal(result.getClass({ id: "discarded" }), undefined);
      assert.equal("hidden" in result, false);
    }
    assert.equal(JSON.stringify(raw), serialized);
  });

  it(`prunes raw data to a fixed point (multipass: ${JSON.stringify(multipass)})`, async () => {
    let queries = 0;
    let prunes = 0;
    const result = await introspectRaw(
      {
        onlyEntities: ["namespaces", "classes"],
        multipass,
        prune(data) {
          prunes++;
          assert.equal("_lookups" in data, false);
          data.classes?.pop();
        },
      },
      async () => {
        queries++;
        return JSON.stringify({
          ...metadata,
          namespaces: [],
          classes: [{ _id: "1" }, { _id: "2" }],
        });
      },
    );
    assert.equal(queries, 1);
    assert.equal(prunes, 3);
    assert.deepEqual(result.classes, []);
  });

  it(`rejects pruning that adds rows (multipass: ${JSON.stringify(multipass)})`, async () => {
    await assert.rejects(
      introspectRaw(
        {
          onlyEntities: ["namespaces", "classes"],
          multipass,
          prune(data) {
            data.classes!.push(data.classes![0]);
          },
        },
        async () =>
          JSON.stringify({
            ...metadata,
            namespaces: [],
            classes: [{ _id: "1" }],
          }),
      ),
      /Introspection pruning must not add entities/,
    );
  });
}

it("expands terminal objects reached later, deduplicates requests and terminates cycles", async () => {
  let calls = 0;
  const expanded: string[] = [];
  const result = await introspectRaw(
    {
      onlyEntities: ["namespaces", "types"],
      multipass: {
        policies: [
          {
            name: "testPolicy0",
            entity: "types",
            select(row, details) {
              if (!details.hasPurpose("initial")) {
                return;
              }
              expanded.push(row._id);
              if (row._id === "1") {
                details.request("types", { _id: "2" }, ["terminal"]);
                details.request("types", { _id: "3" }, ["initial"]);
                details.request("classes", { _id: "99" }, ["initial"]);
              } else if (row._id === "3") {
                details.request("types", { _id: "2" }, ["initial"]);
                details.request("types", { _id: "4" }, ["initial"]);
              } else if (row._id === "2") {
                details.request("types", { _id: "1" }, ["initial"]);
                details.request("types", { _id: "4" }, ["initial"]);
              }
            },
          },
        ],
      },
    },
    async (_text, values) => {
      calls++;
      if (calls === 1) {
        assert.deepEqual(values, []);
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
            entity: "classes",
            select(row, details) {
              if (row._id === "1") {
                details.request("attributes", { attrelid: "2" }, ["initial"]);
                details.request("classes", { _id: "3" }, ["initial"]);
              } else if (row._id === "3") {
                details.request("attributes", { attrelid: "2" }, ["initial"]);
              }
            },
          },
          {
            name: "testPolicy2",
            entity: "attributes",
            select(row, details) {
              expanded.push(row.attname);
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
    { onlyEntities: ["namespaces"] },
    async (text, values) => {
      calls++;
      assert.deepEqual(values, []);
      assert.doesNotMatch(text, /any\(\$1/);
      return JSON.stringify({ ...metadata, namespaces: [] });
    },
  );
  assert.equal(calls, 1);
});

it("passes role as a parameter and applies access checks to entrypoints", async () => {
  await introspectRaw(
    {
      onlyEntities: ["classes"],
      multipass: {
        onlyAccessible: { role: "a' role", includeNoInherit: true },
      },
    },
    async (text, values) => {
      assert.deepEqual(values, ["a' role"]);
      assert.doesNotMatch(text, /a' (?:schema|role)/);
      assert.doesNotMatch(text, /pg_has_role/);
      assert.match(text, /with recursive/);
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
      prune(data) {
        prunes++;
        if (data.attributes?.length) {
          data.attributes.pop();
        }
      },
      multipass: {
        policies: [
          {
            name: "testPolicy3",
            entity: "classes",
            select(row, details) {
              details.request("attributes", { attrelid: "2" }, ["initial"]);
            },
          },
        ],
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
            entity: "classes",
            select(row, details) {
              details.request("attributes", { attrelid: row._id }, ["initial"]);
            },
          },
          {
            name: "testPolicy5",
            entity: "attributes",
            select(row, details) {
              expanded.push(row.attname);
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

it("does not add parameters for metadata-only selections", async () => {
  await introspectRaw(
    { onlyEntities: ["descriptions"], multipass: {} },
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
            entity: "database",
            select(row, details) {
              details.request("roles", { _id: row.datdba }, ["initial"]);
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
      filters: { types: "typname <> 'excluded'" },
      multipass: {
        entrypointFilters: { types: "typname <> 'dependency'" },
        policies: [
          {
            name: "testPolicy7",
            entity: "types",
            select: (row, details) => {
              if (row._id === "1") {
                details.request("types", { _id: "2" }, ["initial"]);
              }
            },
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
              entity: "classes",
              select: (row, { request }) => {
                request("attributes", { attrelid: row._id }, ["initial"]);
                request("constraints", { conrelid: row._id }, ["initial"]);
                request("descriptions", { classoid: "1259", objoid: row._id }, [
                  "initial",
                ]);
              },
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
            select(row, details) {
              details.request("attributes", { attrelid: row._id }, ["keys"]);
            },
          },
          {
            name: "upgrade",
            entity: "attributes",
            select(row, details) {
              if (!details.hasPurpose("keys")) {
                return;
              }

              details.request("attributes", { attrelid: row.attrelid }, [
                "all",
                "unrelated",
              ]);
            },
          },
          {
            name: "consumer",
            entity: "attributes",
            select(row, details) {
              visits.push(
                `${row.attnum}:${details.hasPurpose("keys")}:${details.hasPurpose("all")}`,
              );
            },
          },
          {
            name: "unconditional",
            entity: "attributes",
            select(row, details) {
              visits.push(`once:${row.attnum}`);
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

for (const [name, match, expectedCalls] of [
  ["complete identity", { attrelid: "1", attnum: 1 }, 1],
  ["identity in reverse column order", { attnum: 1, attrelid: "1" }, 1],
  [
    "identity with a boolean condition",
    { attrelid: "1", attnum: 1, attnotnull: false },
    1,
  ],
  [
    "identity with an unmatched boolean condition",
    { attrelid: "1", attnum: 1, attnotnull: true },
    2,
  ],
  [
    "identity with extra columns",
    { attrelid: "1", attnum: 1, attname: "id" },
    1,
  ],
  ["partial identity", { attrelid: "1" }, 2],
  ["numeric partial identity", { attnum: 1 }, 2],
  ["unmatched identity", { attrelid: "1", attnum: 2 }, 2],
  [
    "identity with unmatched extra columns",
    { attrelid: "1", attnum: 1, attname: "other" },
    2,
  ],
] as const) {
  it(`only skips fetching an existing unique match: ${name}`, async () => {
    let calls = 0;
    await introspectRaw(
      {
        onlyEntities: ["attributes"],
        multipass: {
          policies: [
            defineIntrospectionPolicy({
              name: "requestAttribute",
              entity: "attributes",
              select(_row, details) {
                details.request("attributes", match, ["keys"]);
              },
            }),
          ],
        },
      },
      async () => {
        calls++;
        return JSON.stringify(
          calls === 1
            ? {
                ...metadata,
                attributes: [
                  {
                    attrelid: "1",
                    attnum: 1,
                    attname: "id",
                    attnotnull: false,
                  },
                ],
              }
            : { attributes: [] },
        );
      },
    );
    assert.equal(calls, expectedCalls);
  });
}

for (const invalid of ["empty", "duplicate"] as const) {
  it(`rejects ${invalid} purpose policy misuse`, async () => {
    const policy = {
      name: "badPolicy",
      entity: "namespaces" as const,
      select(_row: any, details: IntrospectionPolicyDetails) {
        if (invalid === "empty") {
          details.request(
            "namespaces",
            { _id: "2" },
            [] as unknown as IntrospectionRequest["purposes"],
          );
        }
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
    const policies: IntrospectionPolicy<"classes">[] = [
      {
        name: "keysPath",
        entity: "classes",
        select: (row, details) => {
          details.request("attributes", { attrelid: row._id, attnum: 1 }, [
            "keys",
          ]);
        },
      },
      {
        name: "allPath",
        entity: "classes",
        select: (row, details) => {
          details.request("attributes", { attrelid: row._id }, ["all"]);
        },
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
              select(row, details) {
                observed[row.attnum] = [
                  details.hasPurpose("keys"),
                  details.hasPurpose("all"),
                ];
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

for (const value of [0, "0"]) {
  for (const [entity, column, skipped] of [
    ["namespaces", "_id", true],
    ["event_triggers", "oid", true],
    ["attributes", "attrelid", true],
    ["descriptions", "objoid", true],
    ["descriptions", "objsubid", false],
    ["constraints", "contypid", false],
    ["db_role_settings", "setrole", false],
  ] as const) {
    it(`${skipped ? "skips" : "retains"} ${entity}.${column} = ${JSON.stringify(value)} requests`, async () => {
      let calls = 0;
      await introspectRaw(
        {
          onlyEntities: ["namespaces", entity],
          multipass: {
            policies: [
              {
                name: "zeroSelector",
                entity: "namespaces",
                select(_row, details) {
                  details.request(entity, { [column]: value }, ["keys"]);
                },
              },
            ],
          },
        },
        async () => {
          calls++;
          return JSON.stringify(
            calls === 1 ? { ...metadata, namespaces: [{ _id: "1" }] } : {},
          );
        },
      );
      assert.equal(calls, skipped ? 1 : 2);
    });
  }
}

it("types request selectors according to the selected entity", () => {
  const check = (details: IntrospectionPolicyDetails) => {
    details.request("attributes", { attrelid: "1", attnum: 2 }, ["keys"]);
    details.request("database", { datname: "example" }, ["keys"]);
    details.request("attributes", { attnotnull: true }, ["keys"]);
    // @ts-expect-error Attribute numbers require numbers.
    details.request("attributes", { attnum: "2" }, ["keys"]);
    // @ts-expect-error OIDs require strings.
    details.request("attributes", { attrelid: 1 }, ["keys"]);
    // @ts-expect-error Null does not express an equality selector.
    details.request("attributes", { attrelid: null }, ["keys"]);
    // @ts-expect-error attrelid belongs to attributes, not namespaces.
    details.request("namespaces", { attrelid: "1" }, ["keys"]);
    // @ts-expect-error Unknown catalogue columns must not be accepted.
    details.request("attributes", { missing: "1" }, ["keys"]);
    // @ts-expect-error OID selectors require strings.
    details.request("attributes", { attrelid: true }, ["keys"]);
  };
  const request: IntrospectionRequest<"attributes"> = {
    entity: "attributes",
    match: { attrelid: "1" },
    purposes: ["keys"],
  };
  const invalid: IntrospectionRequest<"attributes"> = {
    entity: "attributes",
    // @ts-expect-error relname belongs to classes, not attributes.
    match: { relname: "example" },
    purposes: ["keys"],
  };
  const requests: IntrospectionRequest[] = [
    request,
    {
      entity: "namespaces",
      match: { nspname: "public" },
      purposes: ["keys"],
    },
    {
      entity: "namespaces",
      // @ts-expect-error Namespace requests cannot select attribute columns.
      match: { attrelid: "1" },
      purposes: ["keys"],
    },
  ];
  const checkNarrowing = (request: IntrospectionRequest) => {
    if (request.entity === "attributes") {
      const attnum: number | undefined = request.match.attnum;
      // @ts-expect-error relname belongs to class selectors.
      request.match.relname;
      void attnum;
    }
  };
  void check;
  void request;
  void invalid;
  void requests;
  void checkNarrowing;
});

it("types policy rows according to their entity", () => {
  const policy = defineIntrospectionPolicy({
    name: "attributeTypes",
    entity: "attributes",
    select(row, details) {
      const attnum: number = row.attnum;
      details.request("types", { _id: row.atttypid }, ["keys"]);
      // @ts-expect-error Attribute numbers are numbers.
      const wrong: string = row.attnum;
      // @ts-expect-error relname belongs to classes.
      row.relname;
      void attnum;
      void wrong;
    },
  });
  const typed: IntrospectionPolicy<"attributes"> = policy;
  const checkUnionRow = (row: IntrospectionRow<"attributes" | "classes">) => {
    if ("attnum" in row) {
      const attnum: number = row.attnum;
      void attnum;
    } else {
      const relname: string = row.relname;
      void relname;
    }
  };
  void checkUnionRow;
  const policies: NonNullable<MultipassOptions["policies"]> = [
    policy,
    {
      name: "database",
      entity: "database",
      select(row) {
        const name: string = row.datname;
        // @ts-expect-error The database is a singular row, not a collection.
        row[0].datname;
        // @ts-expect-error attnum belongs to attributes.
        row.attnum;
        void name;
      },
    },
  ];
  const explicit = defineIntrospectionPolicy<"classes">({
    name: "classes",
    entity: "classes",
    select(row) {
      const name: string = row.relname;
      void name;
    },
  });
  // @ts-expect-error A class policy cannot be used as an attribute policy.
  const invalid: IntrospectionPolicy<"attributes"> = explicit;
  void typed;
  void policies;
  void invalid;
});
