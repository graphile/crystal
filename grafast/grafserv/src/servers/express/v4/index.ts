import type { Express, Request, Response } from "express";
import type { Server as HTTPServer } from "node:http";
import type { Server as HTTPSServer } from "node:https";

import type { GrafservConfig, RequestDigest } from "../../../interfaces.js";
import type { OptionsFromConfig } from "../../../options.js";
import {
  getBodyFromFrameworkBody,
  getBodyFromRequest,
  processHeaders,
} from "../../../utils.js";
import {
  attachWebsocketsToServer,
  NodeGrafservBase,
} from "../../node/index.js";

declare global {
  namespace Grafast {
    interface RequestContext {
      expressv4: {
        req: Request;
        res: Response;
      };
    }
  }
}

export class ExpressGrafserv extends NodeGrafservBase {
  protected getDigest(
    dynamicOptions: OptionsFromConfig,
    req: Request,
    res: Response,
  ): RequestDigest {
    return {
      httpVersionMajor: req.httpVersionMajor,
      httpVersionMinor: req.httpVersionMinor,
      isSecure: req.secure,
      method: req.method,
      path: req.path,
      headers: processHeaders(req.headers),
      getQueryParams() {
        return req.query as Record<string, string | string[]>;
      },
      getBody() {
        if (req.body != null) {
          return getBodyFromFrameworkBody(req.body);
        } else {
          return getBodyFromRequest(req, dynamicOptions.maxRequestLength);
        }
      },
      requestContext: {
        node: {
          req,
          res,
        },
        expressv4: {
          req,
          res,
        },
      },
    };
  }

  async addTo(app: Express, server: HTTPServer | HTTPSServer | null) {
    app.use(this._createHandler());
    if (this.resolvedPreset.server?.websockets) {
      if (server) {
        // If user explicitly passes server, bind to it:
        attachWebsocketsToServer(this, server);
      } else {
        // If not, hope they're calling `app.listen()` and intercept that call.
        const oldListen = app.listen;
        app.listen = (...args: any) => {
          const server = oldListen.apply(app, args);
          attachWebsocketsToServer(this, server);
          return server;
        };
      }
    }
  }
}

export function grafserv(config: GrafservConfig) {
  return new ExpressGrafserv(config);
}
