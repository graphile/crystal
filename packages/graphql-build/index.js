const debug = require("debug")("graphql-builder");
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const INDENT = "  ";

class SchemaBuilder {
  constructor() {
    // this.utils will be replaced by the 'utils' hooks, do not store
    // copies of it!
    this.utils = {
      buildObjectWithHooks: (Type, spec, scope = {}) => {
        let newSpec = spec;
        if (Type === GraphQLSchema) {
          newSpec = this.applyHooks("schema", newSpec, {
            scope,
          });
        } else if (Type === GraphQLObjectType) {
          newSpec = this.applyHooks("objectType", newSpec, {
            scope,
          });
          const rawSpec = newSpec;
          newSpec = Object.assign({}, newSpec, {
            fields: () =>
              this.applyHooks("objectType:fields", rawSpec.fields, {
                scope,
                Self,
                objectType: rawSpec,
              }),
          });
        }
        const Self = new Type(newSpec);
        return Self;
      },
      buildFieldWithHooks: (spec, scope = {}) => {
        let newSpec = spec;
        newSpec = this.applyHooks("field", newSpec, {
          scope,
        });
        newSpec = Object.assign({}, newSpec, {
          args: this.applyHooks("field:args", newSpec.args, {
            scope,
            field: newSpec,
          }),
        });
        return newSpec;
      },
    };

    // Because hooks can nest, this keeps track of how deep we are.
    this.depth = -1;

    this.hooks = {
      // The utils object is passed to all hooks, hook the 'utils' event to
      // extend this object:
      utils: [],

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
   * - utils - the global utils object (which contains a number of utilities)
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

  applyHooks(hookName, oldObj, context) {
    const isContext = hookName === "utils";
    if (isContext) this.utils = oldObj;

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
          newObj = hook(newObj, this.utils, context);
          if (!newObj) {
            throw new Error(`Hook for '${hookName}' returned falsy value`);
          }
          if (isContext) {
            this.utils = newObj;
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
  return builder.utils.buildObjectWithHooks(GraphQLSchema, {});
};

exports.buildSchema = buildSchema;
