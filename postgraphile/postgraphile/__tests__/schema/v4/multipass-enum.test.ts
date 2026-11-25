import { pgSmartTags } from "graphile-utils";
import { assertEnumType, assertObjectType, getNamedType } from "graphql";

import * as core from "./core.ts";

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
          const fields = assertObjectType(schema.getType("Order")).getFields();
          function values(name: string) {
            return assertEnumType(getNamedType(fields[name].type))
              .getValues()
              .map((v) => v.value);
          }
          expect(values("keyword")).toEqual(["Bar", "Baz", "Foo", "Qux"]);
          expect(
            assertEnumType(getNamedType(fields.keyword.type)).getValue("FOO")
              ?.description,
          ).toBe("The first metasyntactic variable");
          expect(values("letter")).toEqual(["A", "B", "C", "D"]);
          expect(values("viewLetter")).toEqual(["A", "B", "C", "D"]);
          expect(values("code")).toEqual(["a1", "a2", "a3", "a4"]);
          expect(values("stage")).toContain("pending");
          expect(
            schema.getQueryType()!.getFields().allAbcdViews,
          ).toBeUndefined();
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
    `exposes functions returning native and domain-backed enums (multipass: ${multipass})`,
    schemaTest(
      undefined,
      "issue_2212",
      {},
      `
        create function issue_2212.pet() returns function_returning_enum.animal_type
          language sql stable as $$ select 'CAT'::function_returning_enum.animal_type $$;
        create function issue_2212.stage() returns function_returning_enum.stage_options_enum_domain
          language sql stable as $$ select 'pending'::function_returning_enum.stage_options_enum_domain $$;
        create domain function_returning_enum.transport as text;
        create function issue_2212.transport() returns function_returning_enum.transport
          language sql stable as $$ select 'CAR'::function_returning_enum.transport $$;
      `,
      (schema) => {
        const fields = schema.getQueryType()!.getFields();
        expect(
          assertEnumType(getNamedType(fields.pet.type))
            .getValues()
            .map((v) => v.value),
        ).toEqual(["CAT", "DOG", "FISH"]);
        expect(
          assertEnumType(getNamedType(fields.stage.type))
            .getValues()
            .map((v) => v.value),
        ).toContain("pending");
        expect(
          assertEnumType(getNamedType(fields.transport.type))
            .getValues()
            .map((v) => v.value),
        ).toEqual(["BIKE", "CAR", "SUBWAY"]);
        expect(fields.allStageOptions).toBeUndefined();
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

test("enum domains retain only their enum source, with independent policies for each build", async () => {
  for (const disableDomainDiscovery of [true, false]) {
    await core.test(
      undefined,
      "issue_2212",
      {},
      `
        alter table issue_2212.user_contacts rename to users_code;
        insert into issue_2212.users (id, username) values (-1, 'Zed');
        alter table issue_2212.users add constraint code unique (username);
        comment on constraint code on issue_2212.users is '@enum';
        create domain issue_2212.users_code_enum_domain as text;
        create function issue_2212.username() returns issue_2212.users_code_enum_domain
          language sql stable as $$ select 'Alice'::issue_2212.users_code_enum_domain $$;
        create domain issue_2212.orders_orders_pkey_enum_domain as text;
        create function issue_2212.order_label() returns issue_2212.orders_orders_pkey_enum_domain
          language sql stable as $$ select 'Order'::issue_2212.orders_orders_pkey_enum_domain $$;
        comment on view enum_tables.abcd_view is '@primaryKey letter|@enum';
        create domain enum_tables.abcd_view_enum_domain as text;
        create function issue_2212.letter() returns enum_tables.abcd_view_enum_domain
          language sql stable as $$ select 'A'::enum_tables.abcd_view_enum_domain $$;
      `,
      (schema) => {
        const fields = schema.getQueryType()!.getFields();
        expect(fields.allUsersCodes).toBeUndefined();
        expect(fields.allOrders).toBeUndefined();
        expect(String(fields.orderLabel.type)).toBe(
          "OrdersOrdersPkeyEnumDomain",
        );
        if (disableDomainDiscovery) {
          expect(String(fields.username.type)).toBe("UsersCodeEnumDomain");
        } else {
          expect(
            assertEnumType(getNamedType(fields.username.type))
              .getValues()
              .map((v) => v.value),
          ).toEqual(["Zed", "Alice", "Bob", "Carl"]);
          expect(
            assertEnumType(getNamedType(fields.letter.type)).getValue("A"),
          ).toBeDefined();
        }
      },
      true,
      {
        plugins: [
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
                      const policy = multipass.policies!.find(
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
