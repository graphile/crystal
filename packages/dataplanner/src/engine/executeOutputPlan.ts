import * as assert from "assert";
import type { DocumentNode, FieldNode } from "graphql";
import { executeSync, GraphQLError, Kind, OperationTypeNode } from "graphql";
import { inspect } from "util";

import type { Bucket, RequestContext } from "../bucket.js";
import { isDev } from "../dev.js";
import { isCrystalError } from "../error.js";
import type { PromiseOrDirect } from "../interfaces.js";
import { $$concreteType } from "../interfaces.js";
import { isPolymorphicData } from "../polymorphic.js";
import type { OutputPlan } from "./OutputPlan.js";

export type OutputPath = Array<string | number>;
export interface OutputStream {
  asyncIterable: AsyncIterableIterator<any>;
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
 * @internal
 */
interface PayloadRoot {
  /**
   * The errors that have occurred; these are proper GraphQLErrors and will be
   * returned directly to clients so they must be complete.
   */
  errors: GraphQLError[];
  /**
   * Stream/defer queues - we don't start executing these until after the main
   * payload is completed (to allow for a non-null boundary to abort
   * execution).
   */
  queue: Array<SubsequentPayloadSpec>;

  /**
   * VERY DANGEROUS. This is _only_ to pass variables through to introspection
   * selections, it shouldn't be used for anything else.
   *
   * @internal
   * */
  variables: { [key: string]: any };
}

/** @internal */
export class NullHandler {
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

export interface OutputPlanContext extends RequestContext {
  root: PayloadRoot;
  path: ReadonlyArray<string | number>;
  nullRoot: NullHandler;
}

export interface SubsequentPayloadSpec {
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
): PromiseOrDirect<unknown> {
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
    throw new GraphQLError(
      bucketRootValue.message,
      null,
      null,
      null,
      ctx.path,
      bucketRootValue,
      null,
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
      assert.ok(
        outputPlan.objectCreator,
        `GraphileInternalError<2c75b7a7-e78d-47bb-936c-b6e030452d30>: ${outputPlan}.objectCreator was not constructed yet`,
      );
      const data = outputPlan.objectCreator(typeName);
      for (const [key, spec] of Object.entries(outputPlan.keys[typeName])) {
        if (spec.type === "__typename") {
          // __typename already handled
          continue;
        }
        if (isDev) {
          assert.strictEqual(spec.type, "outputPlan");
        }
        const newPath = [...ctx.path, key];
        const childOutputPlan = spec.outputPlan;
        const childCtx: OutputPlanContext = {
          ...ctx,
          path: newPath,
          nullRoot: spec.isNonNull
            ? ctx.nullRoot
            : new NullHandler(ctx.nullRoot, spec.isNonNull, newPath),
        };

        const doIt = (): unknown => {
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
              t !== "listItem" &&
              t !== "mutationField"
            ) {
              const never: never = t;
              throw new Error(
                `GraphileInternalError<992ffd55-dc1a-46e5-9df8-cc6a62901386>: unexpected layerplan reason '${never}'`,
              );
            }
          }

          const [childBucket, childBucketIndex] = getChildBucketAndIndex(
            childOutputPlan,
            outputPlan,
            bucket,
            bucketIndex,
          );

          const result =
            executeOutputPlan(
              childCtx,
              childOutputPlan,
              childBucket,
              childBucketIndex,
            ) ?? null;
          return result;
        };

        data[key] = doItHandleNull(spec.isNonNull, doIt, childCtx);
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
        ctx.root.queue.push(queueItem);
        ctx.nullRoot.onAbort(() => {
          // Remove defer from the queue before it even starts
          ctx.root.queue.splice(ctx.root.queue.indexOf(queueItem), 1);
        });
      }

      return data;
    }
    case "array": {
      if (!Array.isArray(bucketRootValue)) {
        if (bucketRootValue != null) {
          console.warn(
            `Hit fallback for value ${inspect(
              bucketRootValue,
            )} coercion to mode ${outputPlan.type.mode}`,
          );
        }
        return null;
      }

      const data = [];
      const l = bucketRootValue.length;
      const childOutputPlan = outputPlan.child;
      const childIsNonNull = outputPlan.childIsNonNull;
      if (!childOutputPlan) {
        throw new Error(
          "GraphileInternalError<48fabdc8-ce84-45ec-ac20-35a2af9098e0>: No child output plan for list bucket?",
        );
      }

      // Now to populate the children...
      for (let i = 0; i < l; i++) {
        const [childBucket, childBucketIndex] = getChildBucketAndIndex(
          childOutputPlan,
          outputPlan,
          bucket,
          bucketIndex,
          i,
        );
        const newPath = [...ctx.path, i];
        const childCtx = {
          ...ctx,
          path: newPath,
          nullRoot: childIsNonNull
            ? ctx.nullRoot
            : new NullHandler(ctx.nullRoot, childIsNonNull, newPath),
        };
        const doIt = () =>
          executeOutputPlan(
            childCtx,
            childOutputPlan,
            childBucket,
            childBucketIndex,
          ) ?? null;
        data[i] = doItHandleNull(childIsNonNull, doIt, childCtx);
      }

      if (outputPlan.type.streamedOutputPlan) {
        // Add the stream to the queue
        const queueItem: SubsequentPayloadSpec = {
          ctx,
          bucket,
          bucketIndex,
          outputPlan: outputPlan.type.streamedOutputPlan,
        };
        ctx.root.queue.push(queueItem);
        ctx.nullRoot.onAbort(() => {
          // Remove stream from the queue before it even starts
          ctx.root.queue.splice(ctx.root.queue.indexOf(queueItem), 1);
        });
      }
      return data;
    }
    case "null": {
      return null;
    }
    case "leaf": {
      if (ctx.insideGraphQL) {
        // Don't serialize to avoid the double serialization problem
        return bucketRootValue;
      } else {
        return outputPlan.type.serialize(bucketRootValue);
      }
    }
    case "introspection": {
      const {
        field: rawField,
        introspectionCacheByVariableValues,
        variableNames,
      } = outputPlan.type;
      const field: FieldNode = {
        ...rawField,
        alias: { kind: Kind.NAME, value: "a" },
      };
      const document: DocumentNode = {
        definitions: [
          {
            kind: Kind.OPERATION_DEFINITION,
            operation: OperationTypeNode.QUERY,
            selectionSet: {
              kind: Kind.SELECTION_SET,
              selections: [field],
            },
          },
          ...Object.values(outputPlan.layerPlan.operationPlan.fragments),
        ],

        kind: Kind.DOCUMENT,
      };
      const variableValues: Record<string, any> = {};
      for (const variableName of variableNames) {
        variableValues[variableName] = ctx.root.variables[variableName];
      }
      // TODO: make this canonical
      const canonical = JSON.stringify(variableValues);
      const cached = introspectionCacheByVariableValues.get(canonical);
      if (cached) {
        return cached;
      }
      const graphqlResult = executeSync({
        schema: outputPlan.layerPlan.operationPlan.schema,
        document,
        variableValues,
      });
      if (graphqlResult.errors) {
        console.error("INTROSPECTION FAILED!");
        console.error(graphqlResult);
        throw new GraphQLError("INTROSPECTION FAILED!");
      }
      const result = graphqlResult.data!.a;
      introspectionCacheByVariableValues.set(canonical, result);
      return result;
    }
    default: {
      const never: never = outputPlan.type;
      throw new Error(
        `GraphileInternalError<e6c19c03-6d13-4568-929e-d9deac9214a3>: don't know how to handle ${inspect(
          never,
        )}`,
      );
    }
  }
}

function doItHandleNull(
  isNonNull: boolean,
  doIt: () => unknown,
  ctx: OutputPlanContext,
) {
  if (isNonNull) {
    // No try/catch for us, raise to the parent if need be
    const result = doIt();
    if (result === null) {
      throw new GraphQLError(
        // TODO: properly populate this error!
        "non-null violation",
        null,
        null,
        null,
        ctx.path,
        null,
        null,
      );
    }
    return result;
  } else {
    // We're nullable, we can catch errors!
    try {
      // If it's null, that's fine - we're nullable!
      return doIt();
    } catch (e) {
      // Ensure it's a GraphQL error
      const error =
        e instanceof GraphQLError
          ? e
          : new GraphQLError(e.message, null, null, null, ctx.path, e, null);
      // Handle the error
      return ctx.nullRoot.handle(error);
    }
  }
}

function getChildBucketAndIndex(
  childOutputPlan: OutputPlan,
  outputPlan: OutputPlan,
  bucket: Bucket,
  bucketIndex: number,
  arrayIndex: number | null = null,
): [Bucket, number] {
  if ((arrayIndex == null) === (outputPlan.type.mode === "array")) {
    throw new Error(
      "GraphileInternalError<83d0e3cc-7eec-4185-85b4-846540288162>: arrayIndex must be supplied iff outputPlan is an array",
    );
  }
  if (childOutputPlan.layerPlan === outputPlan.layerPlan) {
    // Same layer; straightforward
    return [bucket, bucketIndex];
  }

  if (childOutputPlan.type.mode === "polymorphic") {
    // TODO
  }
  if (childOutputPlan.type.mode === "array") {
    // TODO
  }

  // Need to execute new output plan against a different bucket
  throw new Error("TODO");
}
