const debug = require("debug")("graphql-builder");
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

const INDENT = "  ";

class SchemaBuilder {
  constructor() {
    // this.context will be replaced by the 'context' hooks, do not store
    // copies of it!
    this.context = {
      buildObjectWithHooks(Type, spec, scope = {}) {
        let newSpec = spec;
        if (Type === GraphQLSchema) {
          newSpec = this.applyHooks("schema", newSpec, {
            spec: newSpec,
            scope,
          });
        } else if (Type === GraphQLObjectType) {
          newSpec = this.applyHooks("objectType", newSpec, {
            scope,
          });
          const rawSpec = newSpec;
          newSpec = Object.assign({}, newSpec, {
            fields: () => {
              const fields = this.applyHooks(
                "objectType:fields",
                rawSpec.fields,
                {
                  scope,
                  Self,
                }
              );
              return Object.keys(fields).reduce((memo, fieldName) => {
                const field = this.applyHooks(
                  "objectType:field",
                  fields[fieldName],
                  {
                    scope,
                    Self,
                  }
                );
                memo[fieldName] = field;
                return memo;
              }, {});
            },
          });
        }
        const Self = new Type(newSpec);
        return Self;
      },
    };

    // Because hooks can nest, this keeps track of how deep we are.
    this.depth = -1;

    this.hooks = {
      // The context object is passed to all hooks, hook the 'context' event to
      // extend this object:
      context: [],

      // Add 'query', 'mutation' or 'subscription' types in this hook:
      schema: [],

      // When creating a GraphQLObjectType we'll execute, in order, the
      // following hooks:
      // - 'objectType' to add any root-level attributes, e.g. add a description
      // - 'objectType:fields' to add fields to this object type
      // - 'objectType:field' to enhance an individual field
      objectType: [],
      "objectType:fields": [],
      "objectType:field": [],
    };
  }

  /*
   * Every hook `fn` takes three arguments:
   * - obj - the object currently being inspected
   * - context - the global context object (which contains a number of utilities)
   * - scope - information specific to the current invocation of the hook
   *
   * The function must either return a replacement object for `obj` or `obj` itself
   */
  hook(hookName, fn) {
    if (!this.hooks[hookName]) {
      throw new Error(`Sorry, '${hookName}' is not a supported hook`);
    }
    this.hooks[hookName].push(fn);
  }

  applyHooks(hookName, oldObj, scope) {
    const isContext = hookName === "context";
    if (isContext) this.context = oldObj;

    this.depth++;
    debug(`${INDENT.repeat(this.depth)}[${hookName}]: Running...`);

    const hooks = this.hooks[hookName];
    if (!hooks) {
      throw new Error(`Sorry, '${hookName}' is not a registered hook`);
    }

    let newObj = oldObj;
    for (const hook of hooks) {
      newObj = hook(newObj, this.context, scope);
      if (!newObj) {
        throw new Error(`Hook for '${hookName}' returned falsy value`);
      }
      if (isContext) {
        this.context = newObj;
      }
    }

    debug(`${INDENT.repeat(this.depth)}[${hookName}]: Complete`);
    this.depth--;

    return newObj;
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
  return builder.context.buildObjectWithHooks(GraphQLSchema, {});
};

exports.buildSchema = buildSchema;
