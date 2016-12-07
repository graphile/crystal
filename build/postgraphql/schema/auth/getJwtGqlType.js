"use strict";
const jsonwebtoken_1 = require('jsonwebtoken');
const graphql_1 = require('graphql');
const utils_1 = require('../../../graphql/utils');
const utils_2 = require('../../../postgres/utils');
/**
 * Gets a JWT GraphQL scalar type from an object type. Every time this type is
 * serialized, a new token will be signed.
 */
const getJwtGqlType = utils_1.memoize2(_createJwtGqlType);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getJwtGqlType;
// TODO: Can we make a type that represents an object type possible wrapped in
// nullable types? We really need to improve the types for our type system...
function _createJwtGqlType(type, jwtSecret) {
    return new graphql_1.GraphQLScalarType({
        name: utils_1.formatName.type(type.getNamedType().name),
        description: 'A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519) ' +
            'which securely represents claims between two parties.',
        serialize: value => value instanceof Map ? jsonwebtoken_1.sign(utils_2.mapToObject(value), jwtSecret, {
            audience: 'postgraphql',
            issuer: 'postgraphql',
            expiresIn: value.get('exp') ? undefined : '1 day',
        }) : null,
    });
}
exports._createJwtGqlType = _createJwtGqlType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Snd0R3FsVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9zY2hlbWEvYXV0aC9nZXRKd3RHcWxUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrQkFBZ0MsY0FDaEMsQ0FBQyxDQUQ2QztBQUM5QywwQkFBa0MsU0FDbEMsQ0FBQyxDQUQwQztBQUUzQyx3QkFBcUMsd0JBQ3JDLENBQUMsQ0FENEQ7QUFDN0Qsd0JBQTRCLHlCQU01QixDQUFDLENBTm9EO0FBRXJEOzs7R0FHRztBQUNILE1BQU0sYUFBYSxHQUFHLGdCQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUVqRDtrQkFBZSxhQUFhLENBQUE7QUFFNUIsOEVBQThFO0FBQzlFLDZFQUE2RTtBQUM3RSwyQkFBbUMsSUFBaUIsRUFBRSxTQUFpQjtJQUNyRSxNQUFNLENBQUMsSUFBSSwyQkFBaUIsQ0FBUTtRQUNsQyxJQUFJLEVBQUUsa0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQztRQUMvQyxXQUFXLEVBQ1QsOEVBQThFO1lBQzlFLHVEQUF1RDtRQUN6RCxTQUFTLEVBQUUsS0FBSyxJQUNkLEtBQUssWUFBWSxHQUFHLEdBQUcsbUJBQU8sQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRTtZQUM1RCxRQUFRLEVBQUUsYUFBYTtZQUN2QixNQUFNLEVBQUUsYUFBYTtZQUNyQixTQUFTLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLEdBQUcsT0FBTztTQUNsRCxDQUFDLEdBQUcsSUFBSTtLQUNaLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFiZSx5QkFBaUIsb0JBYWhDLENBQUEifQ==