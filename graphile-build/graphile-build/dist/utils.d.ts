import type { GraphQLNamedType, GraphQLScalarTypeConfig } from "grafast/graphql";
import { GraphQLObjectType } from "grafast/graphql";
export declare function EXPORTABLE<T, TScope extends any[]>(factory: (...args: TScope) => T, args: [...TScope], nameHint?: string): T;
export declare function EXPORTABLE_OBJECT_CLONE<T extends object>(obj: T): T;
export declare function exportNameHint(obj: any, nameHint: string): void;
/**
 * Loops over all the given `keys` and binds the method of that name on `obj`
 * to `obj` so that destructuring `build`/etc won't relate in broken `this`
 * references.
 */
declare const bindAll: (obj: object, keys: Array<string>) => object;
export { bindAll };
export declare const constantCaseAll: (str: string) => string;
/**
 * Applies the given format function `fn` to a string, but maintains any
 * leading/trailing underscores.
 */
export declare const formatInsideUnderscores: (fn: (input: string) => string) => (str: string) => string;
export declare const upperFirst: (str: string) => string;
export declare const camelCase: (str: string) => string;
export declare const constantCase: (str: string) => string;
export declare const upperCamelCase: (str: string) => string;
export declare const pluralize: (str: string) => string;
export declare const singularize: (str: string) => string;
/**
 * Returns true if the given type is a GraphQL object type AND that object type
 * defines fields; false otherwise.
 *
 * WARNING: this function may throw if there's issues with the type's fields,
 * since it calls Type.getFields()
 */
export declare function isValidObjectType(Type: GraphQLNamedType | null | undefined): Type is GraphQLObjectType;
/**
 * Only use this on descriptions that are plain text, or that we create
 * manually in code; since descriptions are markdown, it's not safe to use on
 * descriptions that contain code blocks or long inline code strings.
 */
export declare const wrapDescription: (description: string | null | undefined, position: "root" | "type" | "field" | "arg") => string | null;
/**
 * Generates the spec for a GraphQLScalar (except the name) with the
 * given description/coercion.
 */
export declare const stringTypeSpec: (description: string | null, coerce?: (input: string) => string, name?: string) => Omit<GraphQLScalarTypeConfig<any, any>, "name">;
/**
 * This is a TypeScript constrained identity function to save having to specify
 * all the generics manually.
 */
export declare function gatherConfig<const TNamespace extends keyof GraphileConfig.GatherHelpers, const TState extends {
    [key: string]: any;
} = {
    [key: string]: any;
}, const TCache extends {
    [key: string]: any;
} = {
    [key: string]: any;
}>(config: GraphileConfig.PluginGatherConfig<TNamespace, TState, TCache>): GraphileConfig.PluginGatherConfig<TNamespace, TState, TCache>;
//# sourceMappingURL=utils.d.ts.map