import { pgSmartTags } from "graphile-utils";
import { assertEnumType, assertObjectType, getNamedType } from "graphql";

import * as core from "./core.ts";

for (const multipass of [false, true]) {
  const schemaTest = multipass ? core.test : core.testDefaultOptions;
  test(
    `exposes a hidden enum referenced by a foreign key (multipass: ${multipass})`,
    schemaTest(
      undefined,
      "issue_2212",
      {},
      `
        comment on table function_returning_enum.stage_options is null;
        alter table issue_2212.orders
          add column keyword text references enum_tables.simple_enum,
          add column stage text references function_returning_enum.stage_options;
      `,
      (schema) => {
        const fields = assertObjectType(schema.getType("Order")).getFields();
        const keywords = assertEnumType(getNamedType(fields.keyword.type));
        expect(keywords.getValues().map((v) => v.value)).toEqual([
          "Bar",
          "Baz",
          "Foo",
          "Qux",
        ]);
        expect(keywords.getValue("FOO")?.description).toBe(
          "The first metasyntactic variable",
        );
        const stage = assertEnumType(getNamedType(fields.stage.type));
        expect(stage.getValues().map((v) => v.value)).toContain("pending");
      },
      true,
      {
        plugins: [
          pgSmartTags({
            kind: "class",
            match: "function_returning_enum.stage_options",
            tags: { enum: true },
          }),
        ],
      },
    ),
  );
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
