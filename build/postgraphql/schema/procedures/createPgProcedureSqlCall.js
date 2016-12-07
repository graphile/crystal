"use strict";
const utils_1 = require('../../../postgres/utils');
const transformValueIntoPgValue_1 = require('../../../postgres/inventory/transformValueIntoPgValue');
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
function createPgProcedureSqlCall(fixtures, values) {
    if (values.length !== fixtures.args.length)
        throw new Error('Input tuple is of the incorrect length for procedure call.');
    // The last argument that is not null, excluding the value at this index.
    let lastArgIdx = values.length;
    // Reverse loop through our values. We want to see what arguments have
    // defaults that we can skip when generating the call.
    for (let i = values.length - 1; i >= 0; i--) {
        // If the value at this index is nullish, set the `lastArgIdx` to `i` and
        // continue.
        if (values[i] == null)
            lastArgIdx = i;
        else
            break;
    }
    const procedureName = utils_1.sql.identifier(fixtures.pgNamespace.name, fixtures.pgProcedure.name);
    const procedureArgs = fixtures.args
        .slice(0, Math.max(lastArgIdx, fixtures.args.length - fixtures.pgProcedure.argDefaultsNum))
        .map(({ type }, i) => transformValueIntoPgValue_1.default(type, values[i]));
    return utils_1.sql.query `${procedureName}(${utils_1.sql.join(procedureArgs, ', ')})`;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureSqlCall;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVTcWxDYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL3NjaGVtYS9wcm9jZWR1cmVzL2NyZWF0ZVBnUHJvY2VkdXJlU3FsQ2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0JBQW9CLHlCQUNwQixDQUFDLENBRDRDO0FBQzdDLDRDQUFzQyx1REFDdEMsQ0FBQyxDQUQ0RjtBQUc3Rjs7Ozs7Ozs7O0dBU0c7QUFDSCxhQUFhO0FBQ2Isa0NBQ0UsUUFBNkIsRUFDN0IsTUFBb0I7SUFFcEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QyxNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUE7SUFFL0UseUVBQXlFO0lBQ3pFLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUE7SUFFOUIsc0VBQXNFO0lBQ3RFLHNEQUFzRDtJQUN0RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDNUMseUVBQXlFO1FBQ3pFLFlBQVk7UUFDWixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO1lBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQTtRQUVyQyxJQUFJO1lBQUMsS0FBSyxDQUFBO0lBQ1osQ0FBQztJQUVELE1BQU0sYUFBYSxHQUFHLFdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxRixNQUFNLGFBQWEsR0FDakIsUUFBUSxDQUFDLElBQUk7U0FDVixLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDMUYsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEtBQUssbUNBQXlCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFckUsTUFBTSxDQUFDLFdBQUcsQ0FBQyxLQUFLLENBQUEsR0FBRyxhQUFhLElBQUksV0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQTtBQUN0RSxDQUFDO0FBM0JEOzBDQTJCQyxDQUFBIn0=