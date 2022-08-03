import type LRU from "@graphile/lru";
import * as assert from "assert";
import type {
  FieldNode,
  GraphQLError,
  GraphQLObjectType,
  GraphQLScalarType,
} from "graphql";
import { isObjectType } from "graphql";
import { inspect } from "util";

import { isDev } from "../dev.js";
import { $$concreteType, $$verbatim } from "../interfaces.js";
import type { ExecutableStep } from "../step.js";
import type { LayerPlan } from "./LayerPlan.js";

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
  introspectionCacheByVariableValues: LRU<string, unknown>;
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
};
export type OutputPlanTypePolymorphicObject = {
  /**
   * Return `{}` if non-null
   */
  mode: "polymorphic";
};
export type OutputPlanTypeArray = {
  /**
   * Return a list of the same length if an array
   */
  mode: "array";
  streamedOutputPlan?: OutputPlan;
};
export type OutputPlanTypeLeaf = {
  /**
   * Return the value.
   */
  mode: "leaf";
  stepId: number;
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

export type OutputPlanKeyValue =
  | {
      type: "outputPlan";
      outputPlan: OutputPlan;
      isNonNull: boolean;
    }
  | {
      type: "__typename";
    };

/**
 * Defines a way of taking a layerPlan and converting it into an output value.
 *
 * The result of executing an output plan will be the following:
 *
 * - data?: the data for this layer, could be object, array or leaf (see OutputPlanMode)
 * - errors: a list of errors that occurred (if any), including path details _within the output plan_
 * - streams: a list of streams that were created
 *
 */
export class OutputPlan {
  /**
   * The step that represents the root value. How this is used depends on the
   * OutputPlanMode.
   */
  public rootStepId: number;

  /**
   * For root/object output plans, the keys to set on the resulting object
   * grouped by the concrete object type name.
   *
   * IMPORTANT: the order of these keys is significant, they MUST match the
   * order in the request otherwise we break GraphQL spec compliance!
   */
  public keys: {
    [typeName: string]: {
      [key: string]: OutputPlanKeyValue;
    };
  } = Object.create(null);

  /**
   * For list output plans, the output plan that describes the list children.
   */
  public child: OutputPlan | null = null;
  public childIsNonNull = false;

  /**
   * For root/object/polymorphic output plan types only.
   */
  public deferredOutputPlans: OutputPlan[] = [];

  constructor(
    public layerPlan: LayerPlan,
    rootStep: ExecutableStep,
    public readonly type: OutputPlanType,
  ) {
    this.rootStepId = rootStep.id;
    if (type.mode === "polymorphic") {
      if (this.layerPlan.reason.type !== "polymorphic") {
        throw new Error(
          "Polymorphic output plan with non-polymorphic layer plan?",
        );
      }
      const typeNames = this.layerPlan.reason.typeNames;
      for (const typeName of typeNames) {
        this.keys[typeName] = Object.create(null);
      }
    } else if (type.mode === "object" || type.mode === "root") {
      this.keys[type.typeName] = Object.create(null);
    }
  }

  addChild(
    type: GraphQLObjectType | null,
    key: string | null,
    child: OutputPlanKeyValue,
  ): void {
    if (
      this.type.mode === "root" ||
      this.type.mode === "object" ||
      this.type.mode === "polymorphic"
    ) {
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
        if (!this.keys[type.name]) {
          throw new Error(
            `GraphileInternalError<58c311df-8bbc-4dad-bd1f-562cc38f9a06>: type '${type.name}' not known to this OutputPlan`,
          );
        }
        if (this.keys[type.name][key]) {
          throw new Error(
            `GraphileInternalError<5ceecb19-8c2c-4797-9be5-9be1b207fa45>: child already set for type '${type.name}' key '${key}'`,
          );
        }
      }
      this.keys[type!.name][key!] = child;
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
    } else {
      throw new Error(
        `GraphileInternalError<5667df5f-30b7-48d3-be3f-a0065ed9c05c>: Doesn't make sense to set a child in mode '${this.type.mode}'`,
      );
    }
  }

  /** @internal */
  public objectCreator: ((typeName: string) => Record<string, unknown>) | null =
    null;
  finalize() {
    if (["root", "object", "polymorphic"].includes(this.type.mode)) {
      this.objectCreator = this.makeObjectCreator();
    }
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
    for (const typeName in this.keys) {
      for (const key in this.keys[typeName]) {
        const spec = this.keys[typeName][key];
        if (spec.type === "outputPlan") {
          if (spec.outputPlan.layerPlan !== this.layerPlan) {
            spec.outputPlan.getLayerPlans(layerPlans);
            layerPlans.add(spec.outputPlan.layerPlan);
          }
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
  makeObjectCreator(): (typeName: string | null) => Record<string, unknown> {
    const supportedTypeNames = Object.keys(this.keys);
    const possibilities: string[] = [];
    for (const typeName of supportedTypeNames) {
      const fields = this.keys[typeName];
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

      const handler = `\
if (typeName === ${JSON.stringify(typeName)}) {
  return Object.assign(Object.create(verbatimPrototype), {
  [$$concreteType]: typeName,
${Object.entries(fields)
  .map(([fieldName, keyValue]) => {
    switch (keyValue.type) {
      case "outputPlan":
        return `    ${JSON.stringify(fieldName)}: undefined,\n`;
      case "__typename":
        return `    ${JSON.stringify(fieldName)}: typeName,\n`;
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
  .join("")}
  });
}`;
      possibilities.push(handler);
    }
    const functionBody = `\
return typeName => {
${possibilities.join("\n")}
throw new Error(\`GraphileInternalError<03e5d669-5029-41d6-bfbe-5ec563d3fc5b>: Unhandled typeName '\${typeName}'\`);
}
`;
    const f = new Function("verbatimPrototype", "$$concreteType", functionBody);
    return f(verbatimPrototype, $$concreteType) as any;
  }
}

/**
 * Use this via `Object.create(verbatimPrototype)` to mark an object as being
 * allowed to be used verbatim (i.e. it can be returned directly to the user
 * without having to go through GraphQL.js).
 */
const verbatimPrototype = Object.freeze(
  Object.assign(Object.create(null), { [$$verbatim]: true }),
);
