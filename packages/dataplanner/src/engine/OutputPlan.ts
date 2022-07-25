import type LRU from "@graphile/lru";
import * as assert from "assert";
import type { FieldNode, GraphQLError } from "graphql";

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
export type OutputPlanMode = "root" | "object" | "array" | "leaf";

export type KeyModeTypename = {
  mode: "__typename";
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
};
export type KeyModeObject = {
  mode: "object";
  outputPlan: OutputPlan;
};
export type KeyModeArray = {
  mode: "array";
  outputPlan: OutputPlan;
};
export type OutputPlanChild =
  | KeyModeTypename
  | KeyModeIntrospection
  | KeyModeObject
  | KeyModeArray;

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
   * For root/object output plans, the keys to set on the resulting object
   */
  public keys: {
    [key: string]: OutputPlanChild;
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

  addChild(key: string | null, child: OutputPlanChild): void {
    if (typeof key === "string") {
      if (isDev) {
        assert.ok(
          ["root", "object"].includes(this.mode),
          "Can only addChild on root/object output plans",
        );
      }
      if (this.keys[key]) {
        throw new Error(
          `GraphileInternalError<5ceecb19-8c2c-4797-9be5-9be1b207fa45>: child already set`,
        );
      }
      this.keys[key] = child;
    } else {
      if (isDev) {
        assert.ok(
          ["array"].includes(this.mode),
          "Can only addChild on root/object output plans",
        );
      }
      if (this.child) {
        throw new Error(
          `GraphileInternalError<07059d9d-a47d-441f-b834-683cca1d856a>: child already set`,
        );
      }
      this.child = child;
    }
  }
}
