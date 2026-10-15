import * as adaptor from "@dataplan/pg/adaptors/pg";
import { makeSchema } from "graphile-build";

import AmberPreset from "../../../src/presets/amber.ts";
import {
  StripOidsPlugin,
  SwallowAllErrorsPlugin,
  withPoolClientTransaction,
} from "../../helpers.ts";

jest.setTimeout(60000);

// A relational polymorphic table `item` alongside a lookup table `item_type`:
// the lookup table's GraphQL type is `ItemType`, which must not be lost.
const setup = /* SQL */ `
  create schema relational_type_table;
  create table relational_type_table.item_type (
    id serial primary key,
    label text not null
  );
  create table relational_type_table.item (
    id serial primary key,
    type text not null,
    item_type_id int references relational_type_table.item_type,
    name text not null
  );
  create table relational_type_table.book (
    id int primary key references relational_type_table.item,
    pages int
  );
  create table relational_type_table.film (
    id int primary key references relational_type_table.item,
    minutes int
  );
  comment on table relational_type_table.item is $$
    @interface mode:relational
    @type BOOK references:relational_type_table.book
    @type FILM references:relational_type_table.film
    $$;
`;

test("a relational polymorphic table does not hide the type of its `_type` table", () =>
  withPoolClientTransaction(async (client) => {
    await client.query(setup);
    const { schema } = await makeSchema({
      extends: [AmberPreset],
      plugins: [StripOidsPlugin, SwallowAllErrorsPlugin],
      gather: { muteWarnings: true },
      pgServices: [
        {
          adaptor,
          name: "main",
          withPgClientKey: "withPgClient",
          pgSettingsKey: "pgSettings",
          pgSettingsForIntrospection: null,
          schemas: ["relational_type_table"],
          adaptorSettings: { poolClient: client },
        } satisfies GraphileConfig.PgServiceConfiguration<"@dataplan/pg/adaptors/pg">,
      ],
      schema: { muteWarnings: true },
    });

    expect(schema.getType("ItemType")).toBeDefined();
    expect(schema.getType("Item")).toBeDefined();
  }));
