import debugFactory from "debug";
import { PubSub, withFilter } from "graphql-subscriptions";

const debug = debugFactory("pg-pubsub");

function isPubSub(pubsub: any): pubsub is PubSub {
  return !!pubsub;
}

/*
 * This plugin looks for the `@pgSubscription` directive, and adds the
 * `subscribe` method.
 */

const PgSubscriptionResolverPlugin: GraphileEngine.Plugin = function (
  builder,
  { pubsub },
) {
  if (!isPubSub(pubsub)) {
    debug("Subscriptions disabled - no pubsub provided");
    return;
  }
  builder.hook(
    "GraphQLObjectType:fields:field",
    (field, build, graphileContext) => {
      const { extend } = build;
      const {
        scope: { isRootSubscription, fieldDirectives },
      } = graphileContext;
      if (!isRootSubscription) {
        return field;
      }
      if (!fieldDirectives) {
        return field;
      }
      const { pgSubscription } = fieldDirectives;
      if (!pgSubscription) {
        return field;
      }
      const {
        topic: topicGen,
        unsubscribeTopic: unsubscribeTopicGen,
        filter,
      } = pgSubscription;
      if (!topicGen) {
        return field;
      }
      return extend(
        field,
        {
          subscribe: async (
            parent: any,
            args: any,
            resolveContext: any,
            resolveInfo: any,
          ) => {
            const topic =
              typeof topicGen === "function"
                ? await topicGen(args, resolveContext, resolveInfo)
                : topicGen;
            if (!topic) {
              throw new Error("Cannot subscribe at this time");
            }
            if (typeof topic !== "string") {
              throw new Error("Invalid topic provided to pgSubscription");
            }
            const unsubscribeTopic =
              typeof unsubscribeTopicGen === "function"
                ? await unsubscribeTopicGen(args, resolveContext, resolveInfo)
                : unsubscribeTopicGen;
            const asyncIterator = pubsub.asyncIterator(topic);
            if (unsubscribeTopic) {
              // Subscribe to event revoking subscription
              const unsubscribeTopics: Array<string> = Array.isArray(
                unsubscribeTopic,
              )
                ? unsubscribeTopic
                : [unsubscribeTopic];
              const unsubscribeIterators = unsubscribeTopics.map((t) => {
                const i = pubsub.asyncIterator(t);
                i["topic"] = t;
                return i;
              });
              unsubscribeIterators.forEach((unsubscribeIterator) => {
                unsubscribeIterator.next().then(() => {
                  debug(
                    "Unsubscribe triggered on channel %s",
                    unsubscribeIterator["topic"],
                  );
                  if (asyncIterator.return) {
                    asyncIterator.return();
                  }
                  unsubscribeIterators.forEach((i) => {
                    if (i.return) {
                      i.return();
                    }
                  });
                });
              });
            }

            if (filter) {
              if (typeof filter !== "function") {
                throw new Error(
                  "filter provided to pgSubscription must be a function",
                );
              }
              return withFilter(() => asyncIterator, filter)(
                parent,
                args,
                resolveContext,
                resolveInfo,
              );
            }
            return asyncIterator;
          },
          ...(field.resolve
            ? null
            : {
                resolve<T>(event: T): T {
                  return event;
                },
              }),
        },
        "Adding subscribe function to Subscription field",
      );
    },
    ["PgSubscriptionResolver"],
  );
};

export default PgSubscriptionResolverPlugin;
