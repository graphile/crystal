// TODO: Refactor this module, it has code smell…
"use strict";
var pg_1 = require("pg");
exports.$$pgClient = Symbol('postgres/client');
/**
 * Retrieves a Postgres client from a context, throwing an error if such a
 * client does not exist.
 */
function getPgClientFromContext(context) {
    if (context == null || typeof context !== 'object')
        throw new Error('Context must be an object.');
    var client = context[exports.$$pgClient];
    if (client == null)
        throw new Error('Postgres client does not exist on the context.');
    if (!(client instanceof pg_1.Client))
        throw new Error('Postgres client on context is of the incorrect type.');
    return client;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPgClientFromContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdDbGllbnRGcm9tQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvcGdDbGllbnRGcm9tQ29udGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpREFBaUQ7O0FBRWpELHlCQUEyQjtBQUVkLFFBQUEsVUFBVSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRW5EOzs7R0FHRztBQUNILGdDQUFnRCxPQUFjO0lBQzVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDO1FBQ2pELE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtJQUUvQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsa0JBQVUsQ0FBQyxDQUFBO0lBRWxDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7UUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFBO0lBRW5FLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLFlBQVksV0FBTSxDQUFDLENBQUM7UUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO0lBRXpFLE1BQU0sQ0FBQyxNQUFNLENBQUE7QUFDZixDQUFDOztBQWJELHlDQWFDIn0=