import type { AsyncExecutionResult, ExecutionResult } from "grafast/graphql";
import * as graphql from "grafast/graphql";
import type { MaskErrorFn } from "./interfaces";
export declare function defaultMaskError(error: graphql.GraphQLError): graphql.GraphQLError;
export declare const makeMaskError: (callback: MaskErrorFn) => MaskErrorFn;
export declare function optionsFromConfig(config: GraphileConfig.ResolvedPreset): {
    resolvedPreset: GraphileConfig.ResolvedPreset;
    outputDataAsString: boolean;
    graphqlPath: string;
    graphqlOverGET: boolean;
    graphiql: boolean;
    graphiqlOnGraphQLGET: boolean;
    graphiqlPath: string;
    watch: boolean;
    eventStreamPath: string;
    maxRequestLength: number;
    explain: boolean | string[] | undefined;
    schemaWaitTime: number;
    maskError: MaskErrorFn;
    maskPayload: (payload: any) => any;
    maskIterator: (result: AsyncGenerator<AsyncExecutionResult>) => AsyncGenerator<AsyncExecutionResult>;
    maskExecutionResult: (result: ExecutionResult | AsyncGenerator<AsyncExecutionResult>) => any;
};
export type OptionsFromConfig = ReturnType<typeof optionsFromConfig>;
//# sourceMappingURL=options.d.ts.map