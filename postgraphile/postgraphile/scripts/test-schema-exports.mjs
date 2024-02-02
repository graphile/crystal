import { isSchema } from "grafast/graphql";
import { glob } from "glob";

const TESTS = new URL("../__tests__", import.meta.url).pathname;

const exportPaths = await glob(`schema/**/*.export.mjs`, { cwd: TESTS });
for (const exportPath of exportPaths) {
  console.log(exportPath);
  const module = await import(`${TESTS}/${exportPath}`);
  const { schema } = module;
  if (!isSchema(schema)) {
    throw new Error(`Expected '${exportPath}' to export a schema`);
  }
}
