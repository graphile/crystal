import * as adaptor from "@dataplan/pg/adaptors/pg";
import { makeSchema } from "graphile-build";
import { pgSmartTags } from "graphile-utils";
import { assertEnumType, assertObjectType } from "graphql";

import AmberPreset from "../../../dist/presets/amber.js";
import { withPoolClientTransaction } from "../../helpers.ts";

test("follows one foreign key to an enum table outside the exposed schema", () =>
  withPoolClientTransaction(async (client) => {
    await client.query(`
      create schema multipass_enum_app;
      create schema multipass_enum_other;
      create table multipass_enum_other.unrelated (id text primary key);
      create table multipass_enum_other.priority (
        value text primary key,
        description text,
        unrelated_id text references multipass_enum_other.unrelated
      );
      comment on column multipass_enum_other.priority.description is '@enumDescription';
      insert into multipass_enum_other.priority (value, description)
        values ('normal', 'Normal priority');
      create table multipass_enum_app.tasks (
        id integer primary key,
        priority text not null references multipass_enum_other.priority
      );
    `);
    let classNames: string[] = [];
    let foreignKeys: string[] = [];
    let introspectionPasses: number | undefined;
    const { schema } = await makeSchema({
      extends: [AmberPreset],
      plugins: [
        pgSmartTags({
          kind: "class",
          match: "multipass_enum_other.priority",
          tags: { enum: true },
        }),
        {
          name: "InspectMultipassEnumTest",
          after: ["smart-tags"],
          gather: {
            hooks: {
              pgIntrospection_introspection(_info, { introspection }) {
                introspectionPasses = introspection.introspectionPasses;
                classNames = introspection.classes.map(
                  (c) => `${c.getNamespace()?.nspname}.${c.relname}`,
                );
                foreignKeys = introspection.constraints
                  .filter((c) => c.contype === "f")
                  .map((c) => c.conname);
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
          schemas: ["multipass_enum_app"],
          adaptorSettings: { poolClient: client },
        },
      ],
    });
    const task = assertObjectType(schema.getType("Task"));
    expect(String(task.getFields().priority.type)).toBe(
      "MultipassEnumOtherPriority!",
    );
    const priority = assertEnumType(
      schema.getType("MultipassEnumOtherPriority"),
    );
    expect(
      priority
        .getValues()
        .map(({ value, description }) => ({ value, description })),
    ).toEqual([{ value: "normal", description: "Normal priority" }]);
    expect(classNames).toContain("multipass_enum_other.priority");
    expect(classNames).not.toContain("multipass_enum_other.unrelated");
    expect(schema.getType("MultipassEnumOtherUnrelated")).toBeUndefined();
    expect(foreignKeys).toContain("tasks_priority_fkey");
    expect(foreignKeys).not.toContain("priority_unrelated_id_fkey");
    expect(introspectionPasses).toBeGreaterThan(0);
    expect(introspectionPasses).toBeLessThanOrEqual(5);
  }));
