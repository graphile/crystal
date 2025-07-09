import type { IncomingHttpHeaders, IncomingMessage, Server as HTTPServer, ServerResponse } from "node:http";
import type { Server as HTTPSServer } from "node:https";
import type { Duplex } from "node:stream";
import type WebSocket from "ws";
import { GrafservBase } from "../../core/base.js";
import type { GrafservConfig, RequestDigest } from "../../interfaces.js";
import type { OptionsFromConfig } from "../../options.js";
declare global {
    namespace Grafast {
        interface RequestContext {
            node: {
                readonly req: IncomingMessage;
                readonly res: ServerResponse;
            };
            ws: {
                /**
                 * The actual socket connection between the server and the client.
                 */
                readonly socket: WebSocket | undefined;
                /**
                 * The initial HTTP upgrade request before the actual
                 * socket and connection is established.
                 */
                readonly request: IncomingMessage | undefined;
                /** The parameters passed during the connection initialisation. */
                readonly connectionParams: Record<string, unknown> | undefined;
                /**
                 * As `connectionParams`, but with lower case keys to avoid case sensitivity issues. The actual transforms are:
                 *
                 * - Non-string keys are ignored
                 * - Keys are lowercased
                 * - Array values are confirmed to be string[], otherwise they're ignored
                 * - Other values are coerced to string if appropriate, otherwise ignored
                 * - Ignored values are not added to headers
                 * - If duplicate keys are found, the resulting value will be string[]
                 *   by concatenating existing and new values
                 */
                readonly normalizedConnectionParams: IncomingHttpHeaders | undefined;
            };
        }
    }
}
export declare class NodeGrafservBase extends GrafservBase {
    constructor(config: GrafservConfig);
    protected getDigest(dynamicOptions: OptionsFromConfig, req: IncomingMessage, res: ServerResponse, isHTTPS: boolean): RequestDigest;
    /**
     * @deprecated Please user serv.addTo instead, so that websockets can be automatically supported
     */
    createHandler(isHTTPS?: boolean): (req: IncomingMessage, res: ServerResponse, next?: (err?: Error) => void) => void;
    protected _createHandler(isHTTPS?: boolean): (req: IncomingMessage, res: ServerResponse, next?: (err?: Error) => void) => void;
    getUpgradeHandler(): Promise<((req: IncomingMessage, socket: Duplex, head: Buffer) => void) | null>;
    shouldHandleUpgrade(req: IncomingMessage, _socket: Duplex, _head: Buffer): boolean;
}
export declare class NodeGrafserv extends NodeGrafservBase {
    addTo(server: HTTPServer | HTTPSServer, addExclusiveWebsocketHandler?: boolean): Promise<void>;
}
export declare function grafserv(config: GrafservConfig): NodeGrafserv;
export declare function makeNodeUpgradeHandler(instance: GrafservBase): Promise<(req: IncomingMessage, socket: Duplex, head: Buffer) => void>;
//# sourceMappingURL=index.d.ts.map