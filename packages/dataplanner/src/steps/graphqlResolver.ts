import type { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";

import type { ObjectStep } from "../index.js";
import { context } from "../index.js";
import type { CrystalResultsList, CrystalValuesList } from "../interfaces.js";
import { ExecutableStep } from "../step.js";

/**
 * Calls the given GraphQL resolver for each input - emulates GraphQL
 * resolution.
 *
 * @internal
 */
export class GraphQLResolverStep extends ExecutableStep {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "GraphQLResolverStep",
  };
  isSyncAndSafe = false;
  allowMultipleOptimizations = false;

  private planDep: number;
  private argsDep: number;
  private contextDep: number;
  constructor(
    private resolver: GraphQLFieldResolver<any, any> & { displayName?: string },
    $plan: ExecutableStep,
    $args: ObjectStep,
  ) {
    super();
    this.planDep = this.addDependency($plan);
    this.argsDep = this.addDependency($args);
    this.contextDep = this.addDependency(context());
  }

  toStringMeta() {
    return this.resolver.displayName || this.resolver.name;
  }

  deduplicate(peers: GraphQLResolverStep[]): GraphQLResolverStep[] {
    return peers.filter((peer) => peer.resolver === this.resolver);
  }

  execute(values: [CrystalValuesList<any>]): CrystalResultsList<any> {
    return values[this.planDep].map((source, i) => {
      try {
        const args = values[this.argsDep][i];
        const context = values[this.contextDep][i];
        const resolveInfo = makeResolveInfo();
        return this.resolver(source, args, context, resolveInfo);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }
}

function makeResolveInfo(): GraphQLResolveInfo {
  // TODO: at least fake _some_ of ResolveInfo!
  return new Proxy(Object.create(null), {
    get(target, p) {
      throw new Error(
        `GraphileInternalError<0d3f1e5e-617b-41ea-95c2-e86370e9a2d4>: DataPlanner doesn't currently implement the '${String(
          p,
        )}' field on GraphQLResolveInfo, sorry!`,
      );
    },
  });
}

/**
 * Emulates what GraphQL does when calling a resolver.
 *
 * @internal
 */
export function graphqlResolver(
  resolver: GraphQLFieldResolver<any, any>,
  $plan: ExecutableStep,
  $args: ObjectStep,
): GraphQLResolverStep {
  return new GraphQLResolverStep(resolver, $plan, $args);
}
