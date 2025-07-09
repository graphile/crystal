import type { Hooks } from "crossws";
import type { App, H3Event } from "h3";
import { GrafservBase } from "../../../index.js";
import type { GrafservConfig, Result } from "../../../interfaces.js";
declare global {
    namespace Grafast {
        interface RequestContext {
            h3v1: {
                event: H3Event;
            };
        }
    }
}
export declare class H3Grafserv extends GrafservBase {
    constructor(config: GrafservConfig);
    /**
     * @deprecated use handleGraphQLEvent instead
     */
    handleEvent(event: H3Event): Promise<Buffer<ArrayBufferLike> | import("../../../interfaces.js").JSONValue | undefined>;
    handleGraphQLEvent(event: H3Event): Promise<Buffer<ArrayBufferLike> | import("../../../interfaces.js").JSONValue | undefined>;
    handleGraphiqlEvent(event: H3Event): Promise<Buffer<ArrayBufferLike> | import("../../../interfaces.js").JSONValue | undefined>;
    handleEventStreamEvent(event: H3Event): Promise<Buffer<ArrayBufferLike> | import("../../../interfaces.js").JSONValue | undefined>;
    send(event: H3Event, result: Result | null): Promise<Buffer<ArrayBufferLike> | import("../../../interfaces.js").JSONValue | undefined>;
    addTo(app: App): Promise<void>;
    makeWsHandler(): Partial<Hooks>;
}
export declare function grafserv(config: GrafservConfig): H3Grafserv;
//# sourceMappingURL=index.d.ts.map