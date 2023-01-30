import express from "express";
import { grafserv } from "grafserv/express/v4";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create an express app
const app = express();
// (Add any Express middleware you want here.)
app.use((req, _res, next) => {
  req.thing = "Hello from Express!";
  next();
});

// Create a Grafserv instance
const instance = grafserv({ schema, preset });

// Add the Grafserv instance's route handlers to the Express app
instance.addTo(app);

// Start the Express server
app.listen(preset.server.port ?? 5678);
