import assert from "node:assert/strict";
import { it } from "node:test";

import { introspect } from "../dist/incremental.js";
import { ENTITY_TYPES } from "../dist/introspection.js";
import {
  catalogProjection,
  dependencyWhere,
  descriptionWhere,
} from "../dist/introspectionHelpers.js";
import { makeIntrospectionQuery } from "../dist/query.js";

it("uses shared predicate exports instead of copied function bodies", () => {
  assert.equal(ENTITY_TYPES.depends.where, dependencyWhere);
  assert.equal(ENTITY_TYPES.descriptions.where, descriptionWhere);
});

it("requires an explicit policy for new catalog types", () => {
  assert.throws(
    () => catalogProjection({ future_ref: "regfuture[]" }),
    /Unsupported PostgreSQL catalog type 'regfuture' for attribute 'future_ref'.*ALLOWED_TYPES or TYPE_CASTS/,
  );
});

it("uses docs-generated explicit projections and fallbacks for every entity", () => {
  for (const entity of Object.values(ENTITY_TYPES)) {
    const { select, fallback } = catalogProjection(
      entity.attributes,
      entity.oids,
    );
    assert.ok(Object.keys(entity.attributes).length > 0);
    assert.ok(select.length > 0);
    assert.ok(fallback.length > 0);
    assert.doesNotMatch(select, /\*/);
    const query = makeIntrospectionQuery({
      onlyEntities: Object.keys(ENTITY_TYPES) as (keyof typeof ENTITY_TYPES)[],
    });
    assert.ok(query.includes(select));
    assert.ok(query.includes(fallback));
  }
});

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
    // Simulate a future release dropping a formerly guaranteed catalog column.
    const missingOwnerQuery = makeIntrospectionQuery({
      onlyEntities: ["namespaces"],
    }).replace(
      "from pg_catalog.pg_namespace",
      "from (select oid, nspname, nspacl from pg_catalog.pg_namespace) actual",
    );
    const missingOwner = JSON.parse(
      (await client.query(missingOwnerQuery)).rows[0].introspection,
    );
    assert.ok(missingOwner.namespaces.length > 0);
    for (const namespace of missingOwner.namespaces) {
      assert.equal(namespace.nspowner, null);
      assert.equal(typeof namespace.nspname, "string");
      assert.match(namespace._id, /^\d+$/);
      assert.equal(Object.hasOwn(namespace, "oid"), false);
    }
    const functions = await run(["namespaces", "types", "ranges", "am"]);
    for (const type of functions.types) assert.match(type.typinput, /^[0-9]+$/);
    for (const method of functions.am)
      assert.match(method.amhandler, /^[0-9]+$/);
    for (const range of functions.ranges) {
      assert.match(range.rngcanonical, /^[0-9]+$/);
      assert.match(range.rngsubdiff, /^[0-9]+$/);
    }
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

    await client.query(
      `create aggregate ${schema}.sum_int(integer) (sfunc = int4pl, stype = integer, initcond = '0')`,
    );
    await client.query(
      `comment on aggregate ${schema}.sum_int(integer) is 'Aggregate test comment'`,
    );
    const aggregateResult = await run([
      "namespaces",
      "procs",
      "sys_procs",
      "aggregates",
      "descriptions",
    ]);
    const aggregateProc = aggregateResult.procs.find(
      (proc: { proname: string }) => proc.proname === "sum_int",
    );
    assert.ok(aggregateProc);
    const aggregate = aggregateResult.aggregates.find(
      (agg: { aggfnoid: string }) => agg.aggfnoid === aggregateProc._id,
    );
    assert.ok(aggregate);
    const transitionProc = aggregateResult.sys_procs.find(
      (proc: { proname: string }) => proc.proname === "int4pl",
    );
    assert.equal(aggregate.aggtransfn, transitionProc._id);
    for (const column of [
      "aggfinalfn",
      "aggcombinefn",
      "aggserialfn",
      "aggdeserialfn",
      "aggmtransfn",
      "aggminvtransfn",
      "aggmfinalfn",
    ]) {
      assert.equal(aggregate[column], "0", column);
    }
    // Compare every field to the catalog, including version-dependent columns.
    const catalogAggregate = await client.query(
      "select row_to_json(a) as data from pg_aggregate a where aggfnoid = $1::oid",
      [aggregateProc._id],
    );
    const expected = catalogAggregate.rows[0].data;
    for (const column of Object.keys(expected)) {
      if (column === "aggfnoid" || column.endsWith("fn")) continue;
      assert.deepEqual(aggregate[column], expected[column], column);
    }
    const hasComment = (data: typeof aggregateResult, oid: string) =>
      data.descriptions.some(
        (description: { objoid: string; classoid: string }) =>
          description.objoid === oid &&
          data.catalog_by_oid[description.classoid] === "pg_proc",
      );
    assert.ok(hasComment(aggregateResult, aggregateProc._id));
    assert.ok(hasComment(aggregateResult, transitionProc._id));
    const sysOnly = await run(["sys_procs", "descriptions"]);
    assert.ok(hasComment(sysOnly, transitionProc._id));

    const role = `${schema}_role`;
    await client.query(`create role ${role}`);
    await client.query(`alter role ${role} set statement_timeout = '1234ms'`);
    const databaseName = await client.query(
      "select current_database() as name",
    );
    const databaseIdentifier =
      '"' + databaseName.rows[0].name.replaceAll('"', '""') + '"';
    await client.query(
      `alter role ${role} in database ${databaseIdentifier} set lock_timeout = '5678ms'`,
    );
    const roleSettings = await run(["database", "roles", "db_role_settings"]);
    const roleOid = roleSettings.roles.find(
      (entry: { rolname: string }) => entry.rolname === role,
    )._id;
    const settings = roleSettings.db_role_settings.filter(
      (entry: { setrole: string }) => entry.setrole === roleOid,
    );
    assert.deepEqual(settings, [
      {
        setdatabase: "0",
        setrole: roleOid,
        setconfig: ["statement_timeout=1234ms"],
      },
      {
        setdatabase: roleSettings.database._id,
        setrole: roleOid,
        setconfig: ["lock_timeout=5678ms"],
      },
    ]);

    await client.query(
      `create function ${schema}.event_fn() returns event_trigger language plpgsql as $$ begin end $$`,
    );
    await client.query(
      `create event trigger ${schema}_event on ddl_command_end execute procedure ${schema}.event_fn()`,
    );
    await client.query(
      `comment on event trigger ${schema}_event is 'Event trigger test comment'`,
    );
    // This extension installs both a relation and a function; rollback removes it.
    await client.query(`create extension pg_buffercache with schema ${schema}`);
    const queryCallback = async (text: string, values: any[]) =>
      (await client.query(text, values)).rows[0].introspection;
    const partialEntities = ["namespaces", "classes", "procs"] as const;
    await assert.rejects(
      introspect({ onlyEntities: [...partialEntities] }, queryCallback),
      /Introspection collection 'depends' is required/,
    );
    const included = await introspect(
      {
        onlyEntities: [...partialEntities],
        includeExtensionResources: true,
      },
      queryCallback,
    );
    assert.ok(
      included.classes.some((entry) => entry.relname === "pg_buffercache"),
    );
    assert.ok(
      included.procs.some((entry) => entry.proname === "pg_buffercache_pages"),
    );
    const excluded = await introspect(
      { onlyEntities: [...partialEntities, "depends"] },
      queryCallback,
    );
    assert.ok(
      !excluded.classes.some((entry) => entry.relname === "pg_buffercache"),
    );
    assert.ok(
      !excluded.procs.some((entry) => entry.proname === "pg_buffercache_pages"),
    );
    const events = await run(["event_triggers", "descriptions", "depends"]);
    const event = events.event_triggers.find(
      (entry: { evtname: string }) => entry.evtname === `${schema}_event`,
    );
    assert.equal(event._id, undefined);
    assert.match(event.oid, /^[0-9]+$/);
    assert.ok(
      events.descriptions.some(
        (entry: { objoid: string; classoid: string; description: string }) =>
          entry.objoid === event.oid &&
          events.catalog_by_oid[entry.classoid] === "pg_event_trigger" &&
          entry.description === "Event trigger test comment",
      ),
    );
    // Exercise extension dependencies without attaching the trigger to an extension.
    const dependency = await client.query(
      `with event_triggers as (select $1::oid as oid)
       select objid::text
       from (values ('pg_catalog.pg_event_trigger'::regclass, $1::oid, 0, 'e'))
         as depends(classid, objid, objsubid, deptype)
       where ${dependencyWhere({ onlyEntities: ["event_triggers"] })}`,
      [event.oid],
    );
    assert.deepEqual(dependency.rows, [{ objid: event.oid }]);
  } finally {
    await client.query("rollback");
    await client.end();
  }
});
