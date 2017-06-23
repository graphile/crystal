const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
} = require("graphql");
const parseResolveInfo = require("./parseResolveInfo");
const { stripNonNullType, stripListType } = parseResolveInfo;
const isString = require("lodash/isString");

const knownTypes = [GraphQLSchema, GraphQLObjectType, GraphQLEnumType];
const knownTypeNames = knownTypes.map(k => k.name);

const ensureArray = val =>
  val == null ? val : Array.isArray(val) ? val : [val];

let ensureName = () => {};
if (["development", "test"].includes(process.env.NODE_ENV)) {
  ensureName = fn => {
    if (!fn.displayName && !fn.name) {
      console.trace(
        "WARNING: you've added a function with no name as an argDataGenerator, doing so may make debugging more challenging"
      );
    }
  };
}

module.exports = function makeNewBuild(builder) {
  const allTypes = {};

  // Every object type gets fieldData associated with each of its
  // fields.

  // When a field is defined, it may add to this field data.

  // When something resolves referencing this type, the resolver may
  // request the fieldData, e.g. to perform optimisations.

  // fieldData is an object whose keys are the fields on this
  // objectType and whose values are an object (whose keys are
  // arbitrary namespaced keys and whose values are arrays of
  // information of this kind)
  const fieldDataGeneratorsByType = new Map();

  return {
    parseResolveInfo,
    resolveAlias(data, _args, _context, resolveInfo) {
      const { alias } = parseResolveInfo(resolveInfo, { deep: false });
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
        if (keysA.includes(key)) {
          throw new Error(`Overwriting key '${key}' is not allowed!`);
        }
      }
      return Object.assign({}, obj, obj2);
    },
    buildObjectWithHooks(Type, spec, scope = {}) {
      if (!this.buildObjectWithHooks || !Object.isFrozen(this)) {
        throw new Error(
          "Please do not generate the schema during the build building phase, use 'init' instead"
        );
      }
      const fieldDataGeneratorsByFieldName = {};
      let newSpec = spec;
      if (!knownTypes.includes(Type) && knownTypeNames.includes(Type.name)) {
        throw new Error(
          `GraphQL conflict for '${Type.name}' detected! Multiple versions of graphql exist in your node_modules?`
        );
      }
      if (Type === GraphQLSchema) {
        newSpec = builder.applyHooks(this, "schema", newSpec, {
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
          const fn = (parsedResolveInfoFragment, ...rest) => {
            const { fields } = parsedResolveInfoFragment;
            const results = [];
            for (const alias of Object.keys(fields)) {
              const field = fields[alias];
              // 1. XXX: Get the type for this field
              const Type = Self._fields[fieldName].type;
              const StrippedType = stripNonNullType(
                stripListType(stripNonNullType(Type))
              );
              if (!Type) {
                throw new Error(
                  `Could not find type for field '${field.name}' of '${finalSpec.name}'`
                );
              }
              // 2. Get the generators for that type
              const fieldDataGenerators =
                fieldDataGeneratorsByType.get(StrippedType) || {};
              // 3. Run them with `field` as the `parsedResolveInfoFragment`, pushing results to `results`
              if (fieldDataGenerators) {
                for (const alias of Object.keys(fields)) {
                  const field = fields[alias];
                  const gens = fieldDataGenerators[field.name];
                  if (gens) {
                    for (const gen of gens) {
                      const local = ensureArray(gen(field, ...rest));
                      results.push(...local);
                    }
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

        newSpec = builder.applyHooks(this, "objectType", newSpec, {
          scope,
          addDataGeneratorForField,
          recurseDataGeneratorsForField,
        });

        const rawSpec = newSpec;
        newSpec = Object.assign({}, newSpec, {
          fields: () => {
            const fieldsContext = {
              scope,
              addDataGeneratorForField,
              recurseDataGeneratorsForField,
              Self,
              objectType: rawSpec,
              buildFieldWithHooks: (fieldName, spec, scope = {}) => {
                if (!isString(fieldName)) {
                  throw new Error(
                    "It looks like you forgot to pass the fieldName to `buildFieldWithHooks`, we're sorry this is current necessary."
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
                  getDataFromParsedResolveInfoFragment(
                    parsedResolveInfoFragment
                  ) {
                    const data = {};
                    const mergeData = (gen, arg) => {
                      const results = ensureArray(gen(arg, data));
                      if (!results) {
                        return;
                      }
                      for (const result of results) {
                        for (const k of Object.keys(result)) {
                          data[k] = data[k] || [];
                          data[k].push(...ensureArray(result[k]));
                        }
                      }
                    };

                    const { fields, args } = parsedResolveInfoFragment;

                    // Args -> argDataGenerators
                    for (const gen of argDataGenerators) {
                      try {
                        mergeData(gen, args);
                      } catch (e) {
                        console.error(
                          `Failed to execute argDataGenerator '${gen.displayName ||
                            gen.name ||
                            "anonymous"}' on ${fieldName} of ${Self.name}`
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
                    const Type = finalSpec.type;
                    const fieldDataGenerators = fieldDataGeneratorsByType.get(
                      Type
                    );
                    if (fieldDataGenerators) {
                      for (const alias of Object.keys(fields)) {
                        const field = fields[alias];
                        const gens = fieldDataGenerators[field.name];
                        if (gens) {
                          for (const gen of gens) {
                            mergeData(gen, field);
                          }
                        }
                      }
                    }
                    return data;
                  },
                  scope,
                };
                if (typeof newSpec === "function") {
                  newSpec = newSpec(context);
                }
                newSpec = builder.applyHooks(this, "field", newSpec, context);
                newSpec.args = newSpec.args || {};
                newSpec = Object.assign({}, newSpec, {
                  args: builder.applyHooks(
                    this,
                    "field:args",
                    newSpec.args,
                    Object.assign({}, context, {
                      field: newSpec,
                      resultType: newSpec.type,
                    })
                  ),
                });
                const finalSpec = newSpec;
                return finalSpec;
              },
            };
            let rawFields = rawSpec.fields;
            if (typeof rawFields === "function") {
              rawFields = rawFields(fieldsContext);
            }
            return builder.applyHooks(
              this,
              "objectType:fields",
              rawFields,
              fieldsContext
            );
          },
        });
      }
      const finalSpec = newSpec;

      const Self = new Type(finalSpec);
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
    buildRoot() {
      return this.buildObjectWithHooks(GraphQLSchema, {});
    },
  };
};
