import { Plugin, ScopeGraphQLObjectType } from "../SchemaBuilder";

function isValidSubscription(
  Subscription: import("graphql").GraphQLObjectType | null
) {
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

const description = `The root subscription type: contains realtime events you can subscribe to with the \`subscription\` operation.`;
const liveDescription = `The root subscription type: contains events and live queries you can subscribe to with the \`subscription\` operation.

#### Live Queries

Live query fields are differentiated by containing \`(live)\` at the end of their description, \
they are added for each field in the \`Query\` type. \
When you subscribe to a live query field, the selection set will be evaluated and sent to the \
client, and then most things\\* that would cause the output of the selection set to change \
will trigger the selection set to be re-evaluated and the results to be re-sent to the client.

_(\\* Not everything: typically only changes to persisted data referenced by the query are detected, not computed fields.)_

Live queries can be very expensive, so try and keep them small and focussed.

#### Events

Event fields will run their selection set when, and only when, the specified server-side event occurs. \
This makes them a lot more efficient than Live Queries, but it is still recommended that you keep payloads fairly small.`;

export default (async function SubscriptionPlugin(builder, { live }) {
  builder.hook(
    "GraphQLSchema",
    (schema, build) => {
      const {
        newWithHooks,
        extend,
        graphql: { GraphQLObjectType },
        inflection,
      } = build;
      const spec: import("graphql").GraphQLObjectTypeConfig<any, any> = {
        name: inflection.builtin("Subscription"),
        description: live ? liveDescription : description,
        fields: {},
      };
      const scope: ScopeGraphQLObjectType = {
        __origin: `graphile-build built-in (root subscription type)`,
        isRootSubscription: true,
      };
      const Subscription = newWithHooks(GraphQLObjectType, spec, scope, true);

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
    },
    ["Subscription"],
    [],
    ["Query"]
  );
} as Plugin);
