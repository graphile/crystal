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
  AbstractTypePlanner,
  ArgumentApplyPlanResolver,
  BaseGraphQLArguments,
  EnumValueApplyResolver,
  FieldPlanResolver,
  InputObjectFieldApplyResolver,
  InputObjectTypeBakedResolver,
  ScalarPlanResolver,
} from "./interfaces.js";
import type { Step } from "./step.js";
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

export interface ObjectFieldConfig<
  TSource extends Step = Step,
  TArgs extends BaseGraphQLArguments = any,
  TResultStep extends Step = Step,
> {
  plan?: FieldPlanResolver<TSource, TArgs, TResultStep>;
  subscribePlan?: FieldPlanResolver<TSource, TArgs, TResultStep>;
  resolve?: GraphQLFieldResolver<any, any>;
  subscribe?: GraphQLFieldResolver<any, any>;
  args?: {
    [argName: string]:
      | ArgumentApplyPlanResolver
      | {
          applyPlan?: ArgumentApplyPlanResolver;
          applySubscribePlan?: ArgumentApplyPlanResolver;
          extensions?: graphql.GraphQLArgumentExtensions;
        };
  };
}

// TYPES: improve the types here!
/**
 * When defining a field with `typeDefs/objectPlans` you can declare the field plan
 * directly, or you can define a configuration object that accepts the plan and
 * more.
 */
export type FieldPlan<
  TSource extends Step = Step,
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments,
  TResultStep extends Step = Step,
> =
  | FieldPlanResolver<TSource, TArgs, TResultStep>
  | ObjectFieldConfig<TSource, TArgs, TResultStep>;

export type DeprecatedObjectPlan<TSource extends Step = Step> = {
  __assertStep?:
    | ((step: Step) => asserts step is TSource)
    | { new (...args: any[]): TSource };
  __isTypeOf?: graphql.GraphQLIsTypeOfFn<any, any>;
  __planType?($specifier: Step): TSource;
} & {
  [key: string]: FieldPlan<TSource, any, any>;
};
/**
 * The plans/config for each field of a GraphQL object type.
 */
export type ObjectPlan<TSource extends Step = Step> = {
  assertStep?:
    | ((step: Step) => asserts step is TSource)
    | { new (...args: any[]): TSource };
  isTypeOf?: graphql.GraphQLIsTypeOfFn<any, any>;
  planType?($specifier: Step): TSource;
  fields?: {
    [key: string]: FieldPlan<TSource, any, any>;
  };
};

/**
 * The plans for each field of a GraphQL input object type.
 */
export type DeprecatedInputObjectPlan = {
  __baked?: InputObjectTypeBakedResolver;
} & {
  [fieldName: string]:
    | InputObjectFieldApplyResolver<any>
    | {
        apply?: InputObjectFieldApplyResolver<any>;
        extensions?: graphql.GraphQLInputFieldExtensions;
      };
};

export type InputFieldPlan<TParent = any, TData = any> =
  | InputObjectFieldApplyResolver<TParent, TData>
  | {
      apply?: InputObjectFieldApplyResolver<TParent, TData>;
      extensions?: graphql.GraphQLInputFieldExtensions;
    };

export type InputObjectPlan = {
  baked?: InputObjectTypeBakedResolver;
  fields?: {
    [fieldName: string]: InputFieldPlan;
  };
};

/**
 * The plan config for an interface or union type.
 */
export interface AbstractTypePlan<
  TSource extends Step = any,
  TSpecifier extends Step = TSource,
> {
  /**
   * Runtime. If the polymorphic data just needs resolving to a type name, this
   * method can be used to return said type name. If planning of polymorphism
   * is more complex for this polymorphic type (for example, if it includes
   * fetching of data) then the `planType` method should be used instead.
   *
   * Warning: this method is more expensive than planType because it requires
   * the implementation of GraphQL.js emulation.
   */
  resolveType?: graphql.GraphQLTypeResolver<any, Grafast.Context>;

  /**
   * Takes a step representing this polymorphic position, and returns a
   * "specifier" step that will be input to planType. If not specified, the
   * step's own `.toSpecifier()` will be used, if present, otherwise the
   * step's own `.toRecord()`, and failing that the step itself.
   */
  toSpecifier?($step: TSource): TSpecifier;

  /**
   * Plantime. `$specifier` is either a step returned from a field or list
   * position with an abstract type, or a `__ValueStep` that represents the
   * combined values of such steps (to prevent unbounded plan branching).
   * `planType` must then construct a step that represents the `__typename`
   * related to this given specifier (or `null` if no match can be found) and a
   * `planForType` method which, when called, should return the step for the
   * given type.
   */
  planType?: ($specifier: TSpecifier) => AbstractTypePlanner;
}
export interface InterfacePlan<
  TSource extends Step = any,
  TSpecifier extends Step = TSource,
> extends AbstractTypePlan<TSource, TSpecifier> {}
export interface UnionPlan<
  TSource extends Step = any,
  TSpecifier extends Step = TSource,
> extends AbstractTypePlan<TSource, TSpecifier> {}

export type DeprecatedUnionOrInterfacePlan = {
  [TKey in keyof AbstractTypePlan as `__${TKey}`]: AbstractTypePlan[TKey];
};

/**
 * The config for a GraphQL scalar type.
 */
export type ScalarPlan = {
  serialize?: GraphQLScalarSerializer<any>;
  parseValue?: GraphQLScalarValueParser<any>;
  parseLiteral?: GraphQLScalarLiteralParser<any>;
  plan?: ScalarPlanResolver<any, any>;
};

/**
 * The values/configs for the entries in a GraphQL enum type.
 */
export type EnumPlan = {
  // The internal value for the enum
  [enumValueName: string]:
    | EnumValueApplyResolver
    | string
    | number
    | boolean
    | {
        value?: unknown;
        extensions?: graphql.GraphQLEnumValueExtensions;
        apply?: EnumValueApplyResolver;
      };
};

/**
 * A map from GraphQL named type to the config for that type.
 *
 * @deprecated Please use the different plan types instead
 */
export interface GrafastPlans {
  [typeName: string]:
    | DeprecatedObjectPlan
    | DeprecatedInputObjectPlan
    | DeprecatedUnionOrInterfacePlan
    | ScalarPlan
    | EnumPlan;
}

export interface GrafastSchemaSpec {
  typeDefs: string | graphql.DocumentNode | graphql.DocumentNode[];

  /**
   * All the different types of plans smooshed together to simulate the old
   * typeDefs/resolvers pattern. Avoid.
   *
   * @deprecated Please use objectPlans, unionPlans, interfacePlans, inputObjectPlans, scalarPlans or enumPlans as appropriate.
   */
  plans?: GrafastPlans;

  scalarPlans?: { [typeName: string]: ScalarPlan };
  enumPlans?: { [typeName: string]: EnumPlan };
  objectPlans?: { [typeName: string]: ObjectPlan<any> };
  unionPlans?: { [typeName: string]: UnionPlan<any> };
  interfacePlans?: { [typeName: string]: InterfacePlan<any> };
  inputObjectPlans?: { [typeName: string]: InputObjectPlan };
  enableDeferStream?: boolean;
}

/**
 * Takes a GraphQL schema definition in Interface Definition Language (IDL/SDL)
 * syntax and configs for the types in it and returns a GraphQL schema.
 */
export function makeGrafastSchema(details: GrafastSchemaSpec): GraphQLSchema {
  const {
    typeDefs,
    plans: rawPlans,
    objectPlans,
    unionPlans,
    interfacePlans,
    inputObjectPlans,
    scalarPlans,
    enumPlans,
    enableDeferStream = false,
  } = details;

  let plans: GrafastPlans;
  if (rawPlans) {
    if (
      objectPlans ||
      unionPlans ||
      interfacePlans ||
      inputObjectPlans ||
      scalarPlans ||
      enumPlans
    ) {
      throw new Error(
        `plans is deprecated and may not be specified alongside newer approaches`,
      );
    }
    plans = rawPlans;
  } else {
    // Hackily convert the new format into the old format. We'll do away with
    // this in future, but for now it's the easiest way to ensure compatibility
    plans = {};

    for (const [typeName, spec] of Object.entries(objectPlans ?? {})) {
      const o = {} as Record<string, any>;
      plans[typeName] = o as any;

      const { fields = {}, ...rest } = spec;
      for (const [key, val] of Object.entries(rest)) {
        o[`__${key}`] = val;
      }
      for (const [key, val] of Object.entries(fields)) {
        o[key] = val;
      }
    }

    for (const [typeName, spec] of Object.entries(inputObjectPlans ?? {})) {
      const o = {} as Record<string, any>;
      plans[typeName] = o as any;

      const { fields = {}, ...rest } = spec;
      for (const [key, val] of Object.entries(rest)) {
        o[`__${key}`] = val;
      }
      for (const [key, val] of Object.entries(fields)) {
        o[key] = val;
      }
    }

    for (const [typeName, spec] of Object.entries(unionPlans ?? {})) {
      const o = {} as Record<string, any>;
      plans[typeName] = o as any;

      for (const [key, val] of Object.entries(spec)) {
        o[`__${key}`] = val;
      }
    }

    for (const [typeName, spec] of Object.entries(interfacePlans ?? {})) {
      const o = {} as Record<string, any>;
      plans[typeName] = o as any;

      for (const [key, val] of Object.entries(spec)) {
        o[`__${key}`] = val;
      }
    }

    for (const [typeName, spec] of Object.entries(scalarPlans ?? {})) {
      plans[typeName] = spec;
    }

    for (const [typeName, spec] of Object.entries(enumPlans ?? {})) {
      plans[typeName] = spec;
    }
  }

  const document: graphql.DocumentNode =
    typeof typeDefs === "string"
      ? parse(typeDefs)
      : Array.isArray(typeDefs)
        ? {
            kind: graphql.Kind.DOCUMENT,
            definitions: typeDefs.flatMap((t) => t.definitions),
          }
        : typeDefs;
  if (!document || document.kind !== "Document") {
    throw new Error(
      "The first argument to makeGrafastSchema must be an object containing a `typeDefs` field; the value for this field should be a parsed GraphQL document, array of these, or a string.",
    );
  }

  const astSchema = buildASTSchema(document, {
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
        const objectPlans = plans[astType.name] as
          | DeprecatedObjectPlan
          | undefined;

        const rawFields = rawConfig.fields;
        const rawInterfaces = rawConfig.interfaces;
        const config: graphql.GraphQLObjectTypeConfig<any, any> = {
          ...rawConfig,
          extensions: {
            ...rawConfig.extensions,
          },
        };
        const ext = config.extensions as graphql.GraphQLObjectTypeExtensions<
          any,
          any
        >;
        if (objectPlans) {
          for (const [fieldName, rawFieldSpec] of Object.entries(objectPlans)) {
            if (fieldName === "__assertStep") {
              exportNameHint(rawFieldSpec, `${typeName}_assertStep`);
              ext.grafast ??= {};
              config.extensions!.grafast!.assertStep = rawFieldSpec as any;
              continue;
            } else if (fieldName === "__planType") {
              exportNameHint(rawFieldSpec, `${typeName}_planType`);
              ext.grafast ??= {};
              config.extensions!.grafast!.planType = rawFieldSpec as any;
              continue;
            } else if (fieldName === "__isTypeOf") {
              exportNameHint(rawFieldSpec, `${typeName}_isTypeOf`);
              config.isTypeOf = rawFieldSpec as any;
              continue;
            } else if (fieldName.startsWith("__")) {
              throw new Error(
                `Unsupported field name '${fieldName}'; perhaps you meant '__assertStep'?`,
              );
            }
            const fieldSpec = rawFieldSpec as FieldPlan;

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
                    `'plans' specified configuration for object type '${typeName}' field '${fieldName}' arg '${argName}', but that arg was not present on the field`,
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
            const fieldSpec =
              objectPlans && Object.hasOwn(objectPlans, fieldName)
                ? objectPlans[fieldName]
                : undefined;
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
                    const argSpec = fieldSpec.args?.[argName];
                    if (typeof argSpec === "function") {
                      const applyPlan = argSpec;
                      exportNameHint(
                        applyPlan,
                        `${typeName}_${fieldName}_${argName}_applyPlan`,
                      );
                      Object.assign(arg.extensions!, {
                        grafast: { applyPlan },
                      });
                    } else if (
                      typeof argSpec === "object" &&
                      argSpec !== null
                    ) {
                      const { extensions, applyPlan, applySubscribePlan } =
                        argSpec;
                      if (extensions) {
                        Object.assign(arg.extensions!, extensions);
                      }
                      if (applyPlan || applySubscribePlan) {
                        exportNameHint(
                          applyPlan,
                          `${typeName}_${fieldName}_${argName}_applyPlan`,
                        );
                        exportNameHint(
                          applySubscribePlan,
                          `${typeName}_${fieldName}_${argName}_applySubscribePlan`,
                        );
                        Object.assign(arg.extensions!, {
                          grafast: {
                            applyPlan,
                            applySubscribePlan,
                          },
                        });
                      }
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
          | DeprecatedInputObjectPlan
          | undefined;

        if (inputObjectPlans) {
          for (const [fieldName, fieldSpec] of Object.entries(
            inputObjectPlans,
          )) {
            if (fieldName === "__baked") {
              config.extensions!.grafast!.baked =
                fieldSpec as InputObjectTypeBakedResolver;
              continue;
            }
            if (config.extensions?.grafast?.baked) {
              exportNameHint(
                config.extensions.grafast.baked,
                `${typeName}__baked`,
              );
            }
            const field = rawConfig.fields[fieldName];
            if (!field) {
              console.warn(
                `'plans' specified configuration for input object type '${typeName}' field '${fieldName}', but that field was not present in the type`,
              );
              continue;
            }
          }
        }

        const rawFields = rawConfig.fields;
        config.fields = function () {
          const fields: graphql.GraphQLInputFieldConfigMap =
            Object.create(null);

          for (const [fieldName, rawFieldConfig] of Object.entries(rawFields)) {
            const fieldSpec =
              inputObjectPlans && Object.hasOwn(inputObjectPlans, fieldName)
                ? inputObjectPlans[fieldName]
                : undefined;
            const fieldConfig: graphql.GraphQLInputFieldConfig = {
              ...rawFieldConfig,
              type: mapType(rawFieldConfig.type),
            };
            fields[fieldName] = fieldConfig;
            if (fieldSpec) {
              const grafastExtensions: Grafast.InputFieldExtensions =
                Object.create(null);
              (fieldConfig.extensions as any).grafast = grafastExtensions;
              if (typeof fieldSpec === "function") {
                exportNameHint(fieldSpec, `${typeName}_${fieldName}_apply`);
                grafastExtensions.apply = fieldSpec;
              } else {
                const { apply, extensions } = fieldSpec;
                if (extensions) {
                  Object.assign(fieldConfig.extensions!, extensions);
                }
                if (apply) {
                  exportNameHint(
                    fieldSpec.apply,
                    `${typeName}_${fieldName}_apply`,
                  );
                  Object.assign(grafastExtensions, { apply });
                }
              }
            }
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
          | DeprecatedUnionOrInterfacePlan
          | undefined;
        if (polyPlans?.__resolveType) {
          exportNameHint(polyPlans.__resolveType, `${typeName}_resolveType`);
          config.resolveType = polyPlans.__resolveType;
        }
        if (polyPlans?.__toSpecifier) {
          exportNameHint(polyPlans.__toSpecifier, `${typeName}_toSpecifier`);
          config.extensions ??= Object.create(null);
          (config.extensions as any).grafast ??= Object.create(null);
          config.extensions!.grafast!.toSpecifier = polyPlans.__toSpecifier;
        }
        if (polyPlans?.__planType) {
          exportNameHint(polyPlans.__planType, `${typeName}_planType`);
          config.extensions ??= Object.create(null);
          (config.extensions as any).grafast ??= Object.create(null);
          config.extensions!.grafast!.planType = polyPlans.__planType;
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
          | DeprecatedUnionOrInterfacePlan
          | undefined;
        if (polyPlans?.__resolveType) {
          exportNameHint(polyPlans.__resolveType, `${typeName}_resolveType`);
          config.resolveType = polyPlans.__resolveType;
        }
        if (polyPlans?.__toSpecifier) {
          exportNameHint(polyPlans.__toSpecifier, `${typeName}_toSpecifier`);
          config.extensions ??= Object.create(null);
          (config.extensions as any).grafast ??= Object.create(null);
          config.extensions!.grafast!.toSpecifier = polyPlans.__toSpecifier;
        }
        if (polyPlans?.__planType) {
          exportNameHint(polyPlans.__planType, `${typeName}_planType`);
          config.extensions ??= Object.create(null);
          (config.extensions as any).grafast ??= Object.create(null);
          config.extensions!.grafast!.planType = polyPlans.__planType;
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
        const scalarPlans = plans[astType.name] as ScalarPlan | undefined;
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
        const enumPlans = plans[astType.name] as EnumPlan | undefined;
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
                `${typeName}_${enumValueName}_apply`,
              );
              // It's a plan
              if (!enumValue.extensions) {
                enumValue.extensions = Object.create(
                  null,
                ) as graphql.GraphQLEnumValueExtensions;
              }
              enumValue.extensions.grafast = {
                apply: enumValueSpec,
              } as Grafast.EnumValueExtensions;
            } else if (
              typeof enumValueSpec === "object" &&
              enumValueSpec != null
            ) {
              // It's a full spec
              if (enumValueSpec.extensions) {
                exportNameHint(
                  enumValueSpec.extensions,
                  `${typeName}_${enumValueName}_extensions`,
                );
                Object.assign(enumValue.extensions!, enumValueSpec.extensions);
              }
              if (enumValueSpec.apply) {
                exportNameHint(
                  enumValueSpec.apply,
                  `${typeName}_${enumValueName}_apply`,
                );
                enumValue.extensions!.grafast = {
                  apply: enumValueSpec.apply,
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
  const errors = graphql.validateSchema(schema);
  if (errors.length === 1) {
    throw errors[0];
  } else if (errors.length > 1) {
    throw new AggregateError(
      errors,
      `Invalid schema; first few errors:\n${errors.slice(0, 5).join("\n")}`,
    );
  }
  return schema;
}
