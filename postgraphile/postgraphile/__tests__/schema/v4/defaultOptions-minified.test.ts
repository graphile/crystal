import { PgMinifySchemaPreset } from "../../../dist/presets/minify.js";
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
