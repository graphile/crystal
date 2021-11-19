import { exportSchema } from "graphile-exporter";

import { makeExampleSchema } from "../src/examples/exampleSchema";

exportSchema(makeExampleSchema(), `${__dirname}/../exampleSchemaExport.mjs`);
