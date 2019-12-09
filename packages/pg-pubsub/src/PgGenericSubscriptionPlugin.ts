import debugFactory from "debug";
import {
  Plugin,
  GraphileObjectTypeConfig,
  ScopeGraphQLObjectTypeFieldsField,
  Inflection,
} from "graphile-build";
import { PubSub } from "graphql-subscriptions";
import "graphile-build-pg"; // For the types

declare module "graphile-build" {
  interface GraphileBuildOptions {
    pubsub?: PubSub;
    pgSubscriptionPrefix?: string;
    pgSubscriptionAuthorizationFunction?: string;
  }

  interface Inflection {
    listen(): string;
    listenPayload(): string;
  }

  interface ScopeGraphQLObjectType {
    isPgGenericSubscriptionPayloadType?: boolean;
  }

  interface ScopeGraphQLObjectTypeFieldsField {
    isPgGenericSubscriptionPayloadRelatedNodeField?: boolean;
    isPgGenericSubscriptionRootField?: boolean;
  }
}

const debug = debugFactory("pg-pubsub");
const base64 = (str: string) => Buffer.from(String(str)).toString("base64");

const nodeIdFromDbNode = (dbNode: any) => base64(JSON.stringify(dbNode));

function isPubSub(pubsub: any): pubsub is PubSub {
  return !!pubsub;
}

const PgGenericSubscriptionPlugin: Plugin = function(
  builder,
  {
    pubsub,
    pgSubscriptionPrefix = "postgraphile:",
    pgSubscriptionAuthorizationFunction,
  }
) {
  if (!isPubSub(pubsub)) {
    debug("Subscriptions disabled - no pubsub provided");
    return;
  }

  builder.hook(
    "inflection",
    (inflection, build) =>
      build.extend(
        inflection,
        {
          listen(this: Inflection) {
            return "listen";
          },
          listenPayload(this: Inflection) {
            return this.upperCamelCase(`${this.listen()}-payload`);
          },
        },
        "Adding listen / listenPayload inflectors from PgGenericSubscriptionPlugin"
      ),
    ["PgGenericSubscription"]
  );

  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, graphileContext) => {
      const {
        scope: { isRootSubscription },
        fieldWithHooks,
      } = graphileContext;
      const {
        extend,
        newWithHooks,
        pgSql: sql,
        graphql: {
          GraphQLObjectType,
          GraphQLNonNull,
          GraphQLString,
          GraphQLID,
        },
        getTypeByName,
        $$isQuery,
        pgParseIdentifier: parseIdentifier,
        resolveNode,
        inflection,
      } = build;
      if (!isRootSubscription) {
        return fields;
      }
      const parsedFunctionParts = pgSubscriptionAuthorizationFunction
        ? parseIdentifier(pgSubscriptionAuthorizationFunction)
        : null;

      const Node = getTypeByName(inflection.builtin("Node"));
      const Query = getTypeByName(inflection.builtin("Query"));
      if (!Query || !(Query instanceof GraphQLObjectType)) {
        throw new Error("Failed to load Query type");
      }

      const scope: ScopeGraphQLObjectTypeFieldsField = {
        isPgGenericSubscriptionPayloadRelatedNodeField: true,
      };
      const spec: GraphileObjectTypeConfig<any, any> = {
        name: inflection.listenPayload(),
        fields: () => ({
          query: {
            description:
              "Our root query field type. Allows us to run any query from our subscription payload.",
            type: Query,
            resolve() {
              return $$isQuery;
            },
          },
          ...(Node
            ? {
                relatedNode: fieldWithHooks(
                  "relatedNode",
                  ({
                    getDataFromParsedResolveInfoFragment,
                  }: any): import("graphql").GraphQLFieldConfig<any, any> => ({
                    type: Node as import("graphql").GraphQLOutputType,
                    resolve: async (
                      payload,
                      _args,
                      resolveContext,
                      resolveInfo
                    ) => {
                      if (!payload.relatedNodeId) {
                        return null;
                      }
                      return resolveNode(
                        payload.relatedNodeId,
                        build,
                        { getDataFromParsedResolveInfoFragment },
                        {},
                        resolveContext,
                        resolveInfo
                      );
                    },
                  }),
                  scope
                ),
                // We don't use 'nodeId' here because it's likely your cache will
                // use 'nodeId' as the cache key.
                // We need 'relatedNodeId' in addition to 'relatedNode' in case the
                // node itself was deleted.
                relatedNodeId: {
                  type: GraphQLID,
                },
              }
            : null), // If there's no node interface then we simply don't add node stuff
        }),
      };
      const ListenPayload = newWithHooks(GraphQLObjectType, spec, {
        isPgGenericSubscriptionPayloadType: true,
      });

      const listen = inflection.listen();
      const listenScope: ScopeGraphQLObjectTypeFieldsField = {
        isPgGenericSubscriptionRootField: true,
      };

      return extend(
        fields,
        {
          [listen]: fieldWithHooks(
            listen,
            (): import("graphql").GraphQLFieldConfig<any, any> => ({
              type: new GraphQLNonNull(ListenPayload),
              args: {
                topic: {
                  type: new GraphQLNonNull(GraphQLString),
                },
              },
              subscribe: async (_parent, args, _context, _resolveInfo) => {
                const { pgClient } = _context;
                const topic = (pgSubscriptionPrefix || "") + args.topic;
                // Check they're allowed
                let unsubscribeTopic: string | void;
                if (parsedFunctionParts) {
                  const { text, values } = sql.compile(
                    sql.query`select unsubscribe_topic from ${sql.identifier(
                      parsedFunctionParts.namespaceName,
                      parsedFunctionParts.entityName
                    )}(${sql.value(topic)}) unsubscribe_topic`
                  );
                  const {
                    rows: [[_unsubscribeTopic]],
                  } = await pgClient.query({
                    text,
                    values,
                    rowMode: "array",
                  });
                  if (!_unsubscribeTopic) {
                    throw new Error("You may not subscribe to this topic");
                  }
                  unsubscribeTopic = _unsubscribeTopic;
                }
                const asyncIterator = pubsub.asyncIterator(topic);
                if (!asyncIterator) {
                  return asyncIterator;
                }
                if (unsubscribeTopic) {
                  // Subscribe to event revoking subscription
                  const unsubscribeIterator = pubsub.asyncIterator(
                    unsubscribeTopic
                  );
                  unsubscribeIterator.next().then(() => {
                    debug(
                      "Unsubscribe triggered on channel %s",
                      unsubscribeTopic
                    );
                    if (asyncIterator.return) {
                      asyncIterator.return();
                    }
                    if (unsubscribeIterator.return) {
                      unsubscribeIterator.return();
                    }
                  });
                }
                return asyncIterator;
              },
              resolve: async (payload, _args, _context, _resolveInfo) => {
                const result = { ...payload };
                if (Node && payload && payload.__node__) {
                  const nodeId = nodeIdFromDbNode(payload.__node__);
                  result.relatedNodeId = nodeId;
                }
                return result;
              },
            }),
            listenScope
          ),
        },
        "Adding listen field to Subscription type"
      );
    },
    ["PgGenericSubscription"],
    [],
    ["Node", "Query"]
  );
};

export default PgGenericSubscriptionPlugin;
