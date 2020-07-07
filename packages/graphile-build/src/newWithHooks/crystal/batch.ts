import {
  GraphQLResolveInfo,
} from "graphql";
import {
  GraphQLArguments,
  CrystalResult,
  PathIdentity,
  Plan,
  $$path,
  $$batch,
  $$data,
} from "./interfaces";
import { getPathIdentityFromResolveInfo } from "./utils";
import { isCrystalResult } from "./crystalResult";
import { Aether } from "./aether";

/**
 * What a Batch knows about a particular PathIdentity
 */
interface Info {
  pathIdentity: PathIdentity;
  graphile: GraphileEngine.GraphQLObjectTypeGraphileExtension | null;
  plan: Plan;
}

/**
 * When a resolver needs a plan to be executed, that execution takes place
 * within a Batch. The first resolver (field) to create the Batch is called the
 * "batch root". We'll try and expand as far from the batch root as we can,
 * looking ahead in the GraphQL query and pro-actively calling the plans for
 * subfields, arguments, etc. A batch has "dependencies", the values used from
 * variables, context, rootValue, etc. Next time we come to build a Batch in a
 * batch root we will look at the previous Batches, and if the dependencies
 * match we can consider re-using the previous Batch.
 *
 * IMPORTANT: the same "batch root" field may result in many calls to create a
 * batch, but like in DataLoader, future calls should be grouped - we can do
 * so using the PathIdentity of the batch root.
 */
export class Batch {
  /**
   * Await this promise; when it's done the batch is ready to be used.
   */
  public promise: Promise<void>;

  private infoByPathIdentity: Map<PathIdentity, Info>;

  constructor(
    public readonly aether: Aether;
    parent: unknown,
    args: GraphQLArguments,
    context: GraphileEngine.GraphileResolverContext,
    info: GraphQLResolveInfo,
  ) {
    this.infoByPathIdentity = new Map();
    this.execute(parent, args, context, info);
    this.promise = Promise.resolve();
  }

  /**
   * Populates infoByPathIdentity **synchronously**.
   */
  execute(
    parent: unknown,
    args: GraphQLArguments,
    context: GraphileEngine.GraphileResolverContext,
    info: GraphQLResolveInfo,
  ) {
    const pathIdentity = getPathIdentityFromResolveInfo(info, isCrystalResult(parent) ? parent[$$path] : undefined);
    const digest = this.aether.doc.digestForPath(pathIdentity, info.variableValues)

    const graphile: GraphileEngine.GraphQLObjectTypeGraphileExtension =
      info.parentType.extensions?.graphile || {};
    const { plan: planResolver } = graphile;
    // TODO: apply the args here
    /*
     * Since a batch runs for a single (optionally aliased) field in the
     * operation, we know that the args for all entries within the batch will
     * be the same. Note, however, that the selection set may differ.
     */
    const field = info.parentType.getFields()[info.fieldName];
    for (const arg of field.args) {
      if (arg.name in args) {
        const graphile: GraphileEngine.GraphQLFieldGraphileExtension =
          arg.extensions?.graphile;
        if (graphile) {
          graphile.argPlan?.(
            this,
            args[arg.name],
            parent?.[$$record],
            args,
            context,
          );
        }
      }
    }
    // TODO (somewhere else): selection set fields' dependencies
    // TODO (somewhere else): selection set fields' args' dependencies (e.g. includeArchived: 'inherit')
  }

  appliesTo(pathIdentity: PathIdentity): boolean {
    return !!this.infoByPathIdentity.get(pathIdentity);
  }

  async getResultFor(
    parent: unknown,
    info: GraphQLResolveInfo,
  ): Promise<CrystalResult> {
    await this.promise;
    const pathIdentity = getPathIdentityFromResolveInfo(
      info,
      isCrystalResult(parent) ? parent[$$path] : undefined,
    );
    const data = null;
    return {
      [$$batch]: this,
      [$$data]: data,
      [$$path]: pathIdentity,
    };
  }
}
