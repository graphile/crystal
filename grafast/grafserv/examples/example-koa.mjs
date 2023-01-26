import Koa from "koa";
import { grafserv } from "grafserv/koa/v2";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Koa app
const app = new Koa();
// (Add any Koa middleware you want here.)

// Create a Grafserv instance
const instance = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Koa app
instance.addTo(app);

// Start the Koa server
app.listen(preset.server.port ?? 5678);
