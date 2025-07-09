import type { IncomingMessage, Server as HTTPServer } from "node:http";
import type { Server as HTTPSServer } from "node:https";
import type { Duplex } from "node:stream";
import type { Context } from "koa";
import type Koa from "koa";
import { GrafservBase } from "../../../core/base.js";
import type { GrafservConfig } from "../../../interfaces.js";
declare global {
    namespace Grafast {
        interface RequestContext {
            koav2: {
                ctx: Context;
            };
        }
    }
}
export declare class KoaGrafserv extends GrafservBase {
    constructor(config: GrafservConfig);
    protected _createHandler(): (ctx: Context, next: (err?: Error) => void) => void;
    getUpgradeHandler(): Promise<((req: IncomingMessage, socket: Duplex, head: Buffer) => void) | null>;
    shouldHandleUpgrade(req: IncomingMessage, _socket: Duplex, _head: Buffer): boolean;
    addTo(app: Koa, server: HTTPServer | HTTPSServer | null, addExclusiveWebsocketHandler?: boolean): Promise<void>;
}
export declare function grafserv(config: GrafservConfig): KoaGrafserv;
//# sourceMappingURL=index.d.ts.map