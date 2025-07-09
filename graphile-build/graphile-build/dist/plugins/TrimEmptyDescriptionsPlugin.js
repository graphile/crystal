"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimEmptyDescriptionsPlugin = void 0;
require("graphile-config");
/**
 * Sets the 'description' attribute to null if it's the empty string; useful
 * for cleaning up the schema as printing a schema with a lot of empty string
 * descriptions is u.g.l.y.
 */
function rmEmptyTypeDescription(type) {
    if (type.description?.trim() === "") {
        type.description = null;
    }
    return type;
}
/**
 * Sets the 'description' attribute to null if it's the empty string; useful
 * for cleaning up the schema as printing a schema with a lot of empty string
 * descriptions is u.g.l.y.
 */
function rmEmptyFieldDescription(field) {
    if (field.description === "") {
        field.description = null;
    }
    return field;
}
/**
 * Sets the 'description' attribute to null if it's the empty string; useful
 * for cleaning up the schema as printing a schema with a lot of empty string
 * descriptions is u.g.l.y.
 */
function rmEmptyArgDescriptions(arg) {
    if (arg.description === "") {
        arg.description = null;
    }
    return arg;
}
exports.TrimEmptyDescriptionsPlugin = {
    name: "TrimEmptyDescriptionsPlugin",
    description: "Trims the 'description' property from types, field and args that have an empty description",
    version: "1.0.0",
    schema: {
        hooks: {
            GraphQLObjectType: rmEmptyTypeDescription,
            GraphQLObjectType_fields_field: rmEmptyFieldDescription,
            GraphQLObjectType_fields_field_args_arg: rmEmptyArgDescriptions,
            GraphQLInputObjectType: rmEmptyTypeDescription,
            GraphQLInputObjectType_fields_field: rmEmptyFieldDescription,
            GraphQLUnionType: rmEmptyTypeDescription,
            GraphQLInterfaceType: rmEmptyTypeDescription,
            GraphQLInterfaceType_fields_field: rmEmptyFieldDescription,
            GraphQLInterfaceType_fields_field_args_arg: rmEmptyArgDescriptions,
            GraphQLEnumType: rmEmptyTypeDescription,
        },
    },
};
//# sourceMappingURL=TrimEmptyDescriptionsPlugin.js.map