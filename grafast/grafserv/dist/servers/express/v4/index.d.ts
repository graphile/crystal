import type { Server as HTTPServer } from "node:http";
import type { Server as HTTPSServer } from "node:https";
import type { Express, Request, Response } from "express";
import type { GrafservConfig, RequestDigest } from "../../../interfaces.js";
import type { OptionsFromConfig } from "../../../options.js";
import { NodeGrafservBase } from "../../node/index.js";
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
export declare class ExpressGrafserv extends NodeGrafservBase {
    protected getDigest(dynamicOptions: OptionsFromConfig, req: Request, res: Response): RequestDigest;
    addTo(app: Express, server: HTTPServer | HTTPSServer | null, addExclusiveWebsocketHandler?: boolean): Promise<void>;
}
export declare function grafserv(config: GrafservConfig): ExpressGrafserv;
//# sourceMappingURL=index.d.ts.map