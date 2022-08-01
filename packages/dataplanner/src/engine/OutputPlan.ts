import type LRU from "@graphile/lru";
import * as assert from "assert";
import type {
  FieldNode,
  GraphQLEnumType,
  GraphQLError,
  GraphQLObjectType,
  GraphQLScalarType,
} from "graphql";

import { isDev } from "../dev.js";
import type { ExecutableStep } from "../step.js";
import type { LayerPlan } from "./LayerPlan.js";

/**
 * - `root` - always return `{}`
 * - `object` - if non-null return `{}` otherwise `null`
 * - `array` - if non-null then assert it's a list and return a list with the
 *   same length, otherwise `null`
 * - `leaf` - return the value - typically useful for lists (and streams) of
 *   scalars.
 *
 * Note 'root' and 'object' are basically the same, except root doesn't care
 * about the plan value.
 */
export type OutputPlanMode =
  | { mode: "root"; typeName: string }
  | {
      mode: "object";
      /** If null, polymorphic, otherwise concrete object type */
      typeName: string | null;
    }
  | { mode: "array" }
  | { mode: "leaf"; type: GraphQLScalarType | GraphQLEnumType }
  | { mode: "null" };

export type KeyModeTypename = {
  mode: "__typename";
  isNonNull: true;
};
export type KeyModeIntrospection = {
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
  introspectionCacheByVariableValues: LRU<
    string,
    { data: any; errors?: GraphQLError[] }
  >;
  isNonNull: boolean;
};
export type KeyModeObject = {
  mode: "object";
  outputPlan: OutputPlan;
  isNonNull: boolean;
};
export type KeyModeArray = {
  mode: "array";
  listOutputPlan: OutputPlan;
  isNonNull: boolean;
};
export type KeyModeLeaf = {
  mode: "leaf";
  stepId: number;
  isNonNull: boolean;
  serialize: GraphQLScalarType["serialize"];
};
export type KeyModeNull = {
  mode: "null";
  /** If true, we must always throw an error */
  isNonNull: boolean;
};
export type OutputPlanChild =
  | KeyModeTypename
  | KeyModeIntrospection
  | KeyModeObject
  | KeyModeArray
  | KeyModeLeaf
  | KeyModeNull;

/**
 * Defines a way of taking a layerPlan and converting it into an output value.
 *
 * The result of executing an output plan will be the following:
 *
 * - data?: the data for this layer, could be object, array or leaf (see OutputPlanMode)
 * - errors: a list of errors that occurred (if any), including path details _within the output plan_
 * - streams: a list of streams that were created
 */
export class OutputPlan {
  /**
   * The step that represents the root value. How this is used depends on the
   * OutputPlanMode.
   */
  public rootStepId: number;

  /**
   * The list of response keys known, in the same order as they occur in the
   * GraphQL document.
   */
  public knownKeys: string[] = [];

  /**
   * For root/object output plans, the keys to set on the resulting object grouped by the concrete object type name
   */
  public keys: {
    [typeName: string]: {
      [key: string]: OutputPlanChild;
    };
  } = Object.create(null);

  /**
   * For list output plans, the output plan that describes the list children.
   */
  public child: OutputPlanChild | null = null;

  constructor(
    public layerPlan: LayerPlan,
    rootStep: ExecutableStep,
    public readonly mode: OutputPlanMode,
    public readonly nonNull: boolean,
  ) {
    this.rootStepId = rootStep.id;
  }

  addChild(
    type: GraphQLObjectType | null,
    key: string | null,
    child: OutputPlanChild,
  ): void {
    if (this.mode === "root" || this.mode === "object") {
      if (isDev) {
        if (typeof key !== "string") {
          throw new Error(
            `GraphileInternalError<7334ec50-23dc-442a-8ffa-19664c9eb79f>: Key must be provided in ${this.mode} OutputPlan mode`,
          );
        }
        if (type == null) {
          throw new Error(
            `GraphileInternalError<638cebef-4ec6-49f4-b681-2f390fb1c0fc>: Type must be provided in ${this.mode} OutputPlan mode.`,
          );
        }
        assert.ok(
          ["root", "object"].includes(this.mode),
          "Can only addChild on root/object output plans",
        );
        if (this.keys[type.name][key]) {
          throw new Error(
            `GraphileInternalError<5ceecb19-8c2c-4797-9be5-9be1b207fa45>: child already set`,
          );
        }
      }
      if (!this.knownKeys.includes(key!)) {
        this.knownKeys.push(key!);
      }
      this.keys[type!.name][key!] = child;
    } else {
      if (isDev) {
        if (key != null) {
          throw new Error(
            `GraphileInternalError<7de67325-a02f-4619-b118-61bb2d84f33b>: Key must not be provided in ${this.mode} OutputPlan mode`,
          );
        }
        assert.ok(
          type == null,
          "If key is not provided then type must not be also",
        );
        assert.ok(
          ["array"].includes(this.mode),
          "Can only addChild on root/object output plans",
        );
        if (this.child) {
          throw new Error(
            `GraphileInternalError<07059d9d-a47d-441f-b834-683cca1d856a>: child already set`,
          );
        }
      }
      this.child = child;
    }
  }
}
