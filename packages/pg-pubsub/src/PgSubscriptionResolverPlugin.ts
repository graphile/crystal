import debugFactory from "debug";
import { Plugin } from "graphile-build";
import { PubSub, withFilter } from "graphql-subscriptions";
import { GraphQLResolveInfo, GraphQLFieldResolver } from "graphql";

const debug = debugFactory("pg-pubsub");

function isPubSub(pubsub: unknown): pubsub is PubSub {
  return !!pubsub;
}

type PubSubEvent = {
  [key: string]: any;
};

function withInitialEvent(
  topic: string,
  initialEvent: (
    args: { [key: string]: any },
    resolveContext: any,
    resolveInfo: GraphQLResolveInfo
  ) => Promise<PubSubEvent> | PubSubEvent
) {
  return async function* subscribeWithInitialEvent(
    asyncIterator: AsyncIterator<PubSubEvent, void>,
    _parent: unknown,
    args: { [key: string]: any },
    resolveContext: any,
    resolveInfo: GraphQLResolveInfo
  ): AsyncIterator<PubSubEvent, void> {
    const event = await initialEvent(args, resolveContext, resolveInfo);
    if (event != null) {
      if (typeof event !== "object") {
        throw new Error(
          "event returned from pgSubscription initialEvent must be an object"
        );
      }
      yield { ...event, topic };
    }

    /* TODO: when we can upgrade to Node 10.3+ we can replace the below with simply:
    for await (const val of asyncIterator) {
      yield val;
    }
    */
    try {
      while (true) {
        const next = await asyncIterator.next();
        if (next.done) {
          return next.value;
        } else {
          yield next.value;
        }
      }
    } finally {
      // Terminate the previous iterator
      if (typeof asyncIterator.return === "function") {
        asyncIterator.return();
      }
    }
  };
}

/*
 * This plugin looks for the `@pgSubscription` directive, and adds the
 * `subscribe` method.
 */

const PgSubscriptionResolverPlugin: Plugin = function (builder, { pubsub }) {
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
        initialEvent,
      } = pgSubscription;
      if (!topicGen) {
        return field;
      }
      const subscribe: GraphQLFieldResolver<any, any> = async (
        parent,
        args,
        resolveContext,
        resolveInfo
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
        let asyncIterator = pubsub.asyncIterator<PubSubEvent>(topic);
        if (unsubscribeTopic) {
          // Subscribe to event revoking subscription
          const unsubscribeTopics: Array<string> = Array.isArray(
            unsubscribeTopic
          )
            ? unsubscribeTopic
            : [unsubscribeTopic];
          const unsubscribeIterators = unsubscribeTopics.map(t => {
            const i = pubsub.asyncIterator(t);
            i["topic"] = t;
            return i;
          });
          unsubscribeIterators.forEach(unsubscribeIterator => {
            unsubscribeIterator.next().then(() => {
              debug(
                "Unsubscribe triggered on channel %s",
                unsubscribeIterator["topic"]
              );
              if (asyncIterator.return) {
                asyncIterator.return();
              }
              unsubscribeIterators.forEach(i => {
                if (i.return) {
                  i.return();
                }
              });
            });
          });
        }

        if (initialEvent) {
          if (typeof initialEvent !== "function") {
            throw new Error(
              "initialEvent provided to pgSubscription must be a function"
            );
          }
          const oldAsyncIterator = asyncIterator;
          asyncIterator = withInitialEvent(topic, initialEvent)(
            oldAsyncIterator,
            parent,
            args,
            resolveContext,
            resolveInfo
          );
        }

        // filter should always be the last adjustment
        // since we want to feed all current and future
        // custom emissions to the filter
        if (filter) {
          if (typeof filter !== "function") {
            throw new Error(
              "filter provided to pgSubscription must be a function"
            );
          }
          const oldAsyncIterator = asyncIterator;
          asyncIterator = withFilter(() => oldAsyncIterator, filter)(
            parent,
            args,
            resolveContext,
            resolveInfo
          );
        }

        return asyncIterator;
      };
      const resolve: GraphQLFieldResolver<PubSubEvent, any> = (
        event
      ): PubSubEvent => {
        return event;
      };
      return extend(field, {
        subscribe,
        ...(field.resolve ? null : { resolve }),
      });
    },
    ["PgSubscriptionResolver"]
  );
};

export default PgSubscriptionResolverPlugin;
