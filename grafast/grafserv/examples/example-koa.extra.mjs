import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { grafserv } from "grafserv/koa/v2";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Koa app
const app = new Koa();
// Parse the body
app.use(bodyParser());
// (Add any Koa middleware you want here.)

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Koa app
serv.addTo(app);

// Start the Koa server
app.listen(preset.server.port ?? 5678);
