import debugFactory from "debug";
import {
  makeCrystalObjectExtension,
  makeCrystalObjectFieldExtension,
  makeCrystalWrapResolver,
} from "graphile-crystal";
import * as graphql from "graphql";
import { ResolveTree } from "graphql-parse-resolve-info";

import SchemaBuilder from "../SchemaBuilder";

let recurseDataGeneratorsForFieldWarned = false;

const isString = (str: unknown): str is string => typeof str === "string";
const isDev = ["test", "development"].indexOf(process.env.NODE_ENV || "") >= 0;
const debug = debugFactory("graphile-build");

function getNameFromType(
  Type: graphql.GraphQLNamedType | graphql.GraphQLSchema,
) {
  if (Type instanceof GraphQLSchema) {
    return "schema";
  } else {
    return Type.name;
  }
}

const {
  GraphQLSchema,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLUnionType,
  getNamedType,
  isCompositeType,
  isAbstractType,
} = graphql;

function mergeData(
  data: GraphileEngine.ResolvedLookAhead,
  gen: GraphileEngine.DataGeneratorFunction,
  ReturnType: graphql.GraphQLOutputType,
  arg: ResolveTree,
): void;
function mergeData(
  data: GraphileEngine.ResolvedLookAhead,
  gen: GraphileEngine.ArgDataGeneratorFunction,
  ReturnType: graphql.GraphQLOutputType,
  arg: { [fieldName: string]: unknown },
): void;
function mergeData(
  data: GraphileEngine.ResolvedLookAhead,
  gen:
    | GraphileEngine.DataGeneratorFunction
    | GraphileEngine.ArgDataGeneratorFunction,
  ReturnType: graphql.GraphQLOutputType,
  arg: any,
): void {
  const results: Array<GraphileEngine.ResolvedLookAhead> | void = ensureArray<
    GraphileEngine.ResolvedLookAhead
  >(gen(arg, ReturnType, data));

  if (!results) {
    return;
  }
  for (
    let resultIndex = 0, resultCount = results.length;
    resultIndex < resultCount;
    resultIndex++
  ) {
    const result: GraphileEngine.ResolvedLookAhead = results[resultIndex];
    const keys = Object.keys(result);
    for (let i = 0, l = keys.length; i < l; i++) {
      const k = keys[i];
      data[k] = data[k] || [];
      const value: unknown = result[k];
      const newData: Array<unknown> | void = ensureArray<unknown>(value);
      if (newData) {
        data[k].push(...newData);
      }
    }
  }
}

const knownTypes = [
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLUnionType,
];

const knownTypeNames = knownTypes.map((k) => k.name);

/**
 * In v4 if you're not using TypeScript we allow users to return arrays of the
 * valid LookAheadData types from data generator functions. We don't really
 * want this; but alas it was in 4.0.0, so we must support it... At least until
 * v5.
 *
 * TODO:v5: remove this!
 */
function ensureArray<T>(val: undefined | null | T | Array<T>): void | Array<T> {
  if (val == null) {
    return;
  } else if (Array.isArray(val)) {
    return val;
  } else {
    return [val];
  }
}

// eslint-disable-next-line no-unused-vars
let ensureName: (fn: {
  (...args: any[]): any;
  displayName?: string;
}) => void = (_fn) => {};
if (["development", "test"].indexOf(process.env.NODE_ENV || "") >= 0) {
  ensureName = (fn) => {
    // $FlowFixMe: displayName
    if (isDev && !fn.displayName && !fn.name && debug.enabled) {
      // eslint-disable-next-line no-console
      console.trace(
        "WARNING: you've added a function with no name as an argDataGenerator, doing so may make debugging more challenging",
      );
    }
  };
}

interface MakeNewWithHooksOptions {
  builder: SchemaBuilder;
}

export function makeNewWithHooks({ builder }: MakeNewWithHooksOptions) {
  // Every object type gets fieldData associated with each of its
  // fields.

  // When a field is defined, it may add to this field data.

  // When something resolves referencing this type, the resolver may
  // request the fieldData, e.g. to perform optimizations.

  // fieldData is an object whose keys are the fields on this
  // GraphQLObjectType and whose values are an object (whose keys are
  // arbitrary namespaced keys and whose values are arrays of
  // information of this kind)
  const fieldDataGeneratorsByFieldNameByType = new Map<
    graphql.GraphQLNamedType,
    { [fieldName: string]: GraphileEngine.DataGeneratorFunction[] }
  >();
  const fieldArgDataGeneratorsByFieldNameByType = new Map<
    graphql.GraphQLNamedType,
    { [fieldName: string]: GraphileEngine.ArgDataGeneratorFunction[] }
  >();

  const wrapResolver = makeCrystalWrapResolver();
  const newWithHooks: any = function newWithHooks<
    T extends
      | graphql.GraphQLSchema
      | graphql.GraphQLScalarType
      | graphql.GraphQLObjectType
      | graphql.GraphQLInterfaceType
      | graphql.GraphQLUnionType
      | graphql.GraphQLEnumType
      | graphql.GraphQLInputObjectType
  >(
    this: GraphileEngine.Build,
    Type: { new (...args: any[]): T },
    spec: any,
    inScope: any,
    performNonEmptyFieldsCheck: boolean,
  ): T | null | undefined {
    const scope = inScope || {};
    if (!inScope) {
      // eslint-disable-next-line no-console
      console.warn(
        `No scope was provided to new ${Type.name}[name=${spec.name}], it's highly recommended that you add a scope so other hooks can easily reference your object - please check usage of 'newWithHooks'. To mute this message, just pass an empty object.`,
      );
    }
    if (!Type) {
      throw new Error("No type specified!");
    }
    if (!this.newWithHooks) {
      throw new Error(
        "Please do not generate the schema during the build building phase, use 'init' instead",
      );
    }
    const fieldDataGeneratorsByFieldName: {
      [fieldName: string]: GraphileEngine.DataGeneratorFunction[];
    } = {};
    const fieldArgDataGeneratorsByFieldName: {
      [fieldName: string]: GraphileEngine.ArgDataGeneratorFunction[];
    } = {};
    let newSpec = spec;
    if (
      knownTypes.indexOf(Type as any) === -1 &&
      knownTypeNames.indexOf(Type.name) >= 0
    ) {
      throw new Error(
        `GraphQL conflict for '${Type.name}' detected! Multiple versions of graphql exist in your node_` +
          /* yarn doctor */ `modules?`,
      );
    }
    if (Type === GraphQLSchema) {
      const context: GraphileEngine.ContextGraphQLSchema = {
        type: "GraphQLSchema",
        scope,
      };
      newSpec = builder.applyHooks(
        this,
        "GraphQLSchema",
        (newSpec as unknown) as graphql.GraphQLSchemaConfig,
        context,
      );
    } else if (Type === GraphQLObjectType) {
      const addDataGeneratorForField = (
        fieldName: string,
        fn: GraphileEngine.DataGeneratorFunction,
      ): void => {
        fn.displayName =
          fn.displayName ||
          `${getNameFromType(Self)}:${fieldName}[${fn.name || "anonymous"}]`;
        fieldDataGeneratorsByFieldName[fieldName] =
          fieldDataGeneratorsByFieldName[fieldName] || [];
        fieldDataGeneratorsByFieldName[fieldName].push(fn);
      };
      const recurseDataGeneratorsForField = (
        fieldName: string,
        iKnowWhatIAmDoing?: boolean,
      ): void => {
        /*
         * Recursing data generators is not safe in general; however there
         * are certain exceptions - for example when you know there are no
         * "dynamic" data generator fields - e.g. where the GraphQL alias is
         * not used at all. In PostGraphile the only case of this is the
         * PageInfo object as none of the fields accept arguments, and they
         * do not rely on the GraphQL query alias to store the result.
         */
        if (!iKnowWhatIAmDoing && !recurseDataGeneratorsForFieldWarned) {
          recurseDataGeneratorsForFieldWarned = true;
          // eslint-disable-next-line no-console
          console.error(
            "Use of `recurseDataGeneratorsForField` is NOT SAFE. e.g. `{n1: node { a: field1 }, n2: node { a: field2 } }` cannot resolve correctly.",
          );
        }
        const fn: GraphileEngine.DataGeneratorFunction = (
          parsedResolveInfoFragment,
          ReturnType,
          data,
          ...rest
        ) => {
          const { args } = parsedResolveInfoFragment;
          const { fields } = this.simplifyParsedResolveInfoFragmentWithType(
            parsedResolveInfoFragment,
            ReturnType,
          );

          const results: any[] = [];
          const StrippedType = getNamedType(ReturnType);
          if (!StrippedType) {
            throw new Error("Could not determine GraphQL type");
          }
          const fieldDataGeneratorsByFieldName = fieldDataGeneratorsByFieldNameByType.get(
            StrippedType,
          );

          const argDataGeneratorsForSelfByFieldName = fieldArgDataGeneratorsByFieldNameByType.get(
            Self as graphql.GraphQLObjectType,
          );

          if (argDataGeneratorsForSelfByFieldName) {
            const argDataGenerators =
              argDataGeneratorsForSelfByFieldName[fieldName];
            for (
              let genIndex = 0, genCount = argDataGenerators.length;
              genIndex < genCount;
              genIndex++
            ) {
              const gen = argDataGenerators[genIndex];
              const local = ensureArray(gen(args, ReturnType, data, ...rest));
              if (local) {
                results.push(...local);
              }
            }
          }
          if (
            fieldDataGeneratorsByFieldName &&
            isCompositeType(StrippedType) &&
            !isAbstractType(StrippedType)
          ) {
            const typeFields = StrippedType.getFields();
            const keys = Object.keys(fields);
            for (
              let keyIndex = 0, keyCount = keys.length;
              keyIndex < keyCount;
              keyIndex++
            ) {
              const alias = keys[keyIndex];
              const field = fields[alias];
              // Run generators with `field` as the `parsedResolveInfoFragment`, pushing results to `results`
              const gens = fieldDataGeneratorsByFieldName[field.name];
              if (gens) {
                for (
                  let genIndex = 0, genCount = gens.length;
                  genIndex < genCount;
                  genIndex++
                ) {
                  const gen = gens[genIndex];
                  const local = ensureArray(
                    gen(field, typeFields[field.name].type, data, ...rest),
                  );

                  if (local) {
                    results.push(...local);
                  }
                }
              }
            }
          }
          return results;
        };
        fn.displayName = `recurseDataGeneratorsForField(${getNameFromType(
          Self,
        )}:${fieldName})`;
        addDataGeneratorForField(fieldName, fn);
        // get type from field, get
      };

      const commonContext: GraphileEngine.ContextGraphQLObjectTypeBase = {
        type: "GraphQLObjectType",
        scope,
      };

      const objectSpec: GraphileEngine.GraphileObjectTypeConfig<any, any> = {
        ...newSpec,
        extensions: {
          ...newSpec.extensions,
          graphile: makeCrystalObjectExtension(),
        },
      };
      const objectContext: GraphileEngine.ContextGraphQLObjectType = {
        ...commonContext,
        addDataGeneratorForField,
        recurseDataGeneratorsForField,
      };
      newSpec = builder.applyHooks(
        this,
        "GraphQLObjectType",
        objectSpec,
        objectContext,

        `|${newSpec.name}`,
      );

      const rawSpec = newSpec;
      newSpec = {
        ...newSpec,
        interfaces: () => {
          const interfacesContext: GraphileEngine.ContextGraphQLObjectTypeInterfaces = {
            ...commonContext,
            Self: Self as graphql.GraphQLObjectType,
            GraphQLObjectType: rawSpec,
          };

          let rawInterfaces = rawSpec.interfaces || [];
          if (typeof rawInterfaces === "function") {
            rawInterfaces = rawInterfaces(interfacesContext);
          }
          return builder.applyHooks(
            this,
            "GraphQLObjectType:interfaces",
            rawInterfaces,
            interfacesContext,
            `|${getNameFromType(Self)}`,
          );
        },
        fields: () => {
          const processedFields: graphql.GraphQLFieldConfig<any, any>[] = [];
          const fieldWithHooks: GraphileEngine.FieldWithHooksFunction = (
            fieldName,
            spec,
            fieldScope,
          ) => {
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

            const argDataGenerators: GraphileEngine.ArgDataGeneratorFunction[] = [];
            fieldArgDataGeneratorsByFieldName[fieldName] = argDataGenerators;

            let newSpec = spec;
            const scopeWithFieldName: GraphileEngine.ScopeGraphQLObjectTypeFieldsFieldWithFieldName = this.extend(
              this.extend(
                { ...scope },
                {
                  fieldName,
                },

                `Within context for GraphQLObjectType '${rawSpec.name}'`,
              ),

              fieldScope,
              `Extending scope for field '${fieldName}' within context for GraphQLObjectType '${rawSpec.name}'`,
            );
            const context: GraphileEngine.ContextGraphQLObjectTypeFieldsField = {
              ...commonContext,
              Self: Self as graphql.GraphQLObjectType,
              addDataGenerator(fn) {
                return addDataGeneratorForField(fieldName, fn);
              },
              addArgDataGenerator(fn) {
                ensureName(fn);
                argDataGenerators.push(fn);
              },
              getDataFromParsedResolveInfoFragment: (
                parsedResolveInfoFragment,
                ReturnType,
              ): GraphileEngine.ResolvedLookAhead => {
                const Type = getNamedType(ReturnType as graphql.GraphQLType);
                const data: GraphileEngine.ResolvedLookAhead = {};

                const {
                  fields,
                  args,
                } = this.simplifyParsedResolveInfoFragmentWithType(
                  parsedResolveInfoFragment,
                  ReturnType,
                );

                // Args -> argDataGenerators
                for (
                  let dgIndex = 0, dgCount = argDataGenerators.length;
                  dgIndex < dgCount;
                  dgIndex++
                ) {
                  const gen = argDataGenerators[dgIndex];
                  try {
                    mergeData(data, gen, ReturnType, args);
                  } catch (e) {
                    debug(
                      "Failed to execute argDataGenerator '%s' on %s of %s",
                      gen.displayName || gen.name || "anonymous",
                      fieldName,
                      getNameFromType(Self),
                    );

                    throw e;
                  }
                }

                // finalSpec.type -> fieldData
                if (!finalSpec) {
                  throw new Error(
                    "It's too early to call this! Call from within resolve",
                  );
                }
                const fieldDataGeneratorsByFieldName = fieldDataGeneratorsByFieldNameByType.get(
                  Type,
                );

                if (
                  fieldDataGeneratorsByFieldName &&
                  isCompositeType(Type) &&
                  !isAbstractType(Type)
                ) {
                  const typeFields = Type.getFields();
                  const keys = Object.keys(fields);
                  for (
                    let keyIndex = 0, keyCount = keys.length;
                    keyIndex < keyCount;
                    keyIndex++
                  ) {
                    const alias = keys[keyIndex];
                    const field = fields[alias];
                    const gens = fieldDataGeneratorsByFieldName[field.name];
                    if (gens) {
                      const FieldReturnType = typeFields[field.name].type;
                      for (let i = 0, l = gens.length; i < l; i++) {
                        mergeData(data, gens[i], FieldReturnType, field);
                      }
                    }
                  }
                }
                return data;
              },
              scope: scopeWithFieldName,
            };

            if (typeof newSpec === "function") {
              newSpec = newSpec(context);
            }
            newSpec = {
              ...newSpec,
              extensions: {
                ...newSpec.extensions,
                graphile: makeCrystalObjectFieldExtension(),
              },
            };
            newSpec = builder.applyHooks(
              this,
              "GraphQLObjectType:fields:field",
              newSpec,
              context,
              `|${getNameFromType(Self)}.fields.${fieldName}`,
            );

            newSpec.args = newSpec.args || {};
            const argsContext: GraphileEngine.ContextGraphQLObjectTypeFieldsFieldArgs = {
              ...context,
              field: newSpec,
              returnType: newSpec.type,
            };
            newSpec = {
              ...newSpec,
              args: builder.applyHooks(
                this,
                "GraphQLObjectType:fields:field:args",
                newSpec.args,
                argsContext,

                `|${getNameFromType(Self)}.fields.${fieldName}`,
              ),
            };

            const finalSpec = newSpec;
            processedFields.push(finalSpec);
            return finalSpec;
          };
          const fieldsContext: GraphileEngine.ContextGraphQLObjectTypeFields = {
            ...commonContext,
            addDataGeneratorForField,
            recurseDataGeneratorsForField,
            Self: Self as graphql.GraphQLObjectType,
            GraphQLObjectType: rawSpec,
            fieldWithHooks,
          };

          let rawFields = rawSpec.fields || {};
          if (typeof rawFields === "function") {
            rawFields = rawFields(fieldsContext);
          }
          const fieldsSpec = builder.applyHooks(
            this,
            "GraphQLObjectType:fields",
            this.extend(
              {},
              rawFields,
              `Default field included in newWithHooks call for '${
                rawSpec.name
              }'. ${inScope.__origin || ""}`,
            ),

            fieldsContext,
            `|${rawSpec.name}`,
          );

          // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
          for (const fieldName in fieldsSpec) {
            const fieldSpec = fieldsSpec[fieldName];
            if (processedFields.indexOf(fieldSpec) < 0) {
              // We've not processed this yet; process it now!
              fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                fieldName,
                fieldSpec,
                {
                  autoField: true, // We don't have any additional information
                },
              );
            }
          }

          // Perform the Graphile Crystal magic
          for (const fieldName in fieldsSpec) {
            fieldsSpec[fieldName].resolve = wrapResolver(
              fieldsSpec[fieldName].type,
              fieldsSpec[fieldName].resolve,
            );

            // IMPORTANT: **nothing** can modify the resolver from here - i.e.
            // graphql-shield and friends may cause problems
          }

          return fieldsSpec;
        },
      };
    } else if (Type === GraphQLInputObjectType) {
      const commonContext: GraphileEngine.ContextGraphQLInputObjectType = {
        type: "GraphQLInputObjectType",
        scope,
      };

      newSpec = builder.applyHooks(
        this,
        "GraphQLInputObjectType",
        newSpec,
        commonContext,
        `|${newSpec.name}`,
      );

      newSpec.fields = newSpec.fields || {};

      const rawSpec = newSpec;
      newSpec = {
        ...newSpec,
        fields: () => {
          const processedFields: graphql.GraphQLInputFieldConfig[] = [];
          const fieldWithHooks: GraphileEngine.InputFieldWithHooksFunction = (
            fieldName,
            spec,
            fieldScope = {},
          ) => {
            if (!isString(fieldName)) {
              throw new Error(
                "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary.",
              );
            }
            const finalFieldScope: GraphileEngine.ScopeGraphQLInputObjectTypeFieldsFieldWithFieldName = this.extend(
              this.extend(
                { ...scope },
                {
                  fieldName,
                },

                `Within context for GraphQLInputObjectType '${rawSpec.name}'`,
              ),

              fieldScope,
              `Extending scope for field '${fieldName}' within context for GraphQLInputObjectType '${rawSpec.name}'`,
            );
            const context: GraphileEngine.ContextGraphQLInputObjectTypeFieldsField = {
              ...commonContext,
              Self: Self as graphql.GraphQLInputObjectType,
              scope: finalFieldScope,
            };

            let newSpec = spec;
            if (typeof newSpec === "function") {
              newSpec = newSpec(context);
            }
            newSpec = builder.applyHooks(
              this,
              "GraphQLInputObjectType:fields:field",
              newSpec,
              context,
              `|${getNameFromType(Self)}.fields.${fieldName}`,
            );

            const finalSpec = newSpec;
            processedFields.push(finalSpec);
            return finalSpec;
          };
          const fieldsContext: GraphileEngine.ContextGraphQLInputObjectTypeFields = {
            ...commonContext,
            Self: Self as graphql.GraphQLInputObjectType,
            GraphQLInputObjectType: rawSpec,
            fieldWithHooks,
          };

          let rawFields = rawSpec.fields;
          if (typeof rawFields === "function") {
            rawFields = rawFields(fieldsContext);
          }
          const fieldsList: typeof rawFields = this.extend(
            {},
            rawFields,
            `Default field included in newWithHooks call for '${
              rawSpec.name
            }'. ${inScope.__origin || ""}`,
          );
          const fieldsSpec = builder.applyHooks(
            this,
            "GraphQLInputObjectType:fields",
            fieldsList,
            fieldsContext,
            `|${getNameFromType(Self)}`,
          );

          // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
          for (const fieldName in fieldsSpec) {
            const fieldSpec = fieldsSpec[fieldName];
            if (processedFields.indexOf(fieldSpec) < 0) {
              // We've not processed this yet; process it now!
              fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                fieldName,
                fieldSpec,
                {
                  autoField: true, // We don't have any additional information
                },
              );
            }
          }
          return fieldsSpec;
        },
      };
    } else if (Type === GraphQLEnumType) {
      const commonContext: GraphileEngine.ContextGraphQLEnumType = {
        type: "GraphQLEnumType",
        scope,
      };

      newSpec = builder.applyHooks(
        this,
        "GraphQLEnumType",
        newSpec,
        commonContext,
        `|${newSpec.name}`,
      );

      newSpec.values = builder.applyHooks(
        this,
        "GraphQLEnumType:values",
        newSpec.values,
        commonContext,
        `|${newSpec.name}`,
      );

      const values = newSpec.values;
      newSpec.values = Object.keys(values).reduce((memo, valueKey) => {
        const value = values[valueKey];
        const newValue = builder.applyHooks(
          this,
          "GraphQLEnumType:values:value",
          value,
          commonContext,
          `|${newSpec.name}|${valueKey}`,
        );

        memo[valueKey] = newValue;
        return memo;
      }, {});
    } else if (Type === GraphQLUnionType) {
      const commonContext: GraphileEngine.ContextGraphQLUnionType = {
        type: "GraphQLUnionType",
        scope,
      };

      newSpec = builder.applyHooks(
        this,
        "GraphQLUnionType",
        newSpec,
        { ...commonContext },
        `|${newSpec.name}`,
      );

      const rawSpec = newSpec as GraphileEngine.GraphileUnionTypeConfig<
        any,
        any
      >;
      newSpec = {
        ...newSpec,
        types: () => {
          const typesContext: GraphileEngine.ContextGraphQLUnionTypeTypes = {
            ...commonContext,
            Self: Self as graphql.GraphQLUnionType,
            GraphQLUnionType: rawSpec,
          };

          let rawTypes = rawSpec.types || [];
          if (typeof rawTypes === "function") {
            rawTypes = rawTypes(typesContext);
          }
          return builder.applyHooks(
            this,
            "GraphQLUnionType:types",
            rawTypes,
            typesContext,
            `|${getNameFromType(Self)}`,
          );
        },
      };
    }

    const finalSpec = newSpec;

    const Self: T = new Type(finalSpec);
    if (graphql.isNamedType(Self) && performNonEmptyFieldsCheck) {
      try {
        if (
          Self instanceof GraphQLInterfaceType ||
          Self instanceof GraphQLObjectType ||
          Self instanceof GraphQLInputObjectType
        ) {
          if (typeof Self.getFields === "function") {
            const fields = Self.getFields();
            if (Object.keys(fields).length === 0) {
              // We require there's at least one field on GraphQLObjectType and GraphQLInputObjectType records
              return null;
            }
          }
        }
      } catch (e) {
        // This is the error we're expecting to handle:
        // https://github.com/graphql/graphql-js/blob/831598ba76f015078ecb6c5c1fbaf133302f3f8e/src/type/definition.js#L526-L531
        if (inScope && inScope.isRootQuery) {
          throw e;
        }
        const isProbablyAnEmptyObjectError = !!e.message.match(
          /function which returns such an object/,
        );

        if (!isProbablyAnEmptyObjectError) {
          this.swallowError(e);
        }
        return null;
      }
    }

    if (graphql.isNamedType(Self)) {
      this.scopeByType.set(Self, scope);
    }

    if (graphql.isNamedType(Self)) {
      this.addType(
        Self,
        scope.__origin ||
          (this
            ? `'newWithHooks' call during hook '${this.status.currentHookName}'`
            : null),
      );
    }
    if (Type !== GraphQLSchema) {
      fieldDataGeneratorsByFieldNameByType.set(
        Self as graphql.GraphQLNamedType,
        fieldDataGeneratorsByFieldName,
      );

      fieldArgDataGeneratorsByFieldNameByType.set(
        Self as graphql.GraphQLNamedType,
        fieldArgDataGeneratorsByFieldName,
      );
    }

    return Self;
  };

  return {
    newWithHooks,
    fieldDataGeneratorsByFieldNameByType,
    fieldArgDataGeneratorsByFieldNameByType,
  };
}
