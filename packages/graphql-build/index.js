const debug = require("debug")("graphql-builder");
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const bindAll = (obj, keys) => {
  keys.forEach(key => {
    obj[key] = obj[key].bind(obj);
  });
  return obj;
};

const INDENT = "  ";

const makeNewBuild = builder => {
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
  };
};

class SchemaBuilder {
  constructor() {
    // Because hooks can nest, this keeps track of how deep we are.
    this.depth = -1;

    this.hooks = {
      // The build object represents the current schema build and is passed to
      // all hooks, hook the 'build' event to extend this object:
      build: [],

      // Add 'query', 'mutation' or 'subscription' types in this hook:
      schema: [],

      // When creating a GraphQLObjectType via `buildObjectWithHooks`, we'll
      // execute, the following hooks:
      // - 'objectType' to add any root-level attributes, e.g. add a description
      // - 'objectType:fields' to add additional fields to this object type (is
      //   ran asynchronously and gets a reference to the final GraphQL Object as
      //   `Self` in the context)
      objectType: [],
      "objectType:fields": [],

      // When you add a field to an object, wrap the call with
      // `buildFieldWithHooks` in order to fire these hooks:
      field: [],
      "field:args": [],
    };
  }

  /*
   * Every hook `fn` takes three arguments:
   * - obj - the object currently being inspected
   * - build - the current build object (which contains a number of utilities and the context of the build)
   * - context - information specific to the current invocation of the hook
   *
   * The function must either return a replacement object for `obj` or `obj` itself
   */
  hook(hookName, fn) {
    if (!this.hooks[hookName]) {
      throw new Error(`Sorry, '${hookName}' is not a supported hook`);
    }
    this.hooks[hookName].push(fn);
  }

  applyHooks(build, hookName, oldObj, context) {
    this.depth++;
    try {
      debug(`${INDENT.repeat(this.depth)}[${hookName}]: Running...`);

      const hooks = this.hooks[hookName];
      if (!hooks) {
        throw new Error(`Sorry, '${hookName}' is not a registered hook`);
      }

      let newObj = oldObj;
      for (const hook of hooks) {
        this.depth++;
        try {
          const hookDisplayName = hook.displayName || hook.name || "anonymous";
          debug(
            `${INDENT.repeat(
              this.depth
            )}[${hookName}]:   Executing '${hookDisplayName}'`
          );
          newObj = hook(newObj, build, context);
          if (!newObj) {
            throw new Error(`Hook for '${hookName}' returned falsy value`);
          }
          debug(
            `${INDENT.repeat(
              this.depth
            )}[${hookName}]:   '${hookDisplayName}' complete`
          );
        } finally {
          this.depth--;
        }
      }

      debug(`${INDENT.repeat(this.depth)}[${hookName}]: Complete`);

      return newObj;
    } finally {
      this.depth--;
    }
  }

  createBuild() {
    const build = this.applyHooks(null, "build", makeNewBuild(this));
    // Bind all functions so they can be dereferenced
    bindAll(
      build,
      Object.keys(build).filter(key => typeof build[key] === "function")
    );
    return build;
  }
}

const getBuilder = async (plugins, options) => {
  const builder = new SchemaBuilder();
  for (const plugin of plugins) {
    await plugin(builder, options);
  }
  return builder;
};

const buildSchema = async (plugins, options) => {
  const builder = await getBuilder(plugins, options);
  const build = builder.createBuild();
  return build.buildObjectWithHooks(GraphQLSchema, {});
};

exports.buildSchema = buildSchema;
