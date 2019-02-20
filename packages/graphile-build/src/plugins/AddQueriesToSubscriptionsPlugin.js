// @flow
import type { Plugin } from "../SchemaBuilder";
import type { GraphQLObjectType } from "graphql";

const AddQueriesToSubscriptionsPlugin: Plugin = function(
  builder,
  { subscriptions, live }
) {
  if (!subscriptions || !live) {
    return;
  }
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const { extend, getTypeByName, inflection } = build;
    const {
      scope: { isRootSubscription },
    } = context;
    if (!isRootSubscription) {
      return fields;
    }

    const Query: GraphQLObjectType = getTypeByName(inflection.builtin("Query"));
    const queryFields = Query.getFields();
    const subscriptionFields = Object.keys(queryFields).reduce(
      (memo, queryFieldName) => {
        const queryField = queryFields[queryFieldName];
        const oldResolve = queryField.resolve;
        memo[queryFieldName] = {
          description: (queryField.description || "") + " (live)",
          type: queryField.type,
          args: (queryField.args || []).reduce((newArgs, arg) => {
            const { name, description, type, defaultValue } = arg;
            newArgs[name] = {
              description,
              type,
              defaultValue,
            };
            return newArgs;
          }, {}),
          ...(oldResolve
            ? {
                resolve: async (...args) => {
                  try {
                    return await oldResolve(...args);
                  } catch (e) {
                    const context = args[2];
                    if (typeof context.liveAbort === "function") {
                      context.liveAbort(e);
                    }
                    throw e;
                  }
                },
              }
            : null),
          subscribe: build.liveCoordinator.subscribe,
          deprecationReason: queryField.isDeprecated
            ? queryField.deprecationReason
            : undefined,
        };
        return memo;
      },
      {}
    );
    return extend(fields, subscriptionFields);
  });
};
export default AddQueriesToSubscriptionsPlugin;
