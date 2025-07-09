import type { URL } from "node:url";
import * as t from "@babel/types";
import type { GraphQLSchema } from "grafast/graphql";
import type { ExportOptions } from "./interfaces.js";
export declare const canRepresentAsIdentifier: (key: string) => boolean;
export declare function isNotNullish<T>(input: T | null | undefined): input is T;
/**
 * Maps to `{__proto__: null, ...}` which is similar to
 * `Object.assign(Object.create(null), {...})`
 */
export declare function objectNullPrototype(properties: t.ObjectProperty[]): t.Expression;
export declare function exportSchemaAsString(schema: GraphQLSchema, options: ExportOptions): Promise<{
    code: string;
}>;
export declare function exportValueAsString(name: string, value: any, options: ExportOptions): Promise<{
    code: string;
}>;
export declare function exportSchema(schema: GraphQLSchema, toPath: string | URL, options?: ExportOptions): Promise<void>;
//# sourceMappingURL=exportSchema.d.ts.map