import { MinifySchemaPlugin } from "graphile-build";
import { PgRegistryReductionPlugin } from "graphile-build-pg";

/**
 * [EXPERIMENTAL] Minifies a schema for exporting by stripping documentation
 * and deprecation info from the schema, and removing extensions from the
 * registry.
 *
 * @experimental
 */
export const PgMinifySchemaPreset: GraphileConfig.Preset = {
  plugins: [PgRegistryReductionPlugin, MinifySchemaPlugin],
};
