import { Plugin } from "../SchemaBuilder";

declare module "../SchemaBuilder" {
  interface ScopeGraphQLObjectTypeFieldsField {
    isLiveField?: true;
    originalField?: import("graphql").GraphQLField<any, any>;
  }
}

const AddQueriesToSubscriptionsPlugin: Plugin = function(
  builder,
  { subscriptions, live }
) {
  if (!subscriptions || !live) {
    return;
  }
  builder.hook(
    "GraphQLObjectType:fields",
    (fields, build, context) => {
      const { extend, getTypeByName, inflection } = build;
      const {
        scope: { isRootSubscription },
        fieldWithHooks,
      } = context;
      if (!isRootSubscription) {
        return fields;
      }

      const Query = getTypeByName(inflection.builtin("Query"));
      if (!(Query instanceof build.graphql.GraphQLObjectType)) {
        throw new Error(`Could not retrieve 'Query' type.`);
      }

      const queryFields = Query.getFields();
      const subscriptionFields = Object.keys(queryFields).reduce(
        (memo, queryFieldName) => {
          const queryField = queryFields[queryFieldName];
          const oldResolve = queryField.resolve;
          const liveFieldName = inflection.live(queryFieldName);
          memo[liveFieldName] = fieldWithHooks(
            liveFieldName,
            {
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
                        const info = args[3];
                        if (
                          info.rootValue &&
                          typeof info.rootValue.liveAbort === "function"
                        ) {
                          info.rootValue.liveAbort(e);
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
            },
            {
              isLiveField: true,
              originalField: queryField,
            }
          );

          return memo;
        },
        {}
      );

      return extend(
        fields,
        subscriptionFields,
        "Adding Query fields to Subscription type"
      );
    },
    ["AddQueriesToSubscriptions"]
  );
};
export default AddQueriesToSubscriptionsPlugin;
