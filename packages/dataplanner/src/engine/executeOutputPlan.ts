import * as assert from "assert";
import { GraphQLError } from "graphql";
import { inspect } from "util";

import type { Bucket, RequestContext } from "../bucket";
import { isDev } from "../dev";
import type { CrystalError } from "../error";
import { newFieldError } from "../error";
import { newCrystalError } from "../error";
import { isCrystalError } from "../error";
import type { PromiseOrDirect } from "../interfaces";
import { $$concreteType } from "../interfaces";
import { isPolymorphicData } from "../polymorphic";
import { arrayOfLength } from "../utils";
import type { LayerPlan } from "./LayerPlan";
import type { OutputPlan } from "./OutputPlan";

export type OutputPath = Array<string | number>;
export interface OutputStream {
  asyncIterable: AsyncIterableIterator<any>;
}

/** @internal */
export interface OutputResult {
  data?: any;
  streams: OutputStream[];
  errors: OutputError[];
}

// /**
//  * When we take a plan result and store it to the result tree, for non-leaf
//  * plans we're either storing a list or an object. What the underlying plan
//  * represents this as is irrelevant - e.g. a plan for an object type might
//  * return a tuple instead of an object; this is fine - we should still add an
//  * object to the result tree.
//  *
//  * Where possible we try and "merge" the result with the previous result.
//  *
//  * @internal
//  */
// export function bucketValue(
//   operationPlan: OperationPlan,
//   object: object,
//   key: string | number,
//   value: any,
//   spec: OutputPlanChild,
//   concreteType: string | null,
//   // This gets called if any of the non-null constraints are failed, or if
//   // there was an error. This triggers processing through the GraphQL.js stack.
//   requestContext: RequestContext,
//   // `null` here would imply a non-null error
//   onErrorOrNonNullViolation: (errorOrNull: CrystalError | null) => void,
// ): any {
//   const handleNullOrError = (nullOrError: undefined | null | CrystalError) => {
//     if (spec.isNonNull || nullOrError != null) {
//       // Add an error
//       onErrorOrNonNullViolation(nullOrError ?? null);
//     }
//     // DO NOT RETURN `undefined`!
//     return null;
//   };
//   if (isCrystalError(value)) {
//     return handleNullOrError(value);
//   }
//   if (value == null) {
//     return handleNullOrError(value);
//   }
//   switch (spec.mode) {
//     case "root": {
//       return Object.create(null);
//     }
//     case "array": {
//       if (Array.isArray(value)) {
//         return arrayOfLength(value.length);
//       } else {
//         console.warn(
//           `Hit fallback for value ${inspect(value)} coercion to mode ${
//             spec.mode
//           }`,
//         );
//         return handleNullOrError(null);
//       }
//     }
//     case "object": {
//       const typeName = isPolymorphicData(value)
//         ? value[$$concreteType]
//         : concreteType;
//       return spec.objectCreator(typeName);
//     }
//     case "leaf": {
//       if (requestContext.insideGraphQL) {
//         // Do not serialize inside GraphQL, GraphQL will do that for us (and handle any errors)
//         return value;
//       } else {
//         try {
//           return spec.serialize(value);
//         } catch (e) {
//           return handleNullOrError(newCrystalError(e, null));
//         }
//       }
//     }
//     case "null": {
//       if (spec.isNonNull) {
//         return handleNullOrError(null);
//       } else {
//         return null;
//       }
//     }
//     case "__typename": {
//       if (isPolymorphicData(value)) {
//         return value[$$concreteType];
//       } else {
//         // TODO: return the know __typename here
//         throw new Error("TODO");
//       }
//     }
//     case "introspection": {
//       const {
//         isNonNull,
//         field: rawField,
//         introspectionCacheByVariableValues,
//         variableNames,
//       } = spec;
//       const field: FieldNode = {
//         ...rawField,
//         alias: { kind: Kind.NAME, value: "a" },
//       };
//       const document: DocumentNode = {
//         definitions: [
//           {
//             kind: Kind.OPERATION_DEFINITION,
//             operation: OperationTypeNode.QUERY,
//             selectionSet: {
//               kind: Kind.SELECTION_SET,
//               selections: [field],
//             },
//           },
//         ],
//         kind: Kind.DOCUMENT,
//       };
//       const variableValues: Record<string, any> = {};
//       for (const variableName of variableNames) {
//         variableValues[variableName] = variables[variableName];
//       }
//       const canonical = canonicalJSONStringify(variableValues);
//       const cached = introspectionCacheByVariableValues.get(canonical);
//       if (cached) {
//         return cached;
//       }
//       const graphqlResult = executeSync({
//         schema: operationPlan.schema,
//         document,
//         variableValues,
//       });
//       if (graphqlResult.errors) {
//         throw new Error("INTROSPECTION FAILED!");
//       }
//       const result = graphqlResult.data!.a;
//       introspectionCacheByVariableValues.set(canonical, result);
//       return result;
//     }
//     default: {
//       const never: never = spec;
//       throw new Error(
//         `GraphileInternalError<31d26531-b20f-434c-91d8-686048da404c>: Unhandled bucket spec '${
//           (never as any).mode
//         }'`,
//       );
//     }
//   }
// }

/**
 * To help us avoid having too many promises/awaits/etc, we add our work to the
 * queue and then exhaust the queue as much as we can synchronously.
 */
interface NextStep {
  /** path */
  p: Array<string | number>;
  /** target */
  t: object;
  /** key */
  k: string;
  /** outputPlan */
  o: OutputPlan;
  /** streams */
  s: OutputStream[];
  /** errors */
  e: OutputError[];
}

type NextStepByLayerPlan = { [layerPlanId: number]: NextStep[] };

interface PayloadRoot {
  streams: OutputStream[];
  errors: GraphQLError[];
}

class NullHandler {
  root: PayloadRoot | null = null;
  children: NullHandler[] = [];
  callbacks: Array<() => void> = [];
  constructor(
    public parentNullHandler: NullHandler | null,
    private isNonNull: boolean,
    private path: ReadonlyArray<string | number>,
  ) {
    if (parentNullHandler) {
      this.root = parentNullHandler.root;
      parentNullHandler.children.push(this);
    }
  }
  abort() {
    this.stopEverything();
    for (const child of this.children) {
      child.abort();
    }
  }
  /**
   * Call with `null` if nullable, otherwise with a GraphQLError.
   */
  handle(value: null | undefined | GraphQLError): null {
    if (!this.root) {
      throw new Error(
        "GraphileInternalError<78cf93c0-f71f-4232-a708-ef6f475b0bf7>: Invalid NullHandler",
      );
    }
    if (value || this.isNonNull) {
      this.root.errors.push(
        value ??
          new GraphQLError(
            // TODO: properly populate this error!
            "non-null violation",
            null,
            null,
            null,
            this.path,
            null,
            null,
          ),
      );
    }
    this.abort();
    return null;
  }
  onAbort(cb: () => void) {
    this.callbacks.push(cb);
  }
  stopEverything() {
    const callbacks = this.callbacks.splice(0, this.callbacks.length);
    for (const cb of callbacks) {
      cb();
    }
  }
}

interface OutputPlanContext extends RequestContext {
  root: PayloadRoot;
  queue: Array<SubsequentPayloadSpec>;
  path: ReadonlyArray<string | number>;
  nullHander: NullHandler;
}

interface SubsequentPayloadSpec {
  ctx: OutputPlanContext;
  bucket: Bucket;
  bucketIndex: number;
  outputPlan: OutputPlan;
}

// TODO: to start with we're going to do looping here; but later we can compile
// the output plans (even nested ones) into simple functions that just generate
// the resulting objects directly without looping.
/**
 * @internal
 */
export function executeOutputPlan(
  ctx: OutputPlanContext,
  outputPlan: OutputPlan,
  bucket: Bucket,
  bucketIndex: number,
): unknown {
  assert.strictEqual(
    bucket.isComplete,
    true,
    "Can only process an output plan for a completed bucket",
  );
  const bucketRootValue = bucket.store[outputPlan.rootStepId][bucketIndex];

  if (isCrystalError(bucketRootValue)) {
    // > If the field returns null because of a field error which has already
    // > been added to the "errors" list in the response, the "errors" list must
    // > not be further affected. That is, only one error should be added to the
    // > errors list per field.
    // -- https://spec.graphql.org/draft/#sel-EANTNDLAACNAn7V
    return ctx.nullHander.handle(
      new GraphQLError(
        bucketRootValue.message,
        null,
        null,
        null,
        ctx.path,
        bucketRootValue,
        null,
      ),
    );
  }
  switch (outputPlan.type.mode) {
    case "root":
    case "object":
    case "polymorphic": {
      let typeName: string;
      if (outputPlan.type.mode === "root") {
        typeName = outputPlan.type.typeName;
      } else if (bucketRootValue == null) {
        return null;
      } else if (outputPlan.type.mode === "object") {
        typeName = outputPlan.type.typeName;
      } else {
        assert.ok(
          isPolymorphicData(bucketRootValue),
          "Expected polymorphic data",
        );
        typeName = bucketRootValue[$$concreteType];
        assert.ok(typeName, "Could not determine concreteType for object");
      }
      const data = outputPlan.objectCreator!(typeName);
      for (const [key, spec] of Object.entries(outputPlan.keys[typeName])) {
        // __typename already handled
        if (spec.type === "outputPlan") {
          const newPath = [...ctx.path, key];
          const childCtx: OutputPlanContext = {
            ...ctx,
            path: newPath,
            nullHander: new NullHandler(
              ctx.nullHander,
              spec.isNonNull,
              newPath,
            ),
          };
          try {
            const t = spec.outputPlan.layerPlan.reason.type;
            if (isDev) {
              if (
                t === "subroutine" ||
                t === "subscription" ||
                t === "stream" ||
                t === "defer"
              ) {
                throw new Error(
                  `GraphileInternalError<d6b9555c-f173-4b18-96e5-8abe56760fb3>: should never see a ${t} here`,
                );
              }

              if (
                t !== "root" &&
                t !== "polymorphic" &&
                t !== "list" &&
                t !== "mutationField"
              ) {
                const never: never = t;
                throw new Error(
                  `GraphileInternalError<992ffd55-dc1a-46e5-9df8-cc6a62901386>: unexpected layerplan reason '${never}'`,
                );
              }
            }

            // Already executed; building a single payload from the result
            const childOutputPlan = spec.outputPlan;
            if (childOutputPlan.layerPlan === outputPlan.layerPlan) {
              const [childBucket, childBucketIndex] = [bucket, bucketIndex];
              const result =
                executeOutputPlan(
                  childCtx,
                  childOutputPlan,
                  childBucket,
                  childBucketIndex,
                ) ?? null;
              if (result === null && spec.isNonNull) {
                throw new GraphQLError(
                  // TODO: properly populate this error!
                  "non-null violation",
                  null,
                  null,
                  null,
                  childCtx.path,
                  null,
                  null,
                );
              }
              if (
                childOutputPlan.type.mode === "array" &&
                childOutputPlan.type.streamedOutputPlan
              ) {
                // Add the stream to the queue
                const queueItem: SubsequentPayloadSpec = {
                  ctx: childCtx,
                  bucket,
                  bucketIndex,
                  outputPlan: childOutputPlan.type.streamedOutputPlan,
                };
                childCtx.queue.push(queueItem);
                childCtx.nullHander.onAbort(() => {
                  // Remove stream from the queue before it even starts
                  childCtx.queue.splice(childCtx.queue.indexOf(queueItem), 1);
                });
              }
              data[key] = result;
            } else {
              throw new Error("TODO");
            }
          } catch (e) {
            // Ensure it's a GraphQL error
            const error =
              e instanceof GraphQLError
                ? e
                : new GraphQLError(
                    e.message,
                    null,
                    null,
                    null,
                    childCtx.path,
                    e,
                    null,
                  );
            if (spec.isNonNull) {
              // Bubble
              throw error;
            } else {
              // Add to errors, cancel any nested deferreds, return null
              return childCtx.nullHander.handle(error);
            }
          }
        }
      }

      // Everything seems okay; queue any deferred payloads
      for (const defer of outputPlan.deferredOutputPlans) {
        // Add the stream to the queue
        const queueItem: SubsequentPayloadSpec = {
          ctx,
          bucket,
          bucketIndex,
          outputPlan: defer,
        };
        ctx.queue.push(queueItem);
        ctx.nullHander.onAbort(() => {
          // Remove defer from the queue before it even starts
          ctx.queue.splice(ctx.queue.indexOf(queueItem), 1);
        });
      }

      break;
    }
    case "array": {
    }
    case "null": {
    }
    case "leaf": {
    }
  }
  return null as any;
}
