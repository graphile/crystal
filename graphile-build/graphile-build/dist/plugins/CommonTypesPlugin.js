"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonTypesPlugin = void 0;
require("graphile-config");
const utils_js_1 = require("../utils.js");
const version_js_1 = require("../version.js");
exports.CommonTypesPlugin = {
    name: "CommonTypesPlugin",
    description: "Registers common GraphQL utility types like BigInt, Datetime, UUID",
    version: version_js_1.version,
    schema: {
        hooks: {
            // ENHANCE: add "specifiedBy" configuration to custom scalars
            init(_, build) {
                const { options: { jsonScalarAsString }, inflection, stringTypeSpec, graphql: { Kind, GraphQLError }, } = build;
                build.registerScalarType(inflection.builtin("BigInt"), {}, () => stringTypeSpec(build.wrapDescription("A signed eight-byte integer. The upper big integer values are greater than the max value for a JavaScript number. Therefore all big integers will be output as strings and not numbers.", "type"), undefined, inflection.builtin("BigInt")), "graphile-build built-in (BigInt type)");
                build.registerCursorConnection?.({
                    typeName: "BigInt",
                    scope: {},
                    nonNullNode: false,
                });
                build.registerScalarType(inflection.builtin("BigFloat"), {}, () => stringTypeSpec(build.wrapDescription("A floating point number that requires more precision than IEEE 754 binary 64", "type"), undefined, inflection.builtin("BigFloat")), "graphile-build built-in (BigFloat type)");
                build.registerCursorConnection?.({
                    typeName: "BigFloat",
                    scope: {},
                    nonNullNode: false,
                });
                build.registerScalarType(inflection.builtin("Datetime"), {}, () => stringTypeSpec(build.wrapDescription("A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead to unexpected results.", "type"), undefined, inflection.builtin("Datetime")), "graphile-build built-in (Datetime type)");
                build.registerCursorConnection?.({
                    typeName: "Datetime",
                    scope: {},
                    nonNullNode: false,
                });
                build.registerScalarType(inflection.builtin("Date"), {}, () => stringTypeSpec(build.wrapDescription("A calendar date in YYYY-MM-DD format.", "type"), undefined, inflection.builtin("Date")), "graphile-build built-in (Datetype)");
                build.registerCursorConnection?.({
                    typeName: "Date",
                    scope: {},
                    nonNullNode: false,
                });
                build.registerScalarType(inflection.builtin("UUID"), {}, () => stringTypeSpec(build.wrapDescription("A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).", "type"), (0, utils_js_1.EXPORTABLE)((GraphQLError) => (string) => {
                    if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) {
                        throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hypens");
                    }
                    return string;
                }, [GraphQLError]), inflection.builtin("UUID")), "graphile-build built-in (UUID type)");
                build.registerCursorConnection?.({
                    typeName: "UUID",
                    scope: {},
                    nonNullNode: false,
                });
                if (jsonScalarAsString === true) {
                    build.registerScalarType(inflection.builtin("JSON"), {}, () => ({
                        description: build.wrapDescription("A JavaScript object encoded in the JSON format as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).", "type"),
                        parseLiteral: (0, utils_js_1.EXPORTABLE)((Kind) => ((ast, _variables) => {
                            if (ast.kind === Kind.STRING) {
                                return JSON.parse(ast.value);
                            }
                            else {
                                return undefined;
                            }
                        }), [Kind]),
                        parseValue: (0, utils_js_1.EXPORTABLE)(() => ((value) => JSON.parse(value)), []),
                        serialize: (0, utils_js_1.EXPORTABLE)(() => (value) => JSON.stringify(value), []),
                    }), "graphile-build built-in (JSON type; simple)");
                }
                else {
                    const parseLiteral = (0, utils_js_1.EXPORTABLE)((Kind) => {
                        const parseLiteralToObject = (ast, variables) => {
                            switch (ast.kind) {
                                case Kind.STRING:
                                case Kind.BOOLEAN:
                                    return ast.value;
                                case Kind.INT:
                                case Kind.FLOAT:
                                    return parseFloat(ast.value);
                                case Kind.OBJECT: {
                                    const value = Object.create(null);
                                    ast.fields.forEach((field) => {
                                        value[field.name.value] = parseLiteralToObject(field.value, variables);
                                    });
                                    return value;
                                }
                                case Kind.LIST:
                                    return ast.values.map((n) => parseLiteralToObject(n, variables));
                                case Kind.NULL:
                                    return null;
                                case Kind.VARIABLE: {
                                    const name = ast.name.value;
                                    return variables ? variables[name] : undefined;
                                }
                                default:
                                    return undefined;
                            }
                        };
                        return parseLiteralToObject;
                    }, [Kind]);
                    build.registerScalarType(inflection.builtin("JSON"), {}, () => ({
                        description: `Represents JSON values as specified by ` +
                            "[ECMA-404](http://www.ecma-international.org/" +
                            "publications/files/ECMA-ST/ECMA-404.pdf).",
                        serialize: (0, utils_js_1.EXPORTABLE)(() => (value) => value, []),
                        parseValue: (0, utils_js_1.EXPORTABLE)(() => (value) => value, []),
                        parseLiteral,
                    }), "graphile-build built-in (JSON type; extended)");
                }
                build.registerCursorConnection?.({
                    typeName: "JSON",
                    scope: {},
                    nonNullNode: false,
                });
                build.registerScalarType(inflection.builtin("XML"), {}, () => stringTypeSpec(build.wrapDescription("An XML document", "type"), undefined, inflection.builtin("XML")), "graphile-build built-in (XML type)");
                build.registerCursorConnection?.({
                    typeName: "XML",
                    scope: {},
                    nonNullNode: false,
                });
                return _;
            },
        },
    },
};
//# sourceMappingURL=CommonTypesPlugin.js.map