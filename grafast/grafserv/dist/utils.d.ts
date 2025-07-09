import type { Readable } from "node:stream";
import { SafeError } from "grafast";
import type { FormattedExecutionPatchResult, FormattedExecutionResult } from "grafast/graphql";
import type { ServerOptions, SubscribePayload } from "graphql-ws";
import type { GrafservBase } from "./index.js";
import type { GrafservBody, JSONValue, NormalizedRequestDigest, ParsedGraphQLBody, RequestDigest } from "./interfaces.js";
export declare const sleep: (ms: number) => {
    promise: Promise<void>;
    release(): void;
};
export declare function handleErrors(payload: FormattedExecutionResult | FormattedExecutionPatchResult): void;
type IncomingHttpHeaders = Record<string, string | string[] | undefined>;
export declare function processHeaders(headers: IncomingHttpHeaders): Record<string, string>;
export declare function getBodyFromRequest(req: Readable, maxLength: number): Promise<GrafservBody>;
/**
 * Using this is a hack, it sniffs the data and tries to determine the type.
 * Really you should ask your framework of choice what type of data it has given
 * you.
 */
export declare function getBodyFromFrameworkBody(body: unknown): GrafservBody;
export declare function memo<T>(fn: () => T): () => T;
export declare function normalizeRequest(request: RequestDigest | NormalizedRequestDigest): NormalizedRequestDigest;
export declare function httpError(statusCode: number, message: string): SafeError;
export declare function normalizeConnectionParams(connectionParams: Record<string, unknown> | undefined): IncomingHttpHeaders | undefined;
export declare function makeGraphQLWSConfig(instance: GrafservBase): ServerOptions;
export declare function parseGraphQLJSONBody(params: JSONValue | (SubscribePayload & {
    id?: string;
    documentId?: string;
})): ParsedGraphQLBody;
export declare function concatBufferIterator(bufferIterator: AsyncGenerator<Buffer>): Promise<Buffer<ArrayBuffer>>;
export declare function noop(): void;
export {};
//# sourceMappingURL=utils.d.ts.map