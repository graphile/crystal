import type { Express, Request, Response } from "express";
import { GrafservConfig } from "../../../interfaces.js";
import { NodeGrafserv } from "../../node/index.js";

declare global {
  namespace Grafserv {
    interface RequestDigestFrameworkMeta {
      express: {
        req: Request;
        res: Response;
      };
    }
  }
}

export class ExpressGrafserv extends NodeGrafserv {
  addTo(app: Express) {
    app.use(this.createHandler());
  }
}

export function grafserv(config: GrafservConfig) {
  return new ExpressGrafserv(config);
}
