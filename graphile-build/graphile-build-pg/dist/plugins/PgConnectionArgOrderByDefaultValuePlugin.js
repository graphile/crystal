"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgConnectionArgOrderByDefaultValuePlugin = void 0;
require("./PgTablesPlugin.js");
require("graphile-config");
const version_js_1 = require("../version.js");
exports.PgConnectionArgOrderByDefaultValuePlugin = {
    name: "PgConnectionArgOrderByDefaultValuePlugin",
    description: "Sets the default 'orderBy' for a table",
    version: version_js_1.version,
    schema: {
        hooks: {
            GraphQLObjectType_fields_field_args_arg(arg, build, context) {
                const { extend, getTypeByName, inflection } = build;
                const { scope: { fieldName, isPgFieldConnection, pgFieldResource: pgResource, argName, }, Self, } = context;
                if (argName !== "orderBy") {
                    return arg;
                }
                if (!isPgFieldConnection ||
                    !pgResource ||
                    !pgResource.codec.attributes ||
                    pgResource.parameters) {
                    return arg;
                }
                const tableTypeName = inflection.tableType(pgResource.codec);
                const TableOrderByType = getTypeByName(inflection.orderByType(tableTypeName));
                if (!TableOrderByType) {
                    return arg;
                }
                const primaryKeyAsc = inflection.builtin("PRIMARY_KEY_ASC");
                const defaultValueEnum = TableOrderByType.getValues().find((v) => v.name === primaryKeyAsc) ||
                    TableOrderByType.getValues()[0];
                if (!defaultValueEnum) {
                    return arg;
                }
                return extend(arg, {
                    defaultValue: defaultValueEnum && [defaultValueEnum.value],
                }, `Adding defaultValue to orderBy for field '${fieldName}' of '${Self.name}'`);
            },
        },
    },
};
//# sourceMappingURL=PgConnectionArgOrderByDefaultValuePlugin.js.map