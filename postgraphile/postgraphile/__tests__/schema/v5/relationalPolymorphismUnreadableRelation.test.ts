import * as adaptor from "@dataplan/pg/adaptors/pg";
import type { GraphQLObjectType } from "grafast/graphql";
import { makeSchema } from "graphile-build";

import AmberPreset from "../../../src/presets/amber.ts";
import {
  StripOidsPlugin,
  SwallowAllErrorsPlugin,
  withPoolClientTransaction,
} from "../../helpers.ts";

jest.setTimeout(60000);

// The role cannot read `note`, so no field is added for it to the root of a
// relational polymorphic table (`item`)...
const setup = /* SQL */ `
  create schema relational_unreadable;
  create table relational_unreadable.item (
    id serial primary key,
    type text not null,
    name text not null
  );
  create table relational_unreadable.book (
    id int primary key references relational_unreadable.item,
    pages int
  );
  create table relational_unreadable.film (
    id int primary key references relational_unreadable.item,
    minutes int
  );
  create table relational_unreadable.note (
    id serial primary key,
    item_id int not null references relational_unreadable.item,
    body text not null
  );
  comment on table relational_unreadable.item is $$
    @interface mode:relational
    @type BOOK references:relational_unreadable.book
    @type FILM references:relational_unreadable.film
    $$;
  grant usage on schema relational_unreadable to postgraphile_test_visitor;
  grant select on
    relational_unreadable.item,
    relational_unreadable.book,
    relational_unreadable.film
  to postgraphile_test_visitor;
`;

test("a relational polymorphic implementation does not get a field for a relation the role cannot read", () =>
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
          pgSettingsForIntrospection: { role: "postgraphile_test_visitor" },
          schemas: ["relational_unreadable"],
          adaptorSettings: { poolClient: client },
        } satisfies GraphileConfig.PgServiceConfiguration<"@dataplan/pg/adaptors/pg">,
      ],
      schema: { muteWarnings: true },
    });

    // ...so none is added to its implementations either (it could never be
    // queried, the role is not allowed to select from the table)
    const book = schema.getType("Book") as GraphQLObjectType;
    expect(Object.keys(book.getFields())).toEqual(
      expect.arrayContaining(["pages", "name"]),
    );
    expect(
      Object.keys(book.getFields()).filter((name) => /note/i.test(name)),
    ).toEqual([]);
    expect(schema.getType("Note")).toBeUndefined();
  }));
