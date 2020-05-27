import { SchemaBuilder } from "graphile-build";

interface ChangeNullabilityRules {
  [typeName: string]: {
    [fieldName: string]: boolean;
  };
}

export default function makeChangeNullabilityPlugin(
  rules: ChangeNullabilityRules,
): GraphileEngine.Plugin {
  return (
    builder: SchemaBuilder,
    _options: GraphileEngine.GraphileBuildOptions,
  ) => {
    function changeNullability(
      field: import("graphql").GraphQLInputFieldConfig,
      build: GraphileEngine.Build,
      context: GraphileEngine.ContextGraphQLInputObjectTypeFieldsField,
    ): typeof field;
    function changeNullability(
      field: import("graphql").GraphQLFieldConfig<any, any>,
      build: GraphileEngine.Build,
      context: GraphileEngine.ContextGraphQLObjectTypeFieldsField,
    ): typeof field;
    function changeNullability<
      Field extends
        | import("graphql").GraphQLInputFieldConfig
        | import("graphql").GraphQLFieldConfig<any, any>,
      Context extends
        | GraphileEngine.ContextGraphQLInputObjectTypeFieldsField
        | GraphileEngine.ContextGraphQLObjectTypeFieldsField
    >(
      field: Field,
      build: GraphileEngine.Build,
      context: Context,
    ): typeof field {
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
          : field.type, // Optimization if it's already non-null
      };
    }
    builder.hook("GraphQLInputObjectType:fields:field", changeNullability);
    builder.hook("GraphQLObjectType:fields:field", changeNullability);
  };
}
