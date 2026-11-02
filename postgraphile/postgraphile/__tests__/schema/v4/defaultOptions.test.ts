import { PgMinifySchemaPreset } from "../../../dist/presets/minify.js";
import * as core from "./core.ts";

const makeTest = (additionalPresets: GraphileConfig.Preset[]) =>
  core.test(
    __filename,
    ["a", "b", "c"],
    undefined,
    undefined,
    undefined,
    undefined,
    { extends: additionalPresets },
  );

test("prints a schema with the default options", makeTest([]));

test(
  "prints a schema with the default options, but minified",
  makeTest([PgMinifySchemaPreset]),
);
