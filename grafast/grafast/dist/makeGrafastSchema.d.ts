import type { GraphQLFieldResolver, GraphQLScalarLiteralParser, GraphQLScalarSerializer, GraphQLScalarValueParser } from "graphql";
import { GraphQLSchema } from "graphql";
import * as graphql from "graphql";
import type { ArgumentApplyPlanResolver, EnumValueApplyResolver, FieldPlanResolver, InputObjectFieldApplyResolver, InputObjectTypeBakedResolver, ScalarPlanResolver } from "./interfaces.js";
import type { Step } from "./step.js";
/**
 * When defining a field with `typeDefs/plans` you can declare the field plan
 * directly, or you can define a configuration object that accepts the plan and
 * more.
 */
export type FieldPlans = FieldPlanResolver<any, any, any> | {
    plan?: FieldPlanResolver<any, any, any>;
    subscribePlan?: FieldPlanResolver<any, any, any>;
    resolve?: GraphQLFieldResolver<any, any>;
    subscribe?: GraphQLFieldResolver<any, any>;
    args?: {
        [argName: string]: ArgumentApplyPlanResolver | {
            applyPlan?: ArgumentApplyPlanResolver;
            applySubscribePlan?: ArgumentApplyPlanResolver;
            extensions?: graphql.GraphQLArgumentExtensions;
        };
    };
};
/**
 * The plans/config for each field of a GraphQL object type.
 */
export type ObjectPlans = {
    __assertStep?: ((step: Step) => asserts step is Step) | {
        new (...args: any[]): Step;
    };
} & {
    [fieldName: string]: FieldPlans;
};
/**
 * The plans for each field of a GraphQL input object type.
 */
export type InputObjectPlans = {
    __baked?: InputObjectTypeBakedResolver;
} & {
    [fieldName: string]: InputObjectFieldApplyResolver<any> | {
        apply?: InputObjectFieldApplyResolver<any>;
        extensions?: graphql.GraphQLInputFieldExtensions;
    };
};
/**
 * The plan config for an interface or union type.
 */
export type InterfaceOrUnionPlans = {
    __resolveType?: (o: unknown) => string;
};
/**
 * The config for a GraphQL scalar type.
 */
export type ScalarPlans = {
    serialize?: GraphQLScalarSerializer<any>;
    parseValue?: GraphQLScalarValueParser<any>;
    parseLiteral?: GraphQLScalarLiteralParser<any>;
    plan?: ScalarPlanResolver<any, any>;
};
/**
 * The values/configs for the entries in a GraphQL enum type.
 */
export type EnumPlans = {
    [enumValueName: string]: EnumValueApplyResolver | string | number | boolean | {
        value?: unknown;
        extensions?: graphql.GraphQLEnumValueExtensions;
        apply?: EnumValueApplyResolver;
    };
};
/**
 * A map from GraphQL named type to the config for that type.
 */
export interface GrafastPlans {
    [typeName: string]: ObjectPlans | InputObjectPlans | InterfaceOrUnionPlans | ScalarPlans | EnumPlans;
}
/**
 * Takes a GraphQL schema definition in Interface Definition Language (IDL/SDL)
 * syntax and configs for the types in it and returns a GraphQL schema.
 */
export declare function makeGrafastSchema(details: {
    typeDefs: string;
    plans: GrafastPlans;
    enableDeferStream?: boolean;
}): GraphQLSchema;
//# sourceMappingURL=makeGrafastSchema.d.ts.map