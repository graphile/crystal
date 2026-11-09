import assert from "node:assert/strict";
import { it } from "node:test";

import type { IntrospectOptions } from "../dist/index.js";
import { ENTITY_TYPES, type EntityType } from "../dist/introspection.js";
import {
  catalogProjection,
  dependencyWhere,
  descriptionWhere,
} from "../dist/introspectionHelpers.js";
import { introspect, introspectRaw } from "../dist/multipass.js";
import { makeIntrospectionQuery } from "../dist/query.js";
import { makeRunQuery, withPgClientTransaction } from "./helpers.ts";

it("uses shared predicate exports instead of copied function bodies", () => {
  assert.equal(ENTITY_TYPES.depends.where, dependencyWhere);
  assert.equal(ENTITY_TYPES.descriptions.where, descriptionWhere);
});

it("requires an explicit policy for new catalog types", () => {
  assert.throws(
    () => catalogProjection({ future_ref: "regfuture[]" }),
    /Unsupported PostgreSQL catalog type 'regfuture' for attribute 'future_ref'.*ALLOWED_TYPES or TYPE_CASTS/,
  );
  for (const type of ["__proto__", "constructor", "toString"]) {
    assert.throws(
      () => catalogProjection({ future_ref: type }),
      /Unsupported PostgreSQL catalog type/,
    );
  }
});

it("uses docs-generated explicit projections and fallbacks for every entity", () => {
  for (const entity of Object.values(ENTITY_TYPES)) {
    const { select, fallback } = catalogProjection(entity.attributes);
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
  await withPgClientTransaction(async (client) => {
    const runQuery = makeRunQuery(client);
    const schema = `introspection_test_${process.pid}`;
    await client.query(`create schema ${schema}`);
    await client.query(
      `create function ${schema}.trigger_fn() returns trigger language plpgsql as $$ begin return new; end $$`,
    );
    await client.query(
      `create function ${schema}.starter_fn() returns int language sql as $$ select 1 $$`,
    );
    await client.query(
      `create function ${schema}.excluded_fn() returns int language sql as $$ select 2 $$`,
    );
    const filters = {
      namespaces: `nspname = '${schema}'`,
      procs: "proname = 'starter_fn'",
    };
    for (const multipass of [undefined, false, {}] as const) {
      const filtered = await introspect({
        runQuery,
        onlyEntities: ["namespaces", "procs"],
        filters,
        multipass,
      });
      assert.deepEqual(
        filtered.namespaces.map((n) => n.nspname),
        [schema],
      );
      assert.deepEqual(
        filtered.procs.map((p) => p.proname),
        ["starter_fn"],
      );
    }
    const otherSchema = `${schema}_other`;
    await client.query(`create schema ${otherSchema}`);
    await client.query(
      `create function ${otherSchema}.remote_trigger_fn() returns trigger language plpgsql as $$ begin return new; end $$`,
    );
    const {
      rows: [{ id: remoteTriggerId }],
    } = await client.query<{ id: string }>(
      `select '${otherSchema}.remote_trigger_fn()'::regprocedure::oid::text as id`,
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
      assert.equal(namespace.oid, namespace._id);
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
    const multipassWithTriggers = await introspectRaw({
      runQuery,
      onlyEntities: ["namespaces", "classes", "procs", "triggers"],
      multipass: {
        entrypointFilters: { namespaces: `nspname = '${schema}'` },
        policies: [
          {
            name: "testPolicy0",
            entity: "procs",
            select(proc, details) {
              if (proc.proname === "trigger_fn") {
                details.request("procs", { _id: remoteTriggerId }, ["initial"]);
              }
            },
          },
        ],
      },
    });
    assert.equal(
      multipassWithTriggers.procs.some((proc) => proc.proname === "trigger_fn"),
      true,
    );
    assert.equal(
      multipassWithTriggers.procs.some(
        (proc) => proc.proname === "remote_trigger_fn",
      ),
      true,
    );
    const multipassWithoutTriggers = await introspectRaw({
      runQuery,
      onlyEntities: ["namespaces", "procs"],
      multipass: {
        entrypointFilters: { namespaces: `nspname = '${schema}'` },
        policies: [
          {
            name: "testPolicy1",
            entity: "procs",
            select(proc, details) {
              if (proc.proname === "starter_fn") {
                details.request("procs", { _id: remoteTriggerId }, ["initial"]);
              }
            },
          },
        ],
      },
    });
    assert.equal(
      multipassWithoutTriggers.procs.some(
        (proc) => proc.proname === "trigger_fn",
      ),
      false,
    );
    assert.equal(
      multipassWithoutTriggers.procs.some(
        (proc) => proc.proname === "remote_trigger_fn",
      ),
      false,
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
    const partialEntities = ["namespaces", "classes", "procs"] as const;
    const included = await introspect({
      runQuery,
      onlyEntities: [...partialEntities],
    });
    assert.ok(
      included.classes.some((entry) => entry.relname === "pg_buffercache"),
    );
    assert.ok(
      included.procs.some((entry) => entry.proname === "pg_buffercache_pages"),
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
  });
});

it("fetches the current database after excluding it from initial discovery", async () => {
  await withPgClientTransaction(async (client) => {
    const database = await client.query<{ name: string }>(
      "select current_database() as name",
    );
    const name = database.rows[0].name;
    let calls = 0;
    const visited: string[] = [];
    const result = await introspectRaw({
      async runQuery(text, values) {
        const response = await client.query<{ introspection: string }>(
          text,
          values,
        );
        const json = response.rows[0].introspection;
        calls++;
        if (calls === 1) {
          assert.equal(JSON.parse(json).database, null);
        }
        return json;
      },
      onlyEntities: ["namespaces", "database"],
      multipass: {
        entrypointFilters: {
          database: "false",
          namespaces: "nspname = 'pg_catalog'",
        },
        policies: [
          {
            name: "requestDatabase",
            entity: "namespaces",
            select(_row, details) {
              details.request("database", { datname: name }, ["initial"]);
            },
          },
          {
            name: "observeDatabase",
            entity: "database",
            select(row) {
              visited.push(row.datname);
            },
          },
        ],
      },
    });
    assert.equal(calls, 2);
    assert.equal(result.database.datname, name);
    assert.equal(Array.isArray(result.database), false);
    assert.deepEqual(visited, [name]);
  });
});

it("rejects inherited property names as collection names", async () => {
  for (const entity of ["__proto__", "constructor", "toString"]) {
    const options = { onlyEntities: [entity as EntityType] };
    assert.throws(
      () => makeIntrospectionQuery(options),
      /Unknown introspection entity/,
    );
    await assert.rejects(
      introspectRaw({
        ...options,
        runQuery() {
          assert.fail("Invalid collections must be rejected before querying");
        },
        multipass: {},
      }),
      /Unknown introspection entity/,
    );
  }
});

it("ignores inherited filters and exposes a null-prototype catalogue dictionary", async () => {
  await withPgClientTransaction(async (client) => {
    const runQuery = makeRunQuery(client);
    const filters: NonNullable<IntrospectOptions["filters"]> = Object.create({
      namespaces: "false",
      attributes: "false",
    });
    const relation = await client.query<{ id: string }>(
      "select 'pg_catalog.pg_class'::regclass::oid::text as id",
    );
    const relationId = relation.rows[0].id;
    for (const multipass of [false, true]) {
      let visits = 0;
      const options: IntrospectOptions<
        "namespaces" | "classes" | "attributes"
      > = {
        runQuery,
        onlyEntities: ["namespaces", "classes", "attributes"],
        filters,
        multipass: multipass
          ? {
              policies: [
                {
                  name: "checkCatalog",
                  entity: "namespaces",
                  select(_row, details) {
                    visits++;
                    details.request("attributes", { attrelid: relationId }, [
                      "initial",
                    ]);
                    assert.equal(
                      Object.getPrototypeOf(details.catalogByOid),
                      null,
                    );
                    assert.equal(details.catalogByOid["__proto__"], undefined);
                    assert.equal(
                      details.catalogByOid["constructor"],
                      undefined,
                    );
                  },
                },
              ],
            }
          : false,
      };
      const result = await introspectRaw(options);
      assert.ok(result.namespaces.some((row) => row.nspname === "pg_catalog"));
      assert.equal(visits, multipass ? result.namespaces.length : 0);
      if (multipass) {
        assert.ok(result.attributes.some((row) => row.attrelid === relationId));
      }
    }
  });
});

it("supports catalogue names that match Object.prototype properties", async () => {
  await withPgClientTransaction(async (client) => {
    const runQuery = makeRunQuery(client);
    await client.query('create schema "__proto__"');
    await client.query(
      'create table "__proto__"."constructor" ("toString" text)',
    );
    await client.query(
      `comment on table "__proto__"."constructor" is '@constructor safe'`,
    );
    const result = await introspect({
      runQuery,
      onlyEntities: ["namespaces", "classes", "attributes", "descriptions"],
      filters: { namespaces: "nspname = '__proto__'" },
      multipass: {},
    });
    const namespace = result.getNamespace({ name: "__proto__" });
    assert.ok(namespace);
    const table = namespace.getClass({ name: "constructor" });
    assert.ok(table);
    assert.equal(table.getAttribute({ name: "toString" })?.getClass(), table);
    assert.equal(table.getTags()["constructor"], "safe");
    assert.equal(Object.getPrototypeOf(table.getTags()), null);
    assert.equal(namespace.getClass({ name: "toString" }), undefined);
  });
});

it("expands accessible memberships only for non-superusers", async () => {
  await withPgClientTransaction(async (client) => {
    await client.query(`
      create schema introspection_private;
      revoke all on schema introspection_private from public;
      create table introspection_private.secret (id integer);
      create role introspection_member noinherit;
      create role introspection_left;
      create role introspection_right;
      create role introspection_parent;
      create role introspection_isolated;
      create role introspection_super superuser;
      grant introspection_left, introspection_right to introspection_member;
      grant introspection_parent to introspection_left, introspection_right;
    `);
    const {
      rows: [database],
    } = await client.query(
      "select datname from pg_catalog.pg_database where datname = current_database()",
    );
    await client.query(
      `alter database "${database.datname.replaceAll('"', '""')}" owner to introspection_parent`,
    );
    for (const role of [
      "introspection_member",
      "introspection_parent",
      "introspection_isolated",
      "introspection_super",
      null,
    ]) {
      for (const includeNoInherit of [false, true]) {
        await introspectRaw({
          async runQuery(text, values) {
            // Inspect the actual entrypoint CTE independently of entity filtering.
            const prefix = text.slice(
              0,
              text.lastIndexOf("select json_build_object("),
            );
            const actual = await client.query(
              `${prefix}select oid from accessible_roles order by oid`,
              values,
            );
            const {
              rows: [selected],
            } = await client.query(
              "select oid, rolsuper from pg_catalog.pg_roles where oid = pg_catalog.quote_ident(coalesce($1::text, current_user))::regrole::oid",
              [role],
            );
            if (selected.rolsuper) {
              assert.deepEqual(actual.rows, [{ oid: selected.oid }]);
              const {
                rows: [privileges],
              } = await client.query(
                `${prefix}select
                  pg_catalog.has_schema_privilege(oid, 'introspection_private', 'USAGE') as schema,
                  pg_catalog.has_table_privilege(oid, 'introspection_private.secret', 'SELECT') as table
                from accessible_roles`,
                values,
              );
              assert.deepEqual(privileges, { schema: true, table: true });
            }
            const expected = await client.query(
              `
            select oid from pg_catalog.pg_roles
            where oid = pg_catalog.quote_ident(coalesce($1::text, current_user))::regrole::oid
            ${includeNoInherit && !selected.rolsuper ? "or pg_catalog.pg_has_role(pg_catalog.quote_ident(coalesce($1::text, current_user))::regrole::oid, oid, 'MEMBER')" : ""}
            order by oid
          `,
              [role],
            );
            assert.deepEqual(actual.rows, expected.rows);
            return (await client.query(text, values)).rows[0].introspection;
          },
          onlyEntities: [],
          multipass: {
            onlyAccessible: { role: role ?? undefined, includeNoInherit },
          },
        });
      }
    }
  });
});
