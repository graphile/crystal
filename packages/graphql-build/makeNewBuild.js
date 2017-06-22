const { GraphQLSchema, GraphQLObjectType } = require("graphql");

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
      const fieldDataGeneratorsByFieldName = {};
      let newSpec = spec;
      if (Type === GraphQLSchema) {
        newSpec = builder.applyHooks(this, "schema", newSpec, {
          scope,
        });
      } else if (Type === GraphQLObjectType) {
        const addDataGeneratorForField = (fieldName, key, value) => {
          fieldDataGeneratorsByFieldName[key] =
            fieldDataGeneratorsByFieldName[key] || [];
          fieldDataGeneratorsByFieldName[key].push(value);
        };

        newSpec = builder.applyHooks(this, "objectType", newSpec, {
          scope,
          addDataGeneratorForField,
        });

        const rawSpec = newSpec;
        newSpec = Object.assign({}, newSpec, {
          fields: () =>
            builder.applyHooks(this, "objectType:fields", rawSpec.fields, {
              scope,
              Self,
              objectType: rawSpec,
              buildFieldWithHooks: (fieldName, spec, scope = {}) => {
                let argDataGenerators = [];

                let newSpec = spec;
                let context = {
                  addDataGenerator(fn) {
                    return addDataGeneratorForField(fieldName, fn);
                  },
                  addArgDataGenerator(fn) {
                    argDataGenerators.push(fn);
                  },
                  getDataFromParsedResolveInfoFragment(
                    parsedResolveInfoFragment
                  ) {
                    const data = {};
                    const mergeData = results => {
                      if (!Array.isArray(results)) {
                        results = [results];
                      }
                      for (const result of results) {
                        for (const k of Object.keys(result)) {
                          data[k] = data[k] || [];
                          if (!Array.isArray(result[k])) {
                            throw new Error("Data must be an array");
                          }
                          data[k].push(...result[k]);
                        }
                      }
                    };

                    const { fields, args } = parsedResolveInfoFragment;

                    // Args -> argDataGenerators
                    for (const gen of argDataGenerators) {
                      mergeData(gen(args, data));
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
                    if (fieldData) {
                      for (const field of fields) {
                        const gens = fieldDataGenerators[field.name];
                        if (gens) {
                          for (const gen of gens) {
                            mergeData(gen(field));
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
                newSpec = Object.assign({}, newSpec, {
                  args: builder.applyHooks(
                    this,
                    "field:args",
                    newSpec.args,
                    Object.assign({}, context, {
                      field: newSpec,
                    })
                  ),
                });
                const finalSpec = newSpec;
                return finalSpec;
              },
            }),
        });
      }

      const Self = new Type(newSpec);
      if (newSpec.name) {
        if (allTypes[newSpec.name]) {
          throw new Error(
            `Type '${newSpec.name}' has already been registered!`
          );
        }
        allTypes[newSpec.name] = Self;
      }
      fieldDataGeneratorsByType.set(Self, fieldDataGeneratorsByFieldName);
      return Self;
    },
    buildRoot() {
      return this.buildObjectWithHooks(GraphQLSchema, {});
    },
  };
};
