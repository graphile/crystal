import type {
  BaseGraphQLArguments,
  ExecutableStep,
  GrafastFieldConfig,
  OutputPlanForType,
} from "grafast";
import { defaultPlanResolver, inputObjectFieldSpec, objectSpec } from "grafast";
import type {
  GraphQLEnumTypeConfig,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLScalarLiteralParser,
  GraphQLScalarTypeConfig,
  GraphQLSchemaConfig,
} from "grafast/graphql";
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
  isNamedType,
  valueFromASTUntyped,
} from "grafast/graphql";
import { inspect } from "util";

import type { ScopeForType, SpecForType } from "../global.js";
import type { PostPlanResolver } from "../interfaces.js";
import type SchemaBuilder from "../SchemaBuilder.js";
import { EXPORTABLE } from "../utils.js";

const isString = (str: unknown): str is string => typeof str === "string";

const knownTypes = [
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLScalarType,
];

const knownTypeNames = knownTypes.map((k) => k.name);

interface MakeNewWithHooksOptions {
  builder: SchemaBuilder<any>;
}

export type NewWithHooksFunction = <
  TType extends GraphQLNamedType | GraphQLSchema,
>(
  build: GraphileBuild.Build,
  klass: { new (spec: SpecForType<TType>): TType },
  spec: SpecForType<TType>,
  scope: ScopeForType<TType>,
) => TType;

const identity = EXPORTABLE(
  () =>
    function identity<T>(value: T): T {
      return value;
    },
  [],
);

/**
 * Returns a 'newWithHooks' function suitable for creating GraphQL types with
 * the graphile-build plugin system applied.
 */
export function makeNewWithHooks({ builder }: MakeNewWithHooksOptions): {
  newWithHooks: NewWithHooksFunction;
} {
  const newWithHooks: NewWithHooksFunction = function newWithHooks(
    build,
    Type,
    inSpec,
    inScope,
  ) {
    if (!inScope) {
      // eslint-disable-next-line no-console
      console.warn(
        `No scope was provided to new ${Type.name}${
          "name" in inSpec ? `[name=${inSpec.name}]` : ``
        }, it's highly recommended that you add a scope so other hooks can easily reference your object - please check usage of 'newWithHooks'. To mute this message, just pass an empty object.`,
      );
    }

    if (!Type) {
      throw new Error("No type specified!");
    }

    if (
      knownTypes.indexOf(Type as any) === -1 &&
      knownTypeNames.indexOf(Type.name) >= 0
    ) {
      throw new Error(
        `GraphQL conflict for '${Type.name}' detected! Multiple versions of graphql exist in your node_` +
          /* yarn doctor */ `modules?`,
      );
    }

    const Result = (() => {
      switch (Type) {
        case GraphQLSchema: {
          const rawSpec = inSpec as GraphQLSchemaConfig;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeSchema;
          const context: GraphileBuild.ContextSchema = {
            type: "GraphQLSchema",
            scope,
          };
          const finalSpec = builder.applyHooks(
            "GraphQLSchema",
            rawSpec,
            build,
            context,
          );

          finalSpec.types = builder.applyHooks(
            "GraphQLSchema_types",
            [...(finalSpec.types ?? [])],
            build,
            {
              ...context,
              config: finalSpec,
            },
          );
          const Self = new GraphQLSchema(finalSpec);
          return Self;
        }

        case GraphQLObjectType: {
          const rawObjectSpec = inSpec as GraphileBuild.GrafastObjectTypeConfig<
            any,
            any
          >;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeObject;

          const objectContext: GraphileBuild.ContextObject = {
            type: "GraphQLObjectType",
            scope,
          };

          const {
            name: baseName,
            interfaces: baseInterfaces,
            fields: baseFields,
            ...restOfConfig
          } = builder.applyHooks(
            "GraphQLObjectType",
            rawObjectSpec,
            build,
            objectContext,
            `|${rawObjectSpec.name}`,
          );

          const typeName = build.assertValidName(
            baseName,
            `Attempted to define an object type with invalid name $0.`,
          );

          const finalSpec = {
            name: typeName,
            ...restOfConfig,
            interfaces: (): GraphQLInterfaceType[] => {
              const interfacesContext: GraphileBuild.ContextObjectInterfaces = {
                ...objectContext,
                Self,
              };

              let rawInterfaces = baseInterfaces || [];
              if (typeof rawInterfaces === "function") {
                rawInterfaces = rawInterfaces(interfacesContext);
              }
              return builder.applyHooks(
                "GraphQLObjectType_interfaces",
                rawInterfaces,
                build,
                interfacesContext,
                `|${typeName}`,
              );
            },
            fields: () => {
              const processedFields: GrafastFieldConfig<
                any,
                any,
                any,
                any,
                any
              >[] = [];
              const fieldWithHooks: GraphileBuild.FieldWithHooksFunction = <
                TType extends GraphQLOutputType,
                TContext extends Grafast.Context,
                TParentStep extends ExecutableStep,
                TFieldStep extends OutputPlanForType<TType>,
                TArgs extends BaseGraphQLArguments,
              >(
                fieldScope: GraphileBuild.ScopeObjectFieldsField,
                fieldSpec:
                  | GrafastFieldConfig<
                      TType,
                      TContext,
                      TParentStep,
                      TFieldStep,
                      TArgs
                    >
                  | ((
                      context: GraphileBuild.ContextObjectFieldsField,
                    ) => GrafastFieldConfig<
                      TType,
                      TContext,
                      TParentStep,
                      TFieldStep,
                      TArgs
                    >),
              ): GrafastFieldConfig<
                TType,
                TContext,
                TParentStep,
                TFieldStep,
                TArgs
              > => {
                if (!isString(fieldScope.fieldName)) {
                  throw new Error(
                    "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is currently necessary.",
                  );
                }
                const fieldName = build.assertValidName(
                  fieldScope.fieldName,
                  `Object type '$1' attempted to define a field with invalid name $0.`,
                  [typeName],
                );
                build.extend(
                  fieldScope,
                  scope,
                  "Adding the object type scope to the field's scope",
                );
                if (!fieldScope) {
                  throw new Error(
                    "All calls to `fieldWithHooks` must specify a `fieldScope` " +
                      "argument that gives additional context about the field so " +
                      "that further plugins may more easily understand the field. " +
                      "Keys within this object should contain the phrase 'field' " +
                      "since they will be merged into the parent objects scope and " +
                      "are not allowed to clash. If you really have no additional " +
                      "information to give, please just pass `{}`.",
                  );
                }

                const fieldContext: GraphileBuild.ContextObjectFieldsField = {
                  ...fieldsContext,
                  scope: fieldScope,
                };

                let resolvedFieldSpec =
                  typeof fieldSpec === "function"
                    ? fieldSpec(fieldContext)
                    : fieldSpec;
                resolvedFieldSpec = builder.applyHooks(
                  "GraphQLObjectType_fields_field",
                  resolvedFieldSpec,
                  build,
                  fieldContext,
                  `|${typeName}.fields.${fieldName}`,
                ) as typeof resolvedFieldSpec;

                resolvedFieldSpec.args = resolvedFieldSpec.args ?? {};
                const postPlanResolvers: PostPlanResolver<any, any, any>[] = [];
                const argsContext: GraphileBuild.ContextObjectFieldsFieldArgs =
                  {
                    ...fieldContext,
                    addToPlanResolver(cb) {
                      postPlanResolvers.push(cb);
                    },
                  };
                const finalFieldSpec = {
                  ...resolvedFieldSpec,
                  args: builder.applyHooks(
                    "GraphQLObjectType_fields_field_args",
                    resolvedFieldSpec.args,
                    build,
                    argsContext,
                    `|${typeName}.fields.${fieldName}.args`,
                  ),
                };

                for (const [rawArgName, argSpec] of Object.entries(
                  finalFieldSpec.args,
                )) {
                  const argName = build.assertValidName(
                    rawArgName,
                    `Object type '$1' attempted to define an argument for field '$2' with invalid name $0.`,
                    [typeName, fieldName],
                  );
                  const argContext = {
                    ...argsContext,
                    scope: {
                      ...argsContext.scope,
                      argName,
                    },
                  };

                  finalFieldSpec.args[argName] = builder.applyHooks(
                    "GraphQLObjectType_fields_field_args_arg",
                    argSpec,
                    build,
                    argContext,
                    `|${typeName}.fields.${fieldName}.args.${argName}`,
                  );
                }

                if (postPlanResolvers.length > 0) {
                  if (!finalFieldSpec.plan) {
                    throw new Error(`Cannot`);
                  }
                  const basePlan = finalFieldSpec.plan ?? defaultPlanResolver;
                  finalFieldSpec.plan = EXPORTABLE(
                    (basePlan, postPlanResolvers) => ($parent, fieldArgs, info) => {
                      let $result = basePlan($parent, fieldArgs, info);
                      for (const ppr of postPlanResolvers) {
                        $result = ppr($result, $parent, fieldArgs, info);
                      }
                      return $result;
                    },
                  [basePlan, postPlanResolvers]);
                }

                processedFields.push(finalFieldSpec);
                return finalFieldSpec;
              };

              const fieldsContext: GraphileBuild.ContextObjectFields = {
                ...objectContext,
                Self: Self as GraphQLObjectType,
                fieldWithHooks,
              };

              const rawFields =
                typeof baseFields === "function"
                  ? baseFields(fieldsContext)
                  : baseFields || {};
              const fieldsSpec = builder.applyHooks(
                "GraphQLObjectType_fields",
                build.extend(
                  Object.create(null),
                  rawFields,
                  `Default field included in newWithHooks call for '${typeName}'. ${
                    inScope.__origin || ""
                  }`,
                ),
                build,
                fieldsContext,
                `|${typeName}`,
              );

              // Finally, check through all the fields that they've all been
              // processed; any that have not we should do so now.
              for (const [fieldName, fieldSpec] of Object.entries(fieldsSpec)) {
                if (!fieldName) {
                  throw new Error(
                    `Attempted to add empty/falsy fieldName to GraphQLObjectType ${typeName}; ${inspect(
                      fieldSpec,
                    )}`,
                  );
                }
                if (processedFields.indexOf(fieldSpec) < 0) {
                  // We've not processed this yet; process it now!
                  fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                    // We don't have any additional information
                    { fieldName },
                    fieldSpec,
                  );
                }
              }

              return fieldsSpec;
            },
          };
          const Self = new GraphQLObjectType(objectSpec(finalSpec));
          return Self;
        }

        case GraphQLInterfaceType: {
          const rawInterfaceSpec =
            inSpec as GraphileBuild.GrafastInterfaceTypeConfig<any, any>;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeInterface;

          const interfaceContext: GraphileBuild.ContextInterface = {
            type: "GraphQLInterfaceType",
            scope,
          };
          const {
            name: baseName,
            fields: baseFields,
            interfaces: baseInterfaces,
            ...restOfConfig
          } = builder.applyHooks(
            "GraphQLInterfaceType",
            rawInterfaceSpec,
            build,
            interfaceContext,
            `|${rawInterfaceSpec.name}`,
          );

          const typeName = build.assertValidName(
            baseName,
            `Attempted to define an interface type with invalid name $0.`,
          );

          const finalSpec = {
            name: typeName,
            ...restOfConfig,
            fields: () => {
              const processedFields: GraphQLFieldConfig<any, any>[] = [];
              const fieldsContext: GraphileBuild.ContextInterfaceFields = {
                ...interfaceContext,
                Self,
                fieldWithHooks: (fieldScope, fieldSpec) => {
                  if (!isString(fieldScope.fieldName)) {
                    throw new Error(
                      "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is currently necessary.",
                    );
                  }
                  const fieldName = build.assertValidName(
                    fieldScope.fieldName,
                    `Interface type '$1' attempted to define a field with invalid name $0.`,
                    [typeName],
                  );
                  build.extend(
                    fieldScope,
                    scope,
                    "Adding interface scope to interface's field scope",
                  );
                  if (!fieldScope) {
                    throw new Error(
                      "All calls to `fieldWithHooks` must specify a `fieldScope` " +
                        "argument that gives additional context about the field so " +
                        "that further plugins may more easily understand the field. " +
                        "Keys within this object should contain the phrase 'field' " +
                        "since they will be merged into the parent objects scope and " +
                        "are not allowed to clash. If you really have no additional " +
                        "information to give, please just pass `{}`.",
                    );
                  }

                  const fieldContext: GraphileBuild.ContextInterfaceFieldsField =
                    {
                      ...fieldsContext,
                      scope: fieldScope,
                    };
                  let newSpec =
                    typeof fieldSpec === "function"
                      ? fieldSpec(fieldContext)
                      : fieldSpec;
                  newSpec = builder.applyHooks(
                    "GraphQLInterfaceType_fields_field",
                    newSpec,
                    build,
                    fieldContext,
                    `|${typeName}.fields.${fieldName}`,
                  );
                  newSpec.args = newSpec.args || {};
                  const argsContext = {
                    ...fieldContext,
                  };
                  newSpec = {
                    ...newSpec,
                    args: builder.applyHooks(
                      "GraphQLInterfaceType_fields_field_args",
                      newSpec.args ?? Object.create(null),
                      build,
                      argsContext,
                      `|${typeName}.fields.${fieldName}.args`,
                    ),
                  };
                  const finalFieldSpec = newSpec;

                  for (const [rawArgName, argSpec] of Object.entries(
                    finalFieldSpec.args!,
                  )) {
                    const argName = build.assertValidName(
                      rawArgName,
                      `Interface type '$1' attempted to define an argument for field '$2' with invalid name $0.`,
                      [typeName, fieldName],
                    );
                    const argContext = {
                      ...argsContext,
                      scope: {
                        ...argsContext.scope,
                        argName,
                      },
                    };

                    finalFieldSpec.args![argName] = builder.applyHooks(
                      "GraphQLInterfaceType_fields_field_args_arg",
                      argSpec,
                      build,
                      argContext,
                      `|${typeName}.fields.${fieldName}.args.${argName}`,
                    );
                  }

                  processedFields.push(finalFieldSpec);
                  return finalFieldSpec;
                },
              };
              const rawFields =
                (typeof baseFields === "function"
                  ? baseFields(fieldsContext)
                  : baseFields) || {};
              const fieldsSpec = builder.applyHooks(
                "GraphQLInterfaceType_fields",
                build.extend(
                  Object.create(null),
                  rawFields,
                  `Default field included in newWithHooks call for '${typeName}'. ${
                    inScope.__origin || ""
                  }`,
                ),
                build,
                fieldsContext,
                `|${typeName}`,
              );
              // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
              for (const [fieldName, fieldSpec] of Object.entries(fieldsSpec)) {
                if (!fieldName) {
                  throw new Error(
                    `Attempted to add empty/falsy fieldName to GraphQLInterfaceType ${typeName}; ${inspect(
                      fieldSpec,
                    )}`,
                  );
                }
                if (processedFields.indexOf(fieldSpec) < 0) {
                  // We've not processed this yet; process it now!
                  fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                    // We don't have any additional information
                    { fieldName },
                    fieldSpec,
                  );
                }
              }
              return fieldsSpec;
            },
            interfaces: () => {
              const interfacesContext: GraphileBuild.ContextInterfaceInterfaces =
                {
                  ...interfaceContext,
                  Self,
                };
              const rawInterfaces =
                (typeof baseInterfaces === "function"
                  ? baseInterfaces(interfacesContext)
                  : baseInterfaces) || [];
              const interfacesSpec = builder.applyHooks(
                "GraphQLInterfaceType_interfaces",
                rawInterfaces,
                build,
                interfacesContext,
                `|${typeName}`,
              );
              return interfacesSpec;
            },
          };
          const Self: GraphQLInterfaceType = new GraphQLInterfaceType(
            finalSpec,
          );
          return Self;
        }

        case GraphQLUnionType: {
          const rawUnionSpec = inSpec as GraphileBuild.GrafastUnionTypeConfig<
            any,
            any
          >;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeUnion;

          const commonContext: GraphileBuild.ContextUnion = {
            type: "GraphQLUnionType",
            scope,
          };

          const {
            name: baseName,
            types: baseTypes,
            ...restOfConfig
          } = builder.applyHooks(
            "GraphQLUnionType",
            rawUnionSpec,
            build,
            commonContext,
            `|${rawUnionSpec.name}`,
          );

          const typeName = build.assertValidName(
            baseName,
            `Attempted to define an union type with invalid name $0.`,
          );

          const finalSpec = {
            name: typeName,
            ...restOfConfig,
            types: (): GraphQLObjectType[] => {
              const typesContext: GraphileBuild.ContextUnionTypes = {
                ...commonContext,
                Self,
              };

              const rawTypes =
                (typeof baseTypes === "function"
                  ? baseTypes(typesContext)
                  : baseTypes) || [];
              return builder.applyHooks(
                "GraphQLUnionType_types",
                rawTypes,
                build,
                typesContext,
                `|${typeName}`,
              );
            },
          };
          const Self = new GraphQLUnionType(finalSpec);
          return Self;
        }

        case GraphQLInputObjectType: {
          const rawInputObjectSpec =
            inSpec as GraphileBuild.GrafastInputObjectTypeConfig;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeInputObject;

          const inputObjectContext: GraphileBuild.ContextInputObject = {
            type: "GraphQLInputObjectType",
            scope,
          };

          const {
            name: baseName,
            fields: baseFields,
            ...restOfConfig
          } = builder.applyHooks(
            "GraphQLInputObjectType",
            rawInputObjectSpec,
            build,
            inputObjectContext,
            `|${rawInputObjectSpec.name}`,
          );

          const typeName = build.assertValidName(
            baseName,
            `Attempted to define an input object type with invalid name $0.`,
          );

          const finalSpec = {
            name: typeName,
            ...restOfConfig,
            fields: () => {
              const processedFields: GraphQLInputFieldConfig[] = [];
              const fieldWithHooks: GraphileBuild.InputFieldWithHooksFunction =
                (fieldScope, spec) => {
                  if (!isString(fieldScope.fieldName)) {
                    throw new Error(
                      "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is currently necessary.",
                    );
                  }
                  const fieldName = build.assertValidName(
                    fieldScope.fieldName,
                    `Input object type '$1' attempted to define a field with invalid name $0.`,
                    [typeName],
                  );
                  const finalFieldScope: GraphileBuild.ScopeInputObjectFieldsField =
                    build.extend(
                      fieldScope,
                      scope,
                      `Extending scope for field '${fieldName}' within context for GraphQLInputObjectType '${typeName}'`,
                    );
                  const fieldContext: GraphileBuild.ContextInputObjectFieldsField =
                    {
                      ...fieldsContext,
                      scope: finalFieldScope,
                    };

                  let newSpec =
                    typeof spec === "function" ? spec(fieldContext) : spec;
                  newSpec = builder.applyHooks(
                    "GraphQLInputObjectType_fields_field",
                    newSpec,
                    build,
                    fieldContext,
                    `|${typeName}.fields.${fieldName}`,
                  );

                  const finalSpec = newSpec;
                  processedFields.push(finalSpec);
                  return finalSpec;
                };
              const fieldsContext: GraphileBuild.ContextInputObjectFields = {
                ...inputObjectContext,
                Self,
                fieldWithHooks,
              };

              const rawFields =
                (typeof baseFields === "function"
                  ? baseFields(fieldsContext)
                  : baseFields) || {};
              const fieldsList: typeof rawFields = build.extend(
                Object.create(null),
                rawFields,
                `Default field included in newWithHooks call for '${typeName}'. ${
                  inScope.__origin || ""
                }`,
              );
              const fieldsSpec: GraphQLInputFieldConfigMap = builder.applyHooks(
                "GraphQLInputObjectType_fields",
                fieldsList,
                build,
                fieldsContext,
                `|${typeName}`,
              );

              // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
              for (const [fieldName, fieldSpec] of Object.entries(fieldsSpec)) {
                if (!fieldName) {
                  throw new Error(
                    `Attempted to add empty/falsy fieldName to GraphQLInputObjectType ${typeName}; ${inspect(
                      fieldSpec,
                    )}`,
                  );
                }
                if (processedFields.indexOf(fieldSpec) < 0) {
                  // We've not processed this yet; process it now!
                  fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                    // We don't have any additional information
                    { fieldName },
                    fieldSpec,
                  );
                }
                fieldsSpec[fieldName] = inputObjectFieldSpec(
                  fieldsSpec[fieldName],
                  `${typeName}.${fieldName}`,
                );
              }
              return fieldsSpec;
            },
          };
          const Self = new GraphQLInputObjectType(finalSpec);
          return Self;
        }

        case GraphQLScalarType: {
          const rawScalarSpec = inSpec as GraphQLScalarTypeConfig<any, any>;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeScalar;

          const scalarContext: GraphileBuild.ContextScalar = {
            type: "GraphQLScalarType",
            scope,
          };

          const {
            name: baseName,
            parseValue: baseParseValue,
            parseLiteral: baseParseLiteral,
            ...restOfConfig
          } = builder.applyHooks(
            "GraphQLScalarType",
            rawScalarSpec,
            build,
            scalarContext,
            `|${rawScalarSpec.name}`,
          );

          const typeName = build.assertValidName(
            baseName,
            `Attempted to define a scalar type with invalid name $0.`,
          );

          const finalSpec = {
            name: typeName,
            ...restOfConfig,
            parseValue: (() => {
              return baseParseValue ?? identity;
            })(),
            // parseLiteral in GraphQL defaults to a dynamic function; that's not
            // exportable... So we must handle this ourselves.
            parseLiteral: (() => {
              if (baseParseLiteral) {
                return baseParseLiteral;
              }
              const parseValue = baseParseValue ?? identity;
              return EXPORTABLE(
                (parseValue, valueFromASTUntyped) =>
                  ((node, variables) => {
                    return parseValue(valueFromASTUntyped(node, variables));
                  }) as GraphQLScalarLiteralParser<any>,
                [parseValue, valueFromASTUntyped],
              );
            })(),
          };

          const Self = new GraphQLScalarType(finalSpec);
          return Self;
        }

        case GraphQLEnumType: {
          const rawEnumConfig = inSpec as GraphQLEnumTypeConfig;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeEnum;

          const enumContext: GraphileBuild.ContextEnum = {
            type: "GraphQLEnumType",
            scope,
          };

          const {
            name: baseName,
            values: baseValues,
            ...restOfConfig
          } = builder.applyHooks(
            "GraphQLEnumType",
            rawEnumConfig,
            build,
            enumContext,
            `|${rawEnumConfig.name}`,
          );

          const typeName = build.assertValidName(
            baseName,
            `Attempted to define an enum type with invalid name $0.`,
          );

          const valuesContext: GraphileBuild.ContextEnumValues = {
            ...enumContext,
            Self: { name: typeName },
          };

          const finalSpec = {
            name: typeName,
            ...restOfConfig,
            values: (() => {
              const values = builder.applyHooks(
                "GraphQLEnumType_values",
                baseValues,
                build,
                valuesContext,
                `|${typeName}`,
              );
              return Object.entries(values).reduce(
                (memo, [rawValueName, value]) => {
                  const valueName = build.assertValidName(
                    rawValueName,
                    `Enum type '$1' attempted to define a value with invalid name $0.`,
                    [typeName],
                  );
                  const finalValueScope: GraphileBuild.ScopeEnumValuesValue =
                    build.extend(
                      { valueName },
                      scope,
                      `Extending scope for value '${valueName}' within context for GraphQLEnumType '${typeName}'`,
                    );
                  const valueContext: GraphileBuild.ContextEnumValuesValue = {
                    ...valuesContext,
                    scope: finalValueScope,
                  };
                  const newValue = builder.applyHooks(
                    "GraphQLEnumType_values_value",
                    value,
                    build,
                    valueContext,
                    `|${typeName}|${valueName}`,
                  );

                  memo[valueName] = newValue;
                  return memo;
                },
                Object.create(null),
              );
            })(),
          };

          const Self = new GraphQLEnumType(finalSpec);
          return Self;
        }

        default: {
          throw new Error(`Cannot handle ${Type}`);
        }
      }
    })();

    if (isNamedType(Result)) {
      build.scopeByType.set(Result, inScope);
    }

    return Result as any;
  };

  return { newWithHooks };
}
