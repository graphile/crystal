import { readFile } from "fs/promises";
import { glob } from "glob";
import {
  isSchema,
  lexicographicSortSchema,
  printSchema,
} from "grafast/graphql";

const TESTS = new URL("../__tests__", import.meta.url).pathname;

const exportPaths = await glob(`schema/**/*.export.mjs`, { cwd: TESTS });
for (const exportPath of exportPaths) {
  console.log(exportPath);
  const module = await import(`${TESTS}/${exportPath}`);
  const { schema } = module;
  if (!isSchema(schema)) {
    throw new Error(`Expected '${exportPath}' to export a schema`);
  }
  const sorted = lexicographicSortSchema(schema);
  const printed = printSchema(schema).trim();
  const sortedPrinted = printSchema(sorted).trim();
  const schemaPath = exportPath.replace(/\.export\.mjs$/, ".graphql");
  const schemaString = (
    await readFile(`${TESTS}/${schemaPath}`, "utf8")
  ).trim();
  if (schemaString !== printed && schemaString !== sortedPrinted) {
    throw new Error(`Schemas differ`);
  }
}
