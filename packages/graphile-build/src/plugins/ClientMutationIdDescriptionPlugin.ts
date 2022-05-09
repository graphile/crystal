import { version } from "..";

/**
 * Adds generic descriptions (where not already present) to:
 *
 * - the 'clientMutationId' input object field on mutation inputs,
 * - the 'clientMutationId' output field on a mutation payload, and
 * - the 'input' argument to a GraphQL mutation field.
 *
 * Descriptions aren't required in these places, so you can safely disable this
 * plugin.
 */
export const ClientMutationIdDescriptionPlugin: GraphilePlugin.Plugin = {
  name: "ClientMutationIdDescriptionPlugin",
  version,
  description:
    "Adds descriptions to 'clientMutationId' fields and mutation 'input' arguments that don't already have them",
  schema: {
    hooks: {
      GraphQLInputObjectType_fields_field: {
        callback: (field, build, context) => {
          const { extend } = build;
          const {
            scope: { isMutationInput, fieldName },
            Self,
          } = context;

          if (
            isMutationInput !== true ||
            fieldName !== "clientMutationId" ||
            field.description != null
          ) {
            return field;
          }

          return extend(
            field,
            {
              description:
                "An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client.",
            },
            `Tweaking '${fieldName}' field in '${Self.name}'`,
          );
        },
        provides: ["ClientMutationIdDescription"],
      },

      GraphQLObjectType_fields_field: {
        callback: (field, build, context) => {
          const { extend } = build;
          const {
            scope: { isMutationPayload, fieldName },
            Self,
          } = context;

          if (
            isMutationPayload !== true ||
            fieldName !== "clientMutationId" ||
            field.description != null
          ) {
            return field;
          }

          return extend(
            field,
            {
              description:
                "The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.",
            },
            `Tweaking '${fieldName}' field in '${Self.name}'`,
          );
        },
        provides: ["ClientMutationIdDescription"],
      },

      GraphQLObjectType_fields_field_args: {
        callback: (args, build, context) => {
          const { extend } = build;
          const {
            scope: { isRootMutation, fieldName },
            Self,
          } = context;

          if (
            isRootMutation !== true ||
            args.input == null ||
            args.input.description != null
          ) {
            return args;
          }

          return {
            ...args,
            input: extend(
              args.input,
              {
                description:
                  "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
              },
              `Adding a description to input arg for field '${fieldName}' field in '${Self.name}'`,
            ),
          };
        },
        provides: ["ClientMutationIdDescription"],
      },
    },
  },
};
