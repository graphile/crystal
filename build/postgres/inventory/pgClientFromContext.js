// TODO: Refactor this module, it has code smell…
"use strict";
const pg_1 = require('pg');
exports.$$pgClient = Symbol('postgres/client');
/**
 * Retrieves a Postgres client from a context, throwing an error if such a
 * client does not exist.
 */
function getPgClientFromContext(context) {
    if (context == null || typeof context !== 'object')
        throw new Error('Context must be an object.');
    const client = context[exports.$$pgClient];
    if (client == null)
        throw new Error('Postgres client does not exist on the context.');
    if (!(client instanceof pg_1.Client))
        throw new Error('Postgres client on context is of the incorrect type.');
    return client;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPgClientFromContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdDbGllbnRGcm9tQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvcGdDbGllbnRGcm9tQ29udGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpREFBaUQ7O0FBRWpELHFCQUF1QixJQUV2QixDQUFDLENBRjBCO0FBRWQsa0JBQVUsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUVuRDs7O0dBR0c7QUFDSCxnQ0FBZ0QsT0FBYztJQUM1RCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQztRQUNqRCxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUE7SUFFL0MsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGtCQUFVLENBQUMsQ0FBQTtJQUVsQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1FBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtJQUVuRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxZQUFZLFdBQU0sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQTtJQUV6RSxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQWJEO3dDQWFDLENBQUEifQ==