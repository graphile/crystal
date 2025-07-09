import "./PgProceduresPlugin.js";
import "graphile-config";
import type { PgCodec, PgResource, PgResourceParameter, PgSelectArgumentRuntimeValue, PgSelectArgumentSpec } from "@dataplan/pg";
import { generatePgParameterAnalysis } from "@dataplan/pg";
import type { FieldArgs } from "grafast";
import type { GraphQLInputType, GraphQLSchema } from "grafast/graphql";
declare const $$rootQuery: unique symbol;
declare const $$rootMutation: unique symbol;
declare const $$computed: unique symbol;
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgCustomTypeFieldPlugin: true;
        }
    }
    namespace GraphileBuild {
        interface BehaviorStrings {
            queryField: true;
            mutationField: true;
            typeField: true;
            "typeField:resource:connection": true;
            "typeField:resource:list": true;
            "typeField:resource:array": true;
            "queryField:resource:connection": true;
            "queryField:resource:list": true;
            "queryField:resource:array": true;
            "typeField:single": true;
            "queryField:single": true;
        }
        interface Build {
            pgGetArgDetailsFromParameters(resource: PgResource<any, any, any, any, any>, parameters?: readonly PgResourceParameter[]): {
                makeFieldArgs(): {
                    [graphqlArgName: string]: {
                        type: GraphQLInputType;
                        description?: string;
                    };
                };
                makeArgs(args: FieldArgs, path?: string[]): readonly PgSelectArgumentSpec[];
                makeArgsRuntime(schema: GraphQLSchema, 
                /** Suitable for input object fields, or arguments */
                fieldsOrArgs: Record<string, {
                    type: GraphQLInputType;
                }>, input: Record<string, any>): readonly PgSelectArgumentRuntimeValue[];
                argDetails: Array<{
                    graphqlArgName: string;
                    postgresArgName: string | null;
                    pgCodec: PgCodec;
                    inputType: GraphQLInputType;
                    required: boolean;
                }>;
                parameterAnalysis: ReturnType<typeof generatePgParameterAnalysis>;
            };
        }
        interface InflectionCustomFieldProcedureDetails {
            resource: PgResource<any, any, any, readonly PgResourceParameter[], any>;
        }
        interface InflectionCustomFieldArgumentDetails {
            resource: PgResource<any, any, any, readonly PgResourceParameter[], any>;
            param: PgResourceParameter;
            index: number;
        }
        interface InflectionCustomFieldMutationResult {
            resource: PgResource<any, any, any, readonly PgResourceParameter[], any>;
            returnGraphQLTypeName: string;
        }
        interface Inflection {
            _functionName(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            customMutationField(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            customMutationPayload(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            customMutationInput(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            customQueryField(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            customQueryConnectionField(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            customQueryListField(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            computedAttributeField(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            computedAttributeConnectionField(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            computedAttributeListField(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            argument(this: Inflection, details: InflectionCustomFieldArgumentDetails): string;
            recordFunctionConnectionType(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            scalarFunctionConnectionType(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            recordFunctionEdgeType(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            scalarFunctionEdgeType(this: Inflection, details: InflectionCustomFieldProcedureDetails): string;
            functionMutationResultFieldName(this: Inflection, details: InflectionCustomFieldMutationResult): string;
        }
        interface SchemaOptions {
            pgFunctionsPreferNodeId?: boolean;
        }
    }
}
declare global {
    namespace GraphileBuild {
        interface Build {
            [$$rootQuery]: Array<PgResource<any, any, any, any, any>>;
            [$$rootMutation]: Array<PgResource<any, any, any, any, any>>;
            [$$computed]: Map<PgCodec<any, any, any, any, any, any, any>, Array<PgResource<any, any, any, any, any>>>;
        }
    }
}
export declare const PgCustomTypeFieldPlugin: GraphileConfig.Plugin;
export {};
//# sourceMappingURL=PgCustomTypeFieldPlugin.d.ts.map