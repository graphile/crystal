import {
  GraphQLResolveInfo,
  GraphQLSchema,
  SelectionSetNode,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  isUnionType,
  isListType,
  isNonNullType,
  isObjectType,
  isInterfaceType,
} from "graphql";
import {
  GraphQLArguments,
  BatchResult,
  PathIdentity,
  Plan,
  $$path,
  $$root,
  $$data,
} from "./interfaces";
import { getPathIdentityFromResolveInfo } from "./utils";
import assert from "assert";
import { isBatchResult } from "./batchResult";

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
  ): Promise<BatchResult> {
    await this.promise;
    const pathIdentity = getPathIdentityFromResolveInfo(
      info,
      isBatchResult(parent) ? parent[$$path] : undefined,
    );
    const data = null;
    return {
      [$$root]: this,
      [$$data]: data,
      [$$path]: pathIdentity,
    };
  }
}

function populateInfo(
  schema: GraphQLSchema,
  infoByPathIdentity: Map<PathIdentity, Info>,
  selectionSet: SelectionSetNode,
  parentType: GraphQLObjectType | GraphQLUnionType | GraphQLInterfaceType,
  path = "",
) {
  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case "Field": {
        if (selection.name.value.startsWith("__")) {
          // Introspection field; ignore
          break;
        }
        assert(
          !isUnionType(parentType),
          "Cannot select fields on a union type",
        );
        const alias = selection.alias
          ? selection.alias.value
          : selection.name.value;
        const pathIdentity =
          path + (path ? ">" : "") + `${parentType.name}.${alias}`;
        const field = parentType.getFields()[selection.name.value];
        const resultType = field.type;
        let unwrappedType = resultType;
        let listDepth = 0;
        while ("ofType" in unwrappedType && unwrappedType.ofType) {
          if (isListType(unwrappedType)) {
            listDepth++;
          } else if (isNonNullType(unwrappedType)) {
            // ignore
          } else {
            throw new Error("Wrapping type not understood.");
          }
          unwrappedType = unwrappedType.ofType;
        }
        assert(
          isObjectType(unwrappedType) ||
            isUnionType(unwrappedType) ||
            isInterfaceType(unwrappedType),
          "Expected type to have been unwrapped to reveal an object, union or interface type",
        );
        const graphile = unwrappedType.extensions?.graphile;

        if (isObjectType(parentType)) {
          infoByPathIdentity.set(pathIdentity, {
            pathIdentity,
            graphile,
            plan: {
              /* TODO */
            },
          });
        } else {
          // TODO!
          // NOTE TO SELF: I think this is the wrong approach. We shouldn't list
          // out all possibilities for an interface, e.g. "search results" might
          // return a Node, but only actually implement 4 nodes not all 200;
          // exhaustively listing them all is expensive and unnecessary. Perhaps
          // the plan for interfaces should factor in the particular return
          // types?
        }

        if (selection.selectionSet) {
          populateInfo(
            schema,
            infoByPathIdentity,
            selection.selectionSet,
            unwrappedType,
            pathIdentity,
          );
        }
        break;
      }
      case "InlineFragment": {
        if (
          !selection.typeCondition ||
          (selection.typeCondition &&
            selection.typeCondition.name.value === parentType.name)
        ) {
          // Redundant fragment
          populateInfo(
            schema,
            infoByPathIdentity,
            selection.selectionSet,
            parentType,
            path,
          );
          break;
        }
        const fragmentType = schema.getType(selection.typeCondition.name.value);
        assert(
          isUnionType(fragmentType) ||
            isInterfaceType(fragmentType) ||
            isObjectType(fragmentType),
          "Couldn't find type associated with this fragment",
        );
        populateInfo(
          schema,
          infoByPathIdentity,
          selection.selectionSet,
          fragmentType,
          path,
        );
        // TODO...
      }
    }
  }
}
