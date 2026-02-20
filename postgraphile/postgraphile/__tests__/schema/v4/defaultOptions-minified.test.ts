import { PgMinifySchemaPreset } from "../../../src/presets/minify.ts";
import * as core from "./core.ts";

test(
  "prints a schema with the default options, but minified",
  core.test(
    __filename,
    ["a", "b", "c"],
    undefined,
    undefined,
    undefined,
    undefined,
    {
      extends: [PgMinifySchemaPreset],
    },
  ),
);
