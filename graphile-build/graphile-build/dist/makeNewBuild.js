"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = makeNewBuild;
const tslib_1 = require("tslib");
require("./global.js");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const graphql_1 = require("grafast/graphql");
const semver = tslib_1.__importStar(require("semver"));
const extend_js_1 = tslib_1.__importStar(require("./extend.js"));
const utils_js_1 = require("./utils.js");
const version_js_1 = require("./version.js");
const BUILTINS = ["Int", "Float", "Boolean", "ID", "String"];
/** Have we warned the user they're using the 5-arg deprecated registerObjectType call? */
let registerObjectType5argsDeprecatedWarned = false;
/**
 * Makes a new 'Build' object suitable to be passed through the 'build' hook.
 */
function makeNewBuild(builder, input, inflection) {
    const lib = builder.resolvedPreset.lib ?? {};
    const building = new Set();
    const allTypes = {
        Int: graphql_1.GraphQLInt,
        Float: graphql_1.GraphQLFloat,
        String: graphql_1.GraphQLString,
        Boolean: graphql_1.GraphQLBoolean,
        ID: graphql_1.GraphQLID,
    };
    const allTypesSources = {
        Int: "GraphQL Built-in",
        Float: "GraphQL Built-in",
        String: "GraphQL Built-in",
        Boolean: "GraphQL Built-in",
        ID: "GraphQL Built-in",
    };
    /**
     * Where the type factories are; so we don't construct types until they're needed.
     */
    const typeRegistry = Object.create(null);
    const scopeByType = new Map();
    // TODO: allow registering a previously constructed type.
    function register(klass, typeName, scope, specGenerator, origin) {
        if (!this.status.isBuildPhaseComplete || this.status.isInitPhaseComplete) {
            throw new Error("Types may only be registered in the 'init' phase");
        }
        if (!typeName) {
            throw new Error(`Attempted to register a ${klass.name} with empty (or falsy) type name`);
        }
        const newTypeSource = origin || `'addType' call during hook '${build.status.currentHookName}'`;
        if (allTypesSources[typeName]) {
            const oldTypeSource = allTypesSources[typeName];
            const firstEntityDetails = !oldTypeSource
                ? "The first type was registered from an unknown origin."
                : `The first entity was:\n\n${(0, extend_js_1.indent)(chalk_1.default.magenta(oldTypeSource))}`;
            const secondEntityDetails = !newTypeSource
                ? "The second type was registered from an unknown origin."
                : `The second entity was:\n\n${(0, extend_js_1.indent)(chalk_1.default.yellow(newTypeSource))}`;
            throw new Error(`A type naming conflict has occurred - two entities have tried to define the same type '${chalk_1.default.bold(typeName)}'.\n\n${(0, extend_js_1.indent)(firstEntityDetails)}\n\n${(0, extend_js_1.indent)(secondEntityDetails)}`);
        }
        allTypesSources[typeName] = newTypeSource;
        typeRegistry[typeName] = {
            typeName,
            klass,
            scope,
            specGenerator,
            origin,
        };
    }
    const build = {
        lib,
        // Legacy support for things from lib
        EXPORTABLE: lib.graphileBuild.EXPORTABLE,
        exportNameHint: lib.graphileBuild.exportNameHint,
        EXPORTABLE_OBJECT_CLONE: lib.graphileBuild.EXPORTABLE_OBJECT_CLONE,
        grafast: lib.grafast,
        graphql: lib.graphql,
        options: builder.options,
        versions: {
            grafast: lib.grafast.version,
            graphql: lib.graphql.version,
            "graphile-build": version_js_1.version,
        },
        input,
        hasVersion(packageName, range, options = { includePrerelease: true }) {
            const packageVersion = this.versions[packageName];
            if (!packageVersion)
                return false;
            return semver.satisfies(packageVersion, range, options);
        },
        extend(base, extra, hint, behaviorOnConflict = "throw") {
            try {
                return (0, extend_js_1.default)(base, extra, hint);
            }
            catch (e) {
                if (behaviorOnConflict === "recoverable") {
                    this.handleRecoverableError(e);
                    return base;
                }
                else {
                    throw e;
                }
            }
        },
        getAllTypes() {
            return allTypes;
        },
        scopeByType,
        inflection,
        handleRecoverableError(e) {
            e["recoverable"] = true;
            throw e;
        },
        recoverable(value, callback) {
            try {
                return callback();
            }
            catch (e) {
                this.handleRecoverableError(e);
                return value;
            }
        },
        status: {
            isBuildPhaseComplete: false,
            isInitPhaseComplete: false,
            currentHookName: null,
            currentHookEvent: null,
        },
        wrapDescription: utils_js_1.wrapDescription,
        stringTypeSpec: utils_js_1.stringTypeSpec,
        registerObjectType(typeName, scope, assertStepOrSpecGenerator, specGeneratorOrOrigin, possiblyOrigin) {
            if (typeof specGeneratorOrOrigin === "function") {
                // This is the `@deprecated` path; we'll be removing this
                if (!registerObjectType5argsDeprecatedWarned) {
                    registerObjectType5argsDeprecatedWarned = true;
                    console.trace(`[DEPRECATED] There is a call to 'registerObject(typeName, scope, assertStep, specGenerator, origin)'; this signature has been deprecated. Please move 'assertStep' into the spec returned by 'stepGenerator' and remove the third argument to give:  'registerObject(typeName, scope, specGenerator, origin)'. This compatibility shim will not be supported for long.`);
                }
                const assertStep = assertStepOrSpecGenerator;
                const specGenerator = specGeneratorOrOrigin;
                const origin = possiblyOrigin;
                const replacementSpecGenerator = (...args) => {
                    const spec = specGenerator(...args);
                    return {
                        assertStep,
                        ...spec,
                    };
                };
                register.call(this, graphql_1.GraphQLObjectType, typeName, scope, replacementSpecGenerator, origin);
            }
            else {
                const specGenerator = assertStepOrSpecGenerator;
                const origin = specGeneratorOrOrigin;
                register.call(this, graphql_1.GraphQLObjectType, typeName, scope, specGenerator, origin);
            }
        },
        registerUnionType(typeName, scope, specGenerator, origin) {
            register.call(this, graphql_1.GraphQLUnionType, typeName, scope, specGenerator, origin);
        },
        registerInterfaceType(typeName, scope, specGenerator, origin) {
            register.call(this, graphql_1.GraphQLInterfaceType, typeName, scope, specGenerator, origin);
        },
        registerInputObjectType(typeName, scope, specGenerator, origin) {
            register.call(this, graphql_1.GraphQLInputObjectType, typeName, scope, specGenerator, origin);
        },
        registerScalarType(typeName, scope, specGenerator, origin) {
            register.call(this, graphql_1.GraphQLScalarType, typeName, scope, specGenerator, origin);
        },
        registerEnumType(typeName, scope, specGenerator, origin) {
            register.call(this, graphql_1.GraphQLEnumType, typeName, scope, specGenerator, origin);
        },
        assertTypeName(typeName) {
            if (!this.status.isBuildPhaseComplete) {
                throw new Error("Must not call build.assertTypeName before 'build' phase is complete; use 'init' phase instead");
            }
            if (typeName in allTypesSources) {
                return true;
            }
            else {
                throw new Error(`Type name '${typeName}' is not registered - be sure to register the type before you attempt to reference it.`);
            }
        },
        getTypeMetaByName(typeName) {
            if (!this.status.isBuildPhaseComplete) {
                throw new Error("Must not call build.getTypeMetaByName before 'build' phase is complete; use 'init' phase instead");
            }
            // Meta for builtins
            switch (typeName) {
                case "String":
                case "ID":
                case "Boolean":
                case "Int":
                case "Float":
                    return Object.assign(Object.create(null), {
                        Constructor: graphql_1.GraphQLScalarType,
                        scope: Object.freeze({}),
                        origin: "GraphQL builtin",
                        specGenerator: () => {
                            switch (typeName) {
                                case "String":
                                    return graphql_1.GraphQLString.toConfig();
                                case "ID":
                                    return graphql_1.GraphQLID.toConfig();
                                case "Boolean":
                                    return graphql_1.GraphQLBoolean.toConfig();
                                case "Int":
                                    return graphql_1.GraphQLInt.toConfig();
                                case "Float":
                                    return graphql_1.GraphQLFloat.toConfig();
                                default: {
                                    throw new Error(`Unhandled built-in '${typeName}'`);
                                }
                            }
                        },
                    });
            }
            const details = typeRegistry[typeName];
            if (details != null) {
                const { klass: Constructor, scope, origin, specGenerator } = details;
                return Object.assign(Object.create(null), {
                    Constructor,
                    scope,
                    origin,
                    specGenerator,
                });
            }
            return null;
        },
        getTypeByName(typeName) {
            if (currentTypeDetails && !BUILTINS.includes(typeName)) {
                throw new Error(`Error in spec callback for ${currentTypeDetails.klass.name} '${currentTypeDetails.typeName}'; the callback made a call to \`build.getTypeByName(${JSON.stringify(typeName)})\` (directly or indirectly) - this is the wrong time for such a call \
to occur since it can lead to circular dependence. To fix this, ensure that any \
calls to \`getTypeByName\` can only occur inside of the callbacks, such as \
\`fields()\`, \`interfaces()\`, \`types()\` or similar. Be sure to use the callback \
style for these configuration options (e.g. change \`interfaces: \
[getTypeByName('Foo')]\` to \`interfaces: () => [getTypeByName('Foo')]\``);
            }
            if (!this.status.isInitPhaseComplete) {
                throw new Error(mustUseThunkMessage("build.getTypeByName"));
            }
            if (typeName in allTypes) {
                return allTypes[typeName];
            }
            else if (building.has(typeName)) {
                throw new Error(`Construction cycle detected: ${typeName} is already being built (build stack: ${[
                    ...building,
                ].join(">")}). Most likely this means that you forgot to use a callback for 'fields', 'interfaces', 'types', etc. when defining a type.`);
            }
            else {
                building.add(typeName);
                try {
                    const details = typeRegistry[typeName];
                    if (details != null) {
                        const { klass, scope } = details;
                        const spec = generateSpecFromDetails(details);
                        // No need to have the user specify name, and they're forbidden from
                        // changing name (use inflection instead!) so we just set it
                        // ourselves:
                        spec.name = typeName;
                        const finishedBuild = build;
                        const type = builder.newWithHooks(finishedBuild, klass, spec, scope);
                        allTypes[typeName] = type;
                        if (klass === graphql_1.GraphQLObjectType ||
                            klass === graphql_1.GraphQLInputObjectType) {
                            // Perform fields check. It's critical that `allTypes[typeName]` is
                            // set above this to prevent infinite loops in case one of our
                            // fields is dependent on another type, which is in turn dependent
                            // on this type - in this case we know there's at least one field
                            // otherwise the conflict would not occur?
                            if (Object.keys(type.getFields()).length === 0) {
                                allTypes[typeName] = null;
                                return null;
                            }
                        }
                        if (klass === graphql_1.GraphQLEnumType) {
                            // Perform values check.
                            if (Object.keys(type.getValues()).length === 0) {
                                allTypes[typeName] = null;
                                return null;
                            }
                        }
                        return type;
                    }
                    else {
                        allTypes[typeName] = undefined;
                        return undefined;
                    }
                }
                catch (e) {
                    // Error occurred, store null
                    allTypes[typeName] = null;
                    // Rethrow error
                    throw e;
                }
                finally {
                    building.delete(typeName);
                }
            }
        },
        getInputTypeByName(typeName) {
            if (!this.status.isInitPhaseComplete) {
                throw new Error(mustUseThunkMessage("build.getInputTypeByName"));
            }
            const type = this.getTypeByName(typeName);
            if (!type) {
                throw new Error(`Expected an input type named '${typeName}', but ${this.getTypeMetaByName(typeName)
                    ? `that type was not successfully constructed; typically this is because it ended up with no fields.`
                    : `a type with that name has not been registered.`}`);
            }
            if (!(0, graphql_1.isInputType)(type)) {
                throw new Error(`Expected '${typeName}' to be an input type, but it isn't (${String(type)})`);
            }
            return type;
        },
        getOutputTypeByName(typeName) {
            if (!this.status.isInitPhaseComplete) {
                throw new Error(mustUseThunkMessage("build.getOutputTypeByName"));
            }
            const type = this.getTypeByName(typeName);
            if (!type) {
                throw new Error(`Expected an output type named '${typeName}', but ${this.getTypeMetaByName(typeName)
                    ? `that type was not successfully constructed; typically this is because it ended up with no fields.`
                    : `a type with that name has not been registered.`}`);
            }
            if (!(0, graphql_1.isOutputType)(type)) {
                throw new Error(`Expected '${typeName}' to be an output type, but it isn't (${String(type)})`);
            }
            return type;
        },
        nullableIf(condition, type) {
            if (condition) {
                return type;
            }
            else {
                return new graphql_1.GraphQLNonNull(type);
            }
        },
        assertValidName(name, message, args = [], allowDoubleUnderscorePrefix = false) {
            try {
                (0, graphql_1.assertName)(name);
                if (!allowDoubleUnderscorePrefix && name.startsWith("__")) {
                    throw new Error(`Names beginning with two underscores are reserved for introspection.`);
                }
            }
            catch (e) {
                const placeholders = [name, ...args];
                const msg = message.replace(/\$([0-9]+)/g, (_, n) => n == "0" ? JSON.stringify(name) : (placeholders[n] ?? _));
                throw new TypeError(msg + " " + e.message);
            }
            return name;
        },
        _pluginMeta: Object.create(null),
    };
    return build;
}
let currentTypeDetails = null;
function generateSpecFromDetails(details) {
    currentTypeDetails = details;
    try {
        return details.specGenerator();
    }
    finally {
        currentTypeDetails = null;
    }
}
function mustUseThunkMessage(fn) {
    return ("Must not call " +
        fn +
        " before 'init' phase is complete; please be sure to use the 'thunk' configuration method for GraphQL types (e.g. instead of `fields: { /* ... */ }` use `fields: () => ({ /* ... */ })`), and be sure to only call " +
        fn +
        " from inside a thunk.");
}
//# sourceMappingURL=makeNewBuild.js.map