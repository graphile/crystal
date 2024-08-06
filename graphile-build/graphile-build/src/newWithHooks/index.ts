import type {
  BaseGraphQLArguments,
  ExecutableStep,
  GrafastFieldConfig,
  OutputPlanForType,
} from "grafast";
import { inputObjectFieldSpec, objectSpec } from "grafast";
import type {
  GraphQLEnumTypeConfig,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLNamedType,
  GraphQLOutputType,
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
            context,
          );
          const Self = new GraphQLSchema(finalSpec);
          return Self;
        }

        case GraphQLObjectType: {
          const rawSpec = inSpec as GraphileBuild.GrafastObjectTypeConfig<
            any,
            any
          >;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeObject;

          const objectContext: GraphileBuild.ContextObject = {
            type: "GraphQLObjectType",
            scope,
          };

          const baseSpec = builder.applyHooks(
            "GraphQLObjectType",
            rawSpec,
            build,
            objectContext,

            `|${rawSpec.name}`,
          );

          const finalSpec = {
            ...baseSpec,
            interfaces: (): GraphQLInterfaceType[] => {
              const interfacesContext: GraphileBuild.ContextObjectInterfaces = {
                ...objectContext,
                Self,
              };

              let rawInterfaces = rawSpec.interfaces || [];
              if (typeof rawInterfaces === "function") {
                rawInterfaces = rawInterfaces(interfacesContext);
              }
              return builder.applyHooks(
                "GraphQLObjectType_interfaces",
                rawInterfaces,
                build,
                interfacesContext,
                `|${Self.name}`,
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
                const { fieldName } = fieldScope;
                build.extend(
                  fieldScope,
                  scope,
                  "Adding the object type scope to the field's scope",
                );
                if (!isString(fieldName)) {
                  throw new Error(
                    "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary.",
                  );
                }
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
                  `|${Self.name}.fields.${fieldName}`,
                ) as typeof resolvedFieldSpec;

                resolvedFieldSpec.args = resolvedFieldSpec.args ?? {};
                const argsContext: GraphileBuild.ContextObjectFieldsFieldArgs =
                  {
                    ...fieldContext,
                  };
                const finalFieldSpec = {
                  ...resolvedFieldSpec,
                  args: builder.applyHooks(
                    "GraphQLObjectType_fields_field_args",
                    resolvedFieldSpec.args,
                    build,
                    argsContext,
                    `|${Self.name}.fields.${fieldName}.args`,
                  ),
                };

                for (const [argName, argSpec] of Object.entries(
                  finalFieldSpec.args,
                )) {
                  if (!argName) {
                    throw new Error(
                      `Attempted to add empty/falsy argName to GraphQLObjectType ${
                        Self.name
                      }'s '${fieldName}' field; ${inspect(argSpec)}`,
                    );
                  }
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
                    `|${Self.name}.fields.${fieldName}.args.${argName}`,
                  );
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
                typeof rawSpec.fields === "function"
                  ? rawSpec.fields(fieldsContext)
                  : rawSpec.fields || {};
              const fieldsSpec = builder.applyHooks(
                "GraphQLObjectType_fields",
                build.extend(
                  Object.create(null),
                  rawFields,
                  `Default field included in newWithHooks call for '${
                    rawSpec.name
                  }'. ${inScope.__origin || ""}`,
                ),
                build,
                fieldsContext,
                `|${rawSpec.name}`,
              );

              // Finally, check through all the fields that they've all been
              // processed; any that have not we should do so now.
              for (const [fieldName, fieldSpec] of Object.entries(fieldsSpec)) {
                if (!fieldName) {
                  throw new Error(
                    `Attempted to add empty/falsy fieldName to GraphQLObjectType ${
                      Self.name
                    }; ${inspect(fieldSpec)}`,
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
          const rawSpec = inSpec as GraphileBuild.GrafastInterfaceTypeConfig<
            any,
            any
          >;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeInterface;

          const interfaceContext: GraphileBuild.ContextInterface = {
            type: "GraphQLInterfaceType",
            scope,
          };
          const baseSpec = builder.applyHooks(
            "GraphQLInterfaceType",
            rawSpec,
            build,
            interfaceContext,
            `|${rawSpec.name}`,
          );

          const finalSpec = {
            ...baseSpec,
            fields: () => {
              const processedFields: GraphQLFieldConfig<any, any>[] = [];
              const fieldsContext: GraphileBuild.ContextInterfaceFields = {
                ...interfaceContext,
                Self,
                fieldWithHooks: (fieldScope, fieldSpec) => {
                  const { fieldName } = fieldScope;
                  build.extend(
                    fieldScope,
                    scope,
                    "Adding interface scope to interface's field scope",
                  );
                  if (!isString(fieldName)) {
                    throw new Error(
                      "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is currently necessary.",
                    );
                  }
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
                    `|${Self.name}.fields.${fieldName}`,
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
                      `|${Self.name}.fields.${fieldName}.args`,
                    ),
                  };
                  const finalFieldSpec = newSpec;

                  for (const [argName, argSpec] of Object.entries(
                    finalFieldSpec.args!,
                  )) {
                    if (!argName) {
                      throw new Error(
                        `Attempted to add empty/falsy argName to GraphQLInterfaceType ${
                          Self.name
                        }'s '${fieldName}' field; ${inspect(argSpec)}`,
                      );
                    }
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
                      `|${Self.name}.fields.${fieldName}.args.${argName}`,
                    );
                  }

                  processedFields.push(finalFieldSpec);
                  return finalFieldSpec;
                },
              };
              const rawFields =
                (typeof rawSpec.fields === "function"
                  ? rawSpec.fields(fieldsContext)
                  : rawSpec.fields) || {};
              const fieldsSpec = builder.applyHooks(
                "GraphQLInterfaceType_fields",
                build.extend(
                  Object.create(null),
                  rawFields,
                  `Default field included in newWithHooks call for '${
                    rawSpec.name
                  }'. ${inScope.__origin || ""}`,
                ),
                build,
                fieldsContext,
                `|${rawSpec.name}`,
              );
              // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
              for (const [fieldName, fieldSpec] of Object.entries(fieldsSpec)) {
                if (!fieldName) {
                  throw new Error(
                    `Attempted to add empty/falsy fieldName to GraphQLInterfaceType ${
                      Self.name
                    }; ${inspect(fieldSpec)}`,
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
                (typeof rawSpec.interfaces === "function"
                  ? rawSpec.interfaces(interfacesContext)
                  : rawSpec.interfaces) || [];
              const interfacesSpec = builder.applyHooks(
                "GraphQLInterfaceType_interfaces",
                rawInterfaces,
                build,
                interfacesContext,
                `|${rawSpec.name}`,
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
          const rawSpec = inSpec as GraphileBuild.GrafastUnionTypeConfig<
            any,
            any
          >;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeUnion;

          const commonContext: GraphileBuild.ContextUnion = {
            type: "GraphQLUnionType",
            scope,
          };

          const baseSpec = builder.applyHooks(
            "GraphQLUnionType",
            rawSpec,
            build,
            commonContext,
            `|${rawSpec.name}`,
          );

          const finalSpec = {
            ...baseSpec,
            types: (): GraphQLObjectType[] => {
              const typesContext: GraphileBuild.ContextUnionTypes = {
                ...commonContext,
                Self,
              };

              const rawTypes =
                (typeof baseSpec.types === "function"
                  ? baseSpec.types(typesContext)
                  : baseSpec.types) || [];
              return builder.applyHooks(
                "GraphQLUnionType_types",
                rawTypes,
                build,
                typesContext,
                `|${Self.name}`,
              );
            },
          };
          const Self = new GraphQLUnionType(finalSpec);
          return Self;
        }

        case GraphQLInputObjectType: {
          const rawSpec = inSpec as GraphileBuild.GrafastInputObjectTypeConfig;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeInputObject;

          const inputObjectContext: GraphileBuild.ContextInputObject = {
            type: "GraphQLInputObjectType",
            scope,
          };

          const baseSpec = builder.applyHooks(
            "GraphQLInputObjectType",
            rawSpec,
            build,
            inputObjectContext,
            `|${rawSpec.name}`,
          );

          const finalSpec = {
            ...baseSpec,
            fields: () => {
              const processedFields: GraphQLInputFieldConfig[] = [];
              const fieldWithHooks: GraphileBuild.InputFieldWithHooksFunction =
                (fieldScope, spec) => {
                  const { fieldName } = fieldScope;
                  if (!isString(fieldName)) {
                    throw new Error(
                      "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary.",
                    );
                  }
                  const finalFieldScope: GraphileBuild.ScopeInputObjectFieldsField =
                    build.extend(
                      fieldScope,
                      scope,
                      `Extending scope for field '${fieldName}' within context for GraphQLInputObjectType '${rawSpec.name}'`,
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
                    `|${Self.name}.fields.${fieldName}`,
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
                (typeof rawSpec.fields === "function"
                  ? rawSpec.fields(fieldsContext)
                  : rawSpec.fields) || {};
              const fieldsList: typeof rawFields = build.extend(
                Object.create(null),
                rawFields,
                `Default field included in newWithHooks call for '${
                  rawSpec.name
                }'. ${inScope.__origin || ""}`,
              );
              const fieldsSpec: GraphQLInputFieldConfigMap = builder.applyHooks(
                "GraphQLInputObjectType_fields",
                fieldsList,
                build,
                fieldsContext,
                `|${Self.name}`,
              );

              // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
              for (const [fieldName, fieldSpec] of Object.entries(fieldsSpec)) {
                if (!fieldName) {
                  throw new Error(
                    `Attempted to add empty/falsy fieldName to GraphQLInputObjectType ${
                      Self.name
                    }; ${inspect(fieldSpec)}`,
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
                  `${Self.name}.${fieldName}`,
                );
              }
              return fieldsSpec;
            },
          };
          const Self = new GraphQLInputObjectType(finalSpec);
          return Self;
        }

        case GraphQLScalarType: {
          const rawSpec = inSpec as GraphQLScalarTypeConfig<any, any>;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeScalar;

          const scalarContext: GraphileBuild.ContextScalar = {
            type: "GraphQLScalarType",
            scope,
          };

          const finalSpec = builder.applyHooks(
            "GraphQLScalarType",
            rawSpec,
            build,
            scalarContext,
            `|${rawSpec.name}`,
          );

          // parseLiteral in GraphQL defaults to a dynamic function; that's not
          // exportable... So we must handle this ourselves.
          if (!finalSpec.parseValue) {
            finalSpec.parseValue = identity;
          }
          if (!finalSpec.parseLiteral) {
            const parseValue = finalSpec.parseValue!;
            finalSpec.parseLiteral = EXPORTABLE(
              (parseValue, valueFromASTUntyped) => (node, variables) => {
                return parseValue(valueFromASTUntyped(node, variables));
              },
              [parseValue, valueFromASTUntyped],
            );
          }

          const Self = new GraphQLScalarType(finalSpec);
          return Self;
        }

        case GraphQLEnumType: {
          const rawSpec = inSpec as GraphQLEnumTypeConfig;
          const scope = (inScope ||
            Object.create(null)) as GraphileBuild.ScopeEnum;

          const enumContext: GraphileBuild.ContextEnum = {
            type: "GraphQLEnumType",
            scope,
          };

          const baseSpec = builder.applyHooks(
            "GraphQLEnumType",
            rawSpec,
            build,
            enumContext,
            `|${rawSpec.name}`,
          );

          const finalSpec = {
            ...baseSpec,
            values() {
              const rawValues =
                typeof rawSpec.values === "function"
                  ? rawSpec.values()
                  : rawSpec.values;
              const valuesList: typeof rawValues = build.extend(
                Object.create(null),
                rawValues,
                `Default field included in newWithHooks call for '${
                  rawSpec.name
                }'. ${inScope.__origin || ""}`,
              );
              const valuesSpec: GraphQLEnumValueConfigMap = builder.applyHooks(
                "GraphQLEnumType_values",
                valuesList,
                build,
                enumContext,
                `|${Self.name}`,
              );

              for (const [valueKey, value] of Object.entries(valuesSpec)) {
                const newValue = builder.applyHooks(
                  "GraphQLEnumType_values_value",
                  value,
                  build,
                  enumContext,
                  `|${finalSpec.name}|${valueKey}`,
                );

                valuesSpec[valueKey] = newValue;
              }

              return valuesSpec;
            },
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
