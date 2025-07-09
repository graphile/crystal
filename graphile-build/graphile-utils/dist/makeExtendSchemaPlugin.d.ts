import type { ExecutableStep, FieldPlanResolver } from "grafast";
import type { DirectiveDefinitionNode, DocumentNode, EnumTypeDefinitionNode, GraphQLDirective, GraphQLEnumType, GraphQLFieldResolver, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLIsTypeOfFn, GraphQLObjectType, GraphQLScalarType, GraphQLScalarTypeConfig, GraphQLTypeResolver, GraphQLUnionType, InputObjectTypeDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, ScalarTypeDefinitionNode, UnionTypeDefinitionNode } from "grafast/graphql";
import type { GraphileBuild } from "graphile-build";
export interface ObjectFieldConfig<TSource = any, TContext = any> {
    scope?: GraphileBuild.ScopeObjectFieldsField;
    plan?: FieldPlanResolver<any, any, any>;
    subscribePlan?: FieldPlanResolver<any, any, any>;
    /** @deprecated Use 'plan' */
    resolve?: GraphQLFieldResolver<TSource, TContext>;
    /** @deprecated Use 'subscribePlan' */
    subscribe?: GraphQLFieldResolver<TSource, TContext>;
    __resolveType?: GraphQLTypeResolver<TSource, TContext>;
    __isTypeOf?: GraphQLIsTypeOfFn<TSource, TContext>;
}
export interface ObjectResolver<TSource = any, TContext = any> {
    [key: string]: GraphQLFieldResolver<TSource, TContext> | ObjectFieldConfig<TSource, TContext>;
}
export type ObjectPlan<TSource = any, TContext = any> = {
    __assertStep?: ((step: ExecutableStep) => asserts step is ExecutableStep) | {
        new (...args: any[]): ExecutableStep;
    };
    __scope?: GraphileBuild.ScopeObject;
} & {
    [key: string]: FieldPlanResolver<any, any, any> | ObjectFieldConfig<TSource, TContext>;
};
export type EnumResolver = {
    __scope?: GraphileBuild.ScopeEnum;
} & {
    [key: string]: string | number | Array<any> | Record<string, any> | symbol;
};
export interface TypeResolver {
    __resolveType?: GraphQLTypeResolver<any, any>;
    __scope?: GraphileBuild.ScopeUnion | GraphileBuild.ScopeInterface;
}
export interface InputObjectResolver {
    __scope?: GraphileBuild.ScopeInputObject;
}
/** @deprecated Use Plans instead */
export interface Resolvers<TSource = any, TContext = any> {
    [key: string]: ObjectResolver<TSource, TContext> | EnumResolver | TypeResolver | InputObjectResolver | GraphQLScalarType | (GraphQLScalarTypeConfig<any, any> & {
        __scope?: GraphileBuild.ScopeScalar;
    });
}
export interface Plans<TSource = any, TContext = any> {
    [key: string]: ObjectPlan<TSource, TContext> | EnumResolver | GraphQLScalarType | GraphQLScalarTypeConfig<any, any>;
}
export interface ExtensionDefinition {
    typeDefs: DocumentNode | DocumentNode[];
    /** @deprecated Use 'plans' instead */
    resolvers?: Resolvers;
    plans?: Plans;
}
type ParentConstructors<T> = {
    new (...args: any[]): T;
};
type NewTypeDef = {
    type: ParentConstructors<GraphQLObjectType>;
    definition: ObjectTypeDefinitionNode;
} | {
    type: ParentConstructors<GraphQLInputObjectType>;
    definition: InputObjectTypeDefinitionNode;
} | {
    type: ParentConstructors<GraphQLInterfaceType>;
    definition: InterfaceTypeDefinitionNode;
} | {
    type: ParentConstructors<GraphQLUnionType>;
    definition: UnionTypeDefinitionNode;
} | {
    type: ParentConstructors<GraphQLScalarType>;
    definition: ScalarTypeDefinitionNode;
} | {
    type: ParentConstructors<GraphQLEnumType>;
    definition: EnumTypeDefinitionNode;
} | {
    type: typeof GraphQLDirective;
    definition: DirectiveDefinitionNode;
};
declare global {
    namespace GraphileBuild {
        interface Build {
            makeExtendSchemaPlugin: {
                [uniquePluginName: string]: {
                    typeExtensions: any;
                    newTypes: Array<NewTypeDef>;
                    resolvers: Resolvers;
                    plans: Plans;
                };
            };
        }
    }
}
export declare function makeExtendSchemaPlugin(generator: ExtensionDefinition | ((build: GraphileBuild.Build) => ExtensionDefinition), uniquePluginName?: string): GraphileConfig.Plugin;
export {};
//# sourceMappingURL=makeExtendSchemaPlugin.d.ts.map