import "graphile-config";

import type { ExecutableStep, FieldArgs, NodeIdHandler } from "grafast";
import { lambda } from "grafast";

import { EXPORTABLE } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    type NodeFetcher = {
      ($nodeId: ExecutableStep<string>): ExecutableStep<any>;
      deprecationReason?: string;
    };
    interface Build {
      specForHandler?(handler: NodeIdHandler): (nodeId: string) => any;
      nodeFetcherByTypeName?(typeName: string): NodeFetcher | null;
    }
    interface Inflection {
      nodeById(this: Inflection, typeName: string): string;
    }
    interface ScopeObjectFieldsField {
      isPgNodeQuery?: boolean;
    }
  }
}

export const NodeAccessorPlugin: GraphileConfig.Plugin = {
  name: "NodeAccessorPlugin",
  description:
    "Adds accessors for the various types registered with the Global Unique Object Identification ID (Node ID) system",
  version: version,

  inflection: {
    add: {
      nodeById(options, typeName) {
        return this.camelCase(typeName);
      },
    },
  },

  schema: {
    hooks: {
      build(build) {
        const nodeFetcherByTypeNameCache = new Map<
          string,
          ($id: ExecutableStep<string>) => ExecutableStep<any>
        >();
        return build.extend(
          build,
          {
            specForHandler: EXPORTABLE(
              () =>
                function (handler) {
                  function spec(nodeId: string) {
                    // We only want to return the specifier if it matches
                    // this handler; otherwise return null.
                    try {
                      const specifier = handler.codec.decode(nodeId);
                      if (handler.match(specifier)) {
                        return specifier;
                      }
                    } catch {
                      // Ignore errors
                    }
                    return null;
                  }
                  spec.displayName = `specifier_${handler.typeName}_${handler.codec.name}`;
                  spec.isSyncAndSafe = true; // Optimization
                  return spec;
                },
              [],
            ),
            nodeFetcherByTypeName(typeName) {
              const existing = nodeFetcherByTypeNameCache.get(typeName);
              if (existing) return existing;
              const finalBuild = build as GraphileBuild.Build;
              const { specForHandler } = finalBuild;
              if (!specForHandler) return null;
              const handler = finalBuild.getNodeIdHandler?.(typeName);
              if (!handler) return null;
              const fetcher = EXPORTABLE(
                (handler, lambda, specForHandler) => {
                  const fn: GraphileBuild.NodeFetcher = (
                    $nodeId: ExecutableStep<string>,
                  ) => {
                    const $decoded = lambda($nodeId, specForHandler(handler));
                    return handler.get(handler.getSpec($decoded));
                  };
                  fn.deprecationReason = handler.deprecationReason;
                  return fn;
                },
                [handler, lambda, specForHandler],
              );
              nodeFetcherByTypeNameCache.set(typeName, fetcher);
              return fetcher;
            },
          },
          "Adding node accessor helpers",
        );
      },
      GraphQLObjectType_fields(fields, build, context) {
        if (!build.getNodeTypeNames) {
          return fields;
        }
        const {
          graphql: { GraphQLNonNull, GraphQLID },
        } = build;
        const {
          scope: { isRootQuery },
        } = context;
        if (!isRootQuery) {
          return fields;
        }
        if (!build.nodeFetcherByTypeName) {
          return fields;
        }

        const typeNames = build.getNodeTypeNames();
        const nodeIdFieldName = build.inflection.nodeIdFieldName();

        return typeNames.reduce((memo, typeName) => {
          // Don't add a field for 'Query'
          if (typeName === build.inflection.builtin("Query")) {
            return memo;
          }
          const fetcher = build.nodeFetcherByTypeName!(typeName);
          if (!fetcher) {
            return memo;
          }
          return build.extend(
            memo,
            {
              [build.inflection.nodeById(typeName)]: {
                args: {
                  [nodeIdFieldName]: {
                    description: `The globally unique \`ID\` to be used in selecting a single \`${typeName}\`.`,
                    type: new GraphQLNonNull(GraphQLID),
                  },
                },
                type: build.getOutputTypeByName(typeName),
                description: `Reads a single \`${typeName}\` using its globally unique \`ID\`.`,
                deprecationReason: fetcher.deprecationReason,
                plan: EXPORTABLE(
                  (fetcher, nodeIdFieldName) =>
                    function plan(_$parent: ExecutableStep, args: FieldArgs) {
                      const $nodeId = args.get(nodeIdFieldName);
                      return fetcher($nodeId);
                    },
                  [fetcher, nodeIdFieldName],
                ),
              },
            },
            `Adding ${typeName} by NodeId field`,
          );
        }, fields);
      },
    },
  },
};
