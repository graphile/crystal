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
  const fieldDataByType = new Map();

  return {
    buildObjectWithHooks(Type, spec, scope = {}) {
      const fieldData = {};
      let newSpec = spec;
      if (Type === GraphQLSchema) {
        newSpec = builder.applyHooks("schema", newSpec, {
          scope,
        });
      } else if (Type === GraphQLObjectType) {
        const addDataForField = (fieldName, key, value) => {
          fieldData[key] = fieldData[key] || [];
          fieldData[key].push(value);
        };

        newSpec = builder.applyHooks("objectType", newSpec, {
          scope,
          addDataForField,
        });

        const rawSpec = newSpec;
        newSpec = Object.assign({}, newSpec, {
          fields: () =>
            builder.applyHooks("objectType:fields", rawSpec.fields, {
              scope,
              Self,
              objectType: rawSpec,
              buildFieldWithHooks: (spec, scope = {}) => {
                let newSpec = spec;
                newSpec = builder.applyHooks("field", newSpec, {
                  scope,
                });
                newSpec = Object.assign({}, newSpec, {
                  args: builder.applyHooks("field:args", newSpec.args, {
                    scope,
                    field: newSpec,
                  }),
                });
                return newSpec;
              },
            }),
        });
      }

      const Self = new Type(newSpec);
      if (newSpec.name) {
        allTypes[newSpec.name] = Self;
      }
      fieldDataByType.set(Self, fieldData);
      return Self;
    },
    buildRoot() {
      return this.buildObjectWithHooks(GraphQLSchema, {});
    },
  };
};
