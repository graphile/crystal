import LRU from "@graphile/lru";
import type {
  DocumentNode,
  FieldNode,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLScalarType,
} from "graphql";
import * as graphql from "graphql";
import type { TE } from "tamedevil";
import te, { stringifyJSON, stringifyString } from "tamedevil";

import * as assert from "../assert.js";
import type { Bucket } from "../bucket.js";
import { isDev } from "../dev.js";
import { AccessStep, stepADependsOnStepB, stripAnsi } from "../index.js";
import { inspect } from "../inspect.js";
import type {
  ExecutionEntryFlags,
  JSONValue,
  LocationDetails,
} from "../interfaces.js";
import { $$concreteType, $$streamMore, FLAG_ERROR } from "../interfaces.js";
import { isPolymorphicData } from "../polymorphic.js";
import type { ExecutableStep } from "../step.js";
import { expressionSymbol } from "../steps/access.js";
import type { PayloadRoot } from "./executeOutputPlan.js";
import type { LayerPlan, LayerPlanReasonListItem } from "./LayerPlan.js";

const {
  executeSync,
  GraphQLBoolean,
  GraphQLError,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  isObjectType,
  Kind,
  OperationTypeNode,
} = graphql;

interface FieldTypeDigest {
  fieldType: "__typename" | "outputPlan!" | "outputPlan?";
  sameBucket: boolean;
}
export type OutputPlanTypeIntrospection = {
  mode: "introspection";
  /**
   * The GraphQL introspection field selection (may include arguments/etc). We
   * can build a GraphQL document from this and issue it to graphql-js rather
   * than replicating that effort.
   */
  field: FieldNode;
  /**
   * The names of the variables used in this document.
   */
  variableNames: string[];
  /**
   * No need to re-run the introspection each time, may as well cache it,
   * right?
   *
   * Key: canonical JSON stringify of the variables used.
   * Value: the GraphQL result (`{data, errors}`) for this.
   */
  introspectionCacheByVariableValues: LRU<string, JSONValue>;
};
export type OutputPlanTypeRoot = {
  /**
   * Always return `{}`
   */
  mode: "root";
  typeName: string;
};
export type OutputPlanTypeObject = {
  /**
   * Return `{}` if non-null
   */
  mode: "object";
  typeName: string;
  deferLabel: string | undefined;
};
export type OutputPlanTypePolymorphicObject = {
  /**
   * Return `{}` if non-null
   */
  mode: "polymorphic";
  typeNames: string[];
  deferLabel: string | undefined;
};
export type OutputPlanTypeArray = {
  /**
   * Return a list of the same length if an array
   */
  mode: "array";
};
export type OutputPlanTypeLeaf = {
  /**
   * Return the value.
   */
  mode: "leaf";
  // stepId: number;
  graphqlType: GraphQLScalarType | GraphQLEnumType;
};
export type OutputPlanTypeNull = {
  mode: "null";
  /** If true, we must always throw an error */
};

/**
 * Thanks to `@stream`, output plans must handle their own nullability concerns
 * and we might need an output plan for any of these:
 *
 * - A concrete object
 * - A polymorphic object
 * - A leaf (enum/scalar)
 * - Something we know will always be null
 * - A list of any of the above
 * - A list of lists
 *
 * In addition to the above, we also need to cover
 *
 * - The root object (which is like a concrete object, except it's never null)
 * - Introspection
 */
export type OutputPlanType =
  | OutputPlanTypeRoot
  | OutputPlanTypeObject
  | OutputPlanTypePolymorphicObject
  | OutputPlanTypeLeaf
  | OutputPlanTypeNull
  | OutputPlanTypeArray
  | OutputPlanTypeIntrospection;

export type OutputPlanKeyValueOutputPlan = {
  type: "outputPlan";
  outputPlan: OutputPlan;
  isNonNull: boolean;
  locationDetails: LocationDetails;
};
export type OutputPlanKeyValueTypeName = {
  type: "__typename";
  locationDetails: LocationDetails;
};
export type OutputPlanKeyValue =
  | OutputPlanKeyValueOutputPlan
  | OutputPlanKeyValueTypeName;
export type OutputPlanKeyValueOutputPlanWithCachedBits =
  OutputPlanKeyValueOutputPlan & {
    layerPlanId: number;
  };

/**
 * Defines a way of taking a layerPlan and converting it into an output value.
 *
 * The result of executing an output plan will be the following:
 *
 * - data?: the data for this layer, could be object, array or leaf (see OutputPlanMode)
 * - errors: a list of errors that occurred (if any), including path details _within the output plan_
 * - streams: a list of streams that were created
 */
export class OutputPlan<TType extends OutputPlanType = OutputPlanType> {
  /** For errors */
  public readonly locationDetails: LocationDetails;

  /**
   * The step that represents the root value. How this is used depends on the
   * OutputPlanMode.
   */
  public readonly rootStep: ExecutableStep;
  /**
   * If this output plan should resolve to an error if a side effect step
   * raises an error, this is that side effect.
   */
  public readonly sideEffectStep: ExecutableStep | null;

  /**
   * Appended to the root step when accessed to avoid the need for AccessSteps
   *
   * @internal
   */
  public processRoot: ((value: any, flags: ExecutionEntryFlags) => any) | null =
    null;

  /**
   * For root/object output plans, the keys to set on the resulting object
   * grouped by the concrete object type name.
   *
   * IMPORTANT: the order of these keys is significant, they MUST match the
   * order in the request otherwise we break GraphQL spec compliance!
   */
  public keys: {
    [key: string]:
      | OutputPlanKeyValueTypeName
      | OutputPlanKeyValueOutputPlanWithCachedBits;
  } = Object.create(null);

  /**
   * For list output plans, the output plan that describes the list children.
   */
  public child: OutputPlan | null = null;
  public childIsNonNull = false;

  /**
   * For polymorphic output plans, the Object output plan for each specific type.
   */
  public childByTypeName:
    | {
        [typeName: string]: OutputPlan<OutputPlanTypeObject>;
      }
    | undefined;

  /**
   * For object output plan types only.
   */
  public deferredOutputPlans: OutputPlan<
    OutputPlanTypeObject | OutputPlanTypePolymorphicObject
  >[] = [];

  constructor(
    public layerPlan: LayerPlan,
    /**
     * For root, this should always be an object.
     *
     * For object this could represent an object or null.
     *
     * For polymorphic this could represent a polymorphic object or null.
     *
     * For array it's the list itself (or null) and dictates the length of the result.
     *
     * For leaf, it's the leaf plan itself.
     *
     * For `introspection`, `null` it's irrelevant. Use `constant(null)` or whatever.
     */
    rootStep: ExecutableStep,
    public readonly type: TType,
    locationDetails: LocationDetails,
  ) {
    this.locationDetails = locationDetails;
    this.rootStep = rootStep;
    layerPlan.operationPlan.stepTracker.addOutputPlan(this);
    this.childByTypeName =
      this.type.mode === "polymorphic" ? Object.create(null) : undefined;

    // NOTE: this may be cleared during `this.finalize()`
    this.sideEffectStep = layerPlan.latestSideEffectStep;
  }

  public print(): string {
    const type = this.type;
    switch (type.mode) {
      case "root":
      case "object": {
        return `${this.toString()}\n${Object.entries(this.keys)
          .map(([fieldName, val]) => {
            return `.${fieldName}: ${
              val.type === "__typename" ? "" : val.isNonNull ? "!" : "?"
            }${
              val.type === "__typename"
                ? `__typename(${type.typeName})`
                : val.outputPlan.print().replace(/\n/g, "\n  ")
            }`;
          })
          .join("\n")}`;
      }
      case "polymorphic": {
        return `${this.toString()}\n${Object.entries(this.childByTypeName!)
          .map(([typeName, outputPlan]) => {
            return `? ${typeName}: ${outputPlan
              .print()
              .replace(/\n/g, "\n  ")}`;
          })
          .join("\n")}`;
      }
      case "array": {
        return `${this.toString()}\n  ${
          this.childIsNonNull ? "!" : "?"
        }${this.child!.print().replace(/\n/g, "\n  ")}`;
      }
      default: {
        return this.toString();
      }
    }
  }

  toString() {
    return `OutputPlan<${this.type.mode}${
      this.sideEffectStep ? `^${this.sideEffectStep.id}` : ""
    }∈${this.layerPlan.id}!${this.rootStep.id}>`;
  }

  addChild(
    type: GraphQLObjectType | null,
    key: string | null,
    child: OutputPlanKeyValue,
  ): void {
    if (this.type.mode === "root" || this.type.mode === "object") {
      if (isDev) {
        if (typeof key !== "string") {
          throw new Error(
            `GrafastInternalError<7334ec50-23dc-442a-8ffa-19664c9eb79f>: Key must be provided in ${this.type.mode} OutputPlan mode`,
          );
        }
        if (type == null) {
          throw new Error(
            `GrafastInternalError<638cebef-4ec6-49f4-b681-2f390fb1c0fc>: Type must be provided in ${this.type.mode} OutputPlan mode.`,
          );
        }
        if (!isObjectType(type)) {
          throw new Error(
            `GrafastInternalError<eaa87576-1d50-49be-990a-345a9b57b998>: Type must provided in ${this.type.mode} OutputPlan mode must be an object type, instead saw '${type}'.`,
          );
        }
        assert.ok(
          ["root", "object"].includes(this.type.mode),
          "Can only addChild on root/object output plans",
        );
        if (this.keys[key] !== undefined) {
          throw new Error(
            `GrafastInternalError<5ceecb19-8c2c-4797-9be5-9be1b207fa45>: child already set for key '${key}'`,
          );
        }
      }
      this.keys[key!] =
        child.type === "outputPlan"
          ? {
              ...child,
              layerPlanId: child.outputPlan.layerPlan.id,
            }
          : child;
    } else if (this.type.mode === "array") {
      if (isDev) {
        if (key != null) {
          throw new Error(
            `GrafastInternalError<7de67325-a02f-4619-b118-61bb2d84f33b>: Key must not be provided in ${this.type.mode} OutputPlan mode`,
          );
        }
        assert.ok(type == null, "Array should not specify type");
        if (this.child !== null) {
          throw new Error(
            `GrafastInternalError<07059d9d-a47d-441f-b834-683cca1d856a>: child already set`,
          );
        }
      }
      if (child.type === "outputPlan") {
        this.child = child.outputPlan;
        this.childIsNonNull = child.isNonNull;
      } else {
        throw new Error(
          `GrafastInternalError<7525c854-9145-4c6d-8d60-79c14f040519>: Array child must be an outputPlan`,
        );
      }
    } else if (this.type.mode === "polymorphic") {
      if (isDev) {
        assert.ok(
          type && this.type.typeNames.includes(type.name),
          "GrafastInternalError<566a34ac-1138-4dbf-943e-f704819431dd>: polymorphic output plan can only addChild for a matching type",
        );
        assert.strictEqual(
          key,
          null,
          "GrafastInternalError<4346ebda-a02d-4489-b767-7a6d621a73c7>: addChild for polymorphic OutputPlan should not specify a key",
        );
        assert.ok(
          child.type === "outputPlan",
          "GrafastInternalError<b29285da-fb07-4943-9038-708edc785041>: polymorphic OutputPlan child must be an outputPlan",
        );
        assert.ok(
          child.outputPlan.type.mode === "object",
          "GrafastInternalError<203469c6-4bfa-4cd1-ae82-cc5d0132ca16>: polymorphic OutputPlan child must be an object outputPlan",
        );
      }
      this.childByTypeName![type!.name] = (
        child as OutputPlanKeyValueOutputPlan
      ).outputPlan as OutputPlan<OutputPlanTypeObject>;
    } else {
      throw new Error(
        `GrafastInternalError<5667df5f-30b7-48d3-be3f-a0065ed9c05c>: Doesn't make sense to set a child in mode '${this.type.mode}'`,
      );
    }
  }

  getLayerPlans(layerPlans = new Set<LayerPlan>()): Set<LayerPlan> {
    // Find all the layerPlans referenced
    layerPlans.add(this.layerPlan);
    if (this.child !== null) {
      if (this.child.layerPlan != this.layerPlan) {
        this.child.getLayerPlans(layerPlans);
      } else {
        throw new Error(
          "GrafastInternalError<4013e05f-b8ed-41ea-a869-204232d02763>: how could the child be in the same layer?",
        );
      }
    }
    for (const key in this.keys) {
      const spec = this.keys[key];
      if (spec.type === "outputPlan") {
        if (spec.outputPlan.layerPlan !== this.layerPlan) {
          spec.outputPlan.getLayerPlans(layerPlans);
          layerPlans.add(spec.outputPlan.layerPlan);
        }
      }
    }
    return layerPlans;
  }

  makeNextStepByLayerPlan(): Record<number, any[]> {
    const layerPlans = this.getLayerPlans();
    const map = Object.create(null);
    for (const layerPlan of layerPlans) {
      map[layerPlan.id] = [];
    }
    return map;
  }

  // This gets replaced with a mode-specific executor
  execute(
    this: OutputPlan,
    _root: PayloadRoot,
    // By just reusing the same path over and over we don't need to allocate
    // more memory for more arrays; but we must be _incredibly_ careful to
    // ensure any changes to it are reversed.
    _mutablePath: ReadonlyArray<string | number>,
    _bucket: Bucket,
    _bucketIndex: number,
    _rawBucketRootValue?: any,
    _bucketRootFlags?: ExecutionEntryFlags,
  ): JSONValue {
    throw new Error(`OutputPlan.execute has yet to be built!`);
  }

  // This gets replaced with a mode-specific executor
  executeString(
    this: OutputPlan,
    _root: PayloadRoot,
    // By just reusing the same path over and over we don't need to allocate
    // more memory for more arrays; but we must be _incredibly_ careful to
    // ensure any changes to it are reversed.
    _mutablePath: ReadonlyArray<string | number>,
    _bucket: Bucket,
    _bucketIndex: number,
    _rawBucketRootValue?: any,
    _bucketRootFlags?: ExecutionEntryFlags,
  ): string {
    throw new Error(`OutputPlan.executeString has yet to be built!`);
  }

  optimize(): void {
    // This optimization works by ridding us of access steps at the very end of
    // paths and just accessing properties directly. In rare circumstances
    // involving untethered side effects in earlier versions this could lead to
    // errors being skipped and data generated previous to the error being
    // returned; but OutputPlans now check the latestSideEffectStep so this
    // should be safe aga.
    const $root = this.layerPlan.operationPlan.dangerouslyGetStep(
      this.rootStep.id,
    );
    if (
      $root instanceof AccessStep &&
      $root.fallback === undefined &&
      $root.implicitSideEffectStep === null
    ) {
      const expressionDetails:
        | [ReadonlyArray<string | number>, any]
        | undefined = ($root.unbatchedExecute! as any)[expressionSymbol];
      if (expressionDetails !== undefined) {
        // @ts-ignore
        const $parent: ExecutableStep = $root.getDep(0);
        this.layerPlan.operationPlan.stepTracker.setOutputPlanRootStep(
          this,
          $parent,
        );
        const [path, fallback] = expressionDetails;
        withFastExpression(path, fallback, (fn) => {
          this.processRoot = fn;
        });
      }
    }
  }

  finalize(): void {
    // Clear the sideEffectStep if the rootStep explicitly depends on it.
    // NOTE: this occurs here since more dependencies could have been added to
    // $root after `this` was created.
    const $sideEffect = this.sideEffectStep;
    if ($sideEffect) {
      const $root = this.rootStep;
      if (
        $root === $sideEffect ||
        $root.implicitSideEffectStep === $sideEffect ||
        stepADependsOnStepB($root, $sideEffect)
      ) {
        // It's marked readonly, but we override it anyway
        (this.sideEffectStep as ExecutableStep | null) = null;
      }
    }

    // Build the executor
    switch (this.type.mode) {
      case "null": {
        this.execute = nullExecutor;
        this.executeString = nullExecutorString;
        break;
      }
      case "leaf": {
        this.execute = leafExecutor;
        if (
          this.type.graphqlType.serialize === GraphQLID.serialize ||
          this.type.graphqlType.serialize === GraphQLString.serialize
        ) {
          // String types
          this.executeString = stringLeafExecutorString;
        } else if (this.type.graphqlType.serialize === GraphQLInt.serialize) {
          this.executeString = intLeafExecutorString;
        } else if (this.type.graphqlType.serialize === GraphQLFloat.serialize) {
          this.executeString = floatLeafExecutorString;
        } else if (
          this.type.graphqlType.serialize === GraphQLBoolean.serialize
        ) {
          // Boolean type
          this.executeString = booleanLeafExecutorString;
        } else {
          // PERF: we could probably optimize enums too
          this.executeString = leafExecutorString;
        }
        break;
      }
      case "introspection": {
        this.execute = introspectionExecutor;
        this.executeString = introspectionExecutorString;
        break;
      }
      case "polymorphic": {
        this.execute = polymorphicExecutor;
        this.executeString = polymorphicExecutorString;
        break;
      }
      case "array": {
        if (!this.child) {
          throw new Error(
            "GrafastInternalError<48fabdc8-ce84-45ec-ac20-35a2af9098e0>: No child output plan for list bucket?",
          );
        }
        const childIsNonNull = this.childIsNonNull;
        let directLayerPlanChild = this.child.layerPlan;
        while (directLayerPlanChild.parentLayerPlan !== this.layerPlan) {
          const parent = directLayerPlanChild.parentLayerPlan;
          if (!parent) {
            throw new Error(
              `GrafastInternalError<d43e06d8-c533-4e7b-b3e7-af399f19c83f>: Invalid heirarchy - could not find direct layerPlan child of ${this}`,
            );
          }
          directLayerPlanChild = parent;
        }
        const canStream =
          directLayerPlanChild.reason.type === "listItem" &&
          !!directLayerPlanChild.reason.stream;

        if (childIsNonNull) {
          if (canStream) {
            this.execute = arrayExecutor_nonNullable_streaming;
            this.executeString = arrayExecutorString_nonNullable_streaming;
          } else {
            this.execute = arrayExecutor_nonNullable;
            this.executeString = arrayExecutorString_nonNullable;
          }
        } else {
          if (canStream) {
            this.execute = arrayExecutor_nullable_streaming;
            this.executeString = arrayExecutorString_nullable_streaming;
          } else {
            this.execute = arrayExecutor_nullable;
            this.executeString = arrayExecutorString_nullable;
          }
        }
        break;
      }
      case "root":
      case "object": {
        const type = this.type as OutputPlanTypeRoot | OutputPlanTypeObject;
        const digestFieldTypes: {
          [responseKey: string]: FieldTypeDigest;
        } = Object.create(null);
        for (const [responseKey, spec] of Object.entries(this.keys)) {
          digestFieldTypes[responseKey] = {
            fieldType:
              spec.type === "__typename"
                ? "__typename"
                : spec.isNonNull
                ? "outputPlan!"
                : "outputPlan?",
            sameBucket:
              spec.type === "__typename" ||
              spec.outputPlan.layerPlan.id === this.layerPlan.id,
          };
        }
        this.execute = makeObjectExecutor(
          type.typeName,
          digestFieldTypes,
          this.deferredOutputPlans.length > 0,
          type.mode === "root",
          false,
        );
        this.executeString = makeObjectExecutor(
          type.typeName,
          digestFieldTypes,
          this.deferredOutputPlans.length > 0,
          type.mode === "root",
          true,
        );
        break;
      }
      default: {
        const never: never = this.type;
        throw new Error(
          `GrafastInternalError<e88531b2-d9af-4d3a-8cd5-e9f034324341>: Could not build executor for OutputPlan with type ${inspect(
            never,
          )}}`,
        );
      }
    }
  }
}

export function coerceError(
  error: Error,
  locationDetails: LocationDetails,
  path: ReadonlyArray<string | number>,
): graphql.GraphQLError {
  // Ensure it's a GraphQL error
  if (error instanceof GraphQLError) {
    if (error.path !== undefined) {
      return error;
    } else {
      return new GraphQLError(
        error.message,
        locationDetails.node,
        null,
        null,
        path,
        error.originalError ?? error,
        error.extensions,
      );
    }
  } else {
    return new GraphQLError(
      error.message,
      locationDetails.node,
      null,
      null,
      path,
      error,
      null,
    );
  }
}

export function nonNullError(
  locationDetails: LocationDetails,
  path: readonly (string | number)[],
): graphql.GraphQLError {
  const { parentTypeName, fieldName, node } = locationDetails;
  if (!parentTypeName || !fieldName) {
    return new GraphQLError(
      `GrafastInternalError<a3706bba-4f88-4643-8a47-2fe2eaaadbea>: null bubbled to root`,
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

/**
 * We're currently running OutputPlan `outputPlan` in bucket `bucket` at index
 * `bucketIndex`. If this is an array OutputPlan then we're looping over the
 * entries in our list and we're currently at index `inArrayIndex` (otherwise
 * this is null).
 *
 * Now we want to run `childOutputPlan`, but to do so we need to find the
 * related `childBucket` and `childBucketIndex`.
 *
 * @internal
 */
export function getChildBucketAndIndex(
  layerPlan: LayerPlan,
  outputPlan: OutputPlan | null,
  bucket: Bucket,
  bucketIndex: number,
  arrayIndex: number | null = null,
): [Bucket, number] | null {
  if (bucket.layerPlan === layerPlan) {
    return [bucket, bucketIndex];
  }
  if (
    (arrayIndex == null) ===
    (outputPlan != null && outputPlan.type.mode === "array")
  ) {
    throw new Error(
      "GrafastInternalError<83d0e3cc-7eec-4185-85b4-846540288162>: arrayIndex must be supplied iff outputPlan is an array",
    );
  }
  if (outputPlan != null && layerPlan === bucket.layerPlan) {
    // Same layer; straightforward
    return [bucket, bucketIndex];
  }

  const reversePath = [layerPlan];
  let current: LayerPlan | null = layerPlan;
  while (!bucket.children[current.id]) {
    current = current.parentLayerPlan;
    if (!current) {
      return null;
    }
    reversePath.push(current);
  }

  let currentBucket = bucket;
  let currentIndex = bucketIndex;

  for (let l = reversePath.length, i = l - 1; i >= 0; i--) {
    const layerPlan = reversePath[i];
    const child = currentBucket.children[layerPlan.id];
    if (!child) {
      return null;
    }

    const out = child.map.get(currentIndex);
    if (out == null) {
      return null;
    }

    /*
     * TEST: I think this  '|| i !== l - 1' check is saying that an array can
     * only occur at the furthest ancestor and everything since then must be
     * non-array. Presumably in the case of nested arrays there would be an
     * intermediary bucket, hence why this check is allowed, but that should be
     * tested. Also, are there any confounding factors when it comes to steps
     * themselves using arrays for object values - for example pgSelectSingle is
     * represented by an array (tuple), but that doesn't make it a list so it should
     * be fine. Use tests to validate this is all fine.
     */
    if (arrayIndex == null || i !== l - 1) {
      if (Array.isArray(out)) {
        throw new Error(
          "GrafastInternalError<db189d32-bf8f-4e58-b55f-5c5ac3bb2381>: Was expecting an arrayIndex, but none was provided",
        );
      }
      currentBucket = child.bucket;
      currentIndex = out;
    } else {
      if (!Array.isArray(out)) {
        throw new Error(
          `GrafastInternalError<8190d09f-dc75-46ec-8162-b20ad516de41>: Cannot access array index in non-array ${inspect(
            out,
          )}`,
        );
      }
      if (!(out.length > arrayIndex)) {
        throw new Error(
          `GrafastInternalError<1f596c22-368b-4d0d-94df-fb3df632b064>: Attempted to retrieve array index '${arrayIndex}' which is out of bounds of array with length '${out.length}'`,
        );
      }
      currentBucket = child.bucket;
      currentIndex = out[arrayIndex];
    }
  }
  if (currentIndex == null) {
    return null;
  }
  return [currentBucket, currentIndex];
}

interface Execute {
  (
    this: OutputPlan,
    _root: PayloadRoot,
    // By just reusing the same path over and over we don't need to allocate
    // more memory for more arrays; but we must be _incredibly_ careful to
    // ensure any changes to it are reversed.
    _mutablePath: Array<string | number>,
    _bucket: Bucket,
    _bucketIndex: number,
    rawBucketRootValue?: any,
    bucketRootFlags?: ExecutionEntryFlags,
  ): JSONValue;
  displayName?: string;
  name?: string;
}
interface ExecuteString {
  (
    this: OutputPlan,
    _root: PayloadRoot,
    // By just reusing the same path over and over we don't need to allocate
    // more memory for more arrays; but we must be _incredibly_ careful to
    // ensure any changes to it are reversed.
    _mutablePath: Array<string | number>,
    _bucket: Bucket,
    _bucketIndex: number,
    rawBucketRootValue?: any,
    bucketRootFlags?: ExecutionEntryFlags,
  ): string;
  displayName?: string;
  name?: string;
}

interface MakeExecutorOptions<
  TAsString extends boolean,
  TType extends OutputPlanType,
> {
  inner: (
    this: OutputPlan<TType>,
    bucketRootValue: any,
    root: PayloadRoot,
    // By just reusing the same path over and over we don't need to allocate
    // more memory for more arrays; but we must be _incredibly_ careful to
    // ensure any changes to it are reversed.
    mutablePath: Array<string | number>,
    bucket: Bucket,
    bucketIndex: number,
    rawBucketRootValue: any,
    bucketRootFlags: ExecutionEntryFlags,
  ) => TAsString extends true ? string : JSONValue;
  nameExtra: string;
  asString: TAsString;
  // this.type.mode === "introspection" || this.type.mode === "root"
  skipNullHandling?: boolean;
  preamble?: (
    this: OutputPlan<TType>,
    bucketRootValue: any,
  ) => undefined | (TAsString extends true ? string : JSONValue);
}

function makeExecutor<
  TAsString extends boolean,
  TType extends OutputPlanType = OutputPlanType,
>(config: MakeExecutorOptions<TAsString, TType>) {
  const {
    preamble = null,
    inner,
    asString,
    nameExtra,
    skipNullHandling = false,
  } = config;
  const fn: TAsString extends true ? ExecuteString : Execute = function (
    this: OutputPlan,
    root: PayloadRoot,
    mutablePath: Array<string | number>,
    bucket: Bucket,
    bucketIndex: number,
    rawBucketRootValue = bucket.store.get(this.rootStep.id)!.at(bucketIndex),
    bucketRootFlags = bucket.store.get(this.rootStep.id)!._flagsAt(bucketIndex),
  ) {
    if (this.sideEffectStep !== null) {
      const sideEffectBucketDetails = getChildBucketAndIndex(
        this.sideEffectStep.layerPlan,
        null,
        bucket,
        bucketIndex,
      );
      if (sideEffectBucketDetails) {
        const [sideEffectBucket, sideEffectBucketIndex] =
          sideEffectBucketDetails;
        const ev = sideEffectBucket.store.get(this.sideEffectStep.id);
        if (!ev) {
          throw new Error(
            `GrafastInternalError<da9cc5a0-23bf-4af8-a103-92f995795398>: ${stripAnsi(
              String(this.sideEffectStep),
            )} has no entry in ${bucket}`,
          );
        }
        const seFlags = ev._flagsAt(sideEffectBucketIndex);
        if (seFlags & FLAG_ERROR) {
          const seVal = sideEffectBucket.store
            .get(this.sideEffectStep.id)!
            .at(sideEffectBucketIndex);
          throw coerceError(seVal, this.locationDetails, mutablePath.slice(1));
        }
      }
    }
    const bucketRootValue =
      this.processRoot !== null
        ? this.processRoot(rawBucketRootValue, bucketRootFlags)
        : rawBucketRootValue;
    const earlyReturn = preamble?.call(
      this as OutputPlan<any>,
      bucketRootValue,
    );
    if (earlyReturn !== undefined) {
      return earlyReturn as any;
    }
    if (bucketRootFlags & FLAG_ERROR) {
      throw coerceError(
        bucketRootValue,
        this.locationDetails,
        mutablePath.slice(1),
      );
    }
    if (!skipNullHandling) {
      if (bucketRootValue == null)
        return (asString ? "null" : null) as TAsString extends true
          ? string
          : JSONValue;
    }
    return inner.call(
      this as OutputPlan<any>,
      bucketRootValue,
      root,
      mutablePath,
      bucket,
      bucketIndex,
      rawBucketRootValue,
      bucketRootFlags,
    );
  } as any;
  fn.displayName = `outputPlan${asString ? "String" : ""}_${nameExtra}`;
  return fn;
}

function executeChildPlan(
  that: OutputPlan,
  locationDetails: LocationDetails,
  childOutputPlan: OutputPlan,
  isNonNull: boolean,
  asString: boolean,
  childBucket: Bucket | null,
  childBucketIndex: number | null,
  bucket: Bucket,
  bucketIndex: number,
  mutablePath: ReadonlyArray<string | number>,
  mutablePathIndex: number,
  root: PayloadRoot,
  rawBucketRootValue: any,
  bucketRootFlags: ExecutionEntryFlags,
) {
  const $sideEffect = childOutputPlan.layerPlan.parentSideEffectStep;
  if ($sideEffect !== null) {
    // Check if there's an error
    const sideEffectBucketDetails = getChildBucketAndIndex(
      $sideEffect.layerPlan,
      null,
      bucket,
      bucketIndex,
    );
    if (sideEffectBucketDetails) {
      const [sideEffectBucket, sideEffectBucketIndex] = sideEffectBucketDetails;
      const ev = sideEffectBucket.store.get($sideEffect.id);
      if (!ev) {
        throw new Error(
          `GrafastInternalError<d18d52b5-f5bf-42df-a2dd-80e522310b8e>: ${stripAnsi(
            String($sideEffect),
          )} has no entry in ${bucket}`,
        );
      }
      const flags = ev._flagsAt(sideEffectBucketIndex);
      if (flags & FLAG_ERROR) {
        const e = coerceError(
          ev.at(sideEffectBucketIndex),
          locationDetails,
          mutablePath.slice(1),
        );
        if (isNonNull) {
          throw e;
        } else {
          const streamCount = root.streams.length;
          const queueCount = root.queue.length;
          commonErrorHandler(
            e,
            locationDetails,
            mutablePath,
            mutablePathIndex,
            root,
            streamCount,
            queueCount,
          );
          return asString ? "null" : null;
        }
      }
    }
  }
  // This is the code that changes based on if the field is nullable or not
  if (isNonNull) {
    // No need to catch error
    if (childBucket === bucket) {
      //noop
    } else {
      if (childBucket == null) {
        throw nonNullError(locationDetails, mutablePath.slice(1));
      }
    }
    const fieldResult = childOutputPlan[asString ? "executeString" : "execute"](
      root,
      mutablePath,
      childBucket,
      childBucketIndex!,
      // NOTE: the previous code may have had a bug here, it referenced childBucket.rootStep
      childOutputPlan.rootStep === that.rootStep
        ? rawBucketRootValue
        : undefined,
      childOutputPlan.rootStep === that.rootStep ? bucketRootFlags : undefined,
    );
    if (fieldResult == (asString ? "null" : null)) {
      throw nonNullError(locationDetails, mutablePath.slice(1));
    }
    return fieldResult;
  } else {
    // Need to catch error and set null
    const streamCount = root.streams.length;
    const queueCount = root.queue.length;
    try {
      if (childBucket !== bucket && childBucket == null) {
        return asString ? "null" : null;
      } else {
        return childOutputPlan[asString ? "executeString" : "execute"](
          root,
          mutablePath,
          childBucket,
          childBucketIndex!,
          // NOTE: the previous code may have had a bug here, it referenced childBucket.rootStep
          childOutputPlan.rootStep === that.rootStep
            ? rawBucketRootValue
            : undefined,
          childOutputPlan.rootStep === that.rootStep
            ? bucketRootFlags
            : undefined,
        );
      }
    } catch (e) {
      commonErrorHandler(
        e,
        locationDetails,
        mutablePath,
        mutablePathIndex,
        root,
        streamCount,
        queueCount,
      );
      return asString ? "null" : null;
    }
  }
}

function commonErrorHandler(
  e: Error,
  locationDetails: LocationDetails,
  mutablePath: ReadonlyArray<string | number>,
  mutablePathIndex: number,
  root: PayloadRoot,
  streamCount: number,
  queueCount: number,
) {
  if (root.streams.length > streamCount) {
    root.streams.splice(streamCount);
  }
  if (root.queue.length > queueCount) {
    root.queue.splice(queueCount);
  }
  const error = coerceError(e, locationDetails, mutablePath.slice(1));
  const pathLengthTarget = mutablePathIndex + 1;
  const overSize = mutablePath.length - pathLengthTarget;
  if (overSize > 0) {
    (mutablePath as Array<string | number>).splice(pathLengthTarget, overSize);
  }
  root.errors.push(error);
}

const nullExecutor = makeExecutor({
  inner: () => null,
  nameExtra: "null",
  asString: false,
});

const nullExecutorString = makeExecutor({
  inner: () => "null",
  nameExtra: `null`,
  asString: true,
});

/* This is what leafExecutor should use if insideGraphQL (which isn't currently
   * supported)
  `\
    if (root.insideGraphQL) {
      // Don't serialize to avoid the double serialization problem
      return bucketRootValue;
    } else {
      return this.type.graphqlType.serialize(bucketRootValue);
    }
  ` */
const leafExecutor = makeExecutor<false, OutputPlanTypeLeaf>({
  inner(bucketRootValue) {
    return this.type.graphqlType.serialize(bucketRootValue) as JSONValue;
  },
  nameExtra: `leaf`,
  asString: false,
});

const leafExecutorString = makeExecutor<true, OutputPlanTypeLeaf>({
  inner(bucketRootValue) {
    return stringifyJSON(
      (this.type as OutputPlanTypeLeaf).graphqlType.serialize(bucketRootValue),
    );
  },
  nameExtra: `leaf`,
  asString: true,
});

const booleanLeafExecutorString = makeExecutor<true, OutputPlanTypeLeaf>({
  inner(bucketRootValue) {
    const val = this.type.graphqlType.serialize(bucketRootValue);
    return val === true ? "true" : "false";
  },
  nameExtra: `booleanLeaf`,
  asString: true,
  skipNullHandling: false,
  preamble(bucketRootValue) {
    if (bucketRootValue === true) return "true";
    if (bucketRootValue === false) return "false";
  },
});

const intLeafExecutorString = makeExecutor<true, OutputPlanTypeLeaf>({
  inner(bucketRootValue) {
    return "" + this.type.graphqlType.serialize(bucketRootValue);
  },
  nameExtra: `intLeaf`,
  asString: true,
  skipNullHandling: false,
  // Fast check to see if number is 32 bit integer
  preamble(bucketRootValue) {
    if ((bucketRootValue | 0) === bucketRootValue) {
      return "" + bucketRootValue;
    }
  },
});

const floatLeafExecutorString = makeExecutor<true, OutputPlanTypeLeaf>({
  inner(bucketRootValue) {
    return String(this.type.graphqlType.serialize(bucketRootValue));
  },
  nameExtra: `floatLeaf`,
  asString: true,
  skipNullHandling: false,
  preamble(bucketRootValue) {
    if (Number.isFinite(bucketRootValue)) {
      return "" + bucketRootValue;
    }
  },
});

const stringLeafExecutorString = makeExecutor<true, OutputPlanTypeLeaf>({
  inner(bucketRootValue) {
    return stringifyString(
      this.type.graphqlType.serialize(bucketRootValue) as string,
    );
  },
  nameExtra: `stringLeaf`,
  asString: true,
  skipNullHandling: false,
  preamble(bucketRootValue) {
    if (typeof bucketRootValue === "string") {
      return stringifyString(bucketRootValue);
    }
  },
});

// NOTE: the reference to $$concreteType here is a (temporary) optimization; it
// should be `resolveType(bucketRootValue)` but it's not worth the function
// call overhead. Longer term it should just be read directly from a different
// store.

function makePolymorphicExecutor<TAsString extends boolean>(
  asString: TAsString,
) {
  return makeExecutor({
    inner(bucketRootValue, root, mutablePath, bucket, bucketIndex) {
      if (isDev) {
        if (!isPolymorphicData(bucketRootValue)) {
          throw coerceError(
            new Error(
              "GrafastInternalError<db7fcda5-dc39-4568-a7ce-ee8acb88806b>: Expected polymorphic data",
            ),
            this.locationDetails,
            mutablePath.slice(1),
          );
        }
      }
      const typeName = bucketRootValue[$$concreteType];
      const childOutputPlan = this.childByTypeName![typeName];
      if (isDev) {
        assert.ok(
          typeName,
          "GrafastInternalError<fd3f3cf0-0789-4c74-a6cd-839c808896ed>: Could not determine concreteType for object",
        );
        assert.ok(
          childOutputPlan,
          `GrafastInternalError<a46999ef-41ff-4a22-bae9-fa37ff6e5f7f>: Could not determine the OutputPlan to use for '${typeName}' from '${bucket.layerPlan}'`,
        );
      }

      const directChild = bucket.children[childOutputPlan.layerPlan.id];
      if (directChild !== undefined) {
        return childOutputPlan[asString ? "executeString" : "execute"](
          root,
          mutablePath,
          directChild.bucket,
          directChild.map.get(bucketIndex) as number,
        ) as TAsString extends true ? string : JSONValue;
      } else {
        const c = getChildBucketAndIndex(
          childOutputPlan.layerPlan,
          this,
          bucket,
          bucketIndex,
        );
        if (!c) {
          throw new Error(
            "GrafastInternalError<691509d8-31fa-4cfe-a6df-dcba21bd521f>: polymorphic executor couldn't determine child bucket",
          );
        }
        const [childBucket, childBucketIndex] = c;
        return childOutputPlan[asString ? "executeString" : "execute"](
          root,
          mutablePath,
          childBucket,
          childBucketIndex,
        ) as TAsString extends true ? string : JSONValue;
      }
    },
    nameExtra: "polymorphic",
    asString,
  });
}

const polymorphicExecutor = makePolymorphicExecutor(false);
const polymorphicExecutorString = makePolymorphicExecutor(true);

function makeArrayExecutor<TAsString extends boolean>(
  childIsNonNull: boolean,
  canStream: boolean,
  asString: TAsString,
) {
  return makeExecutor({
    inner(
      bucketRootValue,
      root,
      mutablePath,
      bucket,
      bucketIndex,
      rawBucketRootValue,
      bucketRootFlags,
    ) {
      if (!Array.isArray(bucketRootValue)) {
        console.warn(
          `Hit fallback for value ${inspect(
            bucketRootValue,
          )} coercion to mode 'array'`,
        );
        return (asString ? "null" : null) as TAsString extends true
          ? string
          : JSONValue;
      }

      if (this.child === null) {
        throw new Error(
          `GrafastInternalError<365fd45e-2939-411b-92a6-4f6875d8fbd3>: ${this} has no child output plan?!`,
        );
      }
      const childOutputPlan = this.child;
      const l = bucketRootValue.length;
      let string: string | undefined;
      let data: any[] | undefined;
      if (l === 0) {
        if (asString) {
          string = "[]";
        } else {
          data = [];
        }
      } else {
        if (asString) {
          string = "[";
        } else {
          data = [];
        }
        const mutablePathIndex = mutablePath.push(-1) - 1;

        // Now to populate the children...
        const directChild = bucket.children[childOutputPlan.layerPlan.id];
        let childBucket: Bucket | null,
          childBucketIndex: number | null,
          lookup: number[] | undefined;
        if (directChild !== undefined) {
          childBucket = directChild.bucket;
          lookup = directChild.map.get(bucketIndex) as number[];
        }
        for (let i = 0; i < l; i++) {
          if (directChild !== undefined) {
            childBucketIndex = lookup![i];
          } else {
            const c = getChildBucketAndIndex(
              childOutputPlan.layerPlan,
              this,
              bucket,
              bucketIndex,
              i,
            );
            if (c !== null) {
              [childBucket, childBucketIndex] = c;
            } else {
              childBucket = childBucketIndex = null;
            }
          }

          mutablePath[mutablePathIndex] = i;
          if (asString) {
            if (i > 0) {
              string! += ",";
            }
          }
          const val = executeChildPlan(
            this,
            this.locationDetails,
            childOutputPlan,
            childIsNonNull,
            asString,
            childBucket!,
            childBucketIndex!,
            bucket,
            bucketIndex,
            mutablePath,
            mutablePathIndex,
            root,
            rawBucketRootValue,
            bucketRootFlags,
          );
          if (asString) {
            string! += val;
          } else {
            data![i] = val;
          }
        }

        mutablePath.length = mutablePathIndex;
        if (asString) {
          string! += "]";
        }
      }
      if (canStream) {
        const stream = (bucketRootValue as any)[$$streamMore] as
          | AsyncIterableIterator<any>
          | undefined;
        if (stream !== undefined) {
          root.streams.push({
            root,
            path: mutablePath.slice(1),
            bucket,
            bucketIndex,
            outputPlan: childOutputPlan,
            label: (
              childOutputPlan.layerPlan as LayerPlan<LayerPlanReasonListItem>
            ).reason.stream?.label,
            stream,
            startIndex: bucketRootValue.length,
          });
        }
      }

      return (asString ? string : data) as TAsString extends true
        ? string
        : JSONValue;
    },
    nameExtra: `array${childIsNonNull ? "_nonNull" : ""}${
      canStream ? "_stream" : ""
    }`,
    asString,
  });
}
const arrayExecutor_nullable = makeArrayExecutor(false, false, false);
const arrayExecutor_nullable_streaming = makeArrayExecutor(false, true, false);
const arrayExecutor_nonNullable = makeArrayExecutor(true, false, false);
const arrayExecutor_nonNullable_streaming = makeArrayExecutor(
  true,
  true,
  false,
);
const arrayExecutorString_nullable = makeArrayExecutor(false, false, true);
const arrayExecutorString_nullable_streaming = makeArrayExecutor(
  false,
  true,
  true,
);
const arrayExecutorString_nonNullable = makeArrayExecutor(true, false, true);
const arrayExecutorString_nonNullable_streaming = makeArrayExecutor(
  true,
  true,
  true,
);

/**
 * This piggy-backs off of GraphQL.js by rewriting the request, executing it in
 * GraphQL.js, and then patching it into our response. It's a temporary
 * workaround until we can afford the time to write our own introspection
 * execution.
 *
 * ENHANCE: write our own introspection execution!
 */
function introspect<TAsString extends boolean>(
  root: PayloadRoot,
  outputPlan: OutputPlan<OutputPlanTypeIntrospection>,
  mutablePath: ReadonlyArray<string | number>,
  asString: TAsString,
): TAsString extends true ? string : JSONValue {
  const { locationDetails } = outputPlan;
  const {
    field: rawField,
    introspectionCacheByVariableValues,
    variableNames,
  } = outputPlan.type as OutputPlanTypeIntrospection;
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
        variableDefinitions:
          outputPlan.layerPlan.operationPlan.operation.variableDefinitions?.filter(
            (d) => variableNames.includes(d.variable.name.value),
          ),
      },
      ...Object.values(outputPlan.layerPlan.operationPlan.fragments),
    ],

    kind: Kind.DOCUMENT,
  };
  const variableValues: Record<string, any> = Object.create(null);
  const sortedVariableNames = [...variableNames].sort();
  for (const variableName of sortedVariableNames) {
    variableValues[variableName] = root.variables[variableName];
  }
  // "canonical" only to one level, but given introspection doesn't really
  // accept objects this should be mostly sufficient for decent optimization
  // level.
  const canonical = JSON.stringify(variableValues);
  const cached = introspectionCacheByVariableValues.get(canonical);
  if (cached !== undefined) {
    return (
      asString ? JSON.stringify(cached) : cached
    ) as TAsString extends true ? string : JSONValue;
  }
  const graphqlResult = executeSync({
    schema: outputPlan.layerPlan.operationPlan.schema,
    document,
    variableValues,
  });
  if (graphqlResult.errors !== undefined) {
    // NOTE: we should map the introspection path, however that might require
    // us to be able to raise multiple errors. Theoretically if the query
    // validates we shouldn't be able to get errors out of the introspection
    // system, so we'll skip over this for now. When we get around to
    // implementing introspection natively in Grafast rather than piggy-backing
    // off of GraphQL.js then this problem will go away on its own.

    console.error("INTROSPECTION FAILED!");
    console.error(graphqlResult);
    const { node } = locationDetails;
    throw new GraphQLError(
      "INTROSPECTION FAILED!",
      node,
      null,
      null,
      mutablePath.slice(1),
      null,
      null,
    );
  }
  const result = graphqlResult.data!.a as JSONValue;
  introspectionCacheByVariableValues.set(canonical, result);
  return (asString ? JSON.stringify(result) : result) as TAsString extends true
    ? string
    : JSONValue;
}

const introspectionExecutor = makeExecutor<false, OutputPlanTypeIntrospection>({
  inner(_bucketRootValue, root, mutablePath) {
    return introspect(root, this, mutablePath, false);
  },
  nameExtra: `introspection`,
  asString: false,
  skipNullHandling: true,
});
const introspectionExecutorString = makeExecutor<
  true,
  OutputPlanTypeIntrospection
>({
  inner(_bucketRootValue, root, mutablePath) {
    return introspect(root, this, mutablePath, true);
  },
  nameExtra: `introspection`,
  asString: true,
  skipNullHandling: true,
});

const SAFE_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

function makeObjectExecutor<TAsString extends boolean>(
  typeName: string,
  fieldTypes: {
    [key: string]: FieldTypeDigest;
  },
  hasDeferredOutputPlans: boolean,
  // this.type.mode === "root",
  isRoot: boolean,
  asString: TAsString,
): TAsString extends true ? ExecuteString : Execute {
  if (!SAFE_NAME.test(typeName)) {
    throw new Error(
      `Unsafe type name: ${typeName}; doesn't conform to 'Name' in the GraphQL spec`,
    );
  }
  if (isDev) {
    if (Object.getPrototypeOf(fieldTypes) !== null) {
      throw new Error(
        `GrafastInternalError<3d8e3547-d818-44e1-a076-16b828e3a34d>: fieldTypes must have a null prototype`,
      );
    }
  }
  const fieldDigests = Object.entries(fieldTypes).map(
    ([responseKey, fieldSpec], i) => {
      // NOTE: this code relies on the fact that fieldName and typeName do
      // not require any quoting in JSON/JS - they must conform to GraphQL
      // `Name`.
      if (!SAFE_NAME.test(responseKey)) {
        // This should not be able to happen if the GraphQL operation is valid
        throw new Error(
          `Unsafe key: ${responseKey}; doesn't conform to 'Name' in the GraphQL spec`,
        );
      }
      const { fieldType, sameBucket } = fieldSpec;
      const addComma = asString && i > 0;
      switch (fieldType) {
        case "__typename": {
          return {
            isTypeName: true as const,
            addComma,
            responseKey,
            stringValue: asString ? `"${responseKey}":"${typeName}"` : null,
          } as const;
        }
        case "outputPlan!":
        case "outputPlan?": {
          return {
            isTypeName: false as const,
            addComma,
            responseKey,
            stringPrefix: asString ? `"${responseKey}":` : null,
            sameBucket,
            isNonNull: fieldType === "outputPlan!",
          } as const;
        }
        default: {
          const never: never = fieldType;
          throw new Error(
            `GrafastInternalError<879082f4-fe6f-4112-814f-852b9932ca83>: unsupported key type ${never}`,
          );
        }
      }
    },
  );
  return makeExecutor<TAsString, OutputPlanTypeObject>({
    inner(
      bucketRootValue,
      root,
      mutablePath,
      bucket,
      bucketIndex,
      rawBucketRootValue,
      bucketRootFlags,
    ): TAsString extends true ? string : JSONValue {
      let string: string | undefined = asString ? "{" : undefined;
      const obj: Record<string, JSONValue> | undefined = asString
        ? undefined
        : Object.create(null);
      const keys = this.keys;
      const mutablePathIndex = mutablePath.push("!") - 1;

      for (const digest of fieldDigests) {
        if (digest.addComma) {
          string! += ",";
        }
        const responseKey = digest.responseKey;
        if (digest.isTypeName) {
          if (asString) {
            string! += digest.stringValue;
          } else {
            obj![responseKey] = typeName;
          }
        } else {
          mutablePath[mutablePathIndex] = responseKey;
          const spec = keys[responseKey] as OutputPlanKeyValueOutputPlan;
          if (digest.sameBucket) {
            const val = executeChildPlan(
              this,
              spec.locationDetails,
              spec.outputPlan,
              digest.isNonNull,
              asString,
              bucket,
              bucketIndex,
              bucket,
              bucketIndex,
              mutablePath,
              mutablePathIndex,
              root,
              rawBucketRootValue,
              bucketRootFlags,
            );
            if (asString) {
              string! += digest.stringPrefix;
              string! += val;
            } else {
              obj![responseKey] = val;
            }
          } else {
            const directChild = bucket.children[spec.outputPlan.layerPlan.id];
            let childBucket, childBucketIndex;
            if (directChild !== undefined) {
              childBucket = directChild.bucket;
              childBucketIndex = directChild.map.get(bucketIndex);
            } else {
              const c = getChildBucketAndIndex(
                spec.outputPlan.layerPlan,
                this,
                bucket,
                bucketIndex,
              );
              if (c !== null) {
                [childBucket, childBucketIndex] = c;
              } else {
                childBucket = childBucketIndex = null;
              }
            }
            const val = executeChildPlan(
              this,
              spec.locationDetails,
              spec.outputPlan,
              digest.isNonNull,
              asString,
              childBucket,
              childBucketIndex as number,
              bucket,
              bucketIndex,
              mutablePath,
              mutablePathIndex,
              root,
              rawBucketRootValue,
              bucketRootFlags,
            );
            if (asString) {
              string! += digest.stringPrefix;
              string! += val;
            } else {
              obj![responseKey] = val;
            }
          }
        }
      }

      mutablePath.length = mutablePathIndex;
      if (asString) {
        string! += "}";
      }
      if (hasDeferredOutputPlans) {
        // Everything seems okay; queue any deferred payloads
        for (const defer of this.deferredOutputPlans) {
          root.queue.push({
            root,
            path: mutablePath.slice(1),
            bucket,
            bucketIndex,
            outputPlan: defer,
            label: defer.type.deferLabel,
          });
        }
      }
      return (asString ? string : obj) as TAsString extends true
        ? string
        : JSONValue;
    },
    nameExtra: "object",
    asString,
    skipNullHandling: isRoot,
  });
}

const makeCache = new LRU<string, (value: any) => any>({
  maxLength: 1000,
});
const makingCache = new Map<string, Array<(fn: (value: any) => any) => void>>();

function withFastExpression(
  path: ReadonlyArray<string | number>,
  fallback: any,
  callback: (fn: (value: any) => any) => void,
) {
  const signature = (fallback === undefined ? "d" : "f") + "_" + path.join("|");
  const existing = makeCache.get(signature);
  if (existing !== undefined) {
    callback(existing);
    return;
  }
  const existingCallbacks = makingCache.get(signature);
  if (existingCallbacks !== undefined) {
    existingCallbacks.push(callback);
    return;
  }
  const callbacks = [callback];
  makingCache.set(signature, callbacks);

  const jitParts: TE[] = [];

  for (let i = 0, l = path.length; i < l; i++) {
    const part = path[i];
    jitParts.push(te.optionalGet(part));
  }
  const expression = te.join(jitParts, "");
  te.runInBatch<(value: any) => any>(
    te`(value => (value${expression})${
      fallback !== undefined ? te` ?? ${te.lit(fallback)}` : te.blank
    })`,
    (fn) => {
      makeCache.set(signature, fn);
      makingCache.delete(signature);
      for (const callback of callbacks) {
        callback(fn);
      }
    },
  );
}
