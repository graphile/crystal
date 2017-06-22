const debug = require("debug")("graphql-builder");
const makeNewBuild = require("./makeNewBuild");
const { bindAll } = require("./utils");
const INDENT = "  ";

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
    Object.freeze(build);
    return build;
  }
}

module.exports = SchemaBuilder;
