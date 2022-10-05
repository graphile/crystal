import type { GraphQLInputType, GraphQLOutputType, GraphQLType } from "graphql";

interface ChangeNullabilityTypeRules {
  [fieldName: string]: boolean;
}
interface ChangeNullabilityRules {
  [typeName: string]: ChangeNullabilityTypeRules;
}

let counter = 0;

export function makeChangeNullabilityPlugin(
  rules: ChangeNullabilityRules,
): GraphileConfig.Plugin {
  function applyNullability<T extends GraphQLInputType | GraphQLOutputType>(
    type: GraphQLType,
    fieldName: string,
    typeRules: ChangeNullabilityTypeRules,
    build: GraphileBuild.Build,
  ): T {
    const shouldBeNullable = typeRules[fieldName];
    if (shouldBeNullable == null) {
      return type as any;
    }
    const {
      graphql: { getNullableType, GraphQLNonNull },
    } = build;
    const nullableType = getNullableType(type);
    return shouldBeNullable
      ? nullableType
      : nullableType === type
      ? new GraphQLNonNull(type)
      : (type as any); // Optimisation if it's already non-null
  }
  return {
    name: `ChangeNullabilityPlugin_${++counter}`,
    version: "0.0.0",
    schema: {
      hooks: {
        GraphQLInputObjectType_fields_field(field, build, context) {
          const { Self, scope } = context;
          const typeRules = rules[Self.name];
          if (!typeRules) {
            return field;
          }
          field.type = applyNullability<GraphQLInputType>(
            field.type,
            scope.fieldName,
            typeRules,
            build,
          );
          return field;
        },
        GraphQLObjectType_fields_field(field, build, context) {
          const { Self, scope } = context;
          const typeRules = rules[Self.name];
          if (!typeRules) {
            return field;
          }
          field.type = applyNullability<GraphQLOutputType>(
            field.type,
            scope.fieldName,
            typeRules,
            build,
          );
          return field;
        },
      },
    },
  };
}
