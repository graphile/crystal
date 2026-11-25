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
    `exposes functions returning native enums (multipass: ${multipass})`,
    schemaTest(
      undefined,
      "issue_2212",
      {},
      `
        create function issue_2212.pet() returns function_returning_enum.animal_type
          language sql stable as $$ select 'CAT'::function_returning_enum.animal_type $$;
      `,
      (schema) => {
        const fields = schema.getQueryType()!.getFields();
        expect(
          assertEnumType(getNamedType(fields.pet.type))
            .getValues()
            .map((v) => v.value),
        ).toEqual(["CAT", "DOG", "FISH"]);
      },
      true,
    ),
  );
}
