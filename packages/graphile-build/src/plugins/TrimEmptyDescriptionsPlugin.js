// @flow
import type { Plugin } from "../SchemaBuilder";

// In GraphQL v14, empty descriptions were not output. In GraphQL v15 they are.
// We don't want them, so this removes them.

const TrimEmptyDescriptionsPlugin: Plugin = function (builder) {
  const rmEmptyTypeDescription = type => {
    if (type.description === "") {
      type.description = null;
    }
    return type;
  };
  const rmEmptyFieldDescription = field => {
    if (field.description === "") {
      field.description = null;
    }
    return field;
  };
  const rmEmptyArgDescriptions = args => {
    if (!args) {
      return args;
    }
    for (const argName in args) {
      const arg = args[argName];
      if (arg.description === "") {
        arg.description = null;
      }
    }
    return args;
  };
  builder.hook("GraphQLObjectType", rmEmptyTypeDescription);
  builder.hook("GraphQLObjectType:fields:field", rmEmptyFieldDescription);
  builder.hook("GraphQLObjectType:fields:field:args", rmEmptyArgDescriptions);
  builder.hook("GraphQLInputObjectType", rmEmptyTypeDescription);
  builder.hook("GraphQLInputObjectType:fields:field", rmEmptyFieldDescription);
  builder.hook("GraphQLUnionType", rmEmptyTypeDescription);
  builder.hook("GraphQLEnumType", rmEmptyTypeDescription);
};
export default TrimEmptyDescriptionsPlugin;
