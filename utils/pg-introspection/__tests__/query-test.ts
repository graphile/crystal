import assert from "node:assert/strict";
import { it } from "node:test";

import { makeIntrospectionQuery } from "../dist/query.js";

it("generates a metadata-only query for an empty entity selection", () => {
  const query = makeIntrospectionQuery({ onlyEntities: [] });
  assert.match(query, /^select json_build_object\(\n {2}'catalog_by_oid'/);
  assert.doesNotMatch(query, /^with\b/);
});

it("excludes trigger functions unless triggers are selected", () => {
  const withoutTriggers = makeIntrospectionQuery({
    onlyEntities: ["namespaces", "procs"],
  });
  const withTriggers = makeIntrospectionQuery({
    onlyEntities: ["namespaces", "classes", "procs", "triggers"],
  });
  const predicate = "prorettype operator(pg_catalog.<>) 2279";
  assert.ok(withoutTriggers.includes(predicate));
  assert.ok(makeIntrospectionQuery().includes(predicate));
  assert.ok(!withTriggers.includes(predicate));
});

it("rejects selections missing the CTEs they require", () => {
  assert.throws(
    () => makeIntrospectionQuery({ onlyEntities: ["attribute_defaults"] }),
    /requires entity type\(s\) 'attributes'/,
  );
  assert.throws(
    () => makeIntrospectionQuery({ onlyEntities: ["stat_user_tables"] }),
    /requires entity type\(s\) 'classes'/,
  );
});

it("uses a false predicate when no relevant catalog objects are selected", () => {
  for (const entity of ["descriptions", "depends"] as const) {
    const query = makeIntrospectionQuery({ onlyEntities: [entity] });
    assert.match(query, /where \((?:deptype IN \('a', 'e'\) and )?false\)/);
  }
});

it("executes edge-case selections against PostgreSQL", async () => {
  const { Client } = await import("pg");
  const client = new Client({
    database: "graphilecrystaltest",
    user: "graphilecrystaltest",
    password: "test",
    host: process.env.PGHOST ?? "localhost",
  });
  await client.connect();
  try {
    await client.query("begin");
    const schema = `introspection_test_${process.pid}`;
    await client.query(`create schema ${schema}`);
    await client.query(
      `create function ${schema}.trigger_fn() returns trigger language plpgsql as $$ begin return new; end $$`,
    );
    async function run(
      onlyEntities: NonNullable<
        Parameters<typeof makeIntrospectionQuery>[0]
      >["onlyEntities"],
    ) {
      const result = await client.query(
        makeIntrospectionQuery({ onlyEntities }),
      );
      return JSON.parse(result.rows[0].introspection);
    }
    const metadata = await run([]);
    assert.deepEqual(Object.keys(metadata).sort(), [
      "catalog_by_oid",
      "current_user",
      "introspection_version",
      "pg_version",
    ]);
    assert.deepEqual((await run(["descriptions"])).descriptions, []);
    assert.deepEqual((await run(["roles", "depends"])).depends, []);
    const withoutTriggers = await run(["namespaces", "procs"]);
    const withTriggers = await run([
      "namespaces",
      "classes",
      "procs",
      "triggers",
    ]);
    assert.equal(
      withoutTriggers.procs.some(
        (proc: { proname: string }) => proc.proname === "trigger_fn",
      ),
      false,
    );
    assert.equal(
      withTriggers.procs.some(
        (proc: { proname: string }) => proc.proname === "trigger_fn",
      ),
      true,
    );
    await run([
      "namespaces",
      "classes",
      "attributes",
      "attribute_defaults",
      "stat_user_tables",
    ]);
  } finally {
    await client.query("rollback");
    await client.end();
  }
});
