import { Step } from "../step.js";
/**
 * If you want to use a step that might represent a list and you need all of
 * the `listItem` transforms to have already taken place (e.g. you're going to
 * send the result to an external service) rather than processing them through
 * the GraphQL response, then you may need to call `applyTransforms` on it.
 */
export declare function applyTransforms($step: Step): Step<any>;
//# sourceMappingURL=applyTransforms.d.ts.map