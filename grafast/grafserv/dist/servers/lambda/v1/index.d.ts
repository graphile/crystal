import type { APIGatewayEvent, APIGatewayProxyEvent, APIGatewayProxyResult, Context as LambdaContext } from "aws-lambda";
import { GrafservBase } from "../../../core/base.js";
import type { GrafservConfig, RequestDigest, Result } from "../../../interfaces.js";
declare global {
    namespace Grafast {
        interface RequestContext {
            lambdav1: {
                event: APIGatewayProxyEvent;
                context: LambdaContext;
            };
        }
    }
}
/** @experimental */
export declare class LambdaGrafserv extends GrafservBase {
    protected lambdaRequestToGrafserv(event: APIGatewayEvent, context: LambdaContext): RequestDigest;
    protected grafservResponseToLambda(response: Result | null): {
        statusCode: number;
        body: string;
        headers?: undefined;
    } | {
        statusCode: number;
        headers: Record<string, string>;
        body: string;
    };
    createHandler(): (event: APIGatewayEvent, context: LambdaContext) => Promise<APIGatewayProxyResult>;
    protected processLambdaRequest(_event: APIGatewayEvent, _context: LambdaContext, request: RequestDigest): import("grafast").PromiseOrDirect<Result | null>;
}
/** @experimental */
export declare function grafserv(config: GrafservConfig): LambdaGrafserv;
//# sourceMappingURL=index.d.ts.map