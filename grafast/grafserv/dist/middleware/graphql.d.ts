import type { PromiseOrDirect } from "grafast";
import type { DocumentNode, GraphQLSchema } from "grafast/graphql";
import * as graphql from "grafast/graphql";
import type { GrafservBase } from "../index.js";
import type { DynamicOptions, HandlerResult, NormalizedRequestDigest, ParsedGraphQLBody, ValidatedGraphQLBody } from "../interfaces.js";
export declare function makeParseAndValidateFunction(schema: GraphQLSchema, resolvedPreset: GraphileConfig.ResolvedPreset, dynamicOptions: DynamicOptions): (query: string) => {
    document: DocumentNode;
    errors?: undefined;
} | {
    document?: undefined;
    errors: readonly graphql.GraphQLError[];
};
/**
 * The default allowed request content types do not include
 * `application/x-www-form-urlencoded` because that is treated specially by
 * browsers (e.g. it can be submitted cross origins without CORS).
 *
 * If you're using CORS then no media type is CSRF safe - it's up to you to
 * manage your CSRF protection.
 */
export declare const DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES: readonly ("application/json" | "application/graphql")[];
export declare const APPLICATION_JSON = "application/json;charset=utf-8";
export declare const APPLICATION_GRAPHQL_RESPONSE_JSON = "application/graphql-response+json;charset=utf-8";
export declare const TEXT_HTML = "text/html;charset=utf-8";
export declare function validateGraphQLBody(parsed: ParsedGraphQLBody): ValidatedGraphQLBody;
export declare const makeGraphQLHandler: (instance: GrafservBase) => (request: NormalizedRequestDigest, graphiqlHandler?: (request: NormalizedRequestDigest) => PromiseOrDirect<HandlerResult | null>) => PromiseOrDirect<HandlerResult | null>;
//# sourceMappingURL=graphql.d.ts.map