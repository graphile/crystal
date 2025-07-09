import type { FieldNode, GraphQLObjectType, SelectionNode } from "graphql";
import type { OperationPlan } from "./index.js";
/**
 * Given a list of polymorphic selections, return a list of the nested field
 * selections that apply to the object type `type`.
 */
export declare function fieldSelectionsForType(operationPlan: OperationPlan, type: GraphQLObjectType, selections: ReadonlyArray<SelectionNode>, result?: Array<FieldNode>): ReadonlyArray<FieldNode>;
//# sourceMappingURL=graphqlMergeSelectionSets.d.ts.map