import type { GrafastArgumentConfig, GrafastFieldConfig } from "grafast";
import type {} from "graphile-build";
import type * as AllGraphQL from "graphql";
import type { GraphQLInputType, GraphQLOutputType, GraphQLType } from "graphql";
import { inspect } from "util";

export type NullabilitySpecString =
  | ""
  | "!"
  | "[]"
  | "[]!"
  | "[!]"
  | "[!]!"
  | "[[]]"
  | "[[]]!"
  | "[[]!]"
  | "[[]!]!"
  | "[[!]]"
  | "[[!]]!"
  | "[[!]!]"
  | "[[!]!]!";

// For backwards compatibility
export type NullabilitySpec = boolean | NullabilitySpecString;

export interface ChangeNullabilityTypeRules {
  [fieldName: string]:
    | NullabilitySpec
    | {
        type?: NullabilitySpec;
        args?: {
          [argName: string]: NullabilitySpec;
        };
      };
}
export interface ChangeNullabilityRules {
  [typeName: string]: ChangeNullabilityTypeRules;
}

let counter = 0;

function doIt(
  inType: GraphQLType,
  rawSpec: NullabilitySpec,
  graphql: typeof AllGraphQL,
  location: string,
  originalSpec = rawSpec,
): GraphQLType {
  const spec = rawSpec === true ? "" : rawSpec === false ? "!" : rawSpec;
  if (typeof spec !== "string") {
    throw new Error(
      `Invalid spec for '${location}': '${inspect(originalSpec)}'`,
    );
  }
  const shouldBeNonNull = spec.endsWith("!");
  const isNonNull = graphql.isNonNullType(inType);
  const nullableType = isNonNull ? inType.ofType : inType;
  const specSansBang = shouldBeNonNull
    ? spec.substring(0, spec.length - 1)
    : spec;
  if (specSansBang.startsWith("[")) {
    if (!specSansBang.endsWith("]")) {
      throw new Error(
        `Invalid syntax in spec for '${location}': '${inspect(originalSpec)}'`,
      );
    }
    const rest = specSansBang.substring(
      1,
      specSansBang.length - 1,
    ) as NullabilitySpecString;
    if (!graphql.isListType(nullableType)) {
      throw new Error(
        `Spec for '${location}' anticipated a list where there wasn't one: '${inspect(
          originalSpec,
        )}'`,
      );
    }
    const listInnerType = nullableType.ofType;
    const innerType = doIt(
      listInnerType,
      rest,
      graphql,
      location,
      originalSpec,
    );
    const newListType =
      innerType === listInnerType
        ? nullableType
        : new graphql.GraphQLList(innerType);
    if (newListType === nullableType && isNonNull === shouldBeNonNull) {
      return inType;
    } else if (shouldBeNonNull) {
      return new graphql.GraphQLNonNull(newListType);
    } else {
      return newListType;
    }
  } else {
    if (specSansBang.length > 0) {
      throw new Error(
        `Invalid syntax in spec for '${location}'; expected nothing left, but found '${specSansBang}': '${inspect(
          originalSpec,
        )}'`,
      );
    }
    if (shouldBeNonNull && isNonNull) {
      return inType;
    } else if (shouldBeNonNull) {
      return new graphql.GraphQLNonNull(nullableType);
    } else {
      return nullableType;
    }
  }

  return inType;
}

export function makeChangeNullabilityPlugin(
  rules: ChangeNullabilityRules,
): GraphileConfig.Plugin {
  const expectedMatches = Object.entries(rules).flatMap(
    ([typeName, typeRules]) =>
      Object.keys(typeRules).map((fieldName) => `${typeName}.${fieldName}`),
  );
  let pendingMatches = new Set<string>();

  function objectOrInterfaceFieldCallback<
    T extends GrafastFieldConfig<any, any, any, any, any>,
  >(
    field: T,
    build: GraphileBuild.Build,
    context:
      | GraphileBuild.ContextObjectFieldsField
      | GraphileBuild.ContextInterfaceFieldsField,
  ) {
    const {
      Self,
      scope: { fieldName },
    } = context;
    const typeRules = rules[Self.name];
    if (!typeRules) {
      return field;
    }
    const rawRule = typeRules[fieldName];
    if (rawRule == null) {
      return field;
    }
    const rule = typeof rawRule !== "object" ? { type: rawRule } : rawRule;
    pendingMatches.delete(`${Self.name}.${fieldName}`);
    if (rule.type) {
      field.type = doIt(
        field.type,
        rule.type,
        build.graphql,
        `${Self.name}.${fieldName}`,
      ) as GraphQLOutputType;
    }
    return field;
  }

  function objectOrInterfaceArgsArgCallback<
    T extends GrafastArgumentConfig<any, any, any, any, any, any>,
  >(
    arg: T,
    build: GraphileBuild.Build,
    context:
      | GraphileBuild.ContextObjectFieldsFieldArgsArg
      | GraphileBuild.ContextInterfaceFieldsFieldArgsArg,
  ) {
    const {
      Self,
      scope: { fieldName, argName },
    } = context;
    const typeRules = rules[Self.name];
    if (!typeRules) {
      return arg;
    }
    const rawRule = typeRules[fieldName];
    if (rawRule == null) {
      return arg;
    }
    const rule = typeof rawRule !== "object" ? { type: rawRule } : rawRule;
    const spec = rule.args?.[argName];
    if (spec) {
      arg.type = doIt(
        arg.type,
        spec,
        build.graphql,
        `${Self.name}.${fieldName}(${argName}:)`,
      );
    }
    return arg;
  }

  return {
    name: `ChangeNullabilityPlugin_${++counter}`,
    version: "0.0.0",
    schema: {
      hooks: {
        init(_) {
          pendingMatches = new Set(expectedMatches);
          return _;
        },
        GraphQLInputObjectType_fields_field(field, build, context) {
          const {
            Self,
            scope: { fieldName },
          } = context;
          const typeRules = rules[Self.name];
          if (!typeRules) {
            return field;
          }
          const rawRule = typeRules[fieldName];
          if (rawRule == null) {
            return field;
          }
          const rule =
            typeof rawRule !== "object" ? { type: rawRule } : rawRule;
          pendingMatches.delete(`${Self.name}.${fieldName}`);
          if (rule.type) {
            field.type = doIt(
              field.type,
              rule.type,
              build.graphql,
              `${Self.name}.${fieldName}`,
            ) as GraphQLInputType;
          }
          if (rule.args) {
            throw new Error(
              `${Self.name} is an input type, field '${fieldName}' cannot have args`,
            );
          }
          return field;
        },
        GraphQLInterfaceType_fields_field: objectOrInterfaceFieldCallback,
        GraphQLInterfaceType_fields_field_args_arg:
          objectOrInterfaceArgsArgCallback,
        GraphQLObjectType_fields_field: objectOrInterfaceFieldCallback,
        GraphQLObjectType_fields_field_args_arg:
          objectOrInterfaceArgsArgCallback,
        finalize(schema) {
          if (pendingMatches.size > 0) {
            throw new Error(
              `The following entries in your makeChangeNullabilityPlugin didn't match anything in your GraphQL schema; please check your spelling: ${[
                ...pendingMatches,
              ].join(", ")}`,
            );
          }
          return schema;
        },
      },
    },
  };
}
