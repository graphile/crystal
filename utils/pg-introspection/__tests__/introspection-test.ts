import assert from "node:assert/strict";
import { it } from "node:test";

import { expandRoles } from "../dist/acl.js";
import {
  augmentIntrospection,
  augmentIntrospectionData,
} from "../dist/augmentIntrospection.js";
import type { DefaultEntities, IntrospectOptions } from "../dist/index.js";
import {
  introspectRaw,
  parseIntrospectionResults,
  pruneExtensionResources,
} from "../dist/index.js";
import { rawIntrospectionResults } from "./rawIntrospectionResults.mts";

it("provides navigation helpers for selected entities", () => {
  const source = structuredClone(rawIntrospectionResults);
  const data = {
    catalog_by_oid: source.catalog_by_oid,
    current_user: source.current_user,
    pg_version: source.pg_version,
    introspection_version: source.introspection_version,
    namespaces: source.namespaces,
    roles: source.roles,
  };
  const result = augmentIntrospectionData(
    { onlyEntities: ["namespaces", "roles"] },
    data,
  );
  const namespace = result.getNamespace({ name: "public" });
  assert.ok(namespace);
  assert.equal(namespace._type, "PgNamespace");
  assert.equal(namespace.getOwner()?.rolname, "pg_database_owner");
  assert.equal(result.getCurrentUser()?.rolname, source.current_user);
  assert.throws(() => namespace.getProcs({ name: "missing" }), /procs/);
  assert.equal(result.getNamespace({ id: namespace._id }), namespace);
  assert.throws(() => expandRoles(result, [result.roles[0]]), /auth_members/);
});

it("supports the legacy parser and entity helpers", () => {
  const result = parseIntrospectionResults(
    JSON.stringify(rawIntrospectionResults),
  );
  const namespace = result.getNamespace({ name: "public" });
  assert.ok(namespace);
  assert.equal(namespace.getOwner()?.rolname, "pg_database_owner");
  assert.deepEqual(namespace.getTags(), Object.create(null));
  assert.equal(result.database.getDba(), result.database.getOwner());
});

it("composes extension pruning with additional callbacks", async () => {
  const pruneTemporaryProcedures: NonNullable<IntrospectOptions["prune"]> = (
    data,
  ) => {
    data.procs = data.procs?.filter((proc) => proc.proname !== "temporary");
  };
  const pruneInternalProcedures: NonNullable<IntrospectOptions["prune"]> = (
    _data,
    { hide },
  ) => {
    hide("procs", (proc) => proc.proname === "internal");
  };
  const options: IntrospectOptions = {
    async runQuery() {
      return JSON.stringify({
        ...rawIntrospectionResults,
        procs: [
          { _id: "1", pronamespace: "2200", proname: "extension_helper" },
          { _id: "2", pronamespace: "2200", proname: "temporary" },
          { _id: "3", pronamespace: "2200", proname: "internal" },
          { _id: "4", pronamespace: "2200", proname: "public_function" },
        ],
        depends: [
          { classid: "1255", objid: "1", refclassid: "3079", deptype: "e" },
        ],
      });
    },
    prune(data, details) {
      pruneExtensionResources(data, details);
      pruneTemporaryProcedures(data, details);
      pruneInternalProcedures(data, details);
    },
  };
  const raw = await introspectRaw(options);
  assert.deepEqual(
    raw.procs.map((proc) => proc._id),
    ["4"],
  );
  assert.deepEqual(
    raw.hidden?.procs?.map((proc) => proc._id),
    ["1", "3"],
  );
  const result = augmentIntrospectionData(options, structuredClone(raw));
  assert.deepEqual(
    result.procs.map((proc) => proc._id),
    ["4"],
  );
  assert.equal(result.getProc({ id: "1" })?.proname, "extension_helper");
  assert.equal(result.getProc({ id: "2" }), undefined);
  assert.equal(result.getProc({ id: "3" })?.proname, "internal");
});

for (const parse of [parseIntrospectionResults, augmentIntrospection]) {
  for (const includeExtensionResources of [undefined, false, true]) {
    it(`${parse.name} preserves extension filtering (${includeExtensionResources})`, () => {
      const result = parse(
        JSON.stringify({
          ...rawIntrospectionResults,
          classes: [{ _id: "1", relnamespace: "2200", relname: "example" }],
          procs: [
            { _id: "2", pronamespace: "2200", proname: "example" },
            { _id: "6", pronamespace: "2200", proname: "example" },
          ],
          attributes: [{ attrelid: "1", attnum: 1, attname: "id" }],
          constraints: [{ _id: "3", conrelid: "1", confrelid: "1" }],
          types: [
            { _id: "4", typrelid: "1" },
            { _id: "5", typrelid: "0", typname: "citext" },
          ],
          depends: [
            {
              classid: "1259",
              objid: "1",
              refclassid: "3079",
              deptype: "e",
            },
            {
              classid: "1255",
              objid: "2",
              refclassid: "3079",
              deptype: "e",
            },
            {
              classid: "1247",
              objid: "5",
              refclassid: "3079",
              deptype: "e",
            },
          ],
        }),
        includeExtensionResources,
      );
      const expectedCount = includeExtensionResources ? 1 : 0;
      assert.equal(result.classes.length, expectedCount);
      assert.equal(result.procs.length, expectedCount + 1);
      assert.equal(result.attributes.length, expectedCount);
      assert.equal(result.constraints.length, expectedCount);
      assert.equal(result.types.length, expectedCount + 1);
      assert.ok(result.types.some((type) => type.typname === "citext"));
      const table = result.getClass({ id: "1" });
      assert.ok(table);
      assert.equal(table.relname, "example");
      assert.equal(table.getAttributes()[0].attname, "id");
      assert.equal(result.getProc({ id: "2" })?.proname, "example");
      assert.deepEqual(
        result
          .getNamespace({ name: "public" })!
          .getProcs({ name: "example" })
          ?.map((proc) => proc._id),
        ["2", "6"],
      );
      assert.equal(result.getType({ id: "4" })?.getClass(), table);
    });
  }
}

it("requires the collections used by navigation helpers", () => {
  const source = structuredClone(rawIntrospectionResults);
  const { catalog_by_oid, current_user, pg_version, introspection_version } =
    source;
  const metadata = {
    catalog_by_oid,
    current_user,
    pg_version,
    introspection_version,
  };
  const data = {
    ...metadata,
    namespaces: source.namespaces,
    types: source.types,
  };
  const result = augmentIntrospectionData(
    { onlyEntities: ["namespaces", "types"] },
    data,
  );
  const namespace = result.getNamespace({ name: "public" });
  assert.ok(namespace);
  assert.throws(() => namespace.getOwner(), /roles/);
  assert.throws(() => namespace.getClass({ name: "missing" }), /classes/);
  assert.throws(
    () => namespace.getConstraint({ name: "missing" }),
    /constraints/,
  );
  assert.throws(() => namespace.getDescription(), /descriptions/);
  assert.throws(() => result.getCurrentUser(), /roles/);
  assert.throws(() => result.getProc({ id: "0" }), /procs/);
  const type = result.types[0];
  assert.throws(() => type.getEnumValues(), /enums/);
  assert.throws(() => type.getRange(), /ranges/);

  const withEmptyProcs = augmentIntrospectionData(
    { onlyEntities: ["namespaces", "procs"] },
    {
      ...metadata,
      namespaces: structuredClone(rawIntrospectionResults.namespaces),
      procs: [],
    },
  );
  const namespaceWithEmptyProcs = withEmptyProcs.getNamespace({
    name: "public",
  });
  assert.ok(namespaceWithEmptyProcs);
  assert.deepEqual(namespaceWithEmptyProcs.getProcs({ name: "missing" }), []);
  assert.equal(withEmptyProcs.getProc({ id: "0" }), undefined);
});

it("reports missing collections for entity relationships and permissions", () => {
  const source = structuredClone(rawIntrospectionResults);
  const data = {
    catalog_by_oid: source.catalog_by_oid,
    current_user: source.current_user,
    pg_version: source.pg_version,
    introspection_version: source.introspection_version,
    database: source.database,
    namespaces: source.namespaces,
    classes: [
      {
        relkind: "r",
        relowner: "10",
        reltype: "0",
        _id: "1",
        relnamespace: "2200",
        relname: "example",
      },
    ],
    constraints: [
      {
        conrelid: "1",
        contypid: "0",
        conindid: "0",
        confrelid: "0",
        contype: "c",
        _id: "2",
        connamespace: "2200",
        conname: "example",
      },
    ],
    procs: [
      {
        proowner: "10",
        prorettype: "23",
        proretset: false,
        _id: "3",
        pronamespace: "2200",
        proname: "example",
      },
    ],
    indexes: [{ indexrelid: "4", indrelid: "1", indkey: [] }],
    inherits: [{ inhparent: "1", inhrelid: "1" }],
  };
  const result = augmentIntrospectionData(
    {
      onlyEntities: [
        "database",
        "namespaces",
        "classes",
        "constraints",
        "procs",
        "indexes",
        "inherits",
      ],
    },
    data as never,
  );
  const table = result.classes[0];
  assert.throws(() => result.database.getOwner(), /roles/);
  assert.throws(() => table.getAttributes(), /attributes/);
  assert.throws(() => table.getType(), /types/);
  assert.throws(() => table.getAccessMethod(), /am/);
  assert.throws(() => result.constraints[0].getAttributes(), /attributes/);
  assert.throws(() => result.indexes[0].getKeys(), /attributes/);
  assert.throws(() => result.procs[0].getArguments(), /types/);
  assert.equal(result.inherits[0].getParent(), table);
  const namespace = result.getNamespace({ name: "pg_toast" });
  assert.ok(namespace);
  assert.throws(() => namespace.getACL(), /roles/);
});

it("rejects introspection data that has already been augmented", () => {
  const data = structuredClone(rawIntrospectionResults);
  const result = augmentIntrospectionData({}, data);
  assert.throws(
    () => augmentIntrospectionData<DefaultEntities>({}, result),
    /should not be augmented twice/,
  );
  const namespace = result.getNamespace({ name: "public" });
  assert.ok(namespace);
  assert.equal(namespace.nspname, "public");
});

it("throws when an index refers to a missing required attribute", () => {
  const source = structuredClone(rawIntrospectionResults);
  const result = augmentIntrospectionData(
    {
      onlyEntities: ["classes", "attributes", "indexes"],
    },
    {
      catalog_by_oid: source.catalog_by_oid,
      current_user: source.current_user,
      pg_version: source.pg_version,
      introspection_version: source.introspection_version,
      classes: [
        {
          ...source.classes[0],
          _id: "1",
          relnamespace: "1",
          relname: "example",
        },
      ],
      attributes: [],
      indexes: [
        { ...source.indexes[0], indexrelid: "2", indrelid: "1", indkey: [1] },
      ],
    },
  );
  assert.throws(() => result.indexes[0].getKeys(), /Could not find attribute/);
});
