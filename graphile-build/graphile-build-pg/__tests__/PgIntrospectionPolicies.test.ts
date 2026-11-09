import {
  augmentIntrospectionData,
  introspect,
  type IntrospectOptions,
  introspectRaw,
  type MultipassOptions,
} from "pg-introspection";

import type {} from "../dist/index.js";
import {
  postgraphileMultipass,
  postgraphilePrune,
} from "../dist/plugins/PgIntrospectionPolicies.js";
import { makeRunQuery, withPgClientTransaction } from "./helpers.ts";

test.each([false, true])(
  "preserves extension row type references (multipass: %s)",
  async (multipass) => {
    return withPgClientTransaction(async (client) => {
      const runQuery = makeRunQuery(client);
      await client.query({ text: "create schema extension_row_type_test" });
      await client.query({
        text: "create extension pg_buffercache with schema extension_row_type_test",
      });
      await client.query({
        text: "create table extension_row_type_test.user_table (id integer)",
      });
      await client.query({
        text: `
        create function extension_row_type_test.buffer_id(
          entry extension_row_type_test.pg_buffercache
        ) returns integer language sql stable as $$ select entry.bufferid $$
      `,
      });
      const options: IntrospectOptions = {
        runQuery,
        prune: postgraphilePrune,
        multipass: multipass
          ? postgraphileMultipass({ schemas: ["extension_row_type_test"] })
          : false,
      };
      const raw = await introspectRaw(options);
      expect(raw.classes.some((row) => row.relname === "pg_buffercache")).toBe(
        false,
      );
      expect(
        raw.hidden?.classes?.some((row) => row.relname === "pg_buffercache"),
      ).toBe(true);
      expect(
        Boolean(
          raw.hidden?.procs?.some(
            (row) => row.proname === "pg_buffercache_pages",
          ),
        ),
      ).toBe(!multipass);
      const result = augmentIntrospectionData(
        options,
        JSON.parse(JSON.stringify(raw)),
      );
      const table = result.classes.find((row) => row.relname === "user_table");
      expect(table).toBeDefined();
      expect(table!.getAttributes().map((row) => row.attname)).toEqual(["id"]);
      const proc = result.procs.find((p) => p.proname === "buffer_id");
      expect(proc).toBeDefined();
      const args = proc!.getArguments();
      expect(args[0].type.typname).toBe("pg_buffercache");
      expect(
        result.getType({
          schemaName: "extension_row_type_test",
          name: "pg_buffercache",
        }),
      ).toBe(args[0].type);
      expect(result.getType({ arrayId: args[0].type.typarray! })).toBe(
        args[0].type,
      );
      const row = args[0].type.getClass()!;
      expect(row.relname).toBe("pg_buffercache");
      expect(row.getAttributes().map((a) => a.attname)).toContain("bufferid");
      expect(result.classes.some((c) => c.relname === "pg_buffercache")).toBe(
        false,
      );
      expect(result.types.some((t) => t.typname === "pg_buffercache")).toBe(
        false,
      );
      expect(
        result.procs.some((p) => p.proname === "pg_buffercache_pages"),
      ).toBe(false);
    });
  },
);

test.each([false, true])(
  "accumulates FK target requirements regardless of arrival order (%s)",
  async (upgrade) => {
    return withPgClientTransaction(async (client) => {
      const runQuery = makeRunQuery(client);
      await client.query({
        text: `
      create schema purpose_public;
      create schema purpose_private;
      create table purpose_private.target (id integer primary key, parent_id integer references purpose_private.target(id));
      create table purpose_public.source (id integer primary key, target_id integer references purpose_private.target(id));
    `,
      });
      const multipass = postgraphileMultipass({
        schemas: upgrade
          ? ["purpose_public"]
          : ["purpose_private", "purpose_public"],
      });
      multipass.policies = [
        ...multipass.policies!,
        {
          name: "testResourcePath",
          entity: "classes",
          select(row, details) {
            if (
              row.relname !== "target" ||
              (upgrade && !details.hasPurpose("registryRelation"))
            ) {
              return;
            }

            details.request("classes", { _id: row._id }, ["registryCodec"]);
          },
        },
      ];
      const result = await introspect({
        runQuery,
        prune: postgraphilePrune,
        multipass,
      });
      const target = result.classes.find((row) => row.relname === "target")!;
      expect(
        target
          .getConstraints()
          .map((row) => row.contype)
          .filter((type) => type !== "n")
          .sort(),
      ).toEqual(["f", "p"]);
    });
  },
);

test("does not traverse outgoing FKs of a target-only table", async () => {
  return withPgClientTransaction(async (client) => {
    const runQuery = makeRunQuery(client);
    await client.query(
      `
      create schema purpose_public;
      create schema purpose_private;
      create table purpose_private.unneeded (id integer primary key);
      create table purpose_private.target (id integer primary key, parent_id integer references purpose_private.unneeded(id));
      create table purpose_public.source (id integer primary key, target_id integer references purpose_private.target(id));
    `,
    );
    const result = await introspect({
      runQuery,
      multipass: postgraphileMultipass({ schemas: ["purpose_public"] }),
      prune: postgraphilePrune,
    });
    expect(result.classes.some((row) => row.relname === "unneeded")).toBe(
      false,
    );
    const target = result.classes.find((row) => row.relname === "target")!;
    expect(
      target
        .getConstraints()
        .map((row) => row.contype)
        .filter((type) => type !== "n"),
    ).toEqual(["p"]);
  });
});

test("only expands inaccessible row types when required by a resource", async () => {
  return withPgClientTransaction(async (client) => {
    const runQuery = makeRunQuery(client);
    await client.query(
      `
      create role purpose_reader;
      create schema purpose_access;
      grant usage on schema purpose_access to purpose_reader;
      create table purpose_access.hidden (id integer primary key);
      create table purpose_access.required (id integer primary key);
      create table purpose_access.visible (id integer primary key);
      grant select on purpose_access.visible to purpose_reader;
      create function purpose_access.required_row()
        returns purpose_access.required language sql stable
        as $$ select null::purpose_access.required $$;
      grant execute on function purpose_access.required_row() to purpose_reader;
    `,
    );
    const multipass = postgraphileMultipass({ schemas: ["purpose_access"] });
    multipass.onlyAccessible = { role: "purpose_reader" };
    const result = await introspect({
      runQuery,
      multipass,
      prune: postgraphilePrune,
    });
    expect(result.types.some((row) => row.typname === "hidden")).toBe(true);
    expect(result.classes.some((row) => row.relname === "hidden")).toBe(false);
    expect(result.classes.some((row) => row.relname === "visible")).toBe(true);
    const proc = result.procs.find((row) => row.proname === "required_row")!;
    expect(
      proc
        .getReturnType()!
        .getClass()!
        .getAttributes()
        .map((a) => a.attname),
    ).toEqual(["id"]);
  });
});

test.each(["sys_procs", "event_triggers"] as const)(
  "preserves descriptions and dependencies selected with %s",
  async (entity) => {
    return withPgClientTransaction(async (client) => {
      const runQuery = makeRunQuery(client);
      await client.query(
        `
        create schema purpose_metadata;
        create function purpose_metadata.on_ddl() returns event_trigger
          language plpgsql as $$ begin end $$;
        create event trigger purpose_metadata_trigger on ddl_command_end
          execute function purpose_metadata.on_ddl();
        comment on event trigger purpose_metadata_trigger is 'Event description';
      `,
      );
      const run = (multipass: false | MultipassOptions) =>
        introspect({
          runQuery,
          onlyEntities: [entity, "descriptions", "depends"],
          multipass,
        });
      const single = await run(false);
      const multi = await run({});
      expect(single.descriptions.length).toBeGreaterThan(0);
      expect(multi.descriptions).toEqual(single.descriptions);
      expect(multi.depends).toEqual(single.depends);
    });
  },
);

test.each([false, true])(
  "preserves range subtype purposes (required by codec: %s)",
  async (codec) => {
    return withPgClientTransaction(async (client) => {
      const runQuery = makeRunQuery(client);
      await client.query({
        text: `
        create schema purpose_range;
        create type purpose_range.my_range as range (subtype = integer);
      `,
      });
      if (codec) {
        await client.query({
          text: `
          create function purpose_range.range_value()
            returns purpose_range.my_range language sql stable
            as $$ select null::purpose_range.my_range $$;
        `,
        });
      }
      const multipass = postgraphileMultipass({ schemas: ["purpose_range"] });
      // PostgreSQL also creates range constructor functions; exclude those
      // so only the explicit function supplies a codec requirement.
      multipass.entrypointFilters = {
        ...multipass.entrypointFilters,
        procs: "proname = 'range_value'",
      };
      let subtypeCodec = false;
      let subtypeNavigation = false;
      multipass.policies = [
        ...multipass.policies!,
        {
          name: "observeRangeSubtype",
          entity: "types",
          select(row, details) {
            if (row.typname === "int4") {
              subtypeCodec ||= details.hasPurpose("registryCodec");
              subtypeNavigation ||= details.hasPurpose(
                "completeTypeNavigation",
              );
            }
          },
        },
      ];
      await introspectRaw({ runQuery, multipass });
      expect(subtypeCodec).toBe(codec);
      if (!codec) {
        expect(subtypeNavigation).toBe(true);
      }
    });
  },
);

test.each([false, true])(
  "discovers standalone composite types usable by the role (multipass: %s)",
  async (multipass) => {
    return withPgClientTransaction(async (client) => {
      const runQuery = makeRunQuery(client);
      await client.query(
        `
        create role purpose_composite_reader;
        create schema purpose_composite;
        grant usage on schema purpose_composite to purpose_composite_reader;
        create type purpose_composite.visible_pair as (a integer, b text);
        create type purpose_composite.hidden_pair as (c integer);
        revoke usage on type purpose_composite.hidden_pair from public;
      `,
      );
      const options: IntrospectOptions = {
        runQuery,
        prune: postgraphilePrune,
        multipass: false,
      };
      if (multipass) {
        options.multipass = postgraphileMultipass({
          schemas: ["purpose_composite"],
        });
        options.multipass.onlyAccessible = { role: "purpose_composite_reader" };
      }
      const result = await introspect(options);
      const visible = result.classes.find(
        (row) => row.relname === "visible_pair",
      );
      expect(visible?.relkind).toBe("c");
      expect(visible!.getAttributes().map((row) => row.attname)).toEqual([
        "a",
        "b",
      ]);
      expect(result.classes.some((row) => row.relname === "hidden_pair")).toBe(
        !multipass,
      );
    });
  },
);

test.each([false, true])(
  "discovers @enum @foreignKey targets outside the exposed schemas (multipass: %s)",
  async (multipass) => {
    return withPgClientTransaction(async (client) => {
      const runQuery = makeRunQuery(client);
      await client.query(
        `
        create schema smart_fk_exposed;
        create schema "Smart FK Hidden";
        create table "Smart FK Hidden"."Kind" (type text primary key, parent text references "Smart FK Hidden"."Kind");
        comment on table "Smart FK Hidden"."Kind" is E'@enum';
        create table "Smart FK Hidden".unrelated (id integer primary key);
        create table "Smart FK Hidden".plain (id integer primary key, unrelated_id integer references "Smart FK Hidden".unrelated);
        create table smart_fk_exposed.local_target (id integer primary key);
        create table smart_fk_exposed.thing (id integer primary key, kind text, plain_id integer, local_id integer);
        comment on table smart_fk_exposed.thing is E'@foreignKey (kind) references "Smart FK Hidden"."Kind" (type)\\n@foreignKey (plain_id) references "Smart FK Hidden".plain\\n@foreignKey (local_id) references local_target';
      `,
      );
      const result = await introspect({
        runQuery,
        prune: postgraphilePrune,
        multipass: multipass
          ? postgraphileMultipass({ schemas: ["smart_fk_exposed"] })
          : false,
      });
      const kind = result.classes.find((row) => row.relname === "Kind");
      expect(kind?.getNamespace()?.nspname).toBe("Smart FK Hidden");
      expect(kind!.getAttributes().map((row) => row.attname)).toEqual([
        "type",
        "parent",
      ]);
      expect(
        kind!
          .getConstraints()
          .map((row) => row.contype)
          .filter((type) => type !== "n")
          .sort(),
      ).toEqual(multipass ? ["p"] : ["f", "p"]);
      expect(kind!.getTagsAndDescription().tags.enum).toBe(true);
      // Non-enum targets outside the exposed schemas are only checked for `@enum`.
      const plain = result.classes.find((row) => row.relname === "plain");
      expect(plain).toBeDefined();
      expect(plain!.getAttributes().map((row) => row.attname)).toEqual(
        multipass ? [] : ["id", "unrelated_id"],
      );
      expect(result.classes.some((row) => row.relname === "local_target")).toBe(
        true,
      );
      expect(result.classes.some((row) => row.relname === "unrelated")).toBe(
        !multipass,
      );
    });
  },
);
