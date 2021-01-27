import { GraphQLResolveInfo } from "graphql";
import {
  GraphQLArguments,
  CrystalResult,
  FutureDependencies,
  PathIdentity,
  $$path,
  $$batch,
  $$data,
  GraphQLContext,
} from "./interfaces";
import { getPathIdentityFromResolveInfo } from "./utils";
import { Plan } from "./plan";
import { isCrystalResult } from "./crystalResult";
import { Aether } from "./aether";
import { future } from "./future";
import { TrackedObject } from "./trackedObject";

/**
 * What a Batch knows about a particular PathIdentity
 */
interface Info {
  pathIdentity: PathIdentity;
  graphile: GraphileEngine.GraphQLFieldGraphileExtension | null;
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
  private infoByPathIdentity: Map<PathIdentity, Info>;
  private plan: any;

  constructor(
    public readonly aether: Aether,
    parent: unknown,
    args: GraphQLArguments,
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ) {
    this.infoByPathIdentity = new Map();
    this.prepare(parent, args, context, info);
  }

  /**
   * Populates infoByPathIdentity **synchronously**.
   */
  prepare(
    parent: unknown,
    args: GraphQLArguments,
    context: GraphQLContext,
    info: GraphQLResolveInfo,
  ) {
    /*
     * NOTE: although we have access to 'parent' here, we're only using it for
     * meta-data (path, batch, etc); we must not use the *actual* data in it
     * here, that's for `getResultFor` below.
     */

    const pathIdentity = getPathIdentityFromResolveInfo(
      info,
      isCrystalResult(parent) ? parent[$$path] : undefined,
    );
    const digest = this.aether.doc.digestForPath(
      pathIdentity,
      info.variableValues,
    );
    console.log("Digest:");
    console.dir(digest);

    if (digest?.plan) {
      const trackedArgs = new TrackedObject(args);
      const trackedContext = new TrackedObject(context);
      // TODO
      // $deps represents the set of arguments that will be fed into this plan; e.g. for `userById(id: 8)` it'd be the set `[{id: 8}]`.
      const $deps: FutureDependencies<any> = future();
      const plan = digest?.plan($deps, trackedArgs, trackedContext);

      // TODO: apply the args here
      /*
       * Since a batch runs for a single (optionally aliased) field in the
       * operation, we know that the args for all entries within the batch will
       * be the same. Note, however, that the selection set may differ.
       */
      /*
      for (const arg of digest.args) {
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
      */
      // TODO (somewhere else): selection set fields' dependencies
      // TODO (somewhere else): selection set fields' args' dependencies (e.g. includeArchived: 'inherit')

      this.plan = plan.finalize();
    } else {
      return null;
    }
  }

  appliesTo(pathIdentity: PathIdentity): boolean {
    return !!this.infoByPathIdentity.get(pathIdentity);
  }

  async getResultFor(
    parent: unknown,
    info: GraphQLResolveInfo,
  ): Promise<CrystalResult> {
    // TODO: should be able to return this synchronously (no `async`)
    const pathIdentity = getPathIdentityFromResolveInfo(
      info,
      isCrystalResult(parent) ? parent[$$path] : undefined,
    );
    if (!this.plan) {
      console.log(
        `There's no plan for ${info.parentType.name}.${info.fieldName}`,
      );
      return {
        [$$batch]: this,
        [$$data]: isCrystalResult(parent) ? parent[$$data] : parent,
        [$$path]: pathIdentity,
      };
    }
    const data = await this.plan.executeWith(parent);
    console.log("EXECUTED PLAN");
    console.dir(data);
    return {
      [$$batch]: this,
      [$$data]: data,
      [$$path]: pathIdentity,
    };
  }
}
