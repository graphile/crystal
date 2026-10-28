import assert from "node:assert/strict";
import { it } from "node:test";

import { expandRoles } from "../dist/acl.js";
import { augmentIntrospectionData } from "../dist/augmentIntrospection.js";
import { parseIntrospectionResults } from "../dist/index.js";
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
    classes: [{ _id: "1", relnamespace: "2200", relname: "example" }],
    constraints: [{ _id: "2", connamespace: "2200", conname: "example" }],
    procs: [{ _id: "3", pronamespace: "2200", proname: "example" }],
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
