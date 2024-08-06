import type {
  GraphQLFieldExtensions,
  GraphQLFieldResolver,
  GraphQLScalarLiteralParser,
  GraphQLScalarSerializer,
  GraphQLScalarValueParser,
} from "graphql";
import { GraphQLSchema } from "graphql";
import * as graphql from "graphql";

import type {
  EnumValueApplyPlanResolver,
  FieldPlanResolver,
  ScalarPlanResolver,
} from "./interfaces.js";
import type { ExecutableStep } from "./step.js";
import { exportNameHint } from "./utils.js";

const {
  buildASTSchema,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isUnionType,
  parse,
} = graphql;

// TYPES: improve the types here!
/**
 * When defining a field with `typeDefs/plans` you can declare the field plan
 * directly, or you can define a configuration object that accepts the plan and
 * more.
 */
export type FieldPlans =
  | FieldPlanResolver<any, any, any>
  | {
      plan?: FieldPlanResolver<any, any, any>;
      subscribePlan?: FieldPlanResolver<any, any, any>;
      resolve?: GraphQLFieldResolver<any, any>;
      subscribe?: GraphQLFieldResolver<any, any>;
      args?: {
        [argName: string]: Grafast.ArgumentExtensions;
      };
    };

/**
 * The plans/config for each field of a GraphQL object type.
 */
export type ObjectPlans = {
  __assertStep?:
    | ((step: ExecutableStep) => asserts step is ExecutableStep)
    | { new (...args: any[]): ExecutableStep };
} & {
  [fieldName: string]: FieldPlans;
};

/**
 * The plans for each field of a GraphQL input object type.
 */
export type InputObjectPlans = {
  __inputPlan?: () => ExecutableStep;
} & {
  [fieldName: string]: Grafast.InputFieldExtensions;
};

/**
 * The plan config for an interface or union type.
 */
export type InterfaceOrUnionPlans = {
  __resolveType?: (o: unknown) => string;
};

/**
 * The config for a GraphQL scalar type.
 */
export type ScalarPlans = {
  serialize?: GraphQLScalarSerializer<any>;
  parseValue?: GraphQLScalarValueParser<any>;
  parseLiteral?: GraphQLScalarLiteralParser<any>;
  plan?: ScalarPlanResolver<any, any>;
};

/**
 * The values/configs for the entries in a GraphQL enum type.
 */
export type EnumPlans = {
  // The internal value for the enum
  [enumValueName: string]:
    | EnumValueApplyPlanResolver
    | string
    | number
    | boolean
    | {
        value?: unknown;
        applyPlan?: EnumValueApplyPlanResolver;
      };
};

/**
 * A map from GraphQL named type to the config for that type.
 */
export interface GrafastPlans {
  [typeName: string]:
    | ObjectPlans
    | InputObjectPlans
    | InterfaceOrUnionPlans
    | ScalarPlans
    | EnumPlans;
}

/**
 * Takes a GraphQL schema definition in Interface Definition Language (IDL/SDL)
 * syntax and configs for the types in it and returns a GraphQL schema.
 */
export function makeGrafastSchema(details: {
  typeDefs: string;
  plans: GrafastPlans;
  enableDeferStream?: boolean;
}): GraphQLSchema {
  const { typeDefs, plans, enableDeferStream = false } = details;

  const astSchema = buildASTSchema(parse(typeDefs), {
    // @ts-ignore
    enableDeferStream,
  });
  const schemaConfig = astSchema.toConfig() as graphql.GraphQLSchemaConfig & {
    types: Array<graphql.GraphQLNamedType>;
  };

  const typeByName = new Map<string, graphql.GraphQLNamedType>();

  function mapType(type: graphql.GraphQLObjectType): graphql.GraphQLObjectType;
  function mapType(
    type: graphql.GraphQLInterfaceType,
  ): graphql.GraphQLInterfaceType;
  function mapType(
    type: graphql.GraphQLNamedType & graphql.GraphQLOutputType,
  ): graphql.GraphQLNamedType & graphql.GraphQLOutputType;
  function mapType(
    type: graphql.GraphQLNamedType & graphql.GraphQLInputType,
  ): graphql.GraphQLNamedType & graphql.GraphQLInputType;
  function mapType(type: graphql.GraphQLOutputType): graphql.GraphQLOutputType;
  function mapType(type: graphql.GraphQLInputType): graphql.GraphQLInputType;
  function mapType(type: graphql.GraphQLType): graphql.GraphQLType;
  function mapType(type: graphql.GraphQLType): graphql.GraphQLType {
    if (graphql.isNonNullType(type)) {
      return new graphql.GraphQLNonNull(mapType(type.ofType));
    } else if (graphql.isListType(type)) {
      return new graphql.GraphQLList(mapType(type.ofType));
    } else {
      const replacementType = typeByName.get(type.name);
      if (!replacementType) {
        throw new Error(`Failed to find replaced type '${type.name}'`);
      }
      return replacementType;
    }
  }

  for (const [typeName, _spec] of Object.entries(plans)) {
    const astTypeIndex = schemaConfig.types.findIndex(
      (t) => t.name === typeName,
    );
    const astType = schemaConfig.types[astTypeIndex];
    if (!astType) {
      console.warn(
        `'plans' specified configuration for type '${typeName}', but that type was not present in the schema`,
      );
      continue;
    }
  }

  const BUILT_IN_TYPE_NAMES = ["String", "Int", "Float", "Boolean", "ID"];

  // Now mod the types
  const rawTypes = schemaConfig.types;
  schemaConfig.types = rawTypes.map((astType) => {
    const typeName = astType.name;
    const replacementType = (() => {
      if (typeName.startsWith("__") || BUILT_IN_TYPE_NAMES.includes(typeName)) {
        return astType;
      }
      if (isObjectType(astType)) {
        const rawConfig = astType.toConfig();
        const objectPlans = plans[astType.name] as ObjectPlans | undefined;

        const rawFields = rawConfig.fields;
        const rawInterfaces = rawConfig.interfaces;
        const config: graphql.GraphQLObjectTypeConfig<any, any> = {
          ...rawConfig,
          extensions: {
            ...rawConfig.extensions,
          },
        };
        if (objectPlans) {
          for (const [fieldName, rawFieldSpec] of Object.entries(objectPlans)) {
            if (fieldName === "__assertStep") {
              exportNameHint(rawFieldSpec, `${typeName}_assertStep`);
              (
                config.extensions as graphql.GraphQLObjectTypeExtensions<
                  any,
                  any
                >
              ).grafast = { assertStep: rawFieldSpec as any };
              continue;
            } else if (fieldName.startsWith("__")) {
              throw new Error(
                `Unsupported field name '${fieldName}'; perhaps you meant '__assertStep'?`,
              );
            }
            const fieldSpec = rawFieldSpec as FieldPlans;

            const field = rawFields[fieldName];
            if (!field) {
              console.warn(
                `'plans' specified configuration for object type '${typeName}' field '${fieldName}', but that field was not present in the type`,
              );
              continue;
            }
            if (
              "args" in fieldSpec &&
              typeof fieldSpec.args === "object" &&
              fieldSpec.args != null
            ) {
              for (const [argName, _argSpec] of Object.entries(
                fieldSpec.args,
              )) {
                const arg = field.args?.[argName];
                if (!arg) {
                  console.warn(
                    `'plans' specified configuration for object type '${typeName}' field '${fieldName}' arg '${argName}', but that arg was not present in the type`,
                  );
                  continue;
                }
              }
            }
          }
        }
        config.interfaces = function () {
          return rawInterfaces.map((t) => mapType(t));
        };

        config.fields = function () {
          const fields: graphql.GraphQLFieldConfigMap<any, any> =
            Object.create(null);
          for (const [fieldName, rawFieldSpec] of Object.entries(rawFields)) {
            if (fieldName.startsWith("__")) {
              continue;
            }
            const fieldSpec = (objectPlans as ObjectPlans | undefined)?.[
              fieldName
            ];
            const fieldConfig: graphql.GraphQLFieldConfig<any, any> = {
              ...rawFieldSpec,
              type: mapType(rawFieldSpec.type),
            };
            fields[fieldName] = fieldConfig;
            if (fieldSpec) {
              if (typeof fieldSpec === "function") {
                exportNameHint(fieldSpec, `${typeName}_${fieldName}_plan`);
                // it's a plan
                (fieldConfig.extensions as any).grafast = {
                  plan: fieldSpec,
                };
              } else {
                // it's a spec
                const grafastExtensions: GraphQLFieldExtensions<
                  any,
                  any
                >["grafast"] = Object.create(null);
                (fieldConfig.extensions as any).grafast = grafastExtensions;
                if (typeof fieldSpec.resolve === "function") {
                  exportNameHint(
                    fieldSpec.resolve,
                    `${typeName}_${fieldName}_resolve`,
                  );
                  fieldConfig.resolve = fieldSpec.resolve;
                }
                if (typeof fieldSpec.subscribe === "function") {
                  exportNameHint(
                    fieldSpec.subscribe,
                    `${typeName}_${fieldName}_subscribe`,
                  );
                  fieldConfig.subscribe = fieldSpec.subscribe;
                }
                if (typeof fieldSpec.plan === "function") {
                  exportNameHint(
                    fieldSpec.plan,
                    `${typeName}_${fieldName}_plan`,
                  );
                  grafastExtensions!.plan = fieldSpec.plan;
                }
                if (typeof fieldSpec.subscribePlan === "function") {
                  exportNameHint(
                    fieldSpec.subscribePlan,
                    `${typeName}_${fieldName}_subscribePlan`,
                  );
                  grafastExtensions!.subscribePlan = fieldSpec.subscribePlan;
                }

                if (fieldConfig.args) {
                  for (const [argName, arg] of Object.entries(
                    fieldConfig.args,
                  )) {
                    arg.type = mapType(arg.type);
                    const argSpec = fieldSpec.args?.[argName];
                    if (typeof argSpec === "function") {
                      // Invalid
                      throw new Error(
                        `Invalid configuration for plans.${typeName}.${fieldName}.args.${argName} - saw a function, but expected an object with 'inputPlan' (optional) and 'applyPlan' (optional) plans`,
                      );
                    } else if (argSpec) {
                      exportNameHint(
                        argSpec.applyPlan,
                        `${typeName}_${fieldName}_${argName}_applyPlan`,
                      );
                      exportNameHint(
                        argSpec.inputPlan,
                        `${typeName}_${fieldName}_${argName}_inputPlan`,
                      );
                      const grafastExtensions: Grafast.ArgumentExtensions =
                        Object.create(null);
                      (arg.extensions as any).grafast = grafastExtensions;
                      Object.assign(grafastExtensions, argSpec);
                    }
                  }
                }
              }
            }
          }
          return fields;
        };
        return new graphql.GraphQLObjectType(config);
      } else if (isInputObjectType(astType)) {
        const rawConfig = astType.toConfig();
        const config: graphql.GraphQLInputObjectTypeConfig = {
          ...rawConfig,
          extensions: {
            ...rawConfig.extensions,
            grafast: {
              ...rawConfig.extensions?.grafast,
            },
          },
        };
        const inputObjectPlans = plans[astType.name] as
          | InputObjectPlans
          | undefined;

        if (inputObjectPlans) {
          for (const [fieldName, fieldSpec] of Object.entries(
            inputObjectPlans,
          )) {
            if (fieldName === "__inputPlan") {
              config.extensions!.grafast!.inputPlan =
                fieldSpec as () => ExecutableStep;
              continue;
            }
            const field = rawConfig.fields[fieldName];
            if (!field) {
              console.warn(
                `'plans' specified configuration for input object type '${typeName}' field '${fieldName}', but that field was not present in the type`,
              );
              continue;
            }
            if (typeof fieldSpec === "function") {
              throw new Error(
                `Expected input object type '${typeName}' field '${fieldName}' to be an object, but found a function. We don't know if this should be the 'inputPlan' or 'applyPlan' - please supply an object.`,
              );
            }
          }
        }

        const rawFields = rawConfig.fields;
        config.fields = function () {
          const fields: graphql.GraphQLInputFieldConfigMap =
            Object.create(null);

          for (const [fieldName, rawFieldConfig] of Object.entries(rawFields)) {
            const fieldSpec = inputObjectPlans?.[fieldName];
            const fieldConfig: graphql.GraphQLInputFieldConfig = {
              ...rawFieldConfig,
              type: mapType(rawFieldConfig.type),
            };
            fields[fieldName] = fieldConfig;
            if (fieldSpec) {
              exportNameHint(
                fieldSpec.inputPlan,
                `${typeName}_${fieldName}_inputPlan`,
              );
              exportNameHint(
                fieldSpec.applyPlan,
                `${typeName}_${fieldName}_applyPlan`,
              );
            }
            // it's a spec
            const grafastExtensions: Grafast.InputFieldExtensions =
              Object.create(null);
            (fieldConfig.extensions as any).grafast = grafastExtensions;
            Object.assign(grafastExtensions, fieldSpec);
          }
          return fields;
        };
        return new graphql.GraphQLInputObjectType(config);
      } else if (isInterfaceType(astType)) {
        const rawConfig = astType.toConfig();
        const config: graphql.GraphQLInterfaceTypeConfig<any, any> = {
          ...rawConfig,
        };
        const rawFields = rawConfig.fields;
        config.fields = function () {
          const fields: graphql.GraphQLFieldConfigMap<any, any> =
            Object.create(null);
          for (const [fieldName, rawFieldSpec] of Object.entries(rawFields)) {
            const fieldConfig: graphql.GraphQLFieldConfig<any, any> = {
              ...rawFieldSpec,
              type: mapType(rawFieldSpec.type),
            };
            fields[fieldName] = fieldConfig;
            if (fieldConfig.args) {
              for (const [_argName, arg] of Object.entries(fieldConfig.args)) {
                arg.type = mapType(arg.type);
              }
            }
          }
          return fields;
        };
        const rawInterfaces = rawConfig.interfaces;
        config.interfaces = function () {
          return rawInterfaces.map((t) => mapType(t));
        };
        const polyPlans = plans[astType.name] as
          | InterfaceOrUnionPlans
          | undefined;
        if (polyPlans?.__resolveType) {
          exportNameHint(polyPlans.__resolveType, `${typeName}_resolveType`);
          config.resolveType = polyPlans.__resolveType;
        }
        return new graphql.GraphQLInterfaceType(config);
      } else if (isUnionType(astType)) {
        const rawConfig = astType.toConfig();
        const config: graphql.GraphQLUnionTypeConfig<any, any> = {
          ...rawConfig,
        };
        const rawTypes = rawConfig.types;
        config.types = function () {
          return rawTypes.map((t) => mapType(t));
        };
        const polyPlans = plans[astType.name] as
          | InterfaceOrUnionPlans
          | undefined;
        if (polyPlans?.__resolveType) {
          exportNameHint(polyPlans.__resolveType, `${typeName}_resolveType`);
          config.resolveType = polyPlans.__resolveType;
        }
        return new graphql.GraphQLUnionType(config);
      } else if (isScalarType(astType)) {
        const rawConfig = astType.toConfig();
        const config = {
          ...(rawConfig as graphql.GraphQLScalarTypeConfig<any, any>),
          extensions: {
            ...rawConfig.extensions,
          },
        };
        const scalarPlans = plans[astType.name] as ScalarPlans | undefined;
        if (typeof scalarPlans?.serialize === "function") {
          exportNameHint(scalarPlans.serialize, `${typeName}_serialize`);
          config.serialize = scalarPlans.serialize;
        }
        if (typeof scalarPlans?.parseValue === "function") {
          exportNameHint(scalarPlans.parseValue, `${typeName}_parseValue`);
          config.parseValue = scalarPlans.parseValue;
        }
        if (typeof scalarPlans?.parseLiteral === "function") {
          exportNameHint(scalarPlans.parseLiteral, `${typeName}_parseLiteral`);
          config.parseLiteral = scalarPlans.parseLiteral;
        }
        if (typeof scalarPlans?.plan === "function") {
          exportNameHint(scalarPlans.plan, `${typeName}_plan`);
          config.extensions!.grafast = { plan: scalarPlans.plan };
        }
        return new graphql.GraphQLScalarType(config);
      } else if (isEnumType(astType)) {
        const rawConfig = astType.toConfig();
        const config = {
          ...rawConfig,
        } as graphql.GraphQLEnumTypeConfig & {
          extensions: graphql.GraphQLEnumTypeExtensions;
          values: Record<
            string,
            graphql.GraphQLEnumValueConfig & {
              extensions?: graphql.GraphQLEnumValueExtensions;
            }
          >;
        };
        const enumPlans = plans[astType.name] as EnumPlans | undefined;
        const enumValues = config.values;
        if (enumPlans) {
          for (const [enumValueName, enumValueSpec] of Object.entries(
            enumPlans,
          )) {
            const enumValue = enumValues[enumValueName];
            if (!enumValue) {
              console.warn(
                `'plans' specified configuration for enum type '${typeName}' value '${enumValueName}', but that value was not present in the type`,
              );
              continue;
            }
            if (typeof enumValueSpec === "function") {
              exportNameHint(
                enumValueSpec,
                `${typeName}_${enumValueName}_applyPlan`,
              );
              // It's a plan
              if (!enumValue.extensions) {
                enumValue.extensions = Object.create(
                  null,
                ) as graphql.GraphQLEnumValueExtensions;
              }
              enumValue.extensions.grafast = {
                applyPlan: enumValueSpec,
              } as Grafast.EnumValueExtensions;
            } else if (
              typeof enumValueSpec === "object" &&
              enumValueSpec != null
            ) {
              // It's a full spec
              if (enumValueSpec.applyPlan) {
                exportNameHint(
                  enumValueSpec.applyPlan,
                  `${typeName}_${enumValueName}_applyPlan`,
                );
                (enumValue.extensions as any).grafast = {
                  applyPlan: enumValueSpec.applyPlan,
                } as Grafast.EnumValueExtensions;
              }
              if ("value" in enumValueSpec) {
                enumValue.value = enumValueSpec.value;
              }
            } else {
              // It must be the value
              enumValue.value = enumValueSpec;
            }
          }
        }
        return new graphql.GraphQLEnumType(config);
      } else {
        const never: never = astType;
        throw new Error(`Unhandled type ${never}`);
      }
    })();
    typeByName.set(typeName, replacementType);
    return replacementType;
  });
  if (schemaConfig.query) {
    schemaConfig.query = mapType(schemaConfig.query);
  }
  if (schemaConfig.mutation) {
    schemaConfig.mutation = mapType(schemaConfig.mutation);
  }
  if (schemaConfig.subscription) {
    schemaConfig.subscription = mapType(schemaConfig.subscription);
  }
  if (schemaConfig.directives) {
    for (const directiveConfig of schemaConfig.directives) {
      for (const argConfig of directiveConfig.args) {
        argConfig.type = mapType(argConfig.type);
      }
    }
  }
  const schema = new GraphQLSchema(schemaConfig);
  return schema;
}
