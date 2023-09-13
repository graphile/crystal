import { grafserv } from "grafserv/lambda/v1";

import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Let lambda call into its handler
export const handler = serv.createHandler()

