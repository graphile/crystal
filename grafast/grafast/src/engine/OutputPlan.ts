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
import te, { stringifyString, toJSON } from "tamedevil";

import * as assert from "../assert.js";
import type { Bucket } from "../bucket.js";
import { isDev } from "../dev.js";
import { $$error } from "../error.js";
import { AccessStep } from "../index.js";
import { inspect } from "../inspect.js";
import type { JSONValue, LocationDetails } from "../interfaces.js";
import { $$concreteType, $$streamMore } from "../interfaces.js";
import { isPolymorphicData } from "../polymorphic.js";
import type { ExecutableStep } from "../step.js";
import { expressionSymbol } from "../steps/access.js";
import type { PayloadRoot } from "./executeOutputPlan.js";
import type { LayerPlan } from "./LayerPlan.js";

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

const ref_$$error = te.ref($$error, "$$error");
const ref_coerceError = te.ref(coerceError, "coerceError");
const ref_nonNullError = te.ref(nonNullError, "nonNullError");
const ref_stringifyString = te.ref(stringifyString, "stringifyString");
const ref_toJSON = te.ref(toJSON, "toJSON");
const ref_isPolymorphicData = te.ref(isPolymorphicData, "isPolymorphicData");
const ref_$$concreteType = te.ref($$concreteType, "$$concreteType");
const ref_assert = te.ref(assert, "assert");
const ref_getChildBucketAndIndex = te.ref(
  getChildBucketAndIndex,
  "getChildBucketAndIndex",
);
const ref_inspect = te.ref(inspect, "inspect");
const ref_$$streamMore = te.ref($$streamMore, "$$streamMore");
const te_String = te`String`;
const te_nullIsFineComment = te`// root/introspection, null is fine`;
const te_nullString = te`"null"`;
const te_null = te`null`;
const te_childBucket = te`childBucket`;
const te_childBucketIndex = te`childBucketIndex`;
const te_executeString = te`executeString`;
const te_execute = te`execute`;
const te_polymorphic = te`polymorphic`;
const te_letStringLbrace = te`let string = "{";`;
const te_stringPlusEquals = te`string +=`;
const te_stringPlusEqualsRbrace = te`  string += "}";\n`;
const te_stringPlusEqualsRbracket = te`    string += "]";\n`;
const te_constObjEqualsObjectCreateNull = te`const obj = Object.create(null);`;
const te_comma = te`,`;
const te_specDotLocationDetails = te`spec.locationDetails`;
const te_thisDotLocationDetails = te`this.locationDetails`;
const te_specDotOutputPlan = te`spec.outputPlan`;
const te_bucket = te`bucket`;
const te_bucketIndex = te`bucketIndex`;
const te_handleDeferred = te`
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
`;
const te_string = te`string`;
const te_object = te`object`;
const te_obj = te`obj`;
const te_data = te`data`;
const te_commonErrorHandler = te.ref(commonErrorHandler, "handleError");
const te_questionDot = te`?.`;
const te_childBucketCBIDC = te`, childBucket, childBucketIndex, directChild`;
const te_letString = te`let string;`;
const te_constDataEqualsEmptyArray = te`const data = [];`;
const te_stringEqualsEmptyArrayString = te`    string = "[]";`;
const te_stringEqualsLeftSquareBraceString = te`    string = "[";\n`;
const te_noopComment = te`    /* noop */`;
const te_ifIGt0StrPlusEqualComma = te`\n      if (i > 0) { string += ","; }\n`;
const te_dataIEquals = te`data[i] =`;
const te_childOutputPlan = te`childOutputPlan`;
const te_underscoreNonNull = te`_nonNull`;
const te_underscoreStream = te`_stream`;

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
   * Appended to the root step when accessed to avoid the need for AccessSteps
   */
  private processRoot: ((value: any) => any) | null = null;

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
  }

  public print(): string {
    const type = this.type;
    switch (type.mode) {
      case "root":
      case "object": {
        return `${this.toString()}\n${Object.entries(this.keys)
          .map(([fieldName, val]) => {
            return `.${fieldName}: ${
              val.type === "__typename"
                ? `__typename(${type.typeName})`
                : val.outputPlan.print().replace(/\n/g, "\n  ") +
                  (val.isNonNull ? "!" : "?")
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
        return `${this.toString()}\n  ${this.child!.print().replace(
          /\n/g,
          "\n  ",
        )}${this.childIsNonNull ? "!" : "?"}`;
      }
      default: {
        return this.toString();
      }
    }
  }

  toString() {
    return `OutputPlan<${this.type.mode}∈${this.layerPlan.id}!${this.rootStep.id}>`;
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
    _mutablePath: Array<string | number>,
    _bucket: Bucket,
    _bucketIndex: number,
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
    _mutablePath: Array<string | number>,
    _bucket: Bucket,
    _bucketIndex: number,
  ): string {
    throw new Error(`OutputPlan.executeString has yet to be built!`);
  }

  optimize(): void {
    const $root = this.layerPlan.operationPlan.dangerouslyGetStep(
      this.rootStep.id,
    );
    if ($root instanceof AccessStep && $root.fallback === undefined) {
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
        makeObjectExecutor(
          type.typeName,
          digestFieldTypes,
          this.deferredOutputPlans.length > 0,
          type.mode === "root",
          false,
          (fn) => {
            this.execute = fn;
          },
        );
        makeObjectExecutor(
          type.typeName,
          digestFieldTypes,
          this.deferredOutputPlans.length > 0,
          type.mode === "root",
          true,
          (fn) => {
            this.executeString = fn;
          },
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
      // TODO: rename. Also this shouldn't happen?
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
  childOutputPlan: OutputPlan,
  outputPlan: OutputPlan | null,
  bucket: Bucket,
  bucketIndex: number,
  arrayIndex: number | null = null,
): [Bucket, number] | null {
  if (
    (arrayIndex == null) ===
    (outputPlan != null && outputPlan.type.mode === "array")
  ) {
    throw new Error(
      "GrafastInternalError<83d0e3cc-7eec-4185-85b4-846540288162>: arrayIndex must be supplied iff outputPlan is an array",
    );
  }
  if (outputPlan && childOutputPlan.layerPlan === bucket.layerPlan) {
    // Same layer; straightforward
    return [bucket, bucketIndex];
  }

  const reversePath = [childOutputPlan.layerPlan];
  let current: LayerPlan | null = childOutputPlan.layerPlan;
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
     * HACK: this '|| i > 0' feels really really really hacky... What happens if we have
     * nested arrays? I'm concerned there's a bug here.
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

interface MakeExecutorOptions<TAsString extends boolean> {
  inner: TE;
  nameExtra: TE;
  asString: TAsString;
  // this.type.mode === "introspection" || this.type.mode === "root"
  skipNullHandling?: boolean;
  preamble?: TE;
}

function makeExecutorExpression<TAsString extends boolean>(
  options: MakeExecutorOptions<TAsString>,
): TE {
  const {
    inner,
    nameExtra,
    asString,
    skipNullHandling = false,
    preamble = te.blank,
  } = options;
  return te`\
(function compiledOutputPlan${asString ? te_String : te.blank}_${nameExtra}(
  root,
  mutablePath,
  bucket,
  bucketIndex,
  rawBucketRootValue = bucket.store.get(this.rootStep.id)[bucketIndex]
) {
  const bucketRootValue = this.processRoot !== null ? this.processRoot(rawBucketRootValue) : rawBucketRootValue;
${preamble}\
  ${
    skipNullHandling
      ? isDev
        ? te_nullIsFineComment
        : te.blank
      : te`if (bucketRootValue == null) return ${
          asString ? te_nullString : te_null
        };`
  }
  if (bucketRootValue${
    skipNullHandling ? te_questionDot : te.blank
  }[${ref_$$error}]) {
    throw ${ref_coerceError}(bucketRootValue.originalError, this.locationDetails, mutablePath.slice(1));
  }
${inner}
})`;
}

function makeExecutor<TAsString extends boolean>(
  options: MakeExecutorOptions<TAsString>,
): TAsString extends true
  ? typeof OutputPlan.prototype.executeString
  : typeof OutputPlan.prototype.execute;
function makeExecutor<TAsString extends boolean>(
  options: MakeExecutorOptions<TAsString>,
  callback: (fn: any) => void,
): void;
function makeExecutor(
  options: MakeExecutorOptions<boolean>,
  callback?: (fn: any) => void,
): any {
  const expression = makeExecutorExpression(options);
  if (callback !== undefined) {
    te.runInBatch(expression, callback);
  } else {
    return te.run(te`return ${expression}`);
  }
}

function makeExecuteChildPlanCode(
  setTargetOrReturn: TE,
  locationDetails: TE,
  childOutputPlan: TE,
  isNonNull: boolean,
  asString: boolean,
  childBucket: TE = te_childBucket,
  childBucketIndex: TE = te_childBucketIndex,
) {
  const te_childOutputPlanExecute = te`${childOutputPlan}.${
    asString ? te_executeString : te_execute
  }(root, mutablePath, ${childBucket}, ${childBucketIndex}, ${childBucket}.rootStep === this.rootStep ? rawBucketRootValue : undefined)`;
  // This is the code that changes based on if the field is nullable or not
  if (isNonNull) {
    // No need to catch error
    return te`\
  ${
    childBucket === te_bucket
      ? te.blank
      : te`if (${childBucket} == null) {
    throw ${ref_nonNullError}(${locationDetails}, mutablePath.slice(1));
  }
  `
  }fieldResult = ${te_childOutputPlanExecute};
  if (fieldResult == ${asString ? te_nullString : te_null}) {
    throw ${ref_nonNullError}(${locationDetails}, mutablePath.slice(1));
  }
  ${setTargetOrReturn} fieldResult;`;
  } else {
    // Need to catch error and set null
    return te`\
  try {
    ${setTargetOrReturn} ${
      childBucket === te_bucket
        ? te.blank
        : te`${childBucket} == null ? ${asString ? te_nullString : te_null} : `
    }${te_childOutputPlanExecute};
  } catch (e) {
    ${te_commonErrorHandler}(e, ${locationDetails}, mutablePath, mutablePathIndex, root);
    ${setTargetOrReturn} ${asString ? te_nullString : te_null};
  }`;
  }
}

function commonErrorHandler(
  e: Error,
  locationDetails: LocationDetails,
  mutablePath: Array<string | number>,
  mutablePathIndex: number,
  root: PayloadRoot,
) {
  const error = coerceError(e, locationDetails, mutablePath.slice(1));
  const pathLengthTarget = mutablePathIndex + 1;
  const overSize = mutablePath.length - pathLengthTarget;
  if (overSize > 0) {
    mutablePath.splice(pathLengthTarget, overSize);
  }
  root.errors.push(error);
}

/*
 * Below here we create the executors that can be shared across many different
 * OutputPlans without having to be recreated (thus saving significant memory,
 * and increasing the probability of optimization).
 */

const nullExecutor = makeExecutor({
  inner: te.cache`  return null;`,
  nameExtra: te.cache`null`,
  asString: false,
});
const nullExecutorString = makeExecutor({
  inner: te.cache`  return "null";`,
  nameExtra: te.cache`null`,
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
const leafExecutor = makeExecutor({
  inner: te`\
  return this.type.graphqlType.serialize(bucketRootValue);
`,
  nameExtra: te.cache`leaf`,
  asString: false,
});

const leafExecutorString = makeExecutor({
  inner: te`\
  return ${ref_toJSON}(this.type.graphqlType.serialize(bucketRootValue));
`,
  nameExtra: te.cache`leaf`,
  asString: true,
});

const booleanLeafExecutorString = makeExecutor({
  inner: te`\
  const val = this.type.graphqlType.serialize(bucketRootValue);
  return val === true ? 'true' : 'false';
`,
  nameExtra: te.cache`booleanLeaf`,
  asString: true,
  skipNullHandling: false,
  preamble: te`\
  if (bucketRootValue === true) return 'true';
  if (bucketRootValue === false) return 'false';
`,
});

const intLeafExecutorString = makeExecutor({
  inner: te`\
  return '' + this.type.graphqlType.serialize(bucketRootValue);
`,
  nameExtra: te.cache`intLeaf`,
  asString: true,
  skipNullHandling: false,
  // Fast check to see if number is 32 bit integer
  preamble: te`\
  if ((bucketRootValue | 0) === bucketRootValue) {
    return '' + bucketRootValue;
  }
`,
});

const floatLeafExecutorString = makeExecutor({
  inner: te`\
  return String(this.type.graphqlType.serialize(bucketRootValue));
`,
  nameExtra: te.cache`floatLeaf`,
  asString: true,
  skipNullHandling: false,
  preamble: te`\
  if (Number.isFinite(bucketRootValue)) {
    return '' + bucketRootValue;
  }
`,
});

const stringLeafExecutorString = makeExecutor({
  inner: te`\
  return ${ref_stringifyString}(this.type.graphqlType.serialize(bucketRootValue));
`,
  nameExtra: te.cache`stringLeaf`,
  asString: true,
  skipNullHandling: false,
  preamble: te`\
  if (typeof bucketRootValue === 'string') {
    return ${ref_stringifyString}(bucketRootValue);
  }
`,
});

// NOTE: the reference to $$concreteType here is a (temporary) optimization; it
// should be `resolveType(bucketRootValue)` but it's not worth the function
// call overhead. Longer term it should just be read directly from a different
// store.

function makePolymorphicExecutor<TAsString extends boolean>(
  asString: TAsString,
) {
  return makeExecutor({
    inner: te`\
${
  isDev
    ? te`\
  if (!${ref_isPolymorphicData}(bucketRootValue)) {
    throw ${ref_coerceError}(
      new Error(
        "GrafastInternalError<db7fcda5-dc39-4568-a7ce-ee8acb88806b>: Expected polymorphic data",
      ),
      this.locationDetails,
      mutablePath.slice(1),
    );
  }
`
    : te.blank
}\
  const typeName = bucketRootValue[${ref_$$concreteType}];
  const childOutputPlan = this.childByTypeName[typeName];
  ${
    isDev
      ? te`{
    ${ref_assert}.ok(
      typeName,
      "GrafastInternalError<fd3f3cf0-0789-4c74-a6cd-839c808896ed>: Could not determine concreteType for object",
    );
    ${ref_assert}.ok(
      childOutputPlan,
      \`GrafastInternalError<a46999ef-41ff-4a22-bae9-fa37ff6e5f7f>: Could not determine the OutputPlan to use for '\${typeName}' from '\${bucket.layerPlan}'\`,
    );
  }`
      : te.blank
  }

  const directChild = bucket.children[childOutputPlan.layerPlan.id];
  if (directChild !== undefined) {
    return childOutputPlan.${
      asString ? te_executeString : te_execute
    }(root, mutablePath, directChild.bucket, directChild.map.get(bucketIndex));
  } else {
    const c = ${ref_getChildBucketAndIndex}(
      childOutputPlan,
      this,
      bucket,
      bucketIndex,
    );
    if (!c) {
      throw new Error("GrafastInternalError<691509d8-31fa-4cfe-a6df-dcba21bd521f>: polymorphic executor couldn't determine child bucket");
    }
    const [childBucket, childBucketIndex] = c;
    return childOutputPlan.${
      asString ? te_executeString : te_execute
    }(root, mutablePath, childBucket, childBucketIndex);
  }
`,
    nameExtra: te_polymorphic,
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
    inner: te`\
  if (!Array.isArray(bucketRootValue)) {
    console.warn(\`Hit fallback for value \${${ref_inspect}(bucketRootValue)} coercion to mode 'array'\`);
    return ${asString ? te_nullString : te_null};
  }

  const childOutputPlan = this.child;
  const l = bucketRootValue.length;
  let fieldResult;
  ${asString ? te_letString : te_constDataEqualsEmptyArray}
  if (l === 0) {
${asString ? te_stringEqualsEmptyArrayString : te_noopComment}
  } else {
${asString ? te_stringEqualsLeftSquareBraceString : te.blank}\
    const mutablePathIndex = mutablePath.push(-1) - 1;

    // Now to populate the children...
    const directChild = bucket.children[childOutputPlan.layerPlan.id];
    let childBucket, childBucketIndex, lookup;
    if (directChild !== undefined) {
      childBucket = directChild.bucket;
      lookup = directChild.map.get(bucketIndex)
    }
    for (let i = 0; i < l; i++) {
      if (directChild !== undefined) {
        childBucketIndex = lookup[i];
      } else {
        const c = ${ref_getChildBucketAndIndex}(
          childOutputPlan,
          this,
          bucket,
          bucketIndex,
          i,
        );
        if (c !== null) {
          ([childBucket, childBucketIndex] = c);
        } else {
          childBucket = childBucketIndex = null;
        }
      }

      mutablePath[mutablePathIndex] = i;
${asString ? te_ifIGt0StrPlusEqualComma : te.blank}
${makeExecuteChildPlanCode(
  asString ? te_stringPlusEquals : te_dataIEquals,
  te_thisDotLocationDetails,
  te_childOutputPlan,
  childIsNonNull,
  asString,
)}
    }

    mutablePath.length = mutablePathIndex;
${asString ? te_stringPlusEqualsRbracket : te.blank}
  }
${
  canStream
    ? te`\
  const stream = bucketRootValue[${ref_$$streamMore}] /* as | AsyncIterableIterator<any> | undefined*/;
  if (stream !== undefined) {
    root.streams.push({
      root,
      path: mutablePath.slice(1),
      bucket,
      bucketIndex,
      outputPlan: childOutputPlan,
      label: childOutputPlan.layerPlan.reason.stream?.label,
      stream,
      startIndex: bucketRootValue.length,
    });
  }`
    : te.blank
}

  return ${asString ? te_string : te_data};
`,
    nameExtra: te`array${childIsNonNull ? te_underscoreNonNull : te.blank}${
      canStream ? te_underscoreStream : te.blank
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
 * TODO: write our own introspection execution!
 */
const introspect = (
  root: PayloadRoot,
  outputPlan: OutputPlan<OutputPlanTypeIntrospection>,
  mutablePath: ReadonlyArray<string | number>,
  asString: boolean,
) => {
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
    return asString ? JSON.stringify(cached) : cached;
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
  return asString ? JSON.stringify(result) : result;
};

const ref_introspect = te.ref(introspect, "introspect");

const introspectionExecutor = makeExecutor({
  inner: te`  return ${ref_introspect}(root, this, mutablePath, false)`,
  nameExtra: te.cache`introspection`,
  asString: false,
  skipNullHandling: true,
});
const introspectionExecutorString = makeExecutor({
  inner: te`  return ${ref_introspect}(root, this, mutablePath, true)`,
  nameExtra: te.cache`introspection`,
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
  callback: (
    fn: TAsString extends true
      ? typeof OutputPlan.prototype.executeString
      : typeof OutputPlan.prototype.execute,
  ) => void,
): void {
  if (!SAFE_NAME.test(typeName)) {
    throw new Error(
      `Unsafe type name: ${typeName}; doesn't conform to 'Name' in the GraphQL spec`,
    );
  }
  const keys: string[] = [];
  const fieldSpecs: FieldTypeDigest[] = [];
  let signature =
    (asString ? "s" : "o") +
    (isRoot ? "r" : "") +
    (hasDeferredOutputPlans ? "d" : "");
  let hasChildBucketReference = false;

  for (const [key, fieldSpec] of Object.entries(fieldTypes)) {
    if (!SAFE_NAME.test(key)) {
      // This should not be able to happen if the GraphQL operation is valid
      throw new Error(
        `Unsafe key: ${key}; doesn't conform to 'Name' in the GraphQL spec`,
      );
    }

    keys.push(key);
    fieldSpecs.push(fieldSpec);

    const { fieldType, sameBucket } = fieldSpec;
    switch (fieldType) {
      case "__typename": {
        signature += "_";
        break;
      }
      case "outputPlan?": {
        signature += "?";
        break;
      }
      case "outputPlan!": {
        signature += "!";
        break;
      }
      default: {
        const never: never = fieldType;
        throw new Error(`Unsupported field type '${never}'`);
      }
    }
    if (!sameBucket) {
      hasChildBucketReference = true;
      signature += "~";
    }
  }
  withObjectExecutorFactory(
    signature,
    fieldSpecs,
    hasDeferredOutputPlans,
    isRoot,
    asString,
    hasChildBucketReference,
    (factory) => {
      const fn = factory(typeName, ...keys);
      callback(fn);
    },
  );
}

type Factory<TAsString extends boolean> = (
  typeName: string,
  ...keys: string[]
) => TAsString extends true
  ? typeof OutputPlan.prototype.executeString
  : typeof OutputPlan.prototype.execute;

const makeObjectExecutorCache = new LRU<string, Factory<boolean>>({
  maxLength: 1000,
});
const makingObjectExecutorCallbacks = new Map<
  string,
  Array<(factory: Factory<boolean>) => void>
>();

function withObjectExecutorFactory<TAsString extends boolean>(
  signature: string,
  fieldSpecs: ReadonlyArray<FieldTypeDigest>,
  hasDeferredOutputPlans: boolean,
  isRoot: boolean,
  asString: TAsString,
  hasChildBucketReference: boolean,
  callback: (factory: Factory<TAsString>) => void,
) {
  const fn = makeObjectExecutorCache.get(signature);
  if (fn !== undefined) {
    return callback(fn);
  }
  const building = makingObjectExecutorCallbacks.get(signature);
  if (building !== undefined) {
    building.push(callback as (factory: Factory<boolean>) => void);
    return;
  }

  const callbacks = [callback as (factory: Factory<boolean>) => void];
  makingObjectExecutorCallbacks.set(signature, callbacks);

  const inner = te`\
  ${asString ? te_letStringLbrace : te_constObjEqualsObjectCreateNull}
  const { keys } = this;
  const mutablePathIndex = mutablePath.push("!") - 1;
  let spec${
    hasChildBucketReference ? te_childBucketCBIDC : te.blank
  }, fieldResult;

${te.join(
  fieldSpecs.map(({ fieldType, sameBucket }, i) => {
    switch (fieldType) {
      case "__typename": {
        if (asString) {
          // NOTE: this code relies on the fact that fieldName and typeName do
          // not require any quoting in JSON/JS - they must conform to GraphQL
          // `Name`.
          return te`  string += \`${
            i === 0 ? te.blank : te_comma
          }"\${fieldName_${te.lit(i)}}":"\${typeName}"\`;\n`;
        } else {
          return te`  obj[fieldName_${te.lit(i)}] = typeName;\n`;
        }
      }
      case "outputPlan!":
      case "outputPlan?": {
        return te`\
  mutablePath[mutablePathIndex] = fieldName_${te.lit(i)};
  spec = keys[fieldName_${te.lit(i)}];
${
  asString
    ? te`  string += \`${i === 0 ? te.blank : te_comma}"\${fieldName_${te.lit(
        i,
      )}}":\`;
`
    : te.blank
}\
${
  sameBucket
    ? te`\
${makeExecuteChildPlanCode(
  asString ? te_stringPlusEquals : te`obj[fieldName_${te.lit(i)}] =`,
  te_specDotLocationDetails,
  te_specDotOutputPlan,
  fieldType === "outputPlan!",
  asString,
  te_bucket,
  te_bucketIndex,
)}`
    : te`\
  directChild = bucket.children[spec.outputPlan.layerPlanId];
  if (directChild !== undefined) {
    childBucket = directChild.bucket;
    childBucketIndex = directChild.map.get(bucketIndex);
  } else {
    const c = ${ref_getChildBucketAndIndex}(
      spec.outputPlan,
      this,
      bucket,
      bucketIndex,
    );
    if (c !== null) {
      ([childBucket, childBucketIndex] = c);
    } else {
      childBucket = childBucketIndex = null;
    }
  }
${makeExecuteChildPlanCode(
  asString ? te_stringPlusEquals : te`obj[fieldName_${te.lit(i)}] =`,
  te_specDotLocationDetails,
  te_specDotOutputPlan,
  fieldType === "outputPlan!",
  asString,
)}`
}
`;
      }
      default: {
        const never: never = fieldType;
        throw new Error(
          `GrafastInternalError<879082f4-fe6f-4112-814f-852b9932ca83>: unsupported key type ${never}`,
        );
      }
    }
  }),
  "\n",
)}

  mutablePath.length = mutablePathIndex;
${asString ? te_stringPlusEqualsRbrace : te.blank}\
${hasDeferredOutputPlans ? te_handleDeferred : te.blank}
  return ${asString ? te_string : te_obj};`;

  const executorExpression = makeExecutorExpression({
    inner: inner,
    nameExtra: te_object,
    asString,
    skipNullHandling: isRoot,
    preamble: te.blank,
  });

  const factoryExpression = te`\
function objectExecutorFactory(typeName${te.join(
    fieldSpecs.map((_, i) => te`, fieldName_${te.lit(i)}`),
    "",
  )}) {
  return ${executorExpression};
}`;
  te.runInBatch<Factory<boolean>>(factoryExpression, (factory) => {
    makeObjectExecutorCache.set(signature, factory);
    makingObjectExecutorCallbacks.delete(signature);
    for (const callback of callbacks) {
      callback(factory);
    }
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
    jitParts.push(te.get(part));
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
