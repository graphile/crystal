import {
  SchemaBuilder,
  Build,
  Plugin,
  Options,
  ContextGraphQLObjectTypeFieldsField,
  ContextGraphQLInputObjectTypeFieldsField,
} from "graphile-build";

interface ChangeNullabilityRules {
  [typeName: string]: {
    [fieldName: string]: boolean;
  };
}

export default function makeChangeNullabilityPlugin(
  rules: ChangeNullabilityRules
): Plugin {
  return (builder: SchemaBuilder, _options: Options) => {
    function changeNullability(
      field: import("graphql").GraphQLInputFieldConfig,
      build: Build,
      context: ContextGraphQLInputObjectTypeFieldsField
    ): typeof field;
    function changeNullability(
      field: import("graphql").GraphQLFieldConfig<any, any>,
      build: Build,
      context: ContextGraphQLObjectTypeFieldsField
    ): typeof field;
    function changeNullability<
      Field extends
        | import("graphql").GraphQLInputFieldConfig
        | import("graphql").GraphQLFieldConfig<any, any>,
      Context extends
        | ContextGraphQLInputObjectTypeFieldsField
        | ContextGraphQLObjectTypeFieldsField
    >(field: Field, build: Build, context: Context): typeof field {
      const {
        Self,
        scope: { fieldName },
      } = context;
      const typeRules = rules[Self.name];
      if (!typeRules) {
        return field;
      }
      const shouldBeNullable = typeRules[fieldName];
      if (shouldBeNullable == null) {
        return field;
      }
      const {
        graphql: { getNullableType, GraphQLNonNull },
      } = build;
      const nullableType = getNullableType(field.type);
      return {
        ...field,
        type: shouldBeNullable
          ? nullableType
          : nullableType === field.type
          ? new GraphQLNonNull(field.type)
          : field.type, // Optimisation if it's already non-null
      };
    }
    builder.hook("GraphQLInputObjectType:fields:field", changeNullability);
    builder.hook("GraphQLObjectType:fields:field", changeNullability);
  };
}
