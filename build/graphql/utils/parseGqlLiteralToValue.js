"use strict";
var graphql_1 = require("graphql");
/**
 * Parses a GraphQL AST literal into a JavaScript value.
 *
 * @private
 */
function parseGqlLiteralToValue(ast) {
    switch (ast.kind) {
        case graphql_1.Kind.STRING:
        case graphql_1.Kind.BOOLEAN:
            return ast.value;
        case graphql_1.Kind.INT:
        case graphql_1.Kind.FLOAT:
            return parseFloat(ast.value);
        case graphql_1.Kind.OBJECT: {
            return ast.fields.reduce(function (object, field) {
                object[field.name.value] = parseGqlLiteralToValue(field.value);
                return object;
            }, {});
        }
        case graphql_1.Kind.LIST:
            return ast.values.map(function (value) { return parseGqlLiteralToValue(value); });
        default:
            return null;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseGqlLiteralToValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VHcWxMaXRlcmFsVG9WYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3V0aWxzL3BhcnNlR3FsTGl0ZXJhbFRvVmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUF5QztBQUV6Qzs7OztHQUlHO0FBQ0gsZ0NBQWdELEdBQWM7SUFDNUQsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakIsS0FBSyxjQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2pCLEtBQUssY0FBSSxDQUFDLE9BQU87WUFDZixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQTtRQUNsQixLQUFLLGNBQUksQ0FBQyxHQUFHLENBQUM7UUFDZCxLQUFLLGNBQUksQ0FBQyxLQUFLO1lBQ2IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDOUIsS0FBSyxjQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUs7Z0JBQ3JDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDOUQsTUFBTSxDQUFDLE1BQU0sQ0FBQTtZQUNmLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUNSLENBQUM7UUFDRCxLQUFLLGNBQUksQ0FBQyxJQUFJO1lBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsc0JBQXNCLENBQUMsS0FBSyxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQTtRQUMvRDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFDZixDQUFDO0FBQ0gsQ0FBQzs7QUFuQkQseUNBbUJDIn0=