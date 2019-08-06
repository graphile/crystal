// @flow
import type SchemaBuilder, { Plugin } from "../SchemaBuilder";

export default (function ClientMutationIdDescriptionPlugin(
  builder: SchemaBuilder
) {
  builder.hook(
    "GraphQLInputObjectType:fields:field",
    (field, build, context) => {
      const { extend } = build;
      const {
        scope: { isMutationInput, fieldName },
        Self,
      } = context;
      if (
        !isMutationInput ||
        fieldName !== "clientMutationId" ||
        field.description
      ) {
        return field;
      }
      return extend(
        field,
        {
          description:
            "An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client.",
        },
        `Tweaking '${fieldName}' field in '${Self.name}'`
      );
    },
    ["ClientMutationIdDescription"]
  );

  builder.hook(
    "GraphQLObjectType:fields:field",
    (field, build, context) => {
      const { extend } = build;
      const {
        scope: { isMutationPayload, fieldName },
        Self,
      } = context;
      if (
        !isMutationPayload ||
        fieldName !== "clientMutationId" ||
        field.description
      ) {
        return field;
      }
      return extend(
        field,
        {
          description:
            "The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.",
        },
        `Tweaking '${fieldName}' field in '${Self.name}'`
      );
    },
    ["ClientMutationIdDescription"]
  );

  builder.hook(
    "GraphQLObjectType:fields:field:args",
    (args: {}, build, context) => {
      const { extend } = build;
      const {
        scope: { isRootMutation, fieldName },
        Self,
      } = context;
      if (!isRootMutation || !args.input || args.input.description) {
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
          `Adding a description to input arg for field '${fieldName}' field in '${
            Self.name
          }'`
        ),
      };
    },
    ["ClientMutationIdDescription"]
  );
}: Plugin);
