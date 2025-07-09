import type { Context as Ctx, Hono, MiddlewareHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import type { UpgradeWebSocket } from "hono/ws";
import { GrafservBase } from "../../../index.js";
import type { GrafservConfig, Result } from "../../../interfaces.js";
declare global {
    namespace Grafast {
        interface RequestContext {
            honov4: {
                ctx: Ctx;
            };
        }
    }
}
export declare class HonoGrafserv extends GrafservBase {
    private upgradeWebSocket?;
    constructor(config: GrafservConfig, upgradeWebSocket?: UpgradeWebSocket | undefined);
    makeWsHandler(upgradeWebSocket: UpgradeWebSocket): MiddlewareHandler;
    handleGraphQLEvent(ctx: Ctx): Promise<(Response & import("hono").TypedResponse<"¯\\_(ツ)_/¯", import("hono/utils/http-status").ContentfulStatusCode, "text">) | (Response & import("hono").TypedResponse<unknown, import("hono/utils/http-status").ContentfulStatusCode, "body">) | (Response & import("hono").TypedResponse<any, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<null, StatusCode, "body">) | (Response & import("hono").TypedResponse<"Server hasn't implemented this yet", import("hono/utils/http-status").ContentfulStatusCode, "text">)>;
    handleGraphiqlEvent(ctx: Ctx): Promise<(Response & import("hono").TypedResponse<"¯\\_(ツ)_/¯", import("hono/utils/http-status").ContentfulStatusCode, "text">) | (Response & import("hono").TypedResponse<unknown, import("hono/utils/http-status").ContentfulStatusCode, "body">) | (Response & import("hono").TypedResponse<any, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<null, StatusCode, "body">) | (Response & import("hono").TypedResponse<"Server hasn't implemented this yet", import("hono/utils/http-status").ContentfulStatusCode, "text">)>;
    handleEventStreamEvent(ctx: Ctx): Promise<(Response & import("hono").TypedResponse<"¯\\_(ツ)_/¯", import("hono/utils/http-status").ContentfulStatusCode, "text">) | (Response & import("hono").TypedResponse<unknown, import("hono/utils/http-status").ContentfulStatusCode, "body">) | (Response & import("hono").TypedResponse<any, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<null, StatusCode, "body">) | (Response & import("hono").TypedResponse<"Server hasn't implemented this yet", import("hono/utils/http-status").ContentfulStatusCode, "text">)>;
    send(ctx: Ctx, result: Result | null): Promise<(Response & import("hono").TypedResponse<"¯\\_(ツ)_/¯", import("hono/utils/http-status").ContentfulStatusCode, "text">) | (Response & import("hono").TypedResponse<unknown, import("hono/utils/http-status").ContentfulStatusCode, "body">) | (Response & import("hono").TypedResponse<any, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<null, StatusCode, "body">) | (Response & import("hono").TypedResponse<"Server hasn't implemented this yet", import("hono/utils/http-status").ContentfulStatusCode, "text">)>;
    addTo(app: Hono): Promise<void>;
    private setResponseHeaders;
}
/**
 * Creates a new instance of HonoGrafserv.
 *
 * @param config - The configuration object for Grafserv.
 * @param upgradeWebSocket - Optional parameter required when using websockets.
 *        Hono uses the upgradeWebsocket helper depending on the environment.
 *        Refer to https://hono.dev/docs/helpers/websocket for more details.
 * @returns An instance of HonoGrafserv.
 */
export declare const grafserv: (config: GrafservConfig, upgradeWebSocket?: UpgradeWebSocket) => HonoGrafserv;
//# sourceMappingURL=index.d.ts.map