import { isValidObjectType } from "../utils";

/**
 * This plugin registers the operation type for the 'subscription' operation, and
 * if that type adds at least one field then it will be added to the GraphQL
 * schema.
 *
 * By default we call this type `Subscription`, but you can rename it using the
 * `builtin` inflector.
 *
 * Removing this plugin will mean that your GraphQL schema will not allow
 * subscription operations.
 */
export const SubscriptionPlugin: GraphileEngine.Plugin =
  async function SubscriptionPlugin(builder) {
    builder.hook("init", (_, build, _context) => {
      const { inflection } = build;

      build.registerObjectType(
        inflection.builtin("Subscription"),
        {
          isRootSubscription: true,
        },
        () => {
          return {
            description: `The root subscription type: contains realtime events you can subscribe to with the \`subscription\` operation.`,
          };
        },
        `graphile-build built-in (root subscription type)`,
      );

      return _;
    });

    builder.hook(
      "GraphQLSchema",
      (schema, build, _context) => {
        const { getTypeByName, extend, inflection, handleRecoverableError } =
          build;

        // IIFE to get the mutation type, handling errors occurring during
        // validation.
        const Subscription = (() => {
          try {
            const Type = getTypeByName(inflection.builtin("Subscription"));

            if (isValidObjectType(Type)) {
              return Type;
            }
          } catch (e) {
            handleRecoverableError(e);
          }
          return null;
        })();

        if (Subscription == null) {
          return schema;
        }

        // Errors thrown here (e.g. due to naming conflicts) should be raised,
        // hence this is outside of the IIFE.
        return extend(
          schema,
          { mutation: Subscription },
          "Adding subscription type to schema",
        );
      },
      ["Subscription"],
      [],
      ["Query"],
    );
  };
