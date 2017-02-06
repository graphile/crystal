"use strict";
var utils_1 = require("../../../postgres/utils");
/**
 * Creates the actual Postgres procedure call using the fixtures created with
 * `createPgProcedureFixtures`.
 *
 * The input is an array of values. Not GraphQL input values, but actual
 * values that correspond to the procedure arguments.
 *
 * It will also check to see the minimum number of values we can use to call
 * the function. This way defaults can kick in.
 */
// TODO: test
function createPgProcedureSqlCall(fixtures, values, firstArgumentIsTableName) {
    if (firstArgumentIsTableName === void 0) { firstArgumentIsTableName = false; }
    if (values.length !== fixtures.args.length)
        throw new Error('Input tuple is of the incorrect length for procedure call.');
    // The last argument that is not null, excluding the value at this index.
    var lastArgIdx = values.length;
    // Reverse loop through our values. We want to see what arguments have
    // defaults that we can skip when generating the call.
    for (var i = values.length - 1; i >= 0; i--) {
        // If the value at this index is nullish, set the `lastArgIdx` to `i` and
        // continue.
        if (values[i] == null)
            lastArgIdx = i;
        else
            break;
    }
    var procedureName = utils_1.sql.identifier(fixtures.pgNamespace.name, fixtures.pgProcedure.name);
    var procedureArgs = fixtures.args
        .slice(0, Math.max(lastArgIdx, fixtures.args.length - fixtures.pgProcedure.argDefaultsNum))
        .map(function (_a, i) {
        var type = _a.type;
        return (firstArgumentIsTableName && i === 0) ? utils_1.sql.identifier(values[i]) : type.transformValueIntoPgValue(values[i]);
    });
    return (_a = ["", "(", ")"], _a.raw = ["", "(", ")"], utils_1.sql.query(_a, procedureName, utils_1.sql.join(procedureArgs, ', ')));
    var _a;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureSqlCall;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVTcWxDYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL3NjaGVtYS9wcm9jZWR1cmVzL2NyZWF0ZVBnUHJvY2VkdXJlU3FsQ2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaURBQTZDO0FBRzdDOzs7Ozs7Ozs7R0FTRztBQUNILGFBQWE7QUFDYixrQ0FDRSxRQUE2QixFQUM3QixNQUFvQixFQUNwQix3QkFBeUM7SUFBekMseUNBQUEsRUFBQSxnQ0FBeUM7SUFFekMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QyxNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUE7SUFFL0UseUVBQXlFO0lBQ3pFLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUE7SUFFOUIsc0VBQXNFO0lBQ3RFLHNEQUFzRDtJQUN0RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDNUMseUVBQXlFO1FBQ3pFLFlBQVk7UUFDWixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO1lBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTtRQUVyQyxJQUFJO1lBQUMsS0FBSyxDQUFBO0lBQ1osQ0FBQztJQUVELElBQU0sYUFBYSxHQUFHLFdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxRixJQUFNLGFBQWEsR0FDakIsUUFBUSxDQUFDLElBQUk7U0FDVixLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDMUYsR0FBRyxDQUFDLFVBQUMsRUFBUSxFQUFFLENBQUM7WUFBVCxjQUFJO1FBQVUsT0FBQSxDQUFDLHdCQUF3QixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxXQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFBN0csQ0FBNkcsQ0FBQyxDQUFBO0lBRXhJLE1BQU0saUNBQVUsRUFBRyxFQUFhLEdBQUksRUFBNkIsR0FBRyxHQUE3RCxXQUFHLENBQUMsS0FBSyxLQUFHLGFBQWEsRUFBSSxXQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsR0FBRzs7QUFDdEUsQ0FBQzs7QUE1QkQsMkNBNEJDIn0=