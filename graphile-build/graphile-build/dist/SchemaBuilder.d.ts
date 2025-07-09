import "./global.js";
import { EventEmitter } from "events";
import { GraphQLSchema } from "grafast/graphql";
import type { NewWithHooksFunction } from "./newWithHooks/index.js";
/**
 * The class responsible for building a GraphQL schema from graphile-build
 * plugins by orchestrating the various callback functions.
 */
declare class SchemaBuilder<TBuild extends GraphileBuild.Build = GraphileBuild.Build> extends EventEmitter {
    readonly resolvedPreset: GraphileConfig.ResolvedPreset;
    private inflection;
    options: GraphileBuild.SchemaOptions;
    depth: number;
    hooks: GraphileBuild.SchemaBuilderHooks<TBuild>;
    _currentPluginName: string | null | undefined;
    /**
     * Given a Build object, a GraphQL type constructor and a spec, applies the
     * hooks to the spec and then constructs the type, returning the result.
     */
    newWithHooks: NewWithHooksFunction;
    constructor(resolvedPreset: GraphileConfig.ResolvedPreset, inflection: GraphileBuild.Inflection);
    private _setPluginName;
    /**
     * Registers 'fn' as a hook for the given 'hookName'. Every hook `fn` takes
     * three arguments:
     *
     * - obj - the object currently being inspected
     * - build - the current build object (which contains a number of utilities
     *   and the context of the build)
     * - context - information specific to the current invocation of the hook
     *
     * The function must return a replacement object for `obj` or `obj` itself.
     * Generally we advice that you return the object itself, modifying it as
     * necessary. In JavaScript, modifying an object object tends to be
     * significantly faster than returning a modified clone.
     */
    hook<THookName extends keyof GraphileBuild.SchemaBuilderHooks<TBuild>>(hookName: THookName, fn: GraphileBuild.SchemaBuilderHooks[THookName][number]): void;
    /**
     * Applies the given 'hookName' hooks to the given 'input' and returns the
     * result, which is typically a derivative of 'input'.
     */
    applyHooks<THookName extends keyof GraphileBuild.SchemaBuilderHooks<TBuild>>(hookName: THookName, input: Parameters<GraphileBuild.SchemaBuilderHooks<TBuild>[THookName][number]>[0], build: Parameters<GraphileBuild.SchemaBuilderHooks<TBuild>[THookName][number]>[1], context: Parameters<GraphileBuild.SchemaBuilderHooks<TBuild>[THookName][number]>[2], debugStr?: string): Parameters<GraphileBuild.SchemaBuilderHooks<TBuild>[THookName][number]>[0];
    /**
     * Create the 'Build' object.
     */
    createBuild(input: GraphileBuild.BuildInput): TBuild;
    initBuild(build: TBuild): TBuild;
    /**
     * Given the `input` (result of the "gather" phase), builds the GraphQL
     * schema synchronously.
     */
    buildSchema(input: GraphileBuild.BuildInput): GraphQLSchema;
}
export default SchemaBuilder;
//# sourceMappingURL=SchemaBuilder.d.ts.map