import { Constraint } from "./constraints";
import {
  GraphQLSchema,
  OperationDefinitionNode,
  FragmentDefinitionNode,
} from "graphql";
import { Plan, TrackedObjectPlan } from "./plan";

/**
 * Implements the `NewAether` algorithm.
 */
export class Aether {
  public maxGroupId = 0;
  public groupId = this.maxGroupId;
  public readonly plans: Plan[] = [];
  public readonly planIdByPathIdentity: { [pathIdentity: string]: number } = {};
  public readonly valueIdByObjectByPlanId: {
    [planId: number]: WeakMap<object, symbol>;
  } = {};
  public readonly variableValuesConstraints: Constraint[] = [];
  public readonly variableValuesPlan: TrackedObjectPlan;
  public readonly contextConstraints: Constraint[] = [];
  public readonly contextPlan: TrackedObjectPlan;
  public readonly rootValueConstraints: Constraint[] = [];
  public readonly rootValuePlan: TrackedObjectPlan;
  public readonly operationType: "query" | "mutation" | "subscription";

  constructor(
    public readonly schema: GraphQLSchema,
    // Note: whereas the `NewAether` algorithm refers to `document` and
    // `operationName`; we use `operation` and `fragments` because they're
    // easier to access in GraphQL.js
    public readonly operation: OperationDefinitionNode,
    public readonly fragments: {
      [fragmentName: string]: FragmentDefinitionNode;
    },
    public readonly variableValues: {
      [variableName: string]: unknown;
    },
    public readonly context: {
      [key: string]: unknown;
    },
    public readonly rootValue: unknown,
  ) {
    this.variableValuesPlan = new TrackedObjectPlan(
      this,
      variableValues,
      this.variableValuesConstraints,
    );
    this.contextPlan = new TrackedObjectPlan(
      this,
      context,
      this.contextConstraints,
    );
    this.rootValuePlan = new TrackedObjectPlan(
      this,
      rootValue,
      this.rootValueConstraints,
    );
    this.operationType = operation.operation;
    switch (this.operationType) {
      case "query": {
        this.planQuery();
        break;
      }
      case "mutation": {
        this.planMutation();
        break;
      }
      case "subscription": {
        this.planSubscription();
        break;
      }
      default: {
        const never: never = this.operationType;
        throw new Error(`Unsupported operation type '${never}'.`);
      }
    }

    this.optimizePlans();
    this.treeShakePlans();
    this.finalizePlans();
  }

  /**
   * Implements the `PlanAetherQuery` algorithm.
   */
  planQuery(): void {
    const rootType = this.schema.getQueryType();
    this.planSelectionSet(
      "",
      this.rootValuePlan,
      rootType,
      this.operation.selectionSet,
    );
  }

  /**
   * Implements the `PlanAetherMutation` algorithm.
   */
  planMutation(): void {
    const rootType = this.schema.getMutationType();
    if (!rootType) {
      return;
    }
    this.planSelectionSet(
      "",
      this.rootValuePlan,
      rootType,
      this.operation.selectionSet,
      true,
    );
  }

  /**
   * Implements the `PlanAetherSubscription` algorithm.
   */
  planSubscription(): void {
    const rootType = this.schema.getSubscriptionType();
    if (!rootType) {
      return;
    }
    const selectionSet = this.operation.selectionSet;
    const variableValuesPlan = this.variableValuesPlan;
    const groupedFieldSet = graphqlCollectFields(
      rootType,
      selectionSet,
      variableValuesPlan,
    );
    // TODO: continue
    // this.planSelectionSet("", this.rootValuePlan, rootType, selectionSet, true);
  }

  /**
   * Implements the `OptimizePlans` algorithm.
   */
  optimizePlans(): void {
    for (let i = this.plans.length - 1; i >= 0; i--) {
      this.plans[i] = this.optimizePlan(this.plans[i]);
    }
  }

  /**
   * Implements the `OptimizePlan` algorithm.
   */
  optimizePlan(plan: Plan): Plan {
    return plan;
  }
}
