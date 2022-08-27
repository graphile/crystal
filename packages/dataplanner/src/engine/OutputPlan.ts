import type LRU from "@graphile/lru";
import * as assert from "assert";
import type { FieldNode, GraphQLObjectType, GraphQLScalarType } from "graphql";
import { isObjectType } from "graphql";
import { inspect } from "util";

import { isDev } from "../dev.js";
import { newNonNullError } from "../error.js";
import type { JSONObject, JSONValue, LocationDetails } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import type { PayloadRoot } from "./executeOutputPlan.js";
import type { LayerPlan } from "./LayerPlan.js";

export type ObjectCreator = (
  root: PayloadRoot,
  path: ReadonlyArray<string | number>,
  callback: (key: string, spec: OutputPlanKeyValueOutputPlan) => JSONValue,
) => JSONObject;

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
  serialize: GraphQLScalarType["serialize"];
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
  public rootStepId: number;

  // TODO: since polymorphic handles branching, we can remove the `typeName` layer from this.
  /**
   * For root/object output plans, the keys to set on the resulting object
   * grouped by the concrete object type name.
   *
   * IMPORTANT: the order of these keys is significant, they MUST match the
   * order in the request otherwise we break GraphQL spec compliance!
   */
  public keys: {
    [key: string]: OutputPlanKeyValue;
  } = Object.create(null);

  /**
   * For list output plans, the output plan that describes the list children.
   */
  public child: OutputPlan | null = null;
  public childIsNonNull = false;

  /**
   * For polymorphic output plans, the Object output plan for each specific type.
   */
  public childByTypeName: {
    [typeName: string]: OutputPlan<OutputPlanTypeObject>;
  } = Object.create(null);

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
    this.rootStepId = rootStep.id;
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
                : val.outputPlan.print().replace(/\n/g, "\n  ")
            }`;
          })
          .join("\n")}`;
      }
      case "polymorphic": {
        return `${this.toString()}\n${Object.entries(this.childByTypeName)
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
        )}`;
      }
      default: {
        return this.toString();
      }
    }
  }

  toString() {
    return `OutputPlan<${this.type.mode}∈${this.layerPlan.id}!${this.rootStepId}>`;
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
            `GraphileInternalError<7334ec50-23dc-442a-8ffa-19664c9eb79f>: Key must be provided in ${this.type.mode} OutputPlan mode`,
          );
        }
        if (type == null) {
          throw new Error(
            `GraphileInternalError<638cebef-4ec6-49f4-b681-2f390fb1c0fc>: Type must be provided in ${this.type.mode} OutputPlan mode.`,
          );
        }
        if (!isObjectType(type)) {
          throw new Error(
            `GraphileInternalError<eaa87576-1d50-49be-990a-345a9b57b998>: Type must provided in ${this.type.mode} OutputPlan mode must be an object type, instead saw '${type}'.`,
          );
        }
        assert.ok(
          ["root", "object"].includes(this.type.mode),
          "Can only addChild on root/object output plans",
        );
        if (this.keys[key]) {
          throw new Error(
            `GraphileInternalError<5ceecb19-8c2c-4797-9be5-9be1b207fa45>: child already set for key '${key}'`,
          );
        }
      }
      this.keys[key!] = child;
    } else if (this.type.mode === "array") {
      if (isDev) {
        if (key != null) {
          throw new Error(
            `GraphileInternalError<7de67325-a02f-4619-b118-61bb2d84f33b>: Key must not be provided in ${this.type.mode} OutputPlan mode`,
          );
        }
        assert.ok(type == null, "Array should not specify type");
        if (this.child) {
          throw new Error(
            `GraphileInternalError<07059d9d-a47d-441f-b834-683cca1d856a>: child already set`,
          );
        }
      }
      if (child.type === "outputPlan") {
        this.child = child.outputPlan;
        this.childIsNonNull = child.isNonNull;
      } else {
        throw new Error(
          `GraphileInternalError<7525c854-9145-4c6d-8d60-79c14f040519>: Array child must be an outputPlan`,
        );
      }
    } else if (this.type.mode === "polymorphic") {
      assert.ok(
        type && this.type.typeNames.includes(type.name),
        "GraphileInternalError<566a34ac-1138-4dbf-943e-f704819431dd>: polymorphic output plan can only addChild for a matching type",
      );
      assert.strictEqual(
        key,
        null,
        "GraphileInternalError<4346ebda-a02d-4489-b767-7a6d621a73c7>: addChild for polymorphic OutputPlan should not specify a key",
      );
      assert.ok(
        child.type === "outputPlan",
        "GraphileInternalError<b29285da-fb07-4943-9038-708edc785041>: polymorphic OutputPlan child must be an outputPlan",
      );
      assert.ok(
        child.outputPlan.type.mode === "object",
        "GraphileInternalError<203469c6-4bfa-4cd1-ae82-cc5d0132ca16>: polymorphic OutputPlan child must be an object outputPlan",
      );
      this.childByTypeName[type.name] =
        child.outputPlan as OutputPlan<OutputPlanTypeObject>;
    } else {
      throw new Error(
        `GraphileInternalError<5667df5f-30b7-48d3-be3f-a0065ed9c05c>: Doesn't make sense to set a child in mode '${this.type.mode}'`,
      );
    }
  }

  /** @internal */
  public objectCreator: ObjectCreator | null = null;
  finalize() {
    if (this.type.mode === "root" || this.type.mode === "object") {
      this.objectCreator = this.makeObjectCreator(this.type.typeName);
    }

    this.rootStepId = this.layerPlan.operationPlan.dangerouslyGetStep(
      this.rootStepId,
    ).id;
  }

  getLayerPlans(layerPlans = new Set<LayerPlan>()): Set<LayerPlan> {
    // Find all the layerPlans referenced
    layerPlans.add(this.layerPlan);
    if (this.child) {
      if (this.child.layerPlan != this.layerPlan) {
        this.child.getLayerPlans(layerPlans);
      } else {
        throw new Error(
          "GraphileInternalError<4013e05f-b8ed-41ea-a869-204232d02763>: how could the child be in the same layer?",
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

  /**
   * Returns a function that, given a type name, creates an object with the
   * fields in the given order.
   */
  makeObjectCreator(typeName: string): ObjectCreator {
    const fields = this.keys;
    const keys = Object.keys(fields);
    /*
     * NOTE: because we use `Object.create(verbatimPrototype)` (and
     * `verbatimPrototype` is based on Object.create(null)) it's safe for us to
     * set keys such as `__proto__`. This would not be safe if we were to use
     * `{}` instead.
     */
    const unsafeKeys = keys.filter(
      (key) => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(key),
    );
    if (unsafeKeys.length > 0) {
      throw new Error(
        `Unsafe keys: ${unsafeKeys.join(
          ",",
        )}; these don't conform to 'Name' in the GraphQL spec`,
      );
    }

    // We can't initialize the object if it contains `__proto__`, `constructor`, or similar.
    const objectPrototypeKeys = Object.keys(
      Object.getOwnPropertyDescriptors(Object.prototype),
    );
    const unsafeToInitialize = keys.some((key) =>
      objectPrototypeKeys.includes(key),
    );

    const functionBody = `return (root, path, callback) => {
  const obj = ${
    unsafeToInitialize
      ? `Object.create(null)`
      : `Object.assign(Object.create(null), {
${Object.entries(fields)
  .map(([fieldName, keyValue]) => {
    switch (keyValue.type) {
      case "__typename":
        return `    ${JSON.stringify(fieldName)}: typeName,\n`;
      case "outputPlan":
        return `    ${JSON.stringify(fieldName)}: undefined,\n`;
      default: {
        const never: never = keyValue;
        throw new Error(
          `GraphileInternalError<879082f4-fe6f-4112-814f-852b9932ca83>: unsupported key type ${inspect(
            never,
          )}`,
        );
      }
    }
  })
  .join("")}  })`
  };
${Object.entries(fields)
  .map(([fieldName, keyValue]) => {
    switch (keyValue.type) {
      case "__typename": {
        if (unsafeToInitialize) {
          return `  obj.${fieldName} = typeName;`;
        } else {
          // Already handled (during initialize)
          return ``;
        }
      }
      case "outputPlan": {
        if (keyValue.isNonNull) {
          // We cannot be null
          return `\
  {
    const fieldResult = callback(${JSON.stringify(
      fieldName,
    )}, keys.${fieldName});
    if (fieldResult == null) {
      throw nonNullError(keys.${fieldName}.locationDetails, [...path, ${JSON.stringify(
            fieldName,
          )}]);
    }
    obj.${fieldName} = fieldResult;
  }`;
        } else {
          // We're the null handler; we should catch errors from children
          return `\
  try {
    const fieldResult = callback(${JSON.stringify(
      fieldName,
    )}, keys.${fieldName});
    if (fieldResult == null) {
      obj.${fieldName} = null;
    } else {
      obj.${fieldName} = fieldResult;
    }
  } catch (e) {
    obj.${fieldName} = null;
    root.errors.push(e);
  }`;
        }
      }
      default: {
        const never: never = keyValue;
        throw new Error(
          `GraphileInternalError<879082f4-fe6f-4112-814f-852b9932ca83>: unsupported key type ${inspect(
            never,
          )}`,
        );
      }
    }
  })
  .join("\n")}
  return obj;
}`;

    const f = new Function("typeName", "keys", "newNonNullError", functionBody);
    return f(typeName, this.keys, newNonNullError) as any;
  }
}
