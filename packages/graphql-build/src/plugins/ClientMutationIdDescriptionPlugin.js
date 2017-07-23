// @flow
import type SchemaBuilder, { Plugin } from "../SchemaBuilder";

const ClientMutationIdDescriptionPlugin: Plugin = function ClientMutationIdDescriptionPlugin(
  builder: SchemaBuilder
) {
  builder.hook(
    "inputField",
    (field: {}, { extend }, { scope: { isMutationInput, fieldName } }) => {
      if (
        !isMutationInput ||
        fieldName !== "clientMutationId" ||
        field.description
      ) {
        return field;
      }
      return extend(field, {
        description:
          "An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client.",
      });
    }
  );

  builder.hook(
    "field",
    (field: {}, { extend }, { scope: { isMutationPayload, fieldName } }) => {
      if (
        !isMutationPayload ||
        fieldName !== "clientMutationId" ||
        field.description
      ) {
        return field;
      }
      return extend(field, {
        description:
          "The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.",
      });
    }
  );

  builder.hook(
    "field:args",
    (args: {}, { extend }, { scope: { isRootMutation } }) => {
      if (!isRootMutation || !args.input || args.input.description) {
        return args;
      }
      return Object.assign({}, args, {
        input: extend(args.input, {
          description:
            "The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.",
        }),
      });
    }
  );
};

export default ClientMutationIdDescriptionPlugin;
