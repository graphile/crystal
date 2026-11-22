import * as adaptor from "@dataplan/pg/adaptors/pg";
import { makeSchema } from "graphile-build";
import { scopedUtils } from "graphile-utils";

import AmberPreset from "../../../dist/presets/amber.js";
import { withPoolClientTransaction } from "../../helpers.ts";

const { multipassInclude } = scopedUtils("default");

test("includes named objects outside the exposed schema", () =>
  withPoolClientTransaction(async (client) => {
    await client.query(`
      create schema app;
      create schema sys;
      create table app.tasks (id integer primary key);
      create table sys.priority (value text primary key);
      comment on table sys.priority is '@enum';
      insert into sys.priority values ('normal');
      create function sys.helper(i integer) returns integer language sql as $$ select i $$;
      create function sys.helper(i text) returns text language sql as $$ select i $$;
      create type sys.result as (answer integer);
      create table sys.unrelated (id integer);
    `);
    let inspected = false;
    await makeSchema({
      extends: [AmberPreset],
      gather: { pgMultipassIntrospection: true },
      plugins: [
        multipassInclude({
          tables: ["sys.priority"],
          functions: ["sys.helper"],
        }),
        multipassInclude({ types: ["sys.result"] }),
        multipassInclude({ serviceName: "other", tables: ["sys.unrelated"] }),
        {
          name: "InspectInclusions",
          gather: {
            hooks: {
              pgIntrospection_introspection(_info, { introspection }) {
                const sys = introspection.getNamespace({ name: "sys" })!;
                const priority = sys.getClass({ name: "priority" })!;
                expect(
                  priority.getAttributes().map((a) => a.attname),
                ).toContain("value");
                expect(priority.getTags().enum).toBe(true);
                expect(sys.getProcs({ name: "helper" })).toHaveLength(2);
                expect(
                  sys
                    .getType({ name: "result" })
                    ?.getClass()
                    ?.getAttributes()
                    .map((a) => a.attname),
                ).toContain("answer");
                expect(sys.getClass({ name: "unrelated" })).toBeUndefined();
                inspected = true;
              },
            },
          },
        },
      ],
      pgServices: [
        {
          adaptor,
          name: "main",
          withPgClientKey: "withPgClient",
          pgSettingsKey: "pgSettings",
          schemas: ["app"],
          adaptorSettings: { poolClient: client },
        },
      ],
    });
    expect(inspected).toBe(true);
  }));
