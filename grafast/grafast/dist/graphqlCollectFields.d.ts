import type { DirectiveNode } from "graphql";
import type { __TrackedValueStep } from "./steps/index.js";
export declare function evalDirectiveArgDirect<T = unknown>(directive: DirectiveNode, argumentName: string, variableValuesStep: __TrackedValueStep, defaultValue: T): T | undefined;
export declare function newSelectionSetDigest(resolverEmulation: boolean): {
    label: undefined;
    fields: Map<any, any>;
    deferred: undefined;
    resolverEmulation: boolean;
};
//# sourceMappingURL=graphqlCollectFields.d.ts.map