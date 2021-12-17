import type {
  BaseGraphQLArguments,
  BaseGraphQLContext,
  ExecutablePlan,
  GraphileFieldConfig,
  OutputPlanForType,
} from "graphile-crystal";
import {
  crystalWrapResolve,
  makeCrystalSubscriber,
  objectSpec,
} from "graphile-crystal";
import type {
  GraphQLEnumTypeConfig,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLScalarTypeConfig,
  GraphQLSchemaConfig,
} from "graphql";
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
  isNamedType,
} from "graphql";

import type { ScopeForType, SpecForType } from "../global.js";
import type SchemaBuilder from "../SchemaBuilder.js";

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
  build: GraphileEngine.Build,
  klass: { new (spec: SpecForType<TType>): TType },
  spec: SpecForType<TType>,
  scope: ScopeForType<TType>,
  Plan?: { new (...args: any[]): ExecutablePlan<any> } | null,
) => TType;

export function makeNewWithHooks({ builder }: MakeNewWithHooksOptions): {
  newWithHooks: NewWithHooksFunction;
} {
  const newWithHooks: NewWithHooksFunction = function newWithHooks(
    build,
    Type,
    inSpec,
    inScope,
    Plan,
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
          const scope = (inScope || {}) as GraphileEngine.ScopeGraphQLSchema;
          const context: GraphileEngine.ContextGraphQLSchema = {
            type: "GraphQLSchema",
            scope,
          };
          const finalSpec = builder.applyHooks(
            "GraphQLSchema",
            rawSpec,
            build,
            context,
          );
          const Self = new GraphQLSchema(finalSpec);
          return Self;
        }

        case GraphQLObjectType: {
          const rawSpec = inSpec as GraphileEngine.GraphileObjectTypeConfig<
            any,
            any
          >;
          const scope = (inScope ||
            {}) as GraphileEngine.ScopeGraphQLObjectType;

          const objectContext: GraphileEngine.ContextGraphQLObjectType = {
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
              const interfacesContext: GraphileEngine.ContextGraphQLObjectTypeInterfaces =
                {
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
              const processedFields: GraphileFieldConfig<
                any,
                any,
                any,
                any,
                any
              >[] = [];
              const fieldWithHooks: GraphileEngine.FieldWithHooksFunction = <
                TType extends GraphQLOutputType,
                TContext extends BaseGraphQLContext,
                TParentPlan extends ExecutablePlan<any>,
                TFieldPlan extends OutputPlanForType<TType>,
                TArgs extends BaseGraphQLArguments,
              >(
                fieldScope: GraphileEngine.ScopeGraphQLObjectTypeFieldsField,
                fieldSpec:
                  | GraphileFieldConfig<
                      TType,
                      TContext,
                      TParentPlan,
                      TFieldPlan,
                      TArgs
                    >
                  | ((
                      context: GraphileEngine.ContextGraphQLObjectTypeFieldsField,
                    ) => GraphileFieldConfig<
                      TType,
                      TContext,
                      TParentPlan,
                      TFieldPlan,
                      TArgs
                    >),
              ): GraphileFieldConfig<
                TType,
                TContext,
                TParentPlan,
                TFieldPlan,
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

                const fieldContext: GraphileEngine.ContextGraphQLObjectTypeFieldsField =
                  {
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
                const argsContext: GraphileEngine.ContextGraphQLObjectTypeFieldsFieldArgs =
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

                    `|${Self.name}.fields.${fieldName}`,
                  ),
                };

                processedFields.push(finalFieldSpec);
                return finalFieldSpec;
              };

              const fieldsContext: GraphileEngine.ContextGraphQLObjectTypeFields =
                {
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
                if (processedFields.indexOf(fieldSpec) < 0) {
                  // We've not processed this yet; process it now!
                  fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                    // We don't have any additional information
                    { fieldName },
                    fieldSpec,
                  );
                }
              }

              // Perform the Graphile Crystal magic
              for (const fieldSpec of Object.values(fieldsSpec)) {
                const { subscribe, resolve } = fieldSpec;
                fieldSpec.resolve = crystalWrapResolve(resolve);
                if (!subscribe && scope.isRootSubscription) {
                  fieldSpec.subscribe = makeCrystalSubscriber();
                }

                // IMPORTANT: **nothing** can modify the resolver from here - i.e.
                // graphql-shield and friends may cause problems
              }

              return fieldsSpec;
            },
          };
          const Self = new GraphQLObjectType(
            objectSpec(finalSpec, Plan ?? null),
          );
          return Self;
        }

        case GraphQLInterfaceType: {
          const rawSpec = inSpec as GraphileEngine.GraphileInterfaceTypeConfig<
            any,
            any
          >;
          const scope = (inScope ||
            {}) as GraphileEngine.ScopeGraphQLInterfaceType;

          const interfaceContext: GraphileEngine.ContextGraphQLInterfaceType = {
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
              const fieldsContext: GraphileEngine.ContextGraphQLInterfaceTypeFields =
                {
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

                    const fieldContext: GraphileEngine.ContextGraphQLInterfaceTypeFieldsField =
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
                        newSpec.args,
                        build,
                        argsContext,
                        `|${Self.name}.fields.${fieldName}`,
                      ),
                    };
                    const finalSpec = newSpec;
                    processedFields.push(finalSpec);
                    return finalSpec;
                  },
                };
              const rawFields =
                (typeof rawSpec.fields === "function"
                  ? rawSpec.fields(fieldsContext)
                  : rawSpec.fields) || {};
              const fieldsSpec = builder.applyHooks(
                "GraphQLInterfaceType_fields",
                build.extend(
                  {},
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
          const Self: GraphQLInterfaceType = new GraphQLInterfaceType(
            finalSpec,
          );
          return Self;
        }

        case GraphQLUnionType: {
          const rawSpec = inSpec as GraphileEngine.GraphileUnionTypeConfig<
            any,
            any
          >;
          const scope = (inScope || {}) as GraphileEngine.ScopeGraphQLUnionType;

          const commonContext: GraphileEngine.ContextGraphQLUnionType = {
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
              const typesContext: GraphileEngine.ContextGraphQLUnionTypeTypes =
                {
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
          const rawSpec =
            inSpec as GraphileEngine.GraphileInputObjectTypeConfig;
          const scope = (inScope ||
            {}) as GraphileEngine.ScopeGraphQLInputObjectType;

          const inputObjectContext: GraphileEngine.ContextGraphQLInputObjectType =
            {
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
              const fieldWithHooks: GraphileEngine.InputFieldWithHooksFunction =
                (fieldScope, spec) => {
                  const { fieldName } = fieldScope;
                  if (!isString(fieldName)) {
                    throw new Error(
                      "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary.",
                    );
                  }
                  const finalFieldScope: GraphileEngine.ScopeGraphQLInputObjectTypeFieldsField =
                    build.extend(
                      fieldScope,
                      scope,
                      `Extending scope for field '${fieldName}' within context for GraphQLInputObjectType '${rawSpec.name}'`,
                    );
                  const fieldContext: GraphileEngine.ContextGraphQLInputObjectTypeFieldsField =
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
              const fieldsContext: GraphileEngine.ContextGraphQLInputObjectTypeFields =
                {
                  ...inputObjectContext,
                  Self,
                  fieldWithHooks,
                };

              const rawFields =
                (typeof rawSpec.fields === "function"
                  ? rawSpec.fields(fieldsContext)
                  : rawSpec.fields) || {};
              const fieldsList: typeof rawFields = build.extend(
                {},
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
          const Self = new GraphQLInputObjectType(finalSpec);
          return Self;
        }

        case GraphQLScalarType: {
          const rawSpec = inSpec as GraphQLScalarTypeConfig<any, any>;
          const scope = (inScope ||
            {}) as GraphileEngine.ScopeGraphQLScalarType;

          const scalarContext: GraphileEngine.ContextGraphQLScalarType = {
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

          const Self = new GraphQLScalarType(finalSpec);
          return Self;
        }

        case GraphQLEnumType: {
          const rawSpec = inSpec as GraphQLEnumTypeConfig;
          const scope = (inScope || {}) as GraphileEngine.ScopeGraphQLEnumType;

          const enumContext: GraphileEngine.ContextGraphQLEnumType = {
            type: "GraphQLEnumType",
            scope,
          };

          const finalSpec = builder.applyHooks(
            "GraphQLEnumType",
            rawSpec,
            build,
            enumContext,
            `|${rawSpec.name}`,
          );

          finalSpec.values = builder.applyHooks(
            "GraphQLEnumType_values",
            finalSpec.values,
            build,
            enumContext,
            `|${finalSpec.name}`,
          );

          const values = finalSpec.values;
          finalSpec.values = Object.entries(values).reduce(
            (memo, [valueKey, value]) => {
              const newValue = builder.applyHooks(
                "GraphQLEnumType_values_value",
                value,
                build,
                enumContext,
                `|${finalSpec.name}|${valueKey}`,
              );

              memo[valueKey] = newValue;
              return memo;
            },
            Object.create(null),
          );

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
