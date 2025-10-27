import type {
  GraphQLFieldResolver,
  GraphQLInterfaceType,
  GraphQLResolveInfo,
  GraphQLUnionType,
} from "graphql";
import * as graphql from "graphql";

import type { __ItemStep, ExecutionDetails, ObjectStep } from "../index.js";
import { context, flagError } from "../index.js";
import type {
  PlanTypeInfo,
  TrackedArguments,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import { Step, UnbatchedStep } from "../step.js";
import { isPromiseLike } from "../utils.js";

const { defaultTypeResolver } = graphql;

type ResolveInfoBase = Omit<
  GraphQLResolveInfo,
  "path" | "rootValue" | "variableValues"
>;

/**
 * Calls the given GraphQL resolver for each input - emulates GraphQL
 * resolution.
 *
 * @internal
 */
export class GraphQLResolverStep extends UnbatchedStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "GraphQLResolverStep",
  };
  isSyncAndSafe = false;
  allowMultipleOptimizations = false;

  /** root fields can have null parent */
  private isNotRoot: boolean;
  constructor(
    private resolver:
      | (GraphQLFieldResolver<any, any> & { displayName?: string })
      | null
      | undefined,
    private subscriber:
      | (GraphQLFieldResolver<any, any> & { displayName?: string })
      | null
      | undefined,
    $plan: Step,
    $args: ObjectStep<TrackedArguments>,
    private resolveInfoBase: ResolveInfoBase,
  ) {
    super();
    this.addDependency($plan);
    this.addDependency($args);
    this.addDependency(context());
    this.addDependency(this.operationPlan.variableValuesStep);
    this.addDependency(this.operationPlan.rootValueStep);
    this.isNotRoot = ![
      this.operationPlan.queryType,
      this.operationPlan.mutationType,
      this.operationPlan.subscriptionType,
    ].includes(resolveInfoBase.parentType);
  }

  toStringMeta() {
    const resolverName =
      this.resolver?.displayName ||
      this.resolver?.name ||
      this.subscriber?.displayName ||
      this.subscriber?.name ||
      null;
    return `${this.resolveInfoBase.parentType.name}.${this.resolveInfoBase.fieldName}${
      resolverName && resolverName !== "resolve" ? `:${resolverName}` : ""
    }`;
  }

  unbatchedExecute(
    extra: UnbatchedExecutionExtra,
    source: any,
    args: any,
    context: any,
    variableValues: any,
    rootValue: any,
  ): any {
    if (!extra.stream) {
      if (this.isNotRoot && source == null) {
        return source;
      }
      const resolveInfo: GraphQLResolveInfo = Object.assign(
        Object.create(this.resolveInfoBase),
        {
          variableValues,
          rootValue,
          path: {
            typename: this.resolveInfoBase.parentType.name,
            key: this.resolveInfoBase.fieldName,
            // ENHANCE: add full support for path (requires runtime indexes)
            prev: undefined,
          },
        },
      );
      const data = this.resolver?.(source, args, context, resolveInfo);
      return flagErrorIfErrorAsync(data);
    } else {
      if (this.isNotRoot) {
        return Promise.reject(new Error(`Invalid non-root subscribe`));
      }
      if (this.subscriber == null) {
        return Promise.reject(new Error(`Cannot subscribe to field`));
      }
      const resolveInfo: GraphQLResolveInfo = Object.assign(
        Object.create(this.resolveInfoBase),
        {
          // ENHANCE: add support for path
          variableValues,
          rootValue,
        },
      );
      const data = this.subscriber(source, args, context, resolveInfo);
      // TODO: should apply flagErrorIfError to each value data yields
      return flagErrorIfErrorAsync(data);
    }
  }
}

/** @internal */
export class GraphQLResolveTypeStep extends Step {
  static $$export = {
    moduleName: "grafast",
    exportName: "GraphQLResolveTypeStep",
  };
  private abstractType: GraphQLUnionType | GraphQLInterfaceType;
  private resolveInfoBase: Omit<
    GraphQLResolveInfo,
    "rootValue" | "variableValues"
  >;
  // Could be promises
  public isSyncAndSafe = false;
  constructor($stepOrSpecifier: Step, info: PlanTypeInfo) {
    super();
    const { abstractType } = info;
    this.abstractType = abstractType;
    this.resolveInfoBase = {
      ...this.operationPlan.resolveInfoOperationBase,
      // TODO: this resolveInfo is seriously hacked, we don't know a number of
      // things that _shouldn't_ be necessary for figuring out the type, so
      // we'll run in this crippled state.
      // Really we should inherit the resolveInfo from the field itself, but
      // currently that doesn't get passed through. Maybe it should have its
      // own step which we pass through as a dependency?
      fieldName: null as any,
      parentType: null as any,
      path: null as any,
      fieldNodes: null as any,
      // Even this is a lie
      returnType: abstractType,
    };
    this.addDataDependency($stepOrSpecifier);
    this.addUnaryDependency(context());
    this.addUnaryDependency(this.operationPlan.variableValuesStep);
    this.addUnaryDependency(this.operationPlan.rootValueStep);
  }

  /**
   * Akin to graphql-js' completeAbstractValue... but just the typeName
   * resolution part.
   */
  private figureOutTheTypeOf(
    data: unknown,
    context: unknown,
    resolveInfo: GraphQLResolveInfo,
  ) {
    const abstractType = this.abstractType;
    if (abstractType.resolveType != null) {
      return abstractType.resolveType(data, context, resolveInfo, abstractType);
    } else {
      return defaultTypeResolver(data, context, resolveInfo, abstractType);
    }
  }

  execute({
    indexMap,
    values: [values0, contextVal, variableValuesVal, rootValueVal],
  }: ExecutionDetails) {
    const context = contextVal.unaryValue();
    const variableValues = variableValuesVal.unaryValue();
    const rootValue = rootValueVal.unaryValue();
    const resolveInfo: GraphQLResolveInfo = {
      ...this.resolveInfoBase,
      rootValue,
      variableValues,
    };
    return indexMap((i) => {
      const data = values0.at(i);
      if (data == null) {
        return data;
      } else if (isPromiseLike(data)) {
        return data.then((resolvedData: unknown) =>
          this.figureOutTheTypeOf(resolvedData, context, resolveInfo),
        );
      } else {
        return this.figureOutTheTypeOf(data, context, resolveInfo);
      }
    });
  }
}

export function graphqlResolveType($stepOrSpecifier: Step, info: PlanTypeInfo) {
  return new GraphQLResolveTypeStep($stepOrSpecifier, info);
}

/**
 * Emulates what GraphQL does when calling a resolver, including handling of
 * polymorphism.
 *
 * @internal
 */
export function graphqlResolver(
  resolver: GraphQLFieldResolver<any, any> | null | undefined,
  subscriber: GraphQLFieldResolver<any, any> | null | undefined,
  $step: Step,
  $args: ObjectStep<TrackedArguments>,
  resolveInfoBase: ResolveInfoBase,
): Step {
  return new GraphQLResolverStep(
    resolver,
    subscriber,
    $step,
    $args,
    resolveInfoBase,
  );
}

function flagErrorIfError(data: any) {
  return data instanceof Error ? flagError(data) : data;
}

function flagErrorIfErrorAsync(data: any) {
  if (isPromiseLike(data)) {
    return data.then(flagErrorIfError);
  } else {
    return flagErrorIfError(data);
  }
}
