import * as graphql from "graphql";
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
  getAliasFromResolveInfo,
} from "graphql-parse-resolve-info";
import debugFactory from "debug";

const isString = str => typeof str === "string";
const isDev = ["test", "development"].indexOf(process.env.NODE_ENV) >= 0;
const debug = debugFactory("graphql-build");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  getNamedType,
} = graphql;

const mergeData = (data, gen, ReturnType, arg) => {
  const results = ensureArray(gen(arg, ReturnType, data));
  if (!results) {
    return;
  }
  for (const result of results) {
    for (const k of Object.keys(result)) {
      data[k] = data[k] || [];
      const newData = ensureArray(result[k]);
      if (newData) {
        data[k].push(...newData);
      }
    }
  }
};

const knownTypes = [
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
];
const knownTypeNames = knownTypes.map(k => k.name);

const ensureArray = val =>
  val == null ? val : Array.isArray(val) ? val : [val];

let ensureName = () => {};
if (["development", "test"].indexOf(process.env.NODE_ENV) >= 0) {
  ensureName = fn => {
    if (isDev && !fn.displayName && !fn.name) {
      // eslint-disable-next-line no-console
      console.trace(
        "WARNING: you've added a function with no name as an argDataGenerator, doing so may make debugging more challenging"
      );
    }
  };
}

export default function makeNewBuild(builder) {
  const allTypes = {};

  // Every object type gets fieldData associated with each of its
  // fields.

  // When a field is defined, it may add to this field data.

  // When something resolves referencing this type, the resolver may
  // request the fieldData, e.g. to perform optimisations.

  // fieldData is an object whose keys are the fields on this
  // GraphQLObjectType and whose values are an object (whose keys are
  // arbitrary namespaced keys and whose values are arrays of
  // information of this kind)
  const fieldDataGeneratorsByType = new Map();

  return {
    graphql,
    parseResolveInfo,
    simplifyParsedResolveInfoFragmentWithType,
    getAliasFromResolveInfo,
    generateDataForType(Type, parsedResolveInfoFragment) {
      const StrippedType = getNamedType(Type);
      if (!StrippedType) {
        throw new Error(`Invalid type`);
      }
      const { fields } = this.simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment,
        StrippedType
      );
      const fieldDataGenerators =
        fieldDataGeneratorsByType.get(StrippedType) || {};
      const data = {};
      if (fieldDataGenerators) {
        for (const alias of Object.keys(fields)) {
          const field = fields[alias];
          const gens = fieldDataGenerators[field.name];
          if (gens) {
            for (const gen of gens) {
              mergeData(data, gen, StrippedType, field);
            }
          }
        }
      }
      return data;
    },

    resolveAlias(data, _args, _context, resolveInfo) {
      const alias = getAliasFromResolveInfo(resolveInfo);
      return data[alias];
    },
    addType(type) {
      allTypes[type.name] = type;
    },
    getTypeByName(typeName) {
      return allTypes[typeName];
    },
    extend(obj, obj2) {
      const keysA = Object.keys(obj);
      const keysB = Object.keys(obj2);
      for (const key of keysB) {
        if (keysA.indexOf(key) >= 0) {
          throw new Error(`Overwriting key '${key}' is not allowed!`);
        }
      }
      return Object.assign({}, obj, obj2);
    },
    newWithHooks(Type, spec, scope = {}, returnNullOnInvalid = false) {
      if (!Type) {
        throw new Error("No type specified!");
      }
      if (!this.newWithHooks || !Object.isFrozen(this)) {
        throw new Error(
          "Please do not generate the schema during the build building phase, use 'init' instead"
        );
      }
      const fieldDataGeneratorsByFieldName = {};
      let newSpec = spec;
      if (
        knownTypes.indexOf(Type) === -1 &&
        knownTypeNames.indexOf(Type.name) >= 0
      ) {
        throw new Error(
          `GraphQL conflict for '${Type.name}' detected! Multiple versions of graphql exist in your node_modules?`
        );
      }
      if (Type === GraphQLSchema) {
        newSpec = builder.applyHooks(this, "GraphQLSchema", newSpec, {
          scope,
        });
      } else if (Type === GraphQLObjectType) {
        const addDataGeneratorForField = (fieldName, fn) => {
          fn.displayName =
            fn.displayName ||
            `${Self.name}:${fieldName}[${fn.name || "anonymous"}]`;
          fieldDataGeneratorsByFieldName[fieldName] =
            fieldDataGeneratorsByFieldName[fieldName] || [];
          fieldDataGeneratorsByFieldName[fieldName].push(fn);
        };
        const recurseDataGeneratorsForField = fieldName => {
          const fn = (parsedResolveInfoFragment, ReturnType, ...rest) => {
            const { fields } = this.simplifyParsedResolveInfoFragmentWithType(
              parsedResolveInfoFragment,
              ReturnType
            );
            const results = [];
            const StrippedType = getNamedType(ReturnType);
            const fieldDataGenerators = fieldDataGeneratorsByType.get(
              StrippedType
            );
            if (fieldDataGenerators && StrippedType.getFields) {
              const typeFields = StrippedType.getFields();
              for (const alias of Object.keys(fields)) {
                const field = fields[alias];
                // Run generators with `field` as the `parsedResolveInfoFragment`, pushing results to `results`
                const gens = fieldDataGenerators[field.name];
                if (gens) {
                  for (const gen of gens) {
                    const local = ensureArray(
                      gen(field, typeFields[field.name].type, ...rest)
                    );
                    results.push(...local);
                  }
                }
              }
            }
            return results;
          };
          fn.displayName = `recurseDataGeneratorsForField(${Self.name}:${fieldName})`;
          addDataGeneratorForField(fieldName, fn);
          // get type from field, get
        };

        newSpec = builder.applyHooks(
          this,
          "GraphQLObjectType",
          newSpec,
          {
            scope,
            addDataGeneratorForField,
            recurseDataGeneratorsForField,
          },
          `|${newSpec.name}`
        );

        const rawSpec = newSpec;
        newSpec = Object.assign({}, newSpec, {
          interfaces: () => {
            const interfacesContext = {
              scope,
              Self,
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
              `|${Self.name}`
            );
          },
          fields: () => {
            const processedFields = [];
            const fieldsContext = {
              scope,
              addDataGeneratorForField,
              recurseDataGeneratorsForField,
              Self,
              GraphQLObjectType: rawSpec,
              fieldWithHooks: (fieldName, spec, fieldScope = {}) => {
                if (!isString(fieldName)) {
                  throw new Error(
                    "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary."
                  );
                }
                let argDataGenerators = [];

                let newSpec = spec;
                let context = {
                  addDataGenerator(fn) {
                    return addDataGeneratorForField(fieldName, fn);
                  },
                  addArgDataGenerator(fn) {
                    ensureName(fn);
                    argDataGenerators.push(fn);
                  },
                  getDataFromParsedResolveInfoFragment: (
                    parsedResolveInfoFragment,
                    ReturnType
                  ) => {
                    const data = {};

                    const {
                      fields,
                      args,
                    } = this.simplifyParsedResolveInfoFragmentWithType(
                      parsedResolveInfoFragment,
                      ReturnType
                    );

                    // Args -> argDataGenerators
                    for (const gen of argDataGenerators) {
                      try {
                        mergeData(data, gen, ReturnType, args);
                      } catch (e) {
                        debug(
                          "Failed to execute argDataGenerator '%s' on %s of %s",
                          gen.displayName || gen.name || "anonymous",
                          fieldName,
                          Self.name
                        );
                        throw e;
                      }
                    }

                    // finalSpec.type -> fieldData
                    if (!finalSpec) {
                      throw new Error(
                        "It's too early to call this! Call from within resolve"
                      );
                    }
                    const Type = getNamedType(finalSpec.type);
                    const fieldDataGenerators = fieldDataGeneratorsByType.get(
                      Type
                    );
                    if (fieldDataGenerators) {
                      const typeFields = Type.getFields();
                      for (const alias of Object.keys(fields)) {
                        const field = fields[alias];
                        const gens = fieldDataGenerators[field.name];
                        if (gens) {
                          const FieldReturnType = typeFields[field.name].type;
                          for (const gen of gens) {
                            mergeData(data, gen, FieldReturnType, field);
                          }
                        }
                      }
                    }
                    return data;
                  },
                  scope: Object.assign(
                    {},
                    scope,
                    {
                      fieldName,
                    },
                    fieldScope
                  ),
                };
                if (typeof newSpec === "function") {
                  newSpec = newSpec(context);
                }
                newSpec = builder.applyHooks(
                  this,
                  "field",
                  newSpec,
                  context,
                  `|${Self.name}.fields.${fieldName}`
                );
                newSpec.args = newSpec.args || {};
                newSpec = Object.assign({}, newSpec, {
                  args: builder.applyHooks(
                    this,
                    "field:args",
                    newSpec.args,
                    Object.assign({}, context, {
                      field: newSpec,
                      returnType: newSpec.type,
                    }),
                    `|${Self.name}.fields.${fieldName}`
                  ),
                });
                const finalSpec = newSpec;
                processedFields.push(finalSpec);
                return finalSpec;
              },
            };
            let rawFields = rawSpec.fields || {};
            if (typeof rawFields === "function") {
              rawFields = rawFields(fieldsContext);
            }
            const fieldsSpec = builder.applyHooks(
              this,
              "GraphQLObjectType:fields",
              rawFields,
              fieldsContext,
              `|${rawSpec.name}`
            );
            // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
            for (const fieldName in fieldsSpec) {
              const fieldSpec = fieldsSpec[fieldName];
              if (!processedFields.indexOf(fieldSpec) >= 0) {
                // We've not processed this yet; process it now!
                fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                  fieldName,
                  fieldSpec
                );
              }
            }
            return fieldsSpec;
          },
        });
      } else if (Type === GraphQLInputObjectType) {
        newSpec = builder.applyHooks(
          this,
          "GraphQLInputObjectType",
          newSpec,
          {
            scope,
          },
          `|${newSpec.name}`
        );
        newSpec.fields = newSpec.fields || {};

        const rawSpec = newSpec;
        newSpec = Object.assign({}, newSpec, {
          fields: () => {
            const processedFields = [];
            const fieldsContext = {
              scope,
              Self,
              GraphQLObjectType: rawSpec,
              fieldWithHooks: (fieldName, spec, fieldScope = {}) => {
                if (!isString(fieldName)) {
                  throw new Error(
                    "It looks like you forgot to pass the fieldName to `fieldWithHooks`, we're sorry this is current necessary."
                  );
                }
                let context = {
                  scope: Object.assign(
                    {},
                    scope,
                    {
                      fieldName,
                    },
                    fieldScope
                  ),
                };
                let newSpec = spec;
                if (typeof newSpec === "function") {
                  newSpec = newSpec(context);
                }
                newSpec = builder.applyHooks(
                  this,
                  "inputField",
                  newSpec,
                  context,
                  `|${Self.name}.fields.${fieldName}`
                );
                const finalSpec = newSpec;
                processedFields.push(finalSpec);
                return finalSpec;
              },
            };
            let rawFields = rawSpec.fields;
            if (typeof rawFields === "function") {
              rawFields = rawFields(fieldsContext);
            }
            const fieldsSpec = builder.applyHooks(
              this,
              "GraphQLInputObjectType:fields",
              rawFields,
              fieldsContext,
              `|${Self.name}`
            );
            // Finally, check through all the fields that they've all been processed; any that have not we should do so now.
            for (const fieldName in fieldsSpec) {
              const fieldSpec = fieldsSpec[fieldName];
              if (!processedFields.indexOf(fieldSpec) >= 0) {
                // We've not processed this yet; process it now!
                fieldsSpec[fieldName] = fieldsContext.fieldWithHooks(
                  fieldName,
                  fieldSpec
                );
              }
            }
            return fieldsSpec;
          },
        });
      } else if (Type === GraphQLEnumType) {
        newSpec = builder.applyHooks(
          this,
          "GraphQLEnumType",
          newSpec,
          {
            scope,
          },
          `|${newSpec.name}`
        );

        newSpec.values = builder.applyHooks(
          this,
          "GraphQLEnumType:values",
          newSpec.values,
          {
            scope,
          },
          `|${newSpec.name}`
        );
      }
      const finalSpec = newSpec;

      let Self;
      Self = new Type(finalSpec);
      if (returnNullOnInvalid && Self.getFields) {
        try {
          Self.getFields();
        } catch (e) {
          return null;
        }
      }

      if (finalSpec.name) {
        if (allTypes[finalSpec.name]) {
          throw new Error(
            `Type '${finalSpec.name}' has already been registered!`
          );
        }
        allTypes[finalSpec.name] = Self;
      }
      fieldDataGeneratorsByType.set(Self, fieldDataGeneratorsByFieldName);
      return Self;
    },
  };
}
