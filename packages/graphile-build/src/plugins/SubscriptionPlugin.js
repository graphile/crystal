// @flow
import type { Plugin } from "../SchemaBuilder";

function isValidSubscription(Subscription) {
  try {
    if (!Subscription) {
      return false;
    }
    if (Object.keys(Subscription.getFields()).length === 0) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}

export default (async function SubscriptionPlugin(builder) {
  builder.hook("GraphQLSchema", (schema: {}, build) => {
    const {
      newWithHooks,
      extend,
      graphql: { GraphQLObjectType },
      inflection,
    } = build;
    const Subscription = newWithHooks(
      GraphQLObjectType,
      {
        name: inflection.builtin("Subscription"),
        description:
          "The root subscription type which contains root level fields which mutate data.",
      },
      {
        __origin: `graphile-build built-in (root subscription type)`,
        isRootSubscription: true,
      },
      true
    );
    if (isValidSubscription(Subscription)) {
      return extend(
        schema,
        {
          subscription: Subscription,
        },
        "Adding subscription type to schema"
      );
    } else {
      return schema;
    }
  });
}: Plugin);
