import { assertObjectType } from "graphql";

import { PgMinifySchemaPreset } from "../../../dist/presets/minify.js";
import * as core from "./core.ts";

const makeTest = ({ minified = false }: { minified?: boolean } = {}) =>
  core.test(
    __filename,
    ["a", "b", "c"],
    undefined,
    // Test custom smart tags without updating all of the other test snapshots
    `\
comment on function c.query_output_two_rows is '
@arg0description ID of the leftArm to be used as the first row
@arg1description ID of the post to be used as the second row.
@arg1description (This description spans multiple lines.)
@arg2description This is an inout parameter
@arg3description Output only parameter
@arg4description Output only parameter (2)
Tests outputting two rows using in/out/inout parameters';
`,
    (schema) => {
      const Query = assertObjectType(schema.getType("Query"));
      const field = Query.getFields().queryOutputTwoRows;
      const leftArmId = field.args.find((f) => f.name === "leftArmId")!;
      const postId = field.args.find((f) => f.name === "postId")!;
      const txt = field.args.find((f) => f.name === "txt")!;
      if (minified) {
        expect(leftArmId.description).toBe(undefined);
        expect(postId.description).toBe(undefined);
        expect(txt.description).toBe(undefined);
      } else {
        expect(leftArmId.description).toEqual(
          "ID of the leftArm to be used as the first row",
        );
        expect(postId.description).toEqual(
          "ID of the post to be used as the second row.\n(This description spans multiple lines.)",
        );
        expect(txt.description).toEqual("This is an inout parameter");
      }
    },
    undefined,
    {
      extends: [
        // Minify
        minified ? PgMinifySchemaPreset : null,
      ].filter((p) => p != null),
    },
  );

test("prints a schema with the default options", makeTest());

test(
  "prints a schema with the default options, but minified",
  makeTest({ minified: true }),
);
