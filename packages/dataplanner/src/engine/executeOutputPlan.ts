import * as assert from "assert";
import type { DocumentNode, FieldNode } from "graphql";
import { executeSync, GraphQLError, Kind, OperationTypeNode } from "graphql";
import { inspect } from "util";

import type { Bucket, RequestContext } from "../bucket.js";
import { isDev } from "../dev.js";
import { isCrystalError } from "../error.js";
import type { JSONValue, LocationDetails } from "../interfaces.js";
import { $$concreteType, $$streamMore } from "../interfaces.js";
import { isPolymorphicData } from "../polymorphic.js";
import type { LayerPlan } from "./LayerPlan.js";
import type { OutputPlan } from "./OutputPlan.js";

export type OutputPath = Array<string | number>;
export interface OutputStream {
  asyncIterable: AsyncIterableIterator<any>;
}

/**
 * PayloadRoot handles the root-level of a payload, it's ultimately responsible
 * for sharing the `data`/`errors` with the user. But it also handles the
 * intermediate payloads for stream/defer.
 *
 * A standard GraphQL query/mutation request (one that doesn't use
 * `@stream`/`@defer`) will have just one payload. A standard GraphQL
 * subscription request gets one payload per subscription event.
 *
 * When we mix `@stream` and `@defer` into this, we will require (often quite a
 * lot) more payloads.
 *
 * @internal
 */
export interface PayloadRoot {
  /**
   * The errors that have occurred; these are proper GraphQLErrors and will be
   * returned directly to clients so they must be complete.
   */
  errors: GraphQLError[];

  /**
   * Defer queue - we don't start executing these until after the main
   * payload is completed (to allow for a non-null boundary to abort
   * execution).
   */
  queue: Array<SubsequentPayloadSpec>;

  /**
   * Stream queue - we don't start executing these until after the main
   * payload is completed (to allow for a non-null boundary to abort
   * execution).
   */
  streams: Array<SubsequentStreamSpec>;

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
    private path: readonly (string | number)[],
    private locationDetails: LocationDetails,
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
        value ?? nonNullError(this.locationDetails, this.path),
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

export interface OutputPlanContext {
  requestContext: RequestContext;
  root: PayloadRoot;
  path: ReadonlyArray<string | number>;
  nullRoot: NullHandler;
}

export interface SubsequentPayloadSpec {
  ctx: OutputPlanContext;
  bucket: Bucket;
  bucketIndex: number;
  outputPlan: OutputPlan;
  label: string | undefined;
}

export interface SubsequentStreamSpec {
  stream: AsyncIterableIterator<any>;
  startIndex: number;
  ctx: OutputPlanContext;
  bucket: Bucket;
  bucketIndex: number;
  listItemStepId: number;
  outputPlan: OutputPlan;
  label: string | undefined;
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
): JSONValue {
  assert.strictEqual(
    bucket.isComplete,
    true,
    "Can only process an output plan for a completed bucket",
  );
  const entry = bucket.store[outputPlan.rootStepId];
  if (!entry) {
    console.dir(bucket.store);
    throw new Error(
      `GraphileInternalError<aa9cde16-67da-4f30-9f63-3b3cbb7cb0b9>: No store entry for bucket(${bucket.layerPlan.id}/${bucket.layerPlan.reason.type})'s outputPlan.rootStepId ${outputPlan.rootStepId} (layer rootStepId: ${bucket.layerPlan.rootStepId})`,
    );
  }
  const bucketRootValue = entry[bucketIndex];

  if (isCrystalError(bucketRootValue)) {
    // > If the field returns null because of a field error which has already
    // > been added to the "errors" list in the response, the "errors" list must
    // > not be further affected. That is, only one error should be added to the
    // > errors list per field.
    // -- https://spec.graphql.org/draft/#sel-EANTNDLAACNAn7V
    throw new GraphQLError(
      bucketRootValue.originalError.message,
      outputPlan.locationDetails.node, // node
      undefined, // source
      null, // positions
      ctx.path, // path
      bucketRootValue.originalError, // originalError
      null, // extensions
    );
  }
  switch (outputPlan.type.mode) {
    case "root":
    case "object": {
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
            : new NullHandler(
                ctx.nullRoot,
                spec.isNonNull,
                newPath,
                spec.locationDetails,
              ),
        };

        const doIt = (): JSONValue => {
          const t = spec.outputPlan.layerPlan.reason.type;
          if (isDev) {
            if (t === "subroutine" || t === "subscription") {
              throw new Error(
                `GraphileInternalError<d6b9555c-f173-4b18-96e5-8abe56760fb3>: should never see a ${t} here`,
              );
            }

            if (
              t !== "defer" &&
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

        data[key] = doItHandleNull(
          spec.isNonNull,
          doIt,
          childCtx,
          outputPlan.locationDetails,
        );
      }

      // Everything seems okay; queue any deferred payloads
      for (const defer of outputPlan.deferredOutputPlans) {
        // Add the stream to the queue
        const queueItem: SubsequentPayloadSpec = {
          ctx,
          bucket,
          bucketIndex,
          outputPlan: defer,
          label: defer.type.deferLabel,
        };
        ctx.root.queue.push(queueItem);
        ctx.nullRoot.onAbort(() => {
          // Remove defer from the queue before it even starts
          ctx.root.queue.splice(ctx.root.queue.indexOf(queueItem), 1);
        });
      }

      return data;
    }
    case "polymorphic": {
      if (bucketRootValue == null) {
        return null;
      }
      assert.ok(
        isPolymorphicData(bucketRootValue),
        "Expected polymorphic data",
      );
      const typeName = bucketRootValue[$$concreteType];
      assert.ok(
        typeName,
        "GraphileInternalError<fd3f3cf0-0789-4c74-a6cd-839c808896ed>: Could not determine concreteType for object",
      );
      const childOutputPlan = outputPlan.childByTypeName[typeName];
      assert.ok(
        childOutputPlan,
        `GraphileInternalError<a46999ef-41ff-4a22-bae9-fa37ff6e5f7f>: Could not determine the OutputPlan to use for '${typeName}' from '${bucket.layerPlan}'`,
      );
      const [childBucket, childBucketIndex] = getChildBucketAndIndex(
        childOutputPlan,
        outputPlan,
        bucket,
        bucketIndex,
      );
      const newPath = [...ctx.path];
      const childCtx: OutputPlanContext = {
        ...ctx,
        path: newPath,
        nullRoot: ctx.nullRoot,
      };

      const result =
        executeOutputPlan(
          childCtx,
          childOutputPlan,
          childBucket,
          childBucketIndex,
        ) ?? null;
      return result;
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
            : new NullHandler(
                ctx.nullRoot,
                childIsNonNull,
                newPath,
                outputPlan.locationDetails,
              ),
        };
        const doIt = () =>
          executeOutputPlan(
            childCtx,
            childOutputPlan,
            childBucket,
            childBucketIndex,
          ) ?? null;
        data[i] = doItHandleNull(
          childIsNonNull,
          doIt,
          childCtx,
          outputPlan.locationDetails,
        );
      }

      const stream = bucketRootValue[$$streamMore] as
        | AsyncIterableIterator<any>
        | undefined;
      if (stream) {
        // Stream
        assert.ok(
          childOutputPlan.layerPlan.reason.type === "listItem",
          "GraphileInternalError<b655ad6f-566a-480f-9802-1865bf0eaf0a>: bad assumption - expected stream to have listItem child",
        );
        const streamItem: SubsequentStreamSpec = {
          stream,
          ctx,
          bucket,
          bucketIndex,
          outputPlan: childOutputPlan,
          startIndex: bucketRootValue.length,
          label: childOutputPlan.layerPlan.reason.stream?.label,
          listItemStepId: childOutputPlan.layerPlan.rootStepId!,
        };
        ctx.root.streams.push(streamItem);
        ctx.nullRoot.onAbort(() => {
          // Remove stream from the queue before it even starts
          ctx.root.queue.splice(ctx.root.queue.indexOf(streamItem), 1);
        });
      }

      return data;
    }
    case "null": {
      return null;
    }
    case "leaf": {
      if (bucketRootValue == null) {
        return null;
      }
      if (ctx.requestContext.insideGraphQL) {
        // Don't serialize to avoid the double serialization problem
        return bucketRootValue;
      } else {
        return outputPlan.type.serialize(bucketRootValue) as JSONValue;
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
      const result = graphqlResult.data!.a as JSONValue;
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

function doItHandleNull<TVal extends JSONValue>(
  isNonNull: boolean,
  doIt: () => TVal,
  ctx: OutputPlanContext,
  locationDetails: LocationDetails,
): TVal | null {
  if (isNonNull) {
    // No try/catch for us, raise to the parent if need be
    const result = doIt();
    if (result == null) {
      throw nonNullError(locationDetails, ctx.path);
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
          ? e.path
            ? e
            : new GraphQLError(
                e.message,
                null,
                null,
                null,
                ctx.path,
                e.originalError,
                null,
              )
          : new GraphQLError(e.message, null, null, null, ctx.path, e, null);
      // Handle the error
      return ctx.nullRoot.handle(error);
    }
  }
}

function nonNullError(
  locationDetails: LocationDetails,
  path: readonly (string | number)[],
) {
  const { parentTypeName, fieldName, node } = locationDetails;
  if (!parentTypeName || !fieldName) {
    return new GraphQLError(
      // TODO: rename. Also this shouldn't happen?
      `GraphileInternalError<a3706bba-4f88-4643-8a47-2fe2eaaadbea>: null bubbled to root`,
      node,
      null,
      null,
      path,
      null,
      null,
    );
  }
  return new GraphQLError(
    `Cannot return null for non-nullable field ${parentTypeName}.${fieldName}.`,
    node,
    null,
    null,
    path,
    null,
    null,
  );
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

  const reversePath = [childOutputPlan.layerPlan];
  let current: LayerPlan | null = childOutputPlan.layerPlan;
  while (!bucket.children[current.id]) {
    current = current.parentLayerPlan;
    if (!current) {
      throw new Error(
        `GraphileInternalError<c354573b-7714-4b5b-9db1-0beae1074fec>: Could not find child for '${childOutputPlan.layerPlan}' in bucket for '${bucket.layerPlan}'`,
      );
    }
    reversePath.push(current);
  }

  let currentBucket = bucket;
  let currentIndex = bucketIndex;

  for (let i = reversePath.length - 1; i >= 0; i--) {
    const layerPlan = reversePath[i];
    const child = currentBucket.children[layerPlan.id];
    if (!child) {
      throw new Error(
        `GraphileInternalError<f26a3170-3849-4aca-9c0c-85229105da7b>: Could not find child for '${childOutputPlan.layerPlan}' in bucket for '${currentBucket.layerPlan}'`,
      );
    }

    const out = child.map.get(currentIndex);
    assert.ok(
      out != null,
      `GraphileInternalError<e955b964-7bad-4649-84aa-a2a076c6b9ea>: Could not find a matching entry in the map for bucket index ${currentIndex}`,
    );
    if (arrayIndex == null) {
      assert.ok(
        !Array.isArray(out),
        "GraphileInternalError<db189d32-bf8f-4e58-b55f-5c5ac3bb2381>: Was expecting an arrayIndex, but none was provided",
      );
      currentBucket = child.bucket;
      currentIndex = out;
    } else {
      assert.ok(
        Array.isArray(out),
        "GraphileInternalError<8190d09f-dc75-46ec-8162-b20ad516de41>: Cannot access array index in non-array",
      );
      assert.ok(
        out.length > arrayIndex,
        `GraphileInternalError<1f596c22-368b-4d0d-94df-fb3df632b064>: Attempted to retrieve array index '${arrayIndex}' which is out of bounds of array with length '${out.length}'`,
      );
      currentBucket = child.bucket;
      currentIndex = out[arrayIndex];
    }
  }
  return [currentBucket, currentIndex];
}
