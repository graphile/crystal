import type { GraphQLType, ListTypeNode, NamedTypeNode, NonNullTypeNode } from "graphql";
import type { OperationPlan } from "./engine/OperationPlan.js";
import type { AnyInputStep } from "./interfaces.js";
export declare function assertInputStep(itemPlan: unknown): asserts itemPlan is AnyInputStep;
export declare function graphqlGetTypeForNode(operationPlan: OperationPlan, node: NamedTypeNode | ListTypeNode | NonNullTypeNode): GraphQLType;
//# sourceMappingURL=input.d.ts.map