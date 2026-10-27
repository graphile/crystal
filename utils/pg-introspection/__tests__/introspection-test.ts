import assert from "node:assert/strict";
import { it } from "node:test";

import { augmentIntrospectionData } from "../src/augmentIntrospection.ts";
import { parseIntrospectionResults } from "../src/index.ts";
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
  assert.deepEqual(namespace.getProcs({ name: "missing" }), []);
  assert.equal(result.getNamespace({ id: namespace._id }), namespace);
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
