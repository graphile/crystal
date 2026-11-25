import { pgSmartTags } from "graphile-utils";
import type { GraphQLOutputType } from "graphql";
import { assertEnumType, assertObjectType, getNamedType } from "graphql";

import * as core from "./core.ts";

function enumValues(type: GraphQLOutputType) {
  return assertEnumType(getNamedType(type))
    .getValues()
    .map((v) => v.value);
}

for (const multipass of [false, true]) {
  const schemaTest = multipass ? core.test : core.testDefaultOptions;
  for (const smartKey of ["primaryKey", "unique"]) {
    test(
      `exposes hidden enums referenced by foreign keys (@${smartKey}, multipass: ${multipass})`,
      schemaTest(
        undefined,
        "issue_2212",
        {},
        `
          comment on table enum_tables.simple_enum is null;
          ${
            smartKey === "unique"
              ? "comment on table enum_tables.abcd is '@unique letter|@enum';"
              : `comment on table enum_tables.abcd is null;
               alter table enum_tables.abcd add constraint same_letter unique (letter);
               comment on constraint same_letter on enum_tables.abcd is '@enum';`
          }
          comment on view enum_tables.abcd_view is '${smartKey === "unique" ? "@primaryKey letter\n" : ""}@${smartKey} letter|@enum';
          comment on table function_returning_enum.stage_options is null;
          alter table issue_2212.orders
            add column keyword text,
            add column letter text,
            add column view_letter text,
            add column code text,
            add column stage text references function_returning_enum.stage_options;
          comment on table issue_2212.orders is $tags$
@foreignKey (keyword) references enum_tables.simple_enum
@foreignKey (letter) references enum_tables.abcd
@foreignKey (view_letter) references enum_tables.abcd_view ${smartKey === "unique" ? "(letter)" : ""}
@foreignKey (code) references enum_tables.lots_of_enums (enum_1)
$tags$;
        `,
        (schema) => {
          const { keyword, letter, viewLetter, code, stage } = assertObjectType(
            schema.getType("Order"),
          ).getFields();
          expect(enumValues(keyword.type)).toEqual([
            "Bar",
            "Baz",
            "Foo",
            "Qux",
          ]);
          expect(
            assertEnumType(getNamedType(keyword.type)).getValue("FOO")
              ?.description,
          ).toBe("The first metasyntactic variable");
          expect(enumValues(letter.type)).toEqual(["A", "B", "C", "D"]);
          expect(enumValues(viewLetter.type)).toEqual(["A", "B", "C", "D"]);
          expect(enumValues(code.type)).toEqual(["a1", "a2", "a3", "a4"]);
          expect(enumValues(stage.type)).toContain("pending");
        },
        true,
        {
          plugins: [
            pgSmartTags({
              kind: "class",
              match: "function_returning_enum.stage_options",
              tags: { enum: true },
            }),
            pgSmartTags({
              kind: "constraint",
              match: "enum_tables.simple_enum.simple_enum_pkey",
              tags: { enum: true },
            }),
          ],
        },
      ),
    );
  }
  test(
    `exposes a function returning a native enum (multipass: ${multipass})`,
    schemaTest(
      undefined,
      "issue_2212",
      {},
      `
        -- Leave pet() as the only entrypoint so nothing pulls in pg_catalog.
        drop table issue_2212.orders, issue_2212.user_contacts, issue_2212.users;
        create function issue_2212.pet() returns function_returning_enum.animal_type
          language sql stable as $$ select 'CAT'::function_returning_enum.animal_type $$;
      `,
      (schema) => {
        const pet = schema.getQueryType()!.getFields().pet;
        expect(enumValues(pet.type)).toEqual(["CAT", "DOG", "FISH"]);
      },
    ),
  );
  test(
    `exposes functions returning domain-backed enums (multipass: ${multipass})`,
    schemaTest(
      undefined,
      "issue_2212",
      {},
      `
        create function issue_2212.stage() returns function_returning_enum.stage_options_enum_domain
          language sql stable as $$ select 'pending'::function_returning_enum.stage_options_enum_domain $$;
        create domain function_returning_enum.transport as text;
        create function issue_2212.transport() returns function_returning_enum.transport
          language sql stable as $$ select 'CAR'::function_returning_enum.transport $$;
      `,
      (schema) => {
        const { stage, transport } = schema.getQueryType()!.getFields();
        expect(enumValues(stage.type)).toContain("pending");
        expect(enumValues(transport.type)).toEqual(["BIKE", "CAR", "SUBWAY"]);
      },
      true,
      {
        plugins: [
          pgSmartTags({
            kind: "type",
            match: "function_returning_enum.transport",
            tags: { enum: "enum_table_transportation_enum" },
          }),
        ],
      },
    ),
  );
}

test("enum domains resolve to the intended enum, with independent policies for each build", async () => {
  for (const disableDomainDiscovery of [true, false]) {
    await core.test(
      undefined,
      "issue_2212",
      {},
      `
        alter table issue_2212.user_contacts rename to users_code;
        alter table issue_2212.users add column manager_id int references issue_2212.users;
        comment on table issue_2212.users is '@ref manager singular via:(manager_id)->users(id)';
        insert into issue_2212.users (id, username) values (-1, 'Zed');
        alter table issue_2212.users add constraint code unique (username);
        comment on constraint code on issue_2212.users is '@enum';
        create domain issue_2212.users_code_enum_domain as text;
        create function issue_2212.username() returns issue_2212.users_code_enum_domain
          language sql stable as $$ select 'Alice'::issue_2212.users_code_enum_domain $$;
        create domain issue_2212.orders_orders_pkey_enum_domain as text;
        create function issue_2212.order_label() returns issue_2212.orders_orders_pkey_enum_domain
          language sql stable as $$ select 'Order'::issue_2212.orders_orders_pkey_enum_domain $$;
        alter table issue_2212.orders add constraint alias unique (id);
        comment on constraint alias on issue_2212.orders is '@enum';
        create domain issue_2212.orders_alias_enum_domain as text;
        create function issue_2212.username_alias() returns issue_2212.orders_alias_enum_domain
          language sql stable as $$ select 'Alice'::issue_2212.orders_alias_enum_domain $$;
        comment on view enum_tables.abcd_view is '@primaryKey letter|@enum';
        create domain enum_tables.abcd_view_enum_domain as text;
        create function issue_2212.letter() returns enum_tables.abcd_view_enum_domain
          language sql stable as $$ select 'A'::enum_tables.abcd_view_enum_domain $$;
      `,
      (schema, passes) => {
        expect(passes).toBeLessThanOrEqual(7);
        const fields = schema.getQueryType()!.getFields();
        expect(String(fields.orderLabel.type)).toBe(
          "OrdersOrdersPkeyEnumDomain",
        );
        if (disableDomainDiscovery) {
          expect(String(fields.username.type)).toBe("UsersCodeEnumDomain");
        } else {
          expect(fields.usernameAlias.type).toBe(fields.username.type);
          const user = assertObjectType(schema.getType("User"));
          expect(user.getFields().manager?.type).toBe(user);
          expect(enumValues(fields.username.type)).toEqual([
            "Zed",
            "Alice",
            "Bob",
            "Carl",
          ]);
          expect(
            assertEnumType(getNamedType(fields.letter.type)).getValue("A"),
          ).toBeDefined();
        }
      },
      true,
      {
        plugins: [
          pgSmartTags({
            kind: "type",
            match: "issue_2212.orders_alias_enum_domain",
            tags: { enum: "users_code" },
          }),
          {
            name: "OnlyFunctions",
            after: ["PgEnumDomainsPlugin"],
            gather: {
              hooks: {
                pgIntrospection_options(_info, { options }) {
                  const { multipass } = options;
                  if (multipass) {
                    multipass.entrypointFilters = {
                      ...multipass.entrypointFilters,
                      classes: "false",
                    };
                    if (disableDomainDiscovery) {
                      const policy = multipass.policies.find(
                        (p) => p.name === "enumDomainTables",
                      )!;
                      policy.select = () => {};
                    }
                  }
                },
              },
            },
          },
        ],
      },
    )();
  }
});
