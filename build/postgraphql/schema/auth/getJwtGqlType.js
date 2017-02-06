"use strict";
var jsonwebtoken_1 = require("jsonwebtoken");
var graphql_1 = require("graphql");
var utils_1 = require("../../../graphql/utils");
var _getJwtGqlType = utils_1.memoize2(_createJwtGqlType);
/**
 * Gets a JWT GraphQL scalar type from an object type. Every time this type is
 * serialized, a new token will be signed.
 */
function getJwtGqlType(type, jwtSecret) {
    return _getJwtGqlType(type, jwtSecret);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getJwtGqlType;
// TODO: Can we make a type that represents an object type possible wrapped in
// nullable types? We really need to improve the types for our type system...
function _createJwtGqlType(type, jwtSecret) {
    return new graphql_1.GraphQLScalarType({
        name: utils_1.formatName.type(type.name),
        description: 'A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) ' +
            'which securely represents claims between two parties.',
        serialize: function (value) {
            var token = {};
            type.fields.forEach(function (field, fieldName) {
                token[fieldName] = field.getValue(value);
            });
            return jsonwebtoken_1.sign(token, jwtSecret, {
                audience: 'postgraphql',
                issuer: 'postgraphql',
                expiresIn: token['exp'] ? undefined : '1 day',
            });
        },
    });
}
exports._createJwtGqlType = _createJwtGqlType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Snd0R3FsVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9zY2hlbWEvYXV0aC9nZXRKd3RHcWxUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw2Q0FBOEM7QUFDOUMsbUNBQTJDO0FBRTNDLGdEQUE2RDtBQUU3RCxJQUFNLGNBQWMsR0FBRyxnQkFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFFbEQ7OztHQUdHO0FBQ0gsdUJBQWdDLElBQXdCLEVBQUUsU0FBaUI7SUFDekUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDeEMsQ0FBQzs7QUFFRCxrQkFBZSxhQUFhLENBQUE7QUFFNUIsOEVBQThFO0FBQzlFLDZFQUE2RTtBQUM3RSwyQkFBMkMsSUFBd0IsRUFBRSxTQUFpQjtJQUNwRixNQUFNLENBQUMsSUFBSSwyQkFBaUIsQ0FBQztRQUMzQixJQUFJLEVBQUUsa0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNoQyxXQUFXLEVBQ1QsOEVBQThFO1lBQzlFLHVEQUF1RDtRQUN6RCxTQUFTLEVBQUUsVUFBQSxLQUFLO1lBQ2QsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFBO1lBRWhCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLFNBQVM7Z0JBQ25DLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzFDLENBQUMsQ0FBQyxDQUFBO1lBRUYsTUFBTSxDQUFDLG1CQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtnQkFDL0IsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLE1BQU0sRUFBRSxhQUFhO2dCQUNyQixTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsR0FBRyxPQUFPO2FBQzlDLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDO0FBcEJELDhDQW9CQyJ9