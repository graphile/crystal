import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { grafserv } from "grafserv/koa/v2";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Koa app
const app = new Koa();
// Parse the body
app.use(
  bodyParser({
    detectJSON: (ctx) =>
      ["application/json", "application/graphql-request+json"].includes(
        ctx.type,
      ),
  }),
);
// (Add any Koa middleware you want here.)

// Create a Grafserv instance
const instance = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Koa app
instance.addTo(app);

// Start the Koa server
app.listen(preset.server.port ?? 5678);
