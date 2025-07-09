import type { GraphQLSchema, OperationDefinitionNode } from "graphql";
import { OperationPlan } from "./index.js";
import type { BaseGraphQLRootValue, BaseGraphQLVariables, Fragments } from "./interfaces.js";
/**
 * Implements the `EstablishOpPlan` algorithm.
 *
 * @remarks Though EstablishOpPlan accepts document and operationName, we
 * instead accept operation and fragments since they're easier to get a hold of
 * in GraphQL.js.
 */
export declare function establishOperationPlan<TVariables extends BaseGraphQLVariables = BaseGraphQLVariables, TContext extends Grafast.Context = Grafast.Context, TRootValue extends BaseGraphQLRootValue = BaseGraphQLRootValue>(schema: GraphQLSchema, operation: OperationDefinitionNode, fragments: Fragments, variableValues: TVariables, context: TContext, rootValue: TRootValue, planningTimeout?: number | null): OperationPlan;
//# sourceMappingURL=establishOperationPlan.d.ts.map