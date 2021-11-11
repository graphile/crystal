import { makeExampleSchema } from "../src/examples/exampleSchema";

(
  eval("import('graphile-build')") as Promise<typeof import("graphile-build")>
).then(({ exportSchema }) => {
  exportSchema(makeExampleSchema(), `${__dirname}/../exampleSchemaExport.ts`);
});
