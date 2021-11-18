import { makeExampleSchema } from "../src/examples/exampleSchema";

import("graphile-exporter").then(({ exportSchema }) => {
  exportSchema(makeExampleSchema(), `${__dirname}/../exampleSchemaExport.ts`);
});
