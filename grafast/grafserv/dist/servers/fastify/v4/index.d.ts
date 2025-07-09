import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { GrafservBase } from "../../../core/base.js";
import type { GrafservConfig, Result } from "../../../interfaces.js";
declare global {
    namespace Grafast {
        interface RequestContext {
            fastifyv4: {
                request: FastifyRequest;
                reply: FastifyReply;
            };
        }
    }
}
export declare class FastifyGrafserv extends GrafservBase {
    constructor(config: GrafservConfig);
    send(request: FastifyRequest, reply: FastifyReply, result: Result | null): Promise<Buffer<ArrayBufferLike> | import("../../../interfaces.js").JSONValue>;
    addTo(app: FastifyInstance): Promise<void>;
}
export declare function grafserv(config: GrafservConfig): FastifyGrafserv;
//# sourceMappingURL=index.d.ts.map