"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeInitialInflection = void 0;
const tslib_1 = require("tslib");
const pluralize_1 = tslib_1.__importDefault(require("pluralize"));
const utils_js_1 = require("./utils.js");
/**
 * Builds the base inflection object that will be passed into the inflection
 * phase to build the final inflectors.
 */
const makeInitialInflection = () => ({
    pluralize: pluralize_1.default,
    singularize: pluralize_1.default.singular,
    upperCamelCase: utils_js_1.upperCamelCase,
    camelCase: utils_js_1.camelCase,
    constantCase: utils_js_1.constantCase,
    /**
     * Built-in names (allows you to override these in the output schema)
     *
     * e.g.:
     *
     * graphile-build:
     *
     * - Query
     * - Mutation
     * - Subscription
     * - Node
     * - PageInfo
     * - ...
     *
     * graphile-build-pg:
     *
     * - Interval
     * - BigInt
     * - BigFloat
     * - BitString
     * - Point
     * - Date
     * - Datetime
     * - Time
     * - JSON
     * - UUID
     * - InternetAddress
     * - ...
     *
     * Other plugins may add their own builtins too; try and avoid conflicts!
     */
    builtin(name) {
        return name;
    },
    /** Take a type name and return the edge type name */
    edgeType(typeName) {
        return typeName + `Edge`;
    },
    /** Take a type name and return the connection type name */
    connectionType(typeName) {
        return typeName + `Connection`;
    },
    /** The name of a field that returns a connection */
    connectionField(baseName) {
        return baseName;
    },
    /** The name of a field that returns a list */
    listField(baseName) {
        return baseName + "List";
    },
    /**
     * Try and make something a valid GraphQL 'Name'.
     *
     * Name is defined in GraphQL to match this regexp:
     *
     *     /^[_A-Za-z][_0-9A-Za-z]*$/
     *
     * See: https://graphql.github.io/graphql-spec/June2018/#sec-Appendix-Grammar-Summary.Lexical-Tokens
     */
    coerceToGraphQLName(name) {
        let resultingName = name;
        /*
         * If our 'name' starts with a digit, we must prefix it with
         * something. We'll just use an underscore.
         */
        if (resultingName.match(/^[0-9]/)) {
            resultingName = "_" + resultingName;
        }
        /*
         * Fields beginning with two underscores are reserved by the GraphQL
         * introspection systems, trim to just one.
         */
        resultingName = resultingName.replace(/^__+/g, "_");
        return resultingName;
    },
    /**
     * Given the name of a GraphQL output type, what name should we use for the
     * equivalent input type?
     */
    inputType(typeName) {
        return typeName + `Input`;
    },
});
exports.makeInitialInflection = makeInitialInflection;
//# sourceMappingURL=inflection.js.map