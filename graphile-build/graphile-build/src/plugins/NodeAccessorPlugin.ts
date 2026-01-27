import "graphile-config";

import type { ExecutableStep, FieldArgs, Maybe, NodeIdHandler } from "grafast";
import { lambda } from "grafast";

import { EXPORTABLE, exportNameHint } from "../utils.ts";
import { version } from "../version.ts";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      NodeAccessorPlugin: true;
    }
  }

  namespace GraphileBuild {
    type NodeFetcher = {
      ($nodeId: ExecutableStep<Maybe<string>>): ExecutableStep<any>;
      deprecationReason?: string;
    };
    interface Build {
      specForHandler?(handler: NodeIdHandler): (nodeId: Maybe<string>) => any;
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
        const { EXPORTABLE } = build;
        const nodeFetcherByTypeNameCache = EXPORTABLE(
          () =>
            new Map<
              string,
              ($id: ExecutableStep<Maybe<string>>) => ExecutableStep<any>
            >(),
          [],
          "nodeFetcherByTypeNameCache",
        );
        const specForHandlerCache = EXPORTABLE(
          () => new Map<NodeIdHandler, (nodeId: Maybe<string>) => any>(),
          [],
          "specForHandlerCache",
        );
        return build.extend(
          build,
          {
            specForHandler: EXPORTABLE(
              (specForHandlerCache) =>
                function (handler) {
                  const existing = specForHandlerCache.get(handler);
                  if (existing) {
                    return existing;
                  }
                  function spec(nodeId: Maybe<string>) {
                    // We only want to return the specifier if it matches
                    // this handler; otherwise return null.
                    if (nodeId == null) return null;
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
                  specForHandlerCache.set(handler, spec);
                  return spec;
                },
              [specForHandlerCache],
            ),
            nodeFetcherByTypeName(typeName) {
              const existing = nodeFetcherByTypeNameCache.get(typeName);
              if (existing) return existing;
              const finalBuild = build as GraphileBuild.Build;
              const { specForHandler } = finalBuild;
              if (!specForHandler) return null;
              const handler = finalBuild.getNodeIdHandler?.(typeName);
              if (!handler) return null;
              const fetcher = handler.deprecationReason
                ? EXPORTABLE(
                    (handler, lambda, specForHandler) => {
                      const fn: GraphileBuild.NodeFetcher = (
                        $nodeId: ExecutableStep<Maybe<string>>,
                      ) => {
                        const $decoded = lambda(
                          $nodeId,
                          specForHandler(handler),
                        );
                        return handler.get(handler.getSpec($decoded));
                      };
                      fn.deprecationReason = handler.deprecationReason;
                      return fn;
                    },
                    [handler, lambda, specForHandler],
                  )
                : EXPORTABLE(
                    (handler, lambda, specForHandler) =>
                      ($nodeId: ExecutableStep<Maybe<string>>) => {
                        const $decoded = lambda(
                          $nodeId,
                          specForHandler(handler),
                        );
                        return handler.get(handler.getSpec($decoded));
                      },
                    [handler, lambda, specForHandler],
                  );
              exportNameHint(fetcher, `nodeFetcher_${typeName}`);
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

        const recoverableForEachType = (
          cb: (typeName: string) => typeof fields,
        ) => {
          for (const typeName of typeNames) {
            fields = build.recoverable(fields, () => cb(typeName));
          }
          return fields;
        };

        return recoverableForEachType((typeName) => {
          // Don't add a field for 'Query'
          if (typeName === build.inflection.builtin("Query")) {
            return fields;
          }
          const fetcher = build.nodeFetcherByTypeName!(typeName);
          if (!fetcher) {
            return fields;
          }
          return build.extend(
            fields,
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
                      const $nodeId = args.getRaw(
                        nodeIdFieldName,
                      ) as ExecutableStep<string>;
                      return fetcher($nodeId);
                    },
                  [fetcher, nodeIdFieldName],
                ),
              },
            },
            `Adding ${typeName} by NodeId field`,
          );
        });
      },
    },
  },
};
