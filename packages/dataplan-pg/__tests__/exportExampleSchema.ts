import { makeExampleSchema } from "../src/examples/exampleSchema";

import("graphile-build").then(({ exportSchema }) => {
  exportSchema(makeExampleSchema(), `${__dirname}/../exampleSchemaExport.ts`);
});
